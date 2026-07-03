import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { getLocalSeoSlugs } from "@/data/local-seo";
import { siteConfig } from "@/data/site";
import { LocalBusinessJsonLd } from "@/lib/json-ld";
import { getLocalPageContent } from "@/lib/local-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLocalSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocalPageContent(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteConfig.siteUrl}/${page.slug}`
    }
  };
}

export default async function LocalSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getLocalPageContent(slug);

  if (!page) {
    notFound();
  }

  const business = page.businessType || "shop";

  return (
    <main>
      <LocalBusinessJsonLd
        city={page.city}
        description={page.description}
        pageUrl={`${siteConfig.siteUrl}/${page.slug}`}
      />
      <section className="seo-hero">
        <div className="container seo-content">
          <div>
            <span className="eyebrow">
              <span className="pulse-dot" />
              Local business website
            </span>
            <h1>{page.h1}</h1>
            <p className="hero-copy">{page.subtext}</p>
            <ul className="trust-list">
              <li>
                <span className="material-symbols-outlined">verified</span>
                Simple website from {siteConfig.basePrice}
              </li>
              <li>
                <span className="material-symbols-outlined">verified</span>
                Google help for 1 full year
              </li>
              <li>
                <span className="material-symbols-outlined">verified</span>
                Call and WhatsApp buttons included
              </li>
            </ul>
          </div>
          <div className="lead-card" id="lead-form">
            <h2>Get a call back</h2>
            <LeadForm businessType={business} city={page.city} sourcePath={`/${page.slug}`} />
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container seo-content">
          <div>
            <h2>Why this helps your {business} in {page.city}</h2>
            <p className="section-copy">
              Customers search on Google before they visit a shop or call a service. A clear website
              gives them your phone number, services, photos, address, timing, and WhatsApp link in
              one place.
            </p>
            <ul className="check-list">
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Your business details are easy to read on mobile phones.</span>
              </li>
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Customers can call you directly from the page.</span>
              </li>
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>Your town and business type are clearly written for local searches.</span>
              </li>
              <li>
                <span className="material-symbols-outlined">check_circle</span>
                <span>You get simple guidance after the website is ready.</span>
              </li>
            </ul>
          </div>
          <aside className="seo-panel">
            <h2>Starting package</h2>
            <div className="price">
              {siteConfig.basePrice}
              <small> + GST</small>
            </div>
            <p>
              Best for local businesses that need a simple website, call button, WhatsApp link, and
              Google-ready business pages.
            </p>
            <a className="primary-button" href="#lead-form">
              Start with a call
            </a>
          </aside>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head center">
            <h2>What we add to your website</h2>
            <p className="section-copy">
              Everything is written in simple words so your customers understand quickly.
            </p>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <span className="material-symbols-outlined service-icon">call</span>
              <h3>Phone calls</h3>
              <p>Customers can call you with one tap from mobile.</p>
            </article>
            <article className="service-card">
              <span className="material-symbols-outlined service-icon">location_on</span>
              <h3>Shop location</h3>
              <p>Your address, nearby area, and town are clearly shown.</p>
            </article>
            <article className="service-card">
              <span className="material-symbols-outlined service-icon">search</span>
              <h3>Google-ready text</h3>
              <p>Your services and city are written clearly for people searching near you.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
