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

function drawBox(doc, x, y, w, h) {
  doc
    .lineWidth(0.8)
    .strokeColor("#DCDCDC")
    .rect(x, y, w, h)
    .stroke();
}

function drawCell(doc, x, y, w, h, text = "", opts = {}) {
  const {
    fontSize = 9.5,
    bold = false,
    color = "#666666",
    align = "left",
    paddingX = 10,
    paddingY = 8,
  } = opts;

  drawBox(doc, x, y, w, h);

  doc
    .fillColor(color)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(fontSize)
    .text(String(text || ""), x + paddingX, y + paddingY, {
      width: w - paddingX * 2,
      height: h - paddingY * 2,
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

    // page bg
    doc.rect(0, 0, pageW, pageH).fill("#F2F2F2");

    // centered sheet
    const sheetX = 86;
    const sheetY = 0;
    const sheetW = 390;
    const sheetH = 792;

    // top black strip
    doc.rect(sheetX, 0, sheetW, 68).fill("#000000");

    // top logo
    if (fs.existsSync(invoiceLogoPath)) {
      doc.image(invoiceLogoPath, sheetX + sheetW / 2 - 18, 14, {
        fit: [36, 36],
      });
    }

    // white invoice body
    doc.rect(sheetX, 68, sheetW, 724).fill("#FFFFFF");

    // heading
    doc
      .fillColor("#A8A8A8")
      .font("Helvetica")
      .fontSize(22)
      .text(`Tax Invoice for Order #${order.orderNumber}`, sheetX + 28, 106, {
        width: 265,
      });

    // company
    doc
      .fillColor("#4F4F4F")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(order.company?.name || "Atomos Global Pty Ltd", sheetX + 30, 196);

    doc
      .fillColor("#666666")
      .font("Helvetica")
      .fontSize(9.5)
      .text(order.company?.line1 || "", sheetX + 30, 212)
      .text(order.company?.line2 || "", sheetX + 30, 227)
      .text(order.company?.country || "", sheetX + 30, 242);

    doc
      .fillColor("#14AFA1")
      .font("Helvetica")
      .fontSize(18)
      .text("TAX INVOICE", sheetX + 268, 196, {
        width: 90,
        align: "right",
      });

    // address blocks
    const addrX = sheetX + 30;
    const addrY = 286;
    const labelW = 78;
    const contentW = 282;
    const rowH = 78;

    drawCell(doc, addrX, addrY, labelW, rowH, "Bill to", {
      bold: true,
      fontSize: 9.5,
    });

    drawCell(
      doc,
      addrX + labelW,
      addrY,
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
        fontSize: 9.3,
      }
    );

    drawCell(doc, addrX, addrY + rowH, labelW, rowH, "Ship to", {
      bold: true,
      fontSize: 9.5,
    });

    drawCell(
      doc,
      addrX + labelW,
      addrY + rowH,
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
        fontSize: 9.3,
      }
    );

    // metadata table
    const metaX = addrX;
    const metaY = 462;
    const metaLW = 130;
    const metaRW = 230;
    const metaRH = 31;

    const metaRows = [
      ["VAT Number", order.billToVat || order.customerVat || ""],
      ["Invoice Number", order.orderNumber || ""],
      ["Date", order.date || ""],
      ["VAT Number", order.vatNumber || ""],
      ["Terms", order.terms || ""],
    ];

    metaRows.forEach((row, i) => {
      const y = metaY + i * metaRH;
      drawCell(doc, metaX, y, metaLW, metaRH, row[0], {
        bold: true,
        fontSize: 9.2,
      });
      drawCell(doc, metaX + metaLW, y, metaRW, metaRH, row[1], {
        fontSize: 9.2,
      });
    });

    // items table
    const tableX = addrX;
    const tableY = 626;
    const descW = 186;
    const qtyW = 52;
    const unitW = 72;
    const amtW = 50;
    const headH = 38;
    const itemH = 36;
    const sumH = 28;

    drawCell(doc, tableX, tableY, descW, headH, "Description", {
      bold: true,
      fontSize: 9.2,
    });
    drawCell(doc, tableX + descW, tableY, qtyW, headH, "Qty", {
      bold: true,
      fontSize: 9.2,
      align: "center",
    });
    drawCell(doc, tableX + descW + qtyW, tableY, unitW, headH, "Unit Price", {
      bold: true,
      fontSize: 9.2,
      align: "center",
    });
    drawCell(doc, tableX + descW + qtyW + unitW, tableY, amtW, headH, "Amount", {
      bold: true,
      fontSize: 9.2,
      align: "center",
      paddingX: 6,
    });

    const item =
      Array.isArray(order.items) && order.items.length
        ? order.items[0]
        : { name: "", qty: 1, unitPrice: 0, amount: 0 };

    drawCell(doc, tableX, tableY + headH, descW, itemH, item.name || "", {
      fontSize: 9.1,
    });
    drawCell(doc, tableX + descW, tableY + headH, qtyW, itemH, String(item.qty || 1), {
      fontSize: 9.1,
      align: "center",
    });
    drawCell(
      doc,
      tableX + descW + qtyW,
      tableY + headH,
      unitW,
      itemH,
      money(order.currencySymbol || "€", item.unitPrice || 0),
      {
        fontSize: 9.1,
        align: "right",
        paddingX: 8,
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
        fontSize: 9.1,
        align: "right",
        paddingX: 6,
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
        fontSize: 9.2,
        align: "right",
        paddingX: 12,
      });

      drawCell(doc, tableX + summaryLW, y, summaryRW, sumH, row[1], {
        fontSize: 9.2,
        align: "right",
        paddingX: 6,
      });
    });

    doc
      .fillColor("#555555")
      .font("Helvetica")
      .fontSize(8.5)
      .text("© 2026 Atomos", 0, 765, {
        width: pageW,
        align: "center",
      });

    doc.end();
  });
}