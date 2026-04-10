import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeEmail, normalizeOrderNumber } from "../utils/normalize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.resolve(__dirname, "../data/orders.json");

export async function getOrders() {
  const raw = await fs.readFile(ordersFilePath, "utf-8");
  return JSON.parse(raw);
}

export async function validateOrderAndEmail({ email, orderNumber }) {
  const orders = await getOrders();

  const safeEmail = normalizeEmail(email);
  const safeOrderNumber = normalizeOrderNumber(orderNumber);

  const exactMatch =
    orders.find(
      (order) =>
        normalizeEmail(order.email) === safeEmail &&
        normalizeOrderNumber(order.orderNumber) === safeOrderNumber
    ) || null;

  if (exactMatch) {
    return {
      status: "MATCHED",
      order: exactMatch,
      message: "Order matched successfully."
    };
  }

  const orderNumberExists = orders.some(
    (order) => normalizeOrderNumber(order.orderNumber) === safeOrderNumber
  );

  if (orderNumberExists) {
    return {
      status: "EMAIL_MISMATCH",
      order: null,
      message: "Please check your email."
    };
  }

  const emailExists = orders.some(
    (order) => normalizeEmail(order.email) === safeEmail
  );

  if (emailExists) {
    return {
      status: "ORDER_MISMATCH",
      order: null,
      message: "No order is found with this email."
    };
  }

  return {
    status: "NOT_FOUND",
    order: null,
    message: "No order is found with this email."
  };
}