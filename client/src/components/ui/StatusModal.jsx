import { CheckCircle2, XCircle, X } from "lucide-react";

export default function StatusModal({
  open,
  type = "success",
  title,
  message,
  onClose,
  primaryAction,
  secondaryAction,
}) {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0f0f10] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isSuccess ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
            }`}
          >
            {isSuccess ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/70 transition hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="mt-5 text-2xl font-extrabold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/65">{message}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
    </div>
  );
}