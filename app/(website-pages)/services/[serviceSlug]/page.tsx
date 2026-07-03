import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      <section className="section white">
        <div className="container seo-content">
          <div>
            <span className="eyebrow">Service page</span>
            <h1>{service.pageTitle}</h1>
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
    </main>
  );
}
