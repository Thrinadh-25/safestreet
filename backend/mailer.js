const nodemailer = require("nodemailer");

async function sendSeverityAlert({ damageType, severityLabel, file }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "safestreetps@gmail.com",
      pass: "kygj zipx kyaj ieeq",
    },
  });

  const mailOptions = {
    from: "safestreetps@gmail.com",
    to: "sherisrinijareddy@gmail.com",
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
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
}

module.exports = sendSeverityAlert;
