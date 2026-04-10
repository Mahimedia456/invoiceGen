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
    fontSize = 10.5,
    bold = false,
    color = "#666666",
    align = "left",
    padding = 10,
  } = opts;

  doc
    .lineWidth(1)
    .strokeColor("#E6E6E6")
    .rect(x, y, w, h)
    .stroke();

  doc
    .fillColor(color)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(fontSize)
    .text(String(text), x + padding, y + padding, {
      width: w - padding * 2,
      align,
    });
}

export async function generateInvoicePdfBuffer(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = 595.28;
    const pageH = 841.89;

    doc.rect(0, 0, pageW, pageH).fill("#F5F5F5");

    doc.rect(98, 0, 350, 66).fill("#000000");

    if (fs.existsSync(invoiceLogoPath)) {
      doc.image(invoiceLogoPath, pageW / 2 - 18, 13, {
        fit: [36, 36],
        align: "center",
      });
    } else {
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("ATOMOS", pageW / 2 - 30, 24);
    }

    doc.rect(98, 66, 350, 715).fill("#FFFFFF");

    doc
      .fillColor("#A0A0A0")
      .font("Helvetica")
      .fontSize(26)
      .text(`Tax Invoice for Order #${order.orderNumber}`, 125, 95, {
        width: 260,
      });

    doc
      .fillColor("#5B5B5B")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(order.company?.name || "Atomos Global Pty Ltd", 130, 185);

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(10)
      .text(order.company?.line1 || "", 130, 201)
      .text(order.company?.line2 || "", 130, 217)
      .text(order.company?.country || "", 130, 233);

    doc
      .fillColor("#20B7A7")
      .font("Helvetica")
      .fontSize(19)
      .text("TAX INVOICE", 345, 192, {
        width: 75,
        align: "right",
      });

    const leftX = 130;
    const labelW = 64;
    const contentW = 230;
    const rowH = 82;

    drawCell(doc, leftX, 270, labelW, rowH, "Bill to", {
      bold: true,
      fontSize: 10.5,
      color: "#666666",
    });

    drawCell(
      doc,
      leftX + labelW,
      270,
      contentW,
      rowH,
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
        fontSize: 10,
        color: "#666666",
      }
    );

    drawCell(doc, leftX, 352, labelW, rowH, "Ship to", {
      bold: true,
      fontSize: 10.5,
      color: "#666666",
    });

    drawCell(
      doc,
      leftX + labelW,
      352,
      contentW,
      rowH,
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
        fontSize: 10,
        color: "#666666",
      }
    );

    const metaX = 130;
    const metaY = 456;
    const metaL = 120;
    const metaR = 174;
    const metaH = 30;

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
        fontSize: 10,
        color: "#666666",
      });
      drawCell(doc, metaX + metaL, y, metaR, metaH, row[1], {
        fontSize: 10,
        color: "#666666",
      });
    });

    const tableX = 130;
    const tableY = 606;
    const descW = 160;
    const qtyW = 42;
    const unitW = 70;
    const amtW = 52;
    const headH = 42;
    const itemH = 44;

    drawCell(doc, tableX, tableY, descW, headH, "Description", {
      bold: true,
      fontSize: 10,
      color: "#666666",
      padding: 12,
    });
    drawCell(doc, tableX + descW, tableY, qtyW, headH, "Qty", {
      bold: true,
      fontSize: 10,
      color: "#666666",
      align: "center",
      padding: 12,
    });
    drawCell(doc, tableX + descW + qtyW, tableY, unitW, headH, "Unit Price", {
      bold: true,
      fontSize: 10,
      color: "#666666",
      align: "center",
      padding: 12,
    });
    drawCell(doc, tableX + descW + qtyW + unitW, tableY, amtW, headH, "Amount", {
      bold: true,
      fontSize: 10,
      color: "#666666",
      align: "center",
      padding: 12,
    });

    const item =
      Array.isArray(order.items) && order.items.length
        ? order.items[0]
        : { name: "", qty: 1, unitPrice: 0, amount: 0 };

    drawCell(doc, tableX, tableY + headH, descW, itemH, item.name || "", {
      fontSize: 10,
      color: "#666666",
      padding: 12,
    });
    drawCell(doc, tableX + descW, tableY + headH, qtyW, itemH, String(item.qty || 1), {
      fontSize: 10,
      color: "#666666",
      align: "center",
      padding: 12,
    });
    drawCell(
      doc,
      tableX + descW + qtyW,
      tableY + headH,
      unitW,
      itemH,
      money(order.currencySymbol || "€", item.unitPrice || 0),
      {
        fontSize: 10,
        color: "#666666",
        align: "right",
        padding: 12,
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
        fontSize: 10,
        color: "#666666",
        align: "right",
        padding: 12,
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
      const y = summaryY + i * 28;
      drawCell(doc, tableX, y, summaryLW, 28, row[0], {
        bold: true,
        fontSize: 10,
        color: "#666666",
        align: "right",
        padding: 8,
      });
      drawCell(doc, tableX + summaryLW, y, summaryRW, 28, row[1], {
        fontSize: 10,
        color: "#666666",
        align: "right",
        padding: 8,
      });
    });

    doc
      .fillColor("#555555")
      .font("Helvetica")
      .fontSize(9)
      .text("© 2025 Atomos", 0, 755, {
        width: pageW,
        align: "center",
      });

    doc.end();
  });
}