import { Router } from 'express';
import prisma, { createHistoryEvent, getHistoryEventsForUser } from '../utils/db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';
import { sendReturnConfirmationEmail } from '../utils/email';
import { checkAndSendReminders } from '../utils/reminder';

const router = Router();

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
      where.location = location;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
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
    const { name, description, category, location, image, components, quantity } = req.body;

    // Validation
    if (!name || !description || !category || !location) {
      return res.status(400).json({ error: 'Name, description, category, and location are required' });
    }
    if (typeof image === 'string' && image.startsWith('data:')) {
      return res.status(400).json({ error: 'Data URL images are not allowed. Upload the file and send its URL instead.' });
    }

    const itemQuantity = quantity || 1;

    const item = await prisma.item.create({
      data: {
        name,
        description,
        category,
        location,
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

    const item = await prisma.item.findUnique({
      where: { id },
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

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Calculate availability
    const availableInstances = item.instances.filter(i => i.availability === 'available');
    const borrowedInstances = item.instances.filter(i => i.availability === 'borrowed');
    const takenInstances = item.instances.filter(i => i.availability === 'taken');

    const transformedItem = {
      ...item,
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
    const { name, description, category, location, status, quantity, image, components } = req.body;
    if (typeof image === 'string' && image.startsWith('data:')) {
      return res.status(400).json({ error: 'Data URL images are not allowed. Upload the file and send its URL instead.' });
    }

    const existingItem = await prisma.item.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedAvailableQuantity = typeof quantity === 'number'
      ? Math.max(0, Math.min(quantity, existingItem.availableQuantity + (quantity - existingItem.quantity)))
      : existingItem.availableQuantity;

    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        category,
        location,
        status,
        quantity,
        availableQuantity: updatedAvailableQuantity,
        image,
        components,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        borrowedBy: {
          select: { id: true, name: true, email: true },
        },
        takenBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({ item });
  } catch (error: any) {
    console.error('Update item error:', error);
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

    await prisma.item.delete({
      where: { id },
    });

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
