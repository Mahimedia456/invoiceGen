import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InvoiceHero from "../components/invoice/InvoiceHero";
import InvoiceRequestForm from "../components/invoice/InvoiceRequestForm";
import InvoiceInfo from "../components/invoice/InvoiceInfo";

export default function InvoiceRequestPage() {
  return (
    <div className="page-shell">
      <Header />

      <main>
        <InvoiceHero />

        <section className="section-wrap py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <InvoiceRequestForm />
            <InvoiceInfo />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}