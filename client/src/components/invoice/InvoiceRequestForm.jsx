import { useMemo, useState } from "react";
import { Mail, ReceiptText } from "lucide-react";
import {
  getInvoiceDownloadUrl,
  getInvoicePreviewUrl,
  requestInvoice,
} from "../../lib/api";
import StatusModal from "../ui/StatusModal";

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeOrderNumber(value) {
  return value.replace(/\s+/g, "").trim().toUpperCase();
}

function normalizeEmailInput(value) {
  return value.replace(/\\/g, "").trim().toLowerCase();
}

export default function InvoiceRequestForm() {
  const [form, setForm] = useState({
    email: "",
    orderNumber: "",
  });

  const [inlineError, setInlineError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const safeEmail = normalizeEmailInput(form.email);
  const safeOrderNumber = normalizeOrderNumber(form.orderNumber);

  const previewUrl = useMemo(() => {
    if (!safeEmail || !safeOrderNumber) return "#";
    return getInvoicePreviewUrl(safeOrderNumber, safeEmail);
  }, [safeOrderNumber, safeEmail]);

  const downloadUrl = useMemo(() => {
    if (!safeEmail || !safeOrderNumber) return "#";
    return getInvoiceDownloadUrl(safeOrderNumber, safeEmail);
  }, [safeOrderNumber, safeEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "orderNumber"
          ? normalizeOrderNumber(value)
          : normalizeEmailInput(value),
    }));

    setInlineError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineError("");

    const email = normalizeEmailInput(form.email);
    const orderNumber = normalizeOrderNumber(form.orderNumber);

    if (!email || !orderNumber) {
      setInlineError("Please enter both email address and order number.");
      return;
    }

    if (!validateEmail(email)) {
      setInlineError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const result = await requestInvoice({
        email,
        orderNumber,
      });

      setModal({
        open: true,
        type: "success",
        title: "Invoice generated",
        message: result.message || "Invoice generated successfully and emailed.",
      });
    } catch (error) {
      let message = error.message || "Something went wrong.";

      if (error.code === "EMAIL_MISMATCH") {
        message = "Please check your email.";
      }

      if (error.code === "ORDER_MISMATCH") {
        message = "No order is found with this email.";
      }

      if (error.code === "NOT_FOUND") {
        message = "No order is found with this email.";
      }

      setModal({
        open: true,
        type: "error",
        title: "Request failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card-dark overflow-hidden">
        <div className="border-b border-white/10 bg-[#121212] px-6 py-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-atomos-accent">
            Invoice verification
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">
            Verify your order
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Enter the same billing email and order number used at checkout.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white/85">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input-dark"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white/85">
                <ReceiptText size={16} />
                Order Number
              </label>
              <input
                type="text"
                name="orderNumber"
                placeholder="ATOMOS-2025-40956"
                className="input-dark"
                value={form.orderNumber}
                onChange={handleChange}
                required
              />
            </div>

            {inlineError ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {inlineError}
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate & Email"}
              </button>

              <a
                href={safeEmail && safeOrderNumber ? previewUrl : "#"}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full text-center"
                onClick={(e) => {
                  if (!safeEmail || !safeOrderNumber || !validateEmail(safeEmail)) {
                    e.preventDefault();
                    setInlineError("Enter a valid email and order number first.");
                  }
                }}
              >
                Preview PDF
              </a>

              <a
                href={safeEmail && safeOrderNumber ? downloadUrl : "#"}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full text-center"
                onClick={(e) => {
                  if (!safeEmail || !safeOrderNumber || !validateEmail(safeEmail)) {
                    e.preventDefault();
                    setInlineError("Enter a valid email and order number first.");
                  }
                }}
              >
                Download PDF
              </a>
            </div>
          </form>
        </div>
      </div>

      <StatusModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        primaryAction={
          modal.type === "success" ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full text-center"
            >
              Preview invoice
            </a>
          ) : (
            <button
              onClick={() =>
                setModal((prev) => ({
                  ...prev,
                  open: false,
                }))
              }
              className="btn-primary w-full"
            >
              Try again
            </button>
          )
        }
        secondaryAction={
          modal.type === "success" ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full text-center"
            >
              Download PDF
            </a>
          ) : null
        }
      />
    </>
  );
}