import { validateOrderAndEmail } from "../services/order.service.js";
import { sendInvoiceEmail } from "../services/mail.service.js";
import { generateInvoicePdfBuffer } from "../services/pdf.service.js";
import { normalizeEmail, normalizeOrderNumber } from "../utils/normalize.js";
import { addAttempt, isRateLimited } from "../services/rateLimit.service.js";

export async function requestInvoice(req, res) {
  try {
    const email = normalizeEmail(req.body?.email || "");
    const orderNumber = normalizeOrderNumber(req.body?.orderNumber || "");
    const requestKey = `${req.ip}:${email}:${orderNumber}`;

    console.log("[INVOICE_REQUEST_START]", {
      email,
      orderNumber,
      ip: req.ip,
    });

    if (!email || !orderNumber) {
      return res.status(400).json({
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Email and order number are required.",
      });
    }

    if (isRateLimited(requestKey)) {
      return res.status(429).json({
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many attempts. Please wait a few minutes and try again.",
      });
    }

    addAttempt(requestKey);

    const validation = await validateOrderAndEmail({ email, orderNumber });

    console.log("[INVOICE_VALIDATION_RESULT]", validation);

    if (validation.status !== "MATCHED") {
      return res.status(400).json({
        ok: false,
        code: validation.status,
        message: validation.message,
      });
    }

    const pdfBuffer = await generateInvoicePdfBuffer(validation.order);

    console.log("[PDF_GENERATED]", {
      orderNumber: validation.order.orderNumber,
      pdfBytes: pdfBuffer?.length || 0,
    });

    const mailResult = await sendInvoiceEmail({
      orderNumber: validation.order.orderNumber,
      pdfBuffer,
    });

    console.log("[MAIL_RESULT]", mailResult);

    return res.status(200).json({
      ok: true,
      message: mailResult?.skipped
        ? "Invoice generated successfully. SMTP is not configured, so email sending was skipped."
        : "Invoice generated successfully and emailed.",
      data: {
        orderNumber: validation.order.orderNumber,
        currency: validation.order.currency,
        sentTo: process.env.INVOICE_RECEIVER_EMAIL || "aamir@mahimediasolutions.com",
      },
    });
  } catch (error) {
    console.error("[INVOICE_REQUEST_ERROR]", error);

    return res.status(500).json({
      ok: false,
      code: "SERVER_ERROR",
      message: "Something went wrong while processing the invoice request.",
      error: error?.message || "Unknown server error",
    });
  }
}

export async function previewInvoice(req, res) {
  try {
    const orderNumber = normalizeOrderNumber(req.params.orderNumber || "");
    const email = normalizeEmail(req.query.email || "");
    const shouldDownload = req.query.download === "1";

    console.log("[INVOICE_PREVIEW_START]", {
      email,
      orderNumber,
      shouldDownload,
    });

    const validation = await validateOrderAndEmail({ email, orderNumber });

    console.log("[INVOICE_PREVIEW_VALIDATION]", validation);

    if (validation.status !== "MATCHED") {
      return res.status(400).json({
        ok: false,
        code: validation.status,
        message: validation.message,
      });
    }

    const pdfBuffer = await generateInvoicePdfBuffer(validation.order);

    console.log("[INVOICE_PREVIEW_PDF_READY]", {
      orderNumber,
      pdfBytes: pdfBuffer?.length || 0,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${shouldDownload ? "attachment" : "inline"}; filename="${orderNumber}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("[INVOICE_PREVIEW_ERROR]", error);

    return res.status(500).json({
      ok: false,
      code: "SERVER_ERROR",
      message: "Failed to generate invoice preview.",
      error: error?.message || "Unknown server error",
    });
  }
}