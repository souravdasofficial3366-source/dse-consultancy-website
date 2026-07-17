import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { FaqList } from "@/components/faq/FaqList";
import { LeadForm } from "@/components/forms/LeadForm";
import { IndustryVideoGrid } from "@/components/landing/IndustryVideoGrid";
import { WebsiteDevelopmentExperience } from "@/components/landing/WebsiteDevelopmentExperience";
import { LocalBusinessJsonLd } from "@/lib/json-ld";
import { industryCards, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Website Development For Local Businesses",
  description:
    "Affordable, mobile-friendly business website development with Google-ready content, lead forms, WhatsApp and ongoing support."
};

const faqs = [
  {
    question: "Is ₹3,999 the final price of the website?",
    answer:
      "₹3,999 is the starting price for a simple business website. Final price depends on the pages and features you need. We explain everything clearly on a short phone call before you pay."
  },
  {
    question: "Will my business show on Google?",
    answer:
      "Yes. We set up the basic Google details, write clear page titles, add your business information, and help your website get ready for local searches for 1 full year at no extra charge."
  },
  {
    question: "Do I need to know coding or website work?",
    answer:
      "No. You only share your business name, photos, phone number, address, and services. We make the website and guide you in simple words."
  },
  {
    question: "Will the website open properly on mobile phones?",
    answer:
      "Yes. Your website is made first for mobile phones because most local customers search from mobile."
  },
  {
    question: "Can customers call or WhatsApp me from the website?",
    answer:
      "Yes. We add call buttons, WhatsApp buttons, and a simple enquiry form so new customers can contact you quickly."
  }
];

const prices = [
  {
    name: "Essential",
    kicker: "For Startups",
    price: "₹3,999",
    featured: false,
    popularLabel: "",
    items: [
      "4–5 Static Pages",
      "Free Domain + Hosting (1st Year)",
      "Lead Form Integration",
      "Google My Business Registration",
      "24/7 Chat Support",
      "Free Website Maintenance for 3 Months"
    ]
  },
  {
    name: "Dynamic",
    kicker: "For Growth",
    price: "₹6,999",
    featured: true,
    popularLabel: "Most Popular",
    items: [
      "Everything in Essential +",
      "Admin Dashboard",
      "Unlimited Blog Updates",
      "Live Chat Support Integration",
      "24/7 Chat Support",
      "Free Website Maintenance for 6 Months"
    ]
  },
  {
    name: "Advanced",
    kicker: "For Commercial",
    price: "₹8,999",
    featured: false,
    popularLabel: "",
    items: [
      "Everything in Dynamic +",
      "E-Commerce / Storefront",
      "Payment & Logistics Integration",
      "Inventory Management",
      "24/7 Chat Support",
      "Free Website Maintenance for 1 Year",
      "Up to 25 Product Uploads Free"
    ]
  }
];

const performanceStats = [
  {
    score: 98,
    title: "First-Page Google Ready",
    text: "98% of the websites we build are optimized to rank on the first page of Google."
  },
  {
    score: 95,
    title: "User-Friendly Layout",
    text: "95% of our layouts follow modern UI/UX standards, making websites easier to use."
  },
  {
    score: 80,
    title: "Quality Lead Generation",
    text: "80% of the leads we generate are qualified and ready for sales follow-up."
  }
];

export default function HomePage() {
  return (
    <main className="landing-page website-development-page">
      <WebsiteDevelopmentExperience />
      <LocalBusinessJsonLd />
      <section className="hero wd-hero" id="top">
        <div aria-hidden="true" className="wd-hero-grid-art">
          <span className="wd-hero-fragment fragment-browser">
            <i />
            <i />
            <i />
            <b />
          </span>
          <span className="wd-hero-fragment fragment-mobile">
            <b />
            <i />
            <i />
          </span>
          <span className="wd-hero-fragment fragment-search">
            <span className="material-symbols-outlined">search</span>
          </span>
          <span className="wd-hero-fragment fragment-enquiry">
            <span className="material-symbols-outlined">call</span>
          </span>
        </div>
        <div className="container hero-grid">
          <div className="hero-content" data-wd-reveal>
            <span className="eyebrow">
              <span className="pulse-dot" />
              Trusted by local Indian businesses
            </span>
            <h1>
              Get Your Professional Website Starting from{" "}
              <span className="accent">{siteConfig.basePrice}</span>
            </h1>
            <p className="hero-copy">
              We make a fast website for your shop, clinic, store, or local business and help
              customers find you on Google for 1 full year, free.
            </p>
            <ul className="trust-list" aria-label="What is included">
              <li>
                <span className="material-symbols-outlined">verified</span>
                Zero HIDDEN COST.
              </li>
              <li>
                <span className="material-symbols-outlined">verified</span>
                Free Domain, Hosting, SSL, and Website SEO
              </li>
              <li>
                <span className="material-symbols-outlined">verified</span>
                Fast website that opens on mobile
              </li>
            </ul>
          </div>
          <div className="lead-card" data-wd-reveal data-wd-spotlight data-wd-tilt id="lead-form">
            <h2>Get Your Business Website</h2>
            <LeadForm sourcePath="/website-development" />
          </div>
        </div>
      </section>

      <section className="section white" id="why-us">
        <div className="container" data-wd-reveal>
          <div className="section-head center">
            <h2>What&apos;s Included</h2>
            <p className="section-copy">
              Don&apos;t get trapped by &quot;Cheap&quot; ₹999 templates with hidden costs.
            </p>
          </div>
          <div className="comparison" data-wd-spotlight>
            <table>
              <thead>
                <tr>
                  <th>Complimentary Add-ons</th>
                  <th>DSE Consultancy Services</th>
                  <th>Others</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Website SEO</td>
                  <td>
                    <span className="comparison-status included">
                      <span aria-hidden="true" className="material-symbols-outlined">check_circle</span>
                      Included in the package
                    </span>
                  </td>
                  <td>
                    <span className="comparison-status excluded">
                      <span aria-hidden="true" className="material-symbols-outlined">cancel</span>
                      Not included.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Google My Business Setup and Manage</td>
                  <td>
                    <span className="comparison-status included">
                      <span aria-hidden="true" className="material-symbols-outlined">check_circle</span>
                      Included at no extra cost.
                    </span>
                  </td>
                  <td>
                    <span className="comparison-status excluded">
                      <span aria-hidden="true" className="material-symbols-outlined">cancel</span>
                      Usually not included.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Social Media Page Creation</td>
                  <td>
                    <span className="comparison-status included">
                      <span aria-hidden="true" className="material-symbols-outlined">check_circle</span>
                      Included in the package
                    </span>
                  </td>
                  <td>
                    <span className="comparison-status excluded">
                      <span aria-hidden="true" className="material-symbols-outlined">cancel</span>
                      Usually charged separately.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Professional Website Content</td>
                  <td>
                    <span className="comparison-status included">
                      <span aria-hidden="true" className="material-symbols-outlined">check_circle</span>
                      Included in the package
                    </span>
                  </td>
                  <td>
                    <span className="comparison-status excluded">
                      <span aria-hidden="true" className="material-symbols-outlined">cancel</span>
                      Usually not included.
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="industries">
        <div className="container" data-wd-reveal>
          <div className="section-head center">
            <div>
              <h2>Websites for Everyday Businesses</h2>
              <p className="section-copy">
                We create simple pages for the way local customers search and call.
              </p>
            </div>
            <a className="outline-button" data-wd-magnetic href="#lead-form">
              Check my business
              <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <IndustryVideoGrid cards={industryCards} />
        </div>
      </section>

      <section className="section dark" id="results">
        <div className="container advantage-grid">
          <div className="advantage-copy" data-wd-reveal>
            <h2>
              Turn <span className="accent">Local Searches</span> Into Real{" "}
              <span className="accent">Business Leads</span>
            </h2>
            <p className="section-copy">
              A website should not only look good. It should help people find your business, trust
              you, and call you.
            </p>
            <div className="score-list">
              {performanceStats.map((stat, index) => (
                <div className="score-item" data-wd-reveal key={stat.title}>
                  <span aria-label={`${stat.score} percent`} className="score-ring">
                    <svg aria-hidden="true" viewBox="0 0 100 100">
                      <circle className="score-track" cx="50" cy="50" r="43" />
                      <circle
                        className="score-progress"
                        cx="50"
                        cy="50"
                        pathLength="100"
                        r="43"
                        style={{
                          animationDelay: `${index * 180}ms`,
                          strokeDashoffset: 100 - stat.score,
                          "--wd-score-offset": 100 - stat.score
                        } as CSSProperties}
                      />
                    </svg>
                    <strong>{stat.score}%</strong>
                  </span>
                  <div>
                    <h3>{stat.title}</h3>
                    <p>{stat.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="proof-panel" data-wd-reveal data-wd-spotlight>
            <div
              aria-label="Website walkthrough video placeholder"
              className="wd-video-placeholder"
              role="img"
            >
              <div aria-hidden="true" className="wd-video-placeholder-frame">
                <i />
                <i />
                <i />
                <span />
              </div>
              <span className="wd-video-placeholder-status">Video Coming Soon</span>
              <span
                aria-hidden="true"
                className="material-symbols-outlined wd-video-placeholder-play"
              >
                play_arrow
              </span>
              <div className="wd-video-placeholder-copy">
                <strong>Website Walkthrough Video</strong>
                <span>Your project video will play here.</span>
              </div>
            </div>
            <p className="proof-quote">
              A Clear Website Helps Customers Understand What You Sell and Contact You Faster.
            </p>
          </div>
        </div>
      </section>

      <section className="section white" id="pricing">
        <div className="container" data-wd-reveal>
          <div className="section-head center">
            <h2>Pocket-Friendly Pricing</h2>
            <p className="section-copy">Professional Digital Assets at Your Fingertips</p>
          </div>
          <div className="pricing-grid">
            {prices.map((plan) => (
              <article
                className={`price-card ${plan.featured ? "featured" : ""}`}
                data-wd-reveal
                data-wd-spotlight
                data-wd-tilt
                key={plan.name}
              >
                {plan.popularLabel ? <span className="popular-badge">{plan.popularLabel}</span> : null}
                <h3 className="price-kicker">
                  {plan.kicker} <span>Starting Price</span>
                </h3>
                <div className="price">
                  {plan.price}
                  <small> + GST</small>
                </div>
                <p className="price-warning">** Pricing may vary as per your requirement</p>
                <ul className="check-list">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className={plan.featured ? "primary-button" : "outline-button"}
                  data-wd-magnetic
                  href="#lead-form"
                >
                  Choose {plan.name}
                  <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft" id="support">
        <div className="container service-grid">
          <article className="service-card" data-wd-reveal data-wd-spotlight>
            <span className="material-symbols-outlined service-icon">edit_note</span>
            <h3>We Help You with Website Content</h3>
            <p>You do not need to write everything. We help explain your services in simple words.</p>
          </article>
          <article className="service-card" data-wd-reveal data-wd-spotlight>
            <span className="material-symbols-outlined service-icon">code_off</span>
            <h3>No Technical Work for You</h3>
            <p>Share your details and photos. We handle the website work and guide you clearly.</p>
          </article>
          <article className="service-card" data-wd-reveal data-wd-spotlight>
            <span className="material-symbols-outlined service-icon">travel_explore</span>
            <h3>Help Customers Find You</h3>
            <p>Your pages are written so local customers can understand, trust, and call you.</p>
          </article>
        </div>
      </section>

      <section className="section white" id="faq">
        <div className="container" data-wd-reveal>
          <div className="section-head center">
            <span className="eyebrow">Questions</span>
            <h2>Clear Answers Before You Start</h2>
            <p className="section-copy">
              No confusing words. No pressure. We explain the package in everyday language.
            </p>
          </div>
          <div className="faq-grid">
            <FaqList items={faqs} />
            <aside className="help-card" data-wd-spotlight>
              <span className="material-symbols-outlined">support_agent</span>
              <h3>Still Have Questions?</h3>
              <p>Book a short call and tell us about your business.</p>
              <a className="help-link" href={`tel:${siteConfig.phone}`}>
                <span className="material-symbols-outlined">call</span>
                <span>
                  <small>Call us</small>
                  <br />
                  {siteConfig.phone}
                </span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
              <a className="help-link primary" href={`mailto:${siteConfig.email}`}>
                <span className="material-symbols-outlined">mail</span>
                <span>
                  <small>Email us</small>
                  <br />
                  {siteConfig.email}
                </span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </aside>
          </div>
          <div className="mini-grid" style={{ marginTop: 36 }}>
            <article className="mini-card" data-wd-reveal data-wd-spotlight>
              <span className="material-symbols-outlined">payments</span>
              <h3>Clear Billing</h3>
              <p>We tell you the package price and any extra work before payment.</p>
            </article>
            <article className="mini-card" data-wd-reveal data-wd-spotlight>
              <span className="material-symbols-outlined">settings_suggest</span>
              <h3>Guided Support</h3>
              <p>We guide you after launch so you know what was done.</p>
            </article>
            <article className="mini-card" data-wd-reveal data-wd-spotlight>
              <span className="material-symbols-outlined">verified_user</span>
              <h3>Consent First</h3>
              <p>We store form details only after the visitor agrees to be contacted.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
