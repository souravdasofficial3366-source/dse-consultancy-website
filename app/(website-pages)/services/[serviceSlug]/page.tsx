import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { FaqList } from "@/components/faq/FaqList";
import { getService, services } from "@/data/services";

type PageProps = {
  params: Promise<{ serviceSlug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ serviceSlug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const service = getService(serviceSlug);

  if (!service) {
    return {};
  }

  return {
    title: service.title,
    description: service.shortText
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { serviceSlug } = await params;
  const service = getService(serviceSlug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <FaqJsonLd items={service.faqs} />
      <section className="section white">
        <div className="container seo-content">
          <div>
            <span className="eyebrow">Service page</span>
            <h1>
              <span>{service.pageTitle.split(" ").slice(0, Math.ceil(service.pageTitle.split(" ").length / 2)).join(" ")}</span>
              <span>{service.pageTitle.split(" ").slice(Math.ceil(service.pageTitle.split(" ").length / 2)).join(" ")}</span>
            </h1>
            <p className="section-copy">{service.pageText}</p>
          </div>
          <aside className="seo-panel">
            <h2>What is included</h2>
            <ul className="check-list">
              {service.points.map((point) => (
                <li key={point}>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a className="primary-button" href="/contact-us">
              Contact us
            </a>
          </aside>
        </div>
      </section>
      <section className="dse-page-faq" id="faq">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Common questions</span>
            <h2>What to confirm before choosing {service.title.toLowerCase()}</h2>
          </div>
          <div className="social-faq-wrap">
            <FaqList items={service.faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
