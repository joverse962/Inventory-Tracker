import prisma from './db';
import { sendReminderEmail } from './email';

const TAKEN_REMINDER_DAYS = 14;
const BORROWED_REMINDER_DAYS = 30;

export const checkAndSendReminders = async () => {
  try {
    const now = new Date();

    // Check for instances taken >= 14 days ago
    const takenReminders = await prisma.itemInstance.findMany({
      where: {
        availability: 'taken',
        takenReminderSent: false,
        takenAt: {
          lte: new Date(now.getTime() - TAKEN_REMINDER_DAYS * 24 * 60 * 60 * 1000),
        },
        takenBy: {
          isNot: null,
        },
      },
      include: {
        takenBy: true,
        item: {
          select: { id: true, name: true },
        },
      },
    });

    // Check for instances borrowed >= 30 days ago
    const borrowedReminders = await prisma.itemInstance.findMany({
      where: {
        availability: 'borrowed',
        borrowedReminderSent: false,
        borrowedAt: {
          lte: new Date(now.getTime() - BORROWED_REMINDER_DAYS * 24 * 60 * 60 * 1000),
        },
        borrowedBy: {
          isNot: null,
        },
      },
      include: {
        borrowedBy: true,
        item: {
          select: { id: true, name: true },
        },
      },
    });

    let sentCount = 0;

    // Send reminders for taken instances
    for (const instance of takenReminders) {
      if (instance.takenBy?.email) {
        const success = await sendReminderEmail(instance.takenBy.email, instance.item.name, instance.item.id, 'taken');
        if (success) {
          await prisma.itemInstance.update({
            where: { id: instance.id },
            data: { takenReminderSent: true },
          });
          sentCount++;
        }
      }
    }

    // Send reminders for borrowed instances
    for (const instance of borrowedReminders) {
      if (instance.borrowedBy?.email) {
        const success = await sendReminderEmail(instance.borrowedBy.email, instance.item.name, instance.item.id, 'borrowed');
        if (success) {
          await prisma.itemInstance.update({
            where: { id: instance.id },
            data: { borrowedReminderSent: true },
          });
          sentCount++;
        }
      }
    }

    console.log(`📧 Sent ${sentCount} reminder emails`);
    return sentCount;
  } catch (error) {
    console.error('Error checking reminders:', error);
    return 0;
  }
};

// Run reminders check every 12 hours
export const startReminderScheduler = () => {
  const INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
  
  console.log('⏰ Starting reminder scheduler (runs every 12 hours)');
  
  // Run immediately on startup
  checkAndSendReminders();
  
  // Then run periodically
  setInterval(() => {
    checkAndSendReminders();
  }, INTERVAL);
};
