import { FileText, Lock, MailCheck } from "lucide-react";

const steps = [
  {
    icon: <Lock size={18} />,
    title: "Secure verification",
    text: "We validate the billing email and order number before any invoice is generated.",
  },
  {
    icon: <FileText size={18} />,
    title: "Instant PDF generation",
    text: "Your tax invoice PDF is generated automatically using the current invoice structure.",
  },
  {
    icon: <MailCheck size={18} />,
    title: "Email delivery",
    text: "Once matched, the invoice can be sent directly to the billing email address.",
  },
];

export default function InvoiceInfo() {
  return (
    <div className="space-y-6">
      <div className="card-dark p-6 md:p-8">
        <h3 className="text-xl font-extrabold text-white">How it works</h3>

        <div className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-atomos-accent text-black">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 text-white">
                    {step.icon}
                    <h4 className="text-sm font-extrabold uppercase tracking-[0.14em]">
                      {step.title}
                    </h4>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {step.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-dark p-6 md:p-8">
        <h3 className="text-xl font-extrabold text-white">Phase 1 local test data</h3>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75">
          <p>
            <span className="font-bold text-white">Email:</span>{" "}
            florent@example.com
          </p>
          <p className="mt-2">
            <span className="font-bold text-white">Order Number:</span>{" "}
            ATOMOS-2025-40956
          </p>
        </div>
      </div>
    </div>
  );
}