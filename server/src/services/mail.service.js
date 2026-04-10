import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendInvoiceEmail({ orderNumber, pdfBuffer }) {
  const smtpHost = process.env.SMTP_HOST || "";
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || "false") === "true";
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";
  const mailFrom = process.env.MAIL_FROM || "no-reply@atomos.local";
  const receiver =
    process.env.INVOICE_RECEIVER_EMAIL || "aamir@mahimediasolutions.com";

  console.log("[MAIL_CONFIG_CHECK]", {
    hasHost: !!smtpHost,
    hasPort: !!smtpPort,
    hasUser: !!smtpUser,
    hasPass: !!smtpPass,
    mailFrom,
    receiver,
    smtpSecure,
  });

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error(
      "SMTP environment variables are missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, and INVOICE_RECEIVER_EMAIL in Vercel."
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.verify();
    console.log("[MAIL_VERIFY_SUCCESS]");
  } catch (error) {
    console.error("[MAIL_VERIFY_ERROR]", error);
    throw new Error(
      `SMTP verification failed: ${error?.message || "Unknown SMTP error"}`
    );
  }

  try {
    const info = await transporter.sendMail({
      from: mailFrom,
      to: receiver,
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

    console.log("[MAIL_SENT_SUCCESS]", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    return {
      success: true,
      skipped: false,
    };
  } catch (error) {
    console.error("[MAIL_SEND_ERROR]", error);
    throw new Error(
      `Email sending failed: ${error?.message || "Unknown mail send error"}`
    );
  }
}