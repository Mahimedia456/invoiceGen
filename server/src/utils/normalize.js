export function normalizeEmail(value = "") {
  return String(value).replace(/\\/g, "").trim().toLowerCase();
}

export function normalizeOrderNumber(value = "") {
  return String(value).replace(/\s+/g, "").trim().toUpperCase();
}