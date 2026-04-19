import { Router } from 'express';
import prisma, { getItemHistoryDelegate } from '../utils/db';
import { authMiddleware } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

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
          where: { userId: { in: userIds } },
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

export default router;
