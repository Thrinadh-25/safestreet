const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email service not configured - SMTP credentials missing');
      return;
    }

    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('📧 Email service initialized');
  }

  async sendWelcomeEmail(user) {
    if (!this.transporter) return;

    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Welcome to Safe Street!',
        html: `
          <h1>Welcome to Safe Street, ${user.fullName}!</h1>
          <p>Thank you for joining our community of road safety advocates.</p>
          <p>You can now start reporting road damage and help make our streets safer for everyone.</p>
          <p>Best regards,<br>The Safe Street Team</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('📧 Failed to send welcome email:', error);
    }
  }

  async sendUploadNotification(user, upload) {
    if (!this.transporter) return;

    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Upload Processed - Safe Street',
        html: `
          <h1>Your road damage report has been processed</h1>
          <p>Hello ${user.fullName},</p>
          <p>Your recent upload has been analyzed:</p>
          <ul>
            <li><strong>Damage Type:</strong> ${upload.aiAnalysis?.damageType || 'Unknown'}</li>
            <li><strong>Severity:</strong> ${upload.aiAnalysis?.severity || 'Unknown'}</li>
            <li><strong>Status:</strong> ${upload.repairStatus}</li>
          </ul>
          <p>Thank you for helping improve road safety in our community!</p>
          <p>Best regards,<br>The Safe Street Team</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Upload notification sent to ${user.email}`);
    } catch (error) {
      console.error('📧 Failed to send upload notification:', error);
    }
  }
}

module.exports = new EmailService();