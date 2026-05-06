import { Router } from 'express';
import prisma, { createHistoryEvent, getHistoryEventsForUser } from '../utils/db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';
import { sendReturnConfirmationEmail } from '../utils/email';
import { checkAndSendReminders } from '../utils/reminder';

const router = Router();

function hasStorageModel(client: any): boolean {
  return !!client?.storage && typeof client.storage.findMany === 'function';
}

// List storages (for item create/filter UI)
router.get('/storages', authMiddleware, async (_req: AuthRequest, res) => {
  try {
    if (hasStorageModel(prisma)) {
      const storages = await (prisma as any).storage.findMany({ orderBy: { name: 'asc' } });
      return res.status(200).json({ storages });
    }

    // Fallback (pre-migration): derive storages from distinct Item.location values
    const rows = await prisma.item.findMany({
      select: { location: true },
      distinct: ['location'],
      orderBy: { location: 'asc' },
    });
    const storages = rows
      .map((r) => (r.location || '').trim())
      .filter(Boolean)
      .map((name) => ({ id: name, name }));

    return res.status(200).json({ storages });
  } catch (error: any) {
    console.error('List storages error:', error);
    return res.status(500).json({ error: 'Failed to list storages' });
  }
});

// List all items with their instances
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, location, search, availability, status } = req.query;

    const where: any = {};
    const availabilityFilter = typeof availability === 'string' ? availability : Array.isArray(availability) ? availability[0] : undefined;
    const statusFilter = typeof status === 'string' ? status : Array.isArray(status) ? status[0] : undefined;

    if (category) {
      where.category = category;
    }
    if (location) {
      // Support filtering by either legacy location string or new storage name
      where.OR = [
        ...(where.OR || []),
        { location: location },
        ...(hasStorageModel(prisma) ? [{ storage: { is: { name: location } } }] : []),
      ];
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const include: any = {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      instances: {
        include: {
          borrowedBy: {
            select: { id: true, name: true, email: true },
          },
          takenBy: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    };

    if (hasStorageModel(prisma)) {
      include.storage = { select: { id: true, name: true } };
    }

    const items = await prisma.item.findMany({
      where,
      include,
    });

    // Transform to include availability and instance info
    let transformedItems = items.map(item => {
      const availableInstances = item.instances.filter(i => i.availability === 'available');
      const borrowedInstances = item.instances.filter(i => i.availability === 'borrowed');
      const takenInstances = item.instances.filter(i => i.availability === 'taken');
      const conditionCounts = item.instances.reduce((acc: any, instance: any) => {
        acc[instance.condition] = (acc[instance.condition] || 0) + 1;
        return acc;
      }, { good: 0, need_repairing: 0, waste: 0 });

      return {
        ...item,
        // Prefer storage name when present; keep location for backward compatibility
        location: (item as any).storage?.name || item.location,
        availableQuantity: availableInstances.length,
        borrowedQuantity: borrowedInstances.length,
        takenQuantity: takenInstances.length,
        availability: availableInstances.length > 0 ? 'available' : (borrowedInstances.length > 0 ? 'borrowed' : 'taken'),
        conditionCounts,
      };
    });

    if (availabilityFilter && availabilityFilter !== 'all') {
      transformedItems = transformedItems.filter(item => {
        if (availabilityFilter === 'available') return item.availableQuantity > 0;
        if (availabilityFilter === 'borrowed') return item.borrowedQuantity > 0;
        if (availabilityFilter === 'taken') return item.takenQuantity > 0;
        return true;
      });
    }

    if (statusFilter && statusFilter !== 'all') {
      transformedItems = transformedItems.filter(item =>
        item.instances.some((instance: any) => instance.condition === statusFilter)
      );
    }

    return res.status(200).json({ items: transformedItems });
  } catch (error: any) {
    console.error('Get items error:', error);
    return res.status(500).json({ error: 'Failed to get items' });
  }
});

// Get borrow/take/return history for current user
router.get('/history/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const history = await getHistoryEventsForUser(prisma, req.userId!);

    const activeSessions = new Map<string, any>();
    const sessionsAsc: any[] = [];
    const eventsAsc = [...history].sort(
      (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    for (const event of eventsAsc) {
      const action = String(event.action || '').toLowerCase();
      const itemId = event.itemId;
      if (!itemId) continue;

      if (action === 'borrow' || action === 'take') {
        activeSessions.set(itemId, {
          itemId,
          item: event.item,
          action,
          startDate: event.createdAt,
          returnDate: null,
        });
      } else if (action === 'return') {
        const active = activeSessions.get(itemId);
        if (active) {
          sessionsAsc.push({
            ...active,
            returnDate: event.createdAt,
          });
          activeSessions.delete(itemId);
        }
      }
    }

    for (const active of activeSessions.values()) {
      sessionsAsc.push(active);
    }

    return res.status(200).json({
      history,
      borrowSessions: sessionsAsc.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ),
    });
  } catch (error: any) {
    console.error('Get user history error:', error);
    return res.status(500).json({ error: 'Failed to get user history' });
  }
});

// Create item
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, description, category, location, storageId, image, components, quantity } = req.body;

    // Validation
    if (!name || !description || !category || !(location || storageId)) {
      return res.status(400).json({ error: 'Name, description, category, and location are required' });
    }
    if (typeof image === 'string' && image.startsWith('data:')) {
      return res.status(400).json({ error: 'Data URL images are not allowed. Upload the file and send its URL instead.' });
    }

    // If storageId is provided (post-migration), sync legacy location string to storage name
    let resolvedLocation = location;
    if (storageId) {
      if (!hasStorageModel(prisma)) {
        return res.status(400).json({ error: 'Storage feature not enabled yet. Run database migrations.' });
      }
      const storage = await (prisma as any).storage.findUnique({ where: { id: storageId } });
      if (!storage) return res.status(400).json({ error: 'Invalid storageId' });
      resolvedLocation = storage.name;
    }

    const itemQuantity = quantity || 1;

    const item = await prisma.item.create({
      data: {
        name,
        description,
        category,
        location: resolvedLocation,
        ...(hasStorageModel(prisma) ? { storageId: storageId || undefined } : {}),
        image,
        components,
        quantity: itemQuantity,
        createdById: req.userId!,
        instances: {
          createMany: {
            data: Array.from({ length: itemQuantity }, () => ({
              availability: 'available',
              condition: 'good',
            })),
          },
        },
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        instances: {
          include: {
            borrowedBy: {
              select: { id: true, name: true, email: true },
            },
            takenBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return res.status(201).json({ item });
  } catch (error: any) {
    console.error('Create item error:', error);
    if (error.code === 'P2002') {

    }
    return res.status(500).json({ error: 'Failed to create item' });
  }
});

// Get item by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const include: any = {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      instances: {
        include: {
          borrowedBy: {
            select: { id: true, name: true, email: true },
          },
          takenBy: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    };
    if (hasStorageModel(prisma)) include.storage = { select: { id: true, name: true } };

    const item = await prisma.item.findUnique({
      where: { id },
      include,
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Calculate availability
    const availableInstances = item.instances.filter(i => i.availability === 'available');
    const borrowedInstances = item.instances.filter(i => i.availability === 'borrowed');
    const takenInstances = item.instances.filter(i => i.availability === 'taken');

    const transformedItem = {
      ...item,
      location: (item as any).storage?.name || item.location,
      availableQuantity: availableInstances.length,
      borrowedQuantity: borrowedInstances.length,
      takenQuantity: takenInstances.length,
      availability: availableInstances.length > 0 ? 'available' : (borrowedInstances.length > 0 ? 'borrowed' : 'taken'),
    };

    return res.status(200).json({ item: transformedItem });
  } catch (error: any) {
    console.error('Get item error:', error);
    return res.status(500).json({ error: 'Failed to get item' });
  }
});

// Update item
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, location, storageId, status, quantity, image, components } = req.body;
    if (typeof image === 'string' && image.startsWith('data:')) {
      return res.status(400).json({ error: 'Data URL images are not allowed. Upload the file and send its URL instead.' });
    }

    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: { instances: true },
    });
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Authorization: only admins or the creator can edit items
    if (req.userRole !== 'admin' && existingItem.createdById !== req.userId) {
      return res.status(403).json({ error: 'Not allowed to update this item' });
    }

    let resolvedLocation = location;
    let resolvedStorageId = storageId;
    if (storageId) {
      if (!hasStorageModel(prisma)) {
        return res.status(400).json({ error: 'Storage feature not enabled yet. Run database migrations.' });
      }
      const storage = await (prisma as any).storage.findUnique({ where: { id: storageId } });
      if (!storage) return res.status(400).json({ error: 'Invalid storageId' });
      resolvedLocation = storage.name;
      resolvedStorageId = storage.id;
    } else if (typeof location === 'string' && location.trim()) {
      // If a raw location string is supplied, ensure there's a matching Storage row and link it.
      if (hasStorageModel(prisma)) {
        const storage = await (prisma as any).storage.upsert({
          where: { name: location.trim() },
          create: { name: location.trim() },
          update: {},
        });
        resolvedLocation = storage.name;
        resolvedStorageId = storage.id;
      } else {
        resolvedLocation = location.trim();
        resolvedStorageId = undefined;
      }
    }

    const requestedQuantity = typeof quantity === 'number' ? quantity : undefined;
    if (requestedQuantity !== undefined && (!Number.isFinite(requestedQuantity) || requestedQuantity < 1)) {
      return res.status(400).json({ error: 'Quantity must be a number >= 1' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Adjust item instances if quantity changes
      if (requestedQuantity !== undefined) {
        const currentCount = existingItem.instances.length;
        if (requestedQuantity > currentCount) {
          const toCreate = requestedQuantity - currentCount;
          await tx.itemInstance.createMany({
            data: Array.from({ length: toCreate }, () => ({
              itemId: id,
              availability: 'available',
              condition: 'good',
            })),
          });
        } else if (requestedQuantity < currentCount) {
          const toRemove = currentCount - requestedQuantity;
          const removable = existingItem.instances.filter((i) => i.availability === 'available').slice(0, toRemove);
          if (removable.length < toRemove) {
            throw new Error('Cannot reduce quantity below units currently borrowed/taken.');
          }
          await tx.itemInstance.deleteMany({ where: { id: { in: removable.map((i) => i.id) } } });
        }
      }

      const data: any = {
        ...(typeof name === 'string' ? { name } : {}),
        ...(typeof description === 'string' ? { description } : {}),
        ...(typeof category === 'string' ? { category } : {}),
        ...(typeof resolvedLocation === 'string' ? { location: resolvedLocation } : {}),
        ...(typeof status === 'string' ? { status } : {}),
        ...(requestedQuantity !== undefined ? { quantity: requestedQuantity } : {}),
        ...(typeof image === 'string' ? { image } : {}),
        ...(components !== undefined ? { components } : {}),
      };

      if (hasStorageModel(prisma)) {
        // Use relation connect/disconnect so it works even if storageId scalar isn't available in this client.
        if (resolvedStorageId) {
          data.storage = { connect: { id: resolvedStorageId } };
        } else if (storageId === null) {
          data.storage = { disconnect: true };
        }
      }

      return tx.item.update({
        where: { id },
        data,
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          instances: {
            include: {
              borrowedBy: { select: { id: true, name: true, email: true } },
              takenBy: { select: { id: true, name: true, email: true } },
            },
          },
          ...(hasStorageModel(prisma) ? { storage: { select: { id: true, name: true } } } : {}),
        },
      });
    });

    return res.status(200).json({ item: { ...updated, location: (updated as any).storage?.name || updated.location } });
  } catch (error: any) {
    console.error('Update item error:', error);
    if (String(error?.message || '').includes('Cannot reduce quantity')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    // Authorization: only admins or the creator can delete items
    if (req.userRole !== 'admin' && existing.createdById !== req.userId) {
      return res.status(403).json({ error: 'Not allowed to delete this item' });
    }

    await prisma.item.delete({ where: { id } });

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    console.error('Delete item error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Borrow item
router.post('/:id/borrow', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity, condition } = req.body;
    const requestedQuantity = Number(quantity) || 1;
    const now = new Date();

    if (requestedQuantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const item = await prisma.item.findUnique({ 
      where: { id },
      include: { instances: true }
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const availableInstances = item.instances.filter(i => i.availability === 'available');
    if (requestedQuantity > availableInstances.length) {
      return res.status(400).json({ error: 'Requested quantity exceeds available stock' });
    }

    // Select instances to borrow
    const instancesToBorrow = availableInstances.slice(0, requestedQuantity);

    const updatedItem = await prisma.$transaction(async (tx) => {
      // Update instances
      await tx.itemInstance.updateMany({
        where: { id: { in: instancesToBorrow.map(i => i.id) } },
        data: {
          availability: 'borrowed',
          borrowedById: req.userId,
          borrowedAt: now,
          condition: condition || 'good',
        },
      });

      // Get updated item
      const updated = await tx.item.findUnique({
        where: { id },
        include: {
          instances: {
            include: {
              borrowedBy: {
                select: { id: true, name: true, email: true },
              },
              takenBy: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return updated;
    });

    // Create history events
    try {
      await createHistoryEvent(prisma, {
        itemId: id,
        userId: req.userId!,
        action: 'borrow',
        availabilitySnapshot: 'borrowed',
        notes: `borrowed ${requestedQuantity}`,
      });
    } catch (historyError) {
      console.warn('Failed to write borrow history:', historyError);
    }

    return res.status(200).json({ item: updatedItem });
  } catch (error: any) {
    console.error('Borrow item error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(500).json({ error: 'Failed to borrow item' });
  }
});

// Take item (similar to borrow but with 14-day reminder)
router.post('/:id/take', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity, condition } = req.body;
    const requestedQuantity = Number(quantity) || 1;
    const now = new Date();

    if (requestedQuantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const item = await prisma.item.findUnique({ 
      where: { id },
      include: { instances: true }
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const availableInstances = item.instances.filter(i => i.availability === 'available');
    if (requestedQuantity > availableInstances.length) {
      return res.status(400).json({ error: 'Requested quantity exceeds available stock' });
    }

    // Select instances to take
    const instancesToTake = availableInstances.slice(0, requestedQuantity);

    const updatedItem = await prisma.$transaction(async (tx) => {
      // Update instances
      await tx.itemInstance.updateMany({
        where: { id: { in: instancesToTake.map(i => i.id) } },
        data: {
          availability: 'taken',
          takenById: req.userId,
          takenAt: now,
          condition: condition || 'good',
        },
      });

      // Get updated item
      const updated = await tx.item.findUnique({
        where: { id },
        include: {
          instances: {
            include: {
              borrowedBy: {
                select: { id: true, name: true, email: true },
              },
              takenBy: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return updated;
    });

    // Create history events
    try {
      await createHistoryEvent(prisma, {
        itemId: id,
        userId: req.userId!,
        action: 'take',
        availabilitySnapshot: 'taken',
        notes: `taken ${requestedQuantity}`,
      });
    } catch (historyError) {
      console.warn('Failed to write take history:', historyError);
    }

    return res.status(200).json({ item: updatedItem });
  } catch (error: any) {
    console.error('Take item error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(500).json({ error: 'Failed to take item' });
  }
});

// Return item
router.post('/:id/return', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const returnQuantity = quantity ? Number(quantity) : null;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        instances: {
          include: {
            borrowedBy: {
              select: { id: true, email: true },
            },
            takenBy: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Get instances borrowed/taken by current user
    const userInstances = item.instances.filter(i =>
      (i.availability === 'borrowed' && i.borrowedById === req.userId) ||
      (i.availability === 'taken' && i.takenById === req.userId)
    );

    if (userInstances.length === 0) {
      return res.status(400).json({ error: 'No items currently borrowed/taken by you' });
    }

    const amountToReturn = returnQuantity !== null ? Math.min(returnQuantity, userInstances.length) : userInstances.length;
    if (amountToReturn <= 0) {
      return res.status(400).json({ error: 'Return quantity must be at least 1' });
    }

    const instancesToReturn = userInstances.slice(0, amountToReturn);

    const updatedItem = await prisma.$transaction(async (tx) => {
      // Update instances to available
      await tx.itemInstance.updateMany({
        where: { id: { in: instancesToReturn.map(i => i.id) } },
        data: {
          availability: 'available',
          borrowedById: null,
          borrowedAt: null,
          takenById: null,
          takenAt: null,
        },
      });

      // Get updated item
      const updated = await tx.item.findUnique({
        where: { id },
        include: {
          instances: {
            include: {
              borrowedBy: {
                select: { id: true, name: true, email: true },
              },
              takenBy: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return updated;
    });

    try {
      await createHistoryEvent(prisma, {
        itemId: id,
        userId: req.userId!,
        action: 'return',
        availabilitySnapshot: 'available',
        notes: `returned ${amountToReturn}`,
      });
    } catch (historyError) {
      console.warn('Failed to write return history:', historyError);
    }

    // Send return confirmation email
    const userEmail = instancesToReturn[0]?.borrowedBy?.email || instancesToReturn[0]?.takenBy?.email;
    if (userEmail) {
      await sendReturnConfirmationEmail(userEmail, item.name);
    }

    return res.status(200).json({ item: updatedItem });
  } catch (error: any) {
    console.error('Return item error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(500).json({ error: 'Failed to return item' });
  }
});

// Update item instance condition - only for user who took/borrowed it
router.post('/:id/update-condition', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { instanceId, condition } = req.body;

    // Validate condition
    if (!['good', 'waste', 'need_repairing'].includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition' });
    }

    if (!instanceId) {
      return res.status(400).json({ error: 'Instance ID is required' });
    }

    // Get instance to check permissions
    const instance = await prisma.itemInstance.findUnique({
      where: { id: instanceId },
      include: {
        takenBy: {
          select: { id: true },
        },
        borrowedBy: {
          select: { id: true },
        },
      },
    });

    if (!instance) {
      return res.status(404).json({ error: 'Instance not found' });
    }

    // Check if user is the one who took or borrowed the instance
    const isTakenByUser = instance.takenById === req.userId;
    const isBorrowedByUser = instance.borrowedById === req.userId;

    if (!isTakenByUser && !isBorrowedByUser) {
      return res.status(403).json({ error: 'Only the user who took/borrowed the item can update its condition' });
    }

    // Update the condition
    const updatedInstance = await prisma.itemInstance.update({
      where: { id: instanceId },
      data: { condition },
      include: {
        item: {
          select: { id: true, name: true },
        },
        borrowedBy: {
          select: { id: true, name: true, email: true },
        },
        takenBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create history event
    try {
      await createHistoryEvent(prisma, {
        itemId: id,
        userId: req.userId!,
        action: 'condition_change',
        conditionSnapshot: condition,
        notes: `condition changed to ${condition}`,
      });
    } catch (historyError) {
      console.warn('Failed to write condition change history:', historyError);
    }

    return res.status(200).json({ instance: updatedInstance });
  } catch (error: any) {
    console.error('Update item condition error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Instance not found' });
    }
    return res.status(500).json({ error: 'Failed to update item condition' });
  }
});

// Manual reminder check endpoint (for testing/manual trigger)
router.post('/admin/check-reminders', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can trigger reminders' });
    }

    const sentCount = await checkAndSendReminders();
    return res.status(200).json({ message: `Sent ${sentCount} reminder emails`, sentCount });
  } catch (error: any) {
    console.error('Check reminders error:', error);
    return res.status(500).json({ error: 'Failed to check reminders' });
  }
});

export default router;
