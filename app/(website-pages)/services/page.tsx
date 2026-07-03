import type { Metadata } from "next";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Website, Google business help, and lead form setup services from DSE Consultancy."
};

export default function ServicesPage() {
  return (
    <main>
      <section className="section white">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Services</span>
            <h1>Services for small business websites</h1>
            <p className="section-copy">
              Add more service pages here as your website grows.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.slug}>
                <span className="material-symbols-outlined service-icon">design_services</span>
                <h2>{service.title}</h2>
                <p>{service.shortText}</p>
                <a className="outline-button" href={`/services/${service.slug}`}>
                  Open service
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
