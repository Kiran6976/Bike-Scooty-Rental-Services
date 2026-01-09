const nodemailer = require("nodemailer");

module.exports = async (email, invoicePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "BikeBook Payment Receipt",
    text: "Thank you for booking with BikeBook!",
    attachments: [{ path: invoicePath }]
  });
};
