import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Migrating items to instances...');

    // Get all items
    const items = await prisma.item.findMany();

    for (const item of items) {
      // Check if instances already exist
      const existingInstances = await prisma.itemInstance.count({
        where: { itemId: item.id },
      });

      if (existingInstances === 0) {
        console.log(`Creating instances for item: ${item.name}`);

        // Create instances
        await prisma.itemInstance.createMany({
          data: Array.from({ length: item.quantity }, () => ({
            itemId: item.id,
            availability: 'available',
            condition: 'good',
          })),
        });

        console.log(`Created ${item.quantity} instances for ${item.name}`);
      } else {
        console.log(`Item ${item.name} already has instances, skipping...`);
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
