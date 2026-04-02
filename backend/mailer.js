const nodemailer = require("nodemailer");
require("dotenv").config();

/* ===================== EMAIL TRANSPORT ===================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===================== SEVERITY ALERT EMAIL ===================== */
async function sendSeverityAlert({ damageType, severityLabel, file }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // authority email (can change later)
    subject: `🛣️ Road Damage Detected - ${severityLabel} Severity`,
    text: `A road damage of type "${damageType}" was detected with "${severityLabel}" severity.`,
    attachments: file
      ? [
          {
            filename: file.filename || "damage.png",
            content: file.buffer,
            contentType: file.contentType || "image/png",
          },
        ]
      : [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Alert email sent:", info.response);
  } catch (err) {
    console.error("❌ Alert email error:", err.message);
  }
}

/* ===================== RESOLUTION EMAIL ===================== */
async function sendResolvedEmail(to, reportId) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to || process.env.EMAIL_USER,
    subject: "✅ Your Road Damage Complaint Is Resolved",
    html: `
      <p>Hello,</p>
      <p>Your road damage report with ID <strong>${reportId}</strong> has been successfully repaired.</p>
      <p>Thank you for helping us keep the streets safe!</p>
      <p>– SafeStreet Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Resolution email sent:", info.response);
  } catch (err) {
    console.error("❌ Resolution email error:", err.message);
  }
}

module.exports = {
  sendSeverityAlert,
  sendResolvedEmail,
};
