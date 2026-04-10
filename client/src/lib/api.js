export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function requestInvoice(payload) {
  const response = await fetch(`${API_BASE_URL}/api/invoice/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to process invoice request.");
    error.code = data?.code || "UNKNOWN_ERROR";
    throw error;
  }

  return data;
}

export function getInvoicePreviewUrl(orderNumber, email) {
  const query = new URLSearchParams({ email }).toString();
  return `${API_BASE_URL}/api/invoice/preview/${encodeURIComponent(orderNumber)}?${query}`;
}

export function getInvoiceDownloadUrl(orderNumber, email) {
  const query = new URLSearchParams({ email, download: "1" }).toString();
  return `${API_BASE_URL}/api/invoice/preview/${encodeURIComponent(orderNumber)}?${query}`;
}