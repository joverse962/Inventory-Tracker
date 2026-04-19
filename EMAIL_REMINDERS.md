# Email Reminder System Documentation

## Overview
The inventory tracker now supports automated email reminders for items that are "taken" or "borrowed":
- **Taken items**: Reminder sent after 14 days
- **Borrowed items**: Reminder sent after 30 days

## Item Statuses

The system now supports 5 item statuses:
- **available** - Item is ready to be taken or borrowed
- **borrowed** - Item is borrowed by a user (30-day reminder)
- **taken** - Item is taken by a user (14-day reminder)
- **waste** - Item is marked as waste/unusable
- **need repairing** - Item needs repair

## Configuration

To enable email reminders, add these environment variables to your `.env` file:

```bash
# Email Configuration
EMAIL_SERVICE=gmail  # or another email service (outlook, yahoo, etc.)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Gmail Setup Example:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password as `EMAIL_PASSWORD`

## API Endpoints

### Take an Item
```bash
POST /api/items/:id/take
```
- Marks item as "taken" with current date/time
- Resets reminder flag
- Used for items that belong to someone but they're taking/using it

### Borrow an Item
```bash
POST /api/items/:id/borrow
```
- Marks item as "borrowed" with current date/time
- Resets reminder flag
- Used for items that will be returned after use

### Return an Item
```bash
POST /api/items/:id/return
```
- Marks item as "available"
- Clears taken/borrowed information
- Resets all reminder flags
- Sends a confirmation email to the user

### Manual Reminder Check (Admin Only)
```bash
POST /api/items/admin/check-reminders
```
- Manually triggers the reminder sending process
- Only accessible to users with `role: "admin"`
- Returns count of emails sent
- Example:
```json
{
  "message": "Sent 5 reminder emails",
  "sentCount": 5
}
```

## Automatic Reminder Scheduler

The reminder scheduler runs automatically:
- **Frequency**: Every 12 hours
- **On startup**: Runs immediately when server starts
- **Checks**:
  - Items marked as "taken" for 14+ days with no reminder sent
  - Items marked as "borrowed" for 30+ days with no reminder sent
  - Status: active when `npm run dev:server` is running

## Database Fields

New fields added to the `Item` model:

```typescript
// Taken tracking
takenBy: User          // User who took the item
takenById: String      // User ID (foreign key)
takenAt: DateTime      // When item was taken
takenReminderSent: Boolean  // Whether reminder was sent (default: false)

// Borrowed tracking (modified)
borrowedReminderSent: Boolean  // Whether reminder was sent (default: false)
```

New fields added to the `User` model:
```typescript
takenItems: Item[]     // Relation to items taken by this user
```

## Testing the Email System

1. **Set up environment variables** in `.env`
2. **Run the backend**:
   ```bash
   npm run dev:server
   ```
3. **Take or borrow an item** via the API or UI
4. **For testing reminders**, you have two options:
   - Wait 14/30 days (not practical!)
   - Manually trigger the check endpoint:
     ```bash
     curl -X POST http://localhost:3000/api/items/admin/check-reminders \
       -H "Authorization: Bearer YOUR_JWT_TOKEN" \
       -H "Content-Type: application/json"
     ```

## Email Templates

### Reminder Email
Sent when reminder threshold is reached:
- **Subject**: `Reminder: Return "[Item Name]"`
- **Content**: 
  - Item name and ID
  - Time since taken/borrowed (14 or 30 days)
  - Request to return if finished
  - Instructions to contact admin for extension

### Return Confirmation Email
Sent when an item is successfully returned:
- **Subject**: `Item Returned: "[Item Name]"`
- **Content**:
  - Confirmation of return
  - Item name
  - Thank you message

## Troubleshooting

### "Email configuration error"
- Check `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- For Gmail, ensure you generated an App Password, not using regular password
- Verify EMAIL_SERVICE value is correct

### "Failed to send email" in logs
- Check internet connection
- Verify email credentials
- Check email service isn't blocking the connection
- Review nodemailer documentation for your email service

### Reminders not sending
- Ensure backend is running (`npm run dev:server`)
- Check that items have `takenAt` or `borrowedAt` dates set correctly
- Verify user emails are valid
- Check server logs for error messages
- Manually trigger with admin endpoint to test

## Frontend Integration

The frontend can now:
1. **Take an item** - Call `POST /api/items/:id/take`
2. **Borrow an item** - Call `POST /api/items/:id/borrow`
3. **Return an item** - Call `POST /api/items/:id/return`
4. **Display item status** - Show current user who has the item (from `takenBy` or `borrowedBy`)
5. **Show reminder status** - Display when reminder will be sent based on dates

## Example Frontend Usage

```typescript
// Taking an item
const response = await fetch(`/api/items/${itemId}/take`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const { item } = await response.json();
console.log(item.status); // "taken"
console.log(item.takenAt); // Current date
```

