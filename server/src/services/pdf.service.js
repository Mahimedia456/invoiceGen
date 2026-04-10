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
    fontSize = 10,
    bold = false,
    color = "#666666",
    align = "left",
    paddingX = 10,
    paddingY = 8,
  } = opts;

  doc
    .lineWidth(0.8)
    .strokeColor("#D8D8D8")
    .rect(x, y, w, h)
    .stroke();

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

function getAddressLines(address = {}) {
  return [
    address.name || "",
    address.company || "",
    address.line1 || "",
    address.line2 || "",
    address.country || "",
  ].filter(Boolean);
}

function drawMultilineCell(doc, x, y, w, h, lines = [], opts = {}) {
  const {
    fontSize = 10,
    bold = false,
    color = "#666666",
    paddingX = 10,
    paddingY = 8,
    lineGap = 2,
  } = opts;

  doc
    .lineWidth(0.8)
    .strokeColor("#D8D8D8")
    .rect(x, y, w, h)
    .stroke();

  const cleanLines = Array.isArray(lines) ? lines.filter(Boolean) : [];

  doc
    .fillColor(color)
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(fontSize);

  let currentY = y + paddingY;

  cleanLines.forEach((line) => {
    doc.text(String(line), x + paddingX, currentY, {
      width: w - paddingX * 2,
      ellipsis: true,
    });
    currentY += fontSize + lineGap + 2;
  });
}

export async function generateInvoicePdfBuffer(order) {
  return new Promise((resolve, reject) => {
    try {
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

      doc.rect(0, 0, pageW, pageH).fill("#F2F2F2");

      const marginX = 34;
      const sheetX = marginX;
      const sheetW = pageW - marginX * 2;

      doc.rect(sheetX, 0, sheetW, 72).fill("#000000");

      if (fs.existsSync(invoiceLogoPath)) {
        doc.image(invoiceLogoPath, pageW / 2 - 20, 15, {
          fit: [40, 40],
        });
      } else {
        doc
          .fillColor("#FFFFFF")
          .font("Helvetica-Bold")
          .fontSize(16)
          .text("ATOMOS", 0, 28, {
            width: pageW,
            align: "center",
          });
      }

      doc.rect(sheetX, 72, sheetW, pageH - 72 - 24).fill("#FFFFFF");

      doc
        .fillColor("#A6A6A6")
        .font("Helvetica")
        .fontSize(24)
        .text(`Tax Invoice for Order #${order.orderNumber || ""}`, sheetX + 28, 102, {
          width: 360,
        });

      doc
        .fillColor("#4D4D4D")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(order.company?.name || "Atomos Global Pty Ltd", sheetX + 30, 196);

      doc
        .fillColor("#666666")
        .font("Helvetica")
        .fontSize(10)
        .text(order.company?.line1 || "", sheetX + 30, 214)
        .text(order.company?.line2 || "", sheetX + 30, 230)
        .text(order.company?.country || "", sheetX + 30, 246);

      doc
        .fillColor("#16A99E")
        .font("Helvetica")
        .fontSize(20)
        .text("TAX INVOICE", sheetX + sheetW - 175, 196, {
          width: 145,
          align: "right",
        });

      const boxY = 286;
      const gap = 16;
      const boxW = (sheetW - 60 - gap) / 2;
      const boxH = 108;

      drawCell(doc, sheetX + 30, boxY, boxW, 28, "Bill to", {
        bold: true,
        fontSize: 10.5,
        color: "#555555",
      });

      drawMultilineCell(
        doc,
        sheetX + 30,
        boxY + 28,
        boxW,
        boxH - 28,
        getAddressLines(order.billTo),
        {
          fontSize: 10,
          color: "#666666",
        }
      );

      drawCell(doc, sheetX + 30 + boxW + gap, boxY, boxW, 28, "Ship to", {
        bold: true,
        fontSize: 10.5,
        color: "#555555",
      });

      drawMultilineCell(
        doc,
        sheetX + 30 + boxW + gap,
        boxY + 28,
        boxW,
        boxH - 28,
        getAddressLines(order.shipTo),
        {
          fontSize: 10,
          color: "#666666",
        }
      );

      const metaX = sheetX + 30;
      const metaY = 418;
      const metaLW = 160;
      const metaRW = sheetW - 60 - metaLW;
      const metaRH = 34;

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
          fontSize: 10,
          color: "#555555",
        });

        drawCell(doc, metaX + metaLW, y, metaRW, metaRH, row[1], {
          fontSize: 10,
          color: "#666666",
        });
      });

      const tableX = sheetX + 30;
      const tableY = 612;
      const tableW = sheetW - 60;

      const descW = 255;
      const qtyW = 60;
      const unitW = 90;
      const amtW = tableW - descW - qtyW - unitW;

      const headH = 40;
      const itemH = 40;
      const sumH = 30;

      drawCell(doc, tableX, tableY, descW, headH, "Description", {
        bold: true,
        fontSize: 10,
        color: "#555555",
      });
      drawCell(doc, tableX + descW, tableY, qtyW, headH, "Qty", {
        bold: true,
        fontSize: 10,
        color: "#555555",
        align: "center",
      });
      drawCell(doc, tableX + descW + qtyW, tableY, unitW, headH, "Unit Price", {
        bold: true,
        fontSize: 10,
        color: "#555555",
        align: "center",
      });
      drawCell(doc, tableX + descW + qtyW + unitW, tableY, amtW, headH, "Amount", {
        bold: true,
        fontSize: 10,
        color: "#555555",
        align: "center",
      });

      const item =
        Array.isArray(order.items) && order.items.length
          ? order.items[0]
          : { name: "", qty: 1, unitPrice: 0, amount: 0 };

      drawCell(doc, tableX, tableY + headH, descW, itemH, item.name || "", {
        fontSize: 10,
        color: "#666666",
      });
      drawCell(doc, tableX + descW, tableY + headH, qtyW, itemH, String(item.qty || 1), {
        fontSize: 10,
        color: "#666666",
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
          fontSize: 10,
          color: "#666666",
          align: "right",
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
          fontSize: 10,
          color: "#555555",
          align: "right",
          paddingX: 12,
        });

        drawCell(doc, tableX + summaryLW, y, summaryRW, sumH, row[1], {
          fontSize: 10,
          color: "#666666",
          align: "right",
        });
      });

      doc
        .fillColor("#555555")
        .font("Helvetica")
        .fontSize(9)
        .text("© 2026 Atomos", 0, 802, {
          width: pageW,
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}