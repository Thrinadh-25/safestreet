const nodemailer = require("nodemailer");

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "safestreetps@gmail.com",
    pass: "kygj zipx kyaj ieeq", // App password
  },
});

// 🔴 Sends email to GHMC (or authority) with image and severity
async function sendSeverityAlert({ damageType, severityLabel, file }) {
  const mailOptions = {
    from: "safestreetps@gmail.com",
    to: "sherisrinijareddy@gmail.com", // authority email
    subject: `🛣️ Road Damage Detected - ${severityLabel} Severity`,
    text: `A road damage of type "${damageType}" was detected with "${severityLabel}" severity.\n\nThis message is for logging and monitoring purposes.\n\nImage attached.`,
    attachments: [
      {
        filename: file.filename,
        content: file.buffer,
        contentType: file.contentType,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Alert email sent:", info.response);
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
}

// ✅ Sends email to the user when their complaint is resolved
async function sendResolvedEmail(to, reportId) {
  const mailOptions = {
    from: "safestreetps@gmail.com",
    to: "sherisrinijareddy@gmail.com",
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
    throw err;
  }
}

module.exports = {
  sendSeverityAlert,
  sendResolvedEmail,
};
