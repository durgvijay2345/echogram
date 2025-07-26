// Mail.js
import nodemailer from "nodemailer";

const sendMail = async ({ to, subject, text }) => {
  console.log("Sending email to:", to); // Debug log

  if (!to || typeof to !== "string" || to.trim() === "") {
    throw new Error("Invalid 'to' address provided");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};

export default sendMail;
