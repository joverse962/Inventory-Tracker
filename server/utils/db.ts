import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = global.prisma ?? prismaClientSingleton();

export default prisma;

export const getItemHistoryDelegate = (client: any) => {
  const delegate = client?.itemHistory;
  if (!delegate || typeof delegate.findMany !== 'function' || typeof delegate.create !== 'function') {
    return null;
  }
  return delegate;
};

type HistoryAction = 'borrow' | 'take' | 'return';

export type HistoryEvent = {
  id: string;
  itemId: string;
  userId: string;
  action: HistoryAction;
  availabilitySnapshot: 'available' | 'borrowed' | 'taken' | null;
  notes: string | null;
  createdAt: Date;
  item: {
    id: string;
    name: string;
    image: string | null;
    category: string;
    location: string;
  } | null;
};

export async function createHistoryEvent(
  client: any,
  input: {
    itemId: string;
    userId: string;
    action: HistoryAction;
    availabilitySnapshot?: 'available' | 'borrowed' | 'taken' | null;
    notes?: string | null;
  }
): Promise<void> {
  const itemHistory = getItemHistoryDelegate(client);
  if (itemHistory) {
    await itemHistory.create({
      data: {
        itemId: input.itemId,
        userId: input.userId,
        action: input.action,
        availabilitySnapshot: input.availabilitySnapshot ?? null,
        notes: input.notes ?? null,
      },
    });
    return;
  }

  await client.$executeRaw(
    Prisma.sql`
      INSERT INTO "ItemHistory" (
        "id",
        "itemId",
        "userId",
        "action",
        "availabilitySnapshot",
        "notes"
      )
      VALUES (
        ${randomUUID()},
        ${input.itemId},
        ${input.userId},
        ${input.action}::"ItemHistoryAction",
        ${input.availabilitySnapshot ?? null}::"Availability",
        ${input.notes ?? null}
      )
    `
  );
}

export async function getHistoryEventsForUser(client: any, userId: string): Promise<HistoryEvent[]> {
  const itemHistory = getItemHistoryDelegate(client);
  if (itemHistory) {
    return itemHistory.findMany({
      where: { userId },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            image: true,
            category: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  const rows = await client.$queryRaw<
    Array<{
      id: string;
      itemId: string;
      userId: string;
      action: HistoryAction;
      availabilitySnapshot: 'available' | 'borrowed' | 'taken' | null;
      notes: string | null;
      createdAt: Date;
      item_id: string | null;
      item_name: string | null;
      item_image: string | null;
      item_category: string | null;
      item_location: string | null;
    }>
  >(
    Prisma.sql`
      SELECT
        h."id",
        h."itemId",
        h."userId",
        h."action",
        h."availabilitySnapshot",
        h."notes",
        h."createdAt",
        i."id" AS item_id,
        i."name" AS item_name,
        i."image" AS item_image,
        i."category" AS item_category,
        i."location" AS item_location
      FROM "ItemHistory" h
      LEFT JOIN "Item" i ON i."id" = h."itemId"
      WHERE h."userId" = ${userId}
      ORDER BY h."createdAt" DESC
    `
  );

  return rows.map((row) => ({
    id: row.id,
    itemId: row.itemId,
    userId: row.userId,
    action: row.action,
    availabilitySnapshot: row.availabilitySnapshot,
    notes: row.notes,
    createdAt: row.createdAt,
    item: row.item_id
      ? {
          id: row.item_id,
          name: row.item_name ?? 'Unknown item',
          image: row.item_image,
          category: row.item_category ?? 'Unknown',
          location: row.item_location ?? 'Unknown',
        }
      : null,
  }));
}

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
