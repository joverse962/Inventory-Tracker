import nodemailer from 'nodemailer';

// Configure your email service
// For testing, use Ethereal (fake SMTP service)
// For Gmail use smtp.gmail.com with app password or OAuth2
const isGmail = process.env.EMAIL_SERVICE === 'gmail';

const transporter = nodemailer.createTransport({
  host: isGmail ? 'smtp.gmail.com' : (process.env.EMAIL_HOST || 'smtp.ethereal.email'),
  port: Number(process.env.EMAIL_PORT || (isGmail ? 465 : 587)),
  secure: isGmail ? true : Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_USER || 'test@ethereal.email',
    pass: process.env.EMAIL_PASSWORD || 'test123',
  },
});

export const sendReminderEmail = async (
  email: string,
  itemName: string,
  itemId: string,
  type: 'taken' | 'borrowed'
) => {
  try {
    const subject = `Reminder: Return "${itemName}"`;
    const timeline = type === 'taken' ? '1 minute' : '30 days';
    
    const html = `
      <h2>Item Return Reminder</h2>
      <p>Hi,</p>
      <p>This is a reminder that you took the following item <strong>${timeline}</strong> ago:</p>
      <ul>
        <li><strong>Item:</strong> ${itemName}</li>
        <li><strong>Item ID:</strong> ${itemId}</li>
      </ul>
      <p>Please return this item if you're finished with it. If you need more time, please contact the admin.</p>
      <p>Best regards,<br/>Inventory Tracker Team</p>
    `;

    const info = await transporter.sendMail({
      from: process.env.NODE_ENV === 'production' ? process.env.EMAIL_USER : 'test@ethereal.email',
      to: email,
      subject,
      html,
    });

    console.log(`✉️  Reminder email sent to ${email} for item ${itemName}`);
    
    // Log preview URL for testing
    if (process.env.NODE_ENV !== 'production' && info.messageId) {
      console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const sendReturnConfirmationEmail = async (
  email: string,
  itemName: string,
) => {
  try {
    const html = `
      <h2>Item Returned Successfully</h2>
      <p>Hi,</p>
      <p>We have successfully registered the return of:</p>
      <ul>
        <li><strong>Item:</strong> ${itemName}</li>
      </ul>
      <p>Thank you for returning the item promptly!</p>
      <p>Best regards,<br/>Inventory Tracker Team</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Item Returned: "${itemName}"`,
      html,
    });

    console.log(`✉️  Return confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};
