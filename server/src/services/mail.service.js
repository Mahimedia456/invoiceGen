import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendInvoiceEmail({ orderNumber, pdfBuffer }) {
  const hasSmtp =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtp) {
    console.warn("[MAIL] SMTP not configured. Skipping email send.");
    return {
      success: true,
      skipped: true,
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@atomos.local",
    to: process.env.INVOICE_RECEIVER_EMAIL || "aamir@mahimediasolutions.com",
    subject: `Tax Invoice for Order #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Atomos Tax Invoice</h2>
        <p>Your generated tax invoice is attached.</p>
        <p>Order Number: <strong>${orderNumber}</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `${orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return {
    success: true,
    skipped: false,
  };
}