import { Router } from 'express';
import prisma, { getItemHistoryDelegate } from '../utils/db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();

async function requireAdmin(req: AuthRequest, res: any): Promise<boolean> {
  if (req.userRole !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }
  return true;
}

function hasStorageModel(client: any): boolean {
  return !!client?.storage && typeof client.storage.findMany === 'function';
}

router.get('/dashboard', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        borrowedInstances: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                category: true,
                location: true,
                image: true,
              },
            },
          },
        },
        takenInstances: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                category: true,
                location: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform users to include current borrowed/taken quantities and conditions
    const transformedUsers = users.map(user => {
      const borrowedQuantity = user.borrowedInstances.length;
      const takenQuantity = user.takenInstances.length;
      const totalActive = borrowedQuantity + takenQuantity;

      // Group instances by item to show conditions
      const borrowedByItem = new Map<string, any>();
      for (const instance of user.borrowedInstances) {
        const key = instance.item.id;
        if (!borrowedByItem.has(key)) {
          borrowedByItem.set(key, {
            item: instance.item,
            instances: [],
          });
        }
        borrowedByItem.get(key)!.instances.push({
          id: instance.id,
          condition: instance.condition,
          borrowedAt: instance.borrowedAt,
        });
      }

      const takenByItem = new Map<string, any>();
      for (const instance of user.takenInstances) {
        const key = instance.item.id;
        if (!takenByItem.has(key)) {
          takenByItem.set(key, {
            item: instance.item,
            instances: [],
          });
        }
        takenByItem.get(key)!.instances.push({
          id: instance.id,
          condition: instance.condition,
          takenAt: instance.takenAt,
        });
      }

      return {
        ...user,
        borrowedInstances: undefined,
        takenInstances: undefined,
        currentBorrowedQuantity: borrowedQuantity,
        currentTakenQuantity: takenQuantity,
        totalCurrentActive: totalActive,
        borrowedByItem: Array.from(borrowedByItem.values()),
        takenByItem: Array.from(takenByItem.values()),
      };
    });

    const itemHistory = getItemHistoryDelegate(prisma);
    const historyByUser = new Map<string, any[]>();
    const sessionsByUser = new Map<string, any[]>();

    if (itemHistory) {
      const userIds = users.map((u) => u.id);
      if (userIds.length > 0) {
        const events = await itemHistory.findMany({
          where: {
            userId: { in: userIds },
          },
          include: {
            item: {
              select: {
                id: true,
                name: true,
                category: true,
                location: true,
                image: true,
              },
            },
            instance: {
              select: {
                id: true,
                condition: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        });

        const activeByUserAndItem = new Map<string, any>();
        for (const event of events) {
          const userHistory = historyByUser.get(event.userId) || [];
          userHistory.push(event);
          historyByUser.set(event.userId, userHistory);

          const key = `${event.userId}:${event.itemId}`;
          const action = String(event.action || '').toLowerCase();

          if (action === 'borrow' || action === 'take') {
            activeByUserAndItem.set(key, {
              itemId: event.itemId,
              item: event.item,
              action,
              startDate: event.createdAt,
              returnDate: null,
              quantity: 1,
              condition: event.instance?.condition || 'good',
            });
          } else if (action === 'return') {
            const active = activeByUserAndItem.get(key);
            if (active) {
              const list = sessionsByUser.get(event.userId) || [];
              list.push({
                ...active,
                returnDate: event.createdAt,
              });
              sessionsByUser.set(event.userId, list);
              activeByUserAndItem.delete(key);
            }
          }
        }

        for (const [key, active] of activeByUserAndItem.entries()) {
          const userId = key.split(':')[0];
          const list = sessionsByUser.get(userId) || [];
          list.push(active);
          sessionsByUser.set(userId, list);
        }
      }
    }

    const dashboardUsers = transformedUsers.map((user) => {
      const sessions = (sessionsByUser.get(user.id) || []).sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        currentBorrowedQuantity: user.currentBorrowedQuantity,
        currentTakenQuantity: user.currentTakenQuantity,
        totalCurrentActive: user.totalCurrentActive,
        currentItems: {
          borrowed: user.borrowedByItem,
          taken: user.takenByItem,
        },
        history: historyByUser.get(user.id) || [],
        borrowSessions: sessions,
      };
    });

    return res.status(200).json({ users: dashboardUsers });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ error: 'Failed to load admin dashboard' });
  }
});

router.get('/storages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;
    if (!hasStorageModel(prisma)) {
      return res.status(503).json({ error: 'Storage feature not enabled yet. Run database migrations.' });
    }
    const storages = await (prisma as any).storage.findMany({ orderBy: { name: 'asc' } });
    return res.status(200).json({ storages });
  } catch (error: any) {
    console.error('List storages error:', error);
    return res.status(500).json({ error: 'Failed to list storages' });
  }
});

router.post('/storages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;
    if (!hasStorageModel(prisma)) {
      return res.status(503).json({ error: 'Storage feature not enabled yet. Run database migrations.' });
    }
    const { name } = req.body as { name?: string };
    const trimmed = (name || '').trim();
    if (!trimmed) return res.status(400).json({ error: 'name is required' });

    const storage = await (prisma as any).storage.create({ data: { name: trimmed } });
    return res.status(201).json({ storage });
  } catch (error: any) {
    console.error('Create storage error:', error);
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Storage name already exists' });
    return res.status(500).json({ error: 'Failed to create storage' });
  }
});

router.put('/storages/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;
    if (!hasStorageModel(prisma)) {
      return res.status(503).json({ error: 'Storage feature not enabled yet. Run database migrations.' });
    }
    const { id } = req.params;
    const { name } = req.body as { name?: string };
    const trimmed = (name || '').trim();
    if (!trimmed) return res.status(400).json({ error: 'name is required' });

    const storage = await (prisma as any).storage.update({ where: { id }, data: { name: trimmed } });
    return res.status(200).json({ storage });
  } catch (error: any) {
    console.error('Update storage error:', error);
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Storage not found' });
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Storage name already exists' });
    return res.status(500).json({ error: 'Failed to update storage' });
  }
});

router.delete('/storages/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;
    if (!hasStorageModel(prisma)) {
      return res.status(503).json({ error: 'Storage feature not enabled yet. Run database migrations.' });
    }
    const { id } = req.params;

    // Ensure we always have an "Unassigned" storage to migrate items into.
    const unassigned = await (prisma as any).storage.upsert({
      where: { name: 'Unassigned' },
      create: { name: 'Unassigned' },
      update: {},
    });

    const result = await prisma.$transaction(async (tx) => {
      const storage = await (tx as any).storage.findUnique({ where: { id } });
      if (!storage) return { notFound: true as const };

      if (storage.id === unassigned.id) {
        return { notFound: false as const, blocked: true as const };
      }

      const migrated = await tx.item.updateMany({
        where: { storageId: id },
        data: { storageId: unassigned.id, location: unassigned.name },
      });

      await (tx as any).storage.delete({ where: { id } });
      return { notFound: false as const, blocked: false as const, migratedCount: migrated.count };
    });

    if (result.notFound) return res.status(404).json({ error: 'Storage not found' });
    if ((result as any).blocked) return res.status(400).json({ error: 'Cannot delete Unassigned storage' });

    return res.status(200).json({ message: 'Storage deleted', migratedCount: (result as any).migratedCount ?? 0 });
  } catch (error: any) {
    console.error('Delete storage error:', error);
    return res.status(500).json({ error: 'Failed to delete storage' });
  }
});

router.post('/items/set-basement', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const basementName = 'Basement';
    const result = await prisma.$transaction(async (tx) => {
      let basementId: string | null = null;
      if (hasStorageModel(prisma)) {
        const basement = await (tx as any).storage.upsert({
          where: { name: basementName },
          create: { name: basementName },
          update: {},
        });
        basementId = basement.id;
      }

      const updated = await tx.item.updateMany({
        data: {
          location: basementName,
          ...(basementId ? { storageId: basementId } : {}),
        },
      });

      return updated.count;
    });

    return res.status(200).json({ message: 'All items moved to Basement', updatedCount: result });
  } catch (error: any) {
    console.error('Set basement error:', error);
    return res.status(500).json({ error: 'Failed to move items to Basement' });
  }
});

export default router;
