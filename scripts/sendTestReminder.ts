import 'dotenv/config';
import { sendReminderEmail } from '../server/utils/email';

(async () => {
  const targetEmail = 'abdullahalawad123321@gmail.com';
  const itemName = 'Manual test item';
  const itemId = 'test-0001';
  const type: 'taken' | 'borrowed' = 'taken';

  const ok = await sendReminderEmail(targetEmail, itemName, itemId, type);
  console.log('sendReminderEmail result:', ok);
  process.exit(ok ? 0 : 1);
})();