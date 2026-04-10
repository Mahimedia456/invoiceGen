import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const invoiceLogoPath = path.resolve(__dirname, "../assets/invoicelogo.png");

function money(symbol, value) {
  return `${symbol}${Number(value || 0).toFixed(2)}`;
}

function drawCell(doc, x, y, w, h, text = "", opts = {}) {
  const {
    fontSize = 9.5,
    bold = false,
    color = "#666666",
    align = "left",
    padding = 7,
  } = opts;

  doc
    .lineWidth(0.8)
    .strokeColor("#E5E5E5")
    .rect(x, y, w, h)
    .stroke();

  doc
    .fillColor(color)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(fontSize)
    .text(String(text), x + padding, y + padding, {
      width: w - padding * 2,
      height: h - padding * 2,
      align,
      ellipsis: true,
    });
}

export async function generateInvoicePdfBuffer(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      compress: true,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = 595.28;
    const pageH = 841.89;

    doc.rect(0, 0, pageW, pageH).fill("#F3F3F3");

    // main centered sheet
    const sheetX = 98;
    const sheetY = 0;
    const sheetW = 350;
    const sheetH = 780;

    // black top strip
    doc.rect(sheetX, sheetY, sheetW, 66).fill("#000000");

    if (fs.existsSync(invoiceLogoPath)) {
      doc.image(invoiceLogoPath, sheetX + sheetW / 2 - 18, 14, {
        fit: [36, 36],
      });
    }

    doc.rect(sheetX, 66, sheetW, 714).fill("#FFFFFF");

    doc
      .fillColor("#A9A9A9")
      .font("Helvetica")
      .fontSize(19)
      .text(`Tax Invoice for Order #${order.orderNumber}`, 124, 96, {
        width: 250,
      });

    doc
      .fillColor("#4E4E4E")
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .text(order.company?.name || "Atomos Global Pty Ltd", 130, 180);

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(8.8)
      .text(order.company?.line1 || "", 130, 195)
      .text(order.company?.line2 || "", 130, 208)
      .text(order.company?.country || "", 130, 221);

    doc
      .fillColor("#1EB6A7")
      .font("Helvetica")
      .fontSize(16)
      .text("TAX INVOICE", 330, 190, { width: 90, align: "right" });

    const leftX = 130;
    const labelW = 64;
    const contentW = 230;
    const blockH = 72;

    drawCell(doc, leftX, 264, labelW, blockH, "Bill to", {
      bold: true,
      fontSize: 9,
    });

    drawCell(
      doc,
      leftX + labelW,
      264,
      contentW,
      blockH,
      [
        order.billTo?.name || "",
        order.billTo?.company || "",
        order.billTo?.line1 || "",
        order.billTo?.line2 || "",
        order.billTo?.country || "",
      ]
        .filter(Boolean)
        .join("\n"),
      {
        fontSize: 8.7,
      }
    );

    drawCell(doc, leftX, 336, labelW, blockH, "Ship to", {
      bold: true,
      fontSize: 9,
    });

    drawCell(
      doc,
      leftX + labelW,
      336,
      contentW,
      blockH,
      [
        order.shipTo?.name || "",
        order.shipTo?.company || "",
        order.shipTo?.line1 || "",
        order.shipTo?.line2 || "",
        order.shipTo?.country || "",
      ]
        .filter(Boolean)
        .join("\n"),
      {
        fontSize: 8.7,
      }
    );

    const metaX = 130;
    const metaY = 430;
    const metaL = 120;
    const metaR = 174;
    const metaH = 28;

    const metaRows = [
      ["VAT Number", order.billToVat || order.customerVat || ""],
      ["Invoice Number", order.orderNumber || ""],
      ["Date", order.date || ""],
      ["VAT Number", order.vatNumber || ""],
      ["Terms", order.terms || ""],
    ];

    metaRows.forEach((row, i) => {
      const y = metaY + i * metaH;
      drawCell(doc, metaX, y, metaL, metaH, row[0], {
        bold: true,
        fontSize: 8.8,
      });
      drawCell(doc, metaX + metaL, y, metaR, metaH, row[1], {
        fontSize: 8.8,
      });
    });

    const tableX = 130;
    const tableY = 582;
    const descW = 160;
    const qtyW = 42;
    const unitW = 70;
    const amtW = 52;
    const headH = 38;
    const itemH = 40;
    const sumH = 26;

    drawCell(doc, tableX, tableY, descW, headH, "Description", {
      bold: true,
      fontSize: 8.8,
      padding: 10,
    });
    drawCell(doc, tableX + descW, tableY, qtyW, headH, "Qty", {
      bold: true,
      fontSize: 8.8,
      align: "center",
      padding: 10,
    });
    drawCell(doc, tableX + descW + qtyW, tableY, unitW, headH, "Unit Price", {
      bold: true,
      fontSize: 8.8,
      align: "center",
      padding: 10,
    });
    drawCell(doc, tableX + descW + qtyW + unitW, tableY, amtW, headH, "Amount", {
      bold: true,
      fontSize: 8.8,
      align: "center",
      padding: 10,
    });

    const item =
      Array.isArray(order.items) && order.items.length
        ? order.items[0]
        : { name: "", qty: 1, unitPrice: 0, amount: 0 };

    drawCell(doc, tableX, tableY + headH, descW, itemH, item.name || "", {
      fontSize: 8.6,
      padding: 10,
    });
    drawCell(doc, tableX + descW, tableY + headH, qtyW, itemH, String(item.qty || 1), {
      fontSize: 8.6,
      align: "center",
      padding: 10,
    });
    drawCell(
      doc,
      tableX + descW + qtyW,
      tableY + headH,
      unitW,
      itemH,
      money(order.currencySymbol || "€", item.unitPrice || 0),
      {
        fontSize: 8.6,
        align: "right",
        padding: 10,
      }
    );
    drawCell(
      doc,
      tableX + descW + qtyW + unitW,
      tableY + headH,
      amtW,
      itemH,
      money(order.currencySymbol || "€", item.amount || 0),
      {
        fontSize: 8.6,
        align: "right",
        padding: 10,
      }
    );

    const summaryY = tableY + headH + itemH;
    const summaryLW = descW + qtyW + unitW;
    const summaryRW = amtW;

    const summaryRows = [
      [`Subtotal (${order.currency || "EURO"})`, money(order.currencySymbol || "€", order.subtotal || 0)],
      [`VAT (${order.currency || "EURO"})`, money(order.currencySymbol || "€", order.tax || 0)],
      [`Total Paid (${order.currency || "EURO"})`, money(order.currencySymbol || "€", order.total || 0)],
    ];

    summaryRows.forEach((row, i) => {
      const y = summaryY + i * sumH;
      drawCell(doc, tableX, y, summaryLW, sumH, row[0], {
        bold: true,
        fontSize: 8.8,
        align: "right",
        padding: 8,
      });
      drawCell(doc, tableX + summaryLW, y, summaryRW, sumH, row[1], {
        fontSize: 8.8,
        align: "right",
        padding: 8,
      });
    });

    doc
      .fillColor("#555555")
      .font("Helvetica")
      .fontSize(8.5)
      .text("© 2025 Atomos", 0, 754, {
        width: pageW,
        align: "center",
      });

    doc.end();
  });
}