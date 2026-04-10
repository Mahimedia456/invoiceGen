export default function InvoiceHero() {
  return (
    <section className="border-b border-white/10 bg-black">
      <div className="section-wrap py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-atomos-accent">
            Atomos Self-Service Tool
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Request Your Tax Invoice
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Enter your billing email address and order number to securely generate
            and receive your tax invoice.
          </p>
        </div>
      </div>
    </section>
  );
}