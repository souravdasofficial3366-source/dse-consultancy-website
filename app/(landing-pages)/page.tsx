import { FaqList } from "@/components/faq/FaqList";
import { LeadForm } from "@/components/forms/LeadForm";
import { LocalBusinessJsonLd } from "@/lib/json-ld";
import { industryCards, siteConfig } from "@/data/site";

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
    name: "Starter",
    kicker: "For small shops",
    price: "₹3,999",
    note: "Starting price",
    featured: false,
    items: [
      "Simple business website",
      "Mobile-friendly pages",
      "Call and WhatsApp buttons",
      "Google Business Profile help",
      "1 year free Google ranking help"
    ]
  },
  {
    name: "Growth",
    kicker: "For growing businesses",
    price: "₹6,999",
    note: "Starting price",
    featured: true,
    items: [
      "Everything in Starter",
      "More pages for your services",
      "Photo gallery and offers",
      "Customer enquiry form",
      "Easy guidance after launch"
    ]
  },
  {
    name: "Store",
    kicker: "For product sellers",
    price: "₹8,999",
    note: "Starting price",
    featured: false,
    items: [
      "Everything in Growth",
      "Product listing pages",
      "Order or enquiry flow",
      "Payment guidance if needed",
      "More support for setup"
    ]
  }
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <LocalBusinessJsonLd />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">
              <span className="pulse-dot" />
              Trusted by local Indian businesses
            </span>
            <h1>
              Get a business website from <span className="accent">{siteConfig.basePrice}</span>
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
          <div className="lead-card" id="lead-form">
            <h2>Get your business website</h2>
            <LeadForm sourcePath="/" />
          </div>
        </div>
      </section>

      <section className="section white" id="why-us">
        <div className="container">
          <div className="section-head center">
            <h2>What&apos;s Included</h2>
            <p className="section-copy">
              Don&apos;t get trapped by &quot;Cheap&quot; ₹999 templates with hidden costs.
            </p>
          </div>
          <div className="comparison">
            <table>
              <thead>
                <tr>
                  <th>Need</th>
                  <th>DSE Consultancy</th>
                  <th>Many cheap offers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Advanced website setup</td>
                  <td>Included in the package</td>
                  <td>Often added later</td>
                </tr>
                <tr>
                  <td>Free website SEO for one year</td>
                  <td>Included at no extra cost</td>
                  <td>Usually not included</td>
                </tr>
                <tr>
                  <td>Google My Business setup and management</td>
                  <td>Included in the package</td>
                  <td>Usually charged separately</td>
                </tr>
                <tr>
                  <td>Website content</td>
                  <td>Professional content included</td>
                  <td>You may be asked to write everything</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="industries">
        <div className="container">
          <div className="section-head center">
            <div>
              <h2>Websites for everyday businesses</h2>
              <p className="section-copy">
                We create simple pages for the way local customers search and call.
              </p>
            </div>
            <a className="outline-button" href="#lead-form">
              Check my business
            </a>
          </div>
          <div className="industry-grid">
            {industryCards.map((card) => (
              <article className="industry-card" key={card.title}>
                <div className="industry-image" style={{ backgroundImage: `url("${card.image}")` }} />
                <div className="industry-content">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <a className="secondary-button" href="#lead-form">
                    View package
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container advantage-grid">
          <div className="advantage-copy">
            <h2>
              Made to bring <span className="accent">local calls</span>
            </h2>
            <p className="section-copy">
              A website should not only look good. It should help people find your business, trust
              you, and call you.
            </p>
            <div className="score-list">
              <div className="score-item">
                <span className="score-ring">98%</span>
                <div>
                  <h3>Mobile-ready pages</h3>
                  <p>Pages open quickly for customers searching from phones.</p>
                </div>
              </div>
              <div className="score-item">
                <span className="score-ring">91%</span>
                <div>
                  <h3>Easy contact flow</h3>
                  <p>Customers can call, WhatsApp, or send an enquiry without confusion.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="proof-panel">
            <div
              className="proof-image"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAoSOrRnNQcXHYZYYb--ceQ7SMmIDtrKPlsbUosk9kFrClMKG7h6sltVZGrzZlCJWKGnfiDQYMv-wEHq8YEI78rOajpPzTW_3nn6YrOK9i6cE49nn54SDsfgB0hDh_AnVRpXDDMgywopG5DvJ8vWuNOIRGUNpwV1Il7R7AcTfVlUeDjENctYHf5-kwz16ynAf6DeLUKoQHUjripUzhsrVbrWVKMfDYxj0HauQxS2YVh9Y8NW4b7go0I9PzznvYh98D27wlu7U_t2wg")'
              }}
            >
              <p className="proof-quote">
                A clear website helps customers understand what you sell and contact you faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section white" id="pricing">
        <div className="container">
          <div className="section-head center">
            <h2>Pocket friendly pricing</h2>
            <p className="section-copy">Start small. Add more pages only when your business needs them.</p>
          </div>
          <div className="pricing-grid">
            {prices.map((plan) => (
              <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
                <span className="price-kicker">{plan.kicker}</span>
                <h3>{plan.name}</h3>
                <div className="price">
                  {plan.price}
                  <small> + GST</small>
                </div>
                <p>{plan.note}</p>
                <ul className="check-list">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a className={plan.featured ? "primary-button" : "outline-button"} href="#lead-form">
                  Choose {plan.name}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container service-grid">
          <article className="service-card">
            <span className="material-symbols-outlined service-icon">edit_note</span>
            <h3>We help with website text</h3>
            <p>You do not need to write everything. We help explain your services in simple words.</p>
          </article>
          <article className="service-card">
            <span className="material-symbols-outlined service-icon">dashboard_customize</span>
            <h3>No technical work for you</h3>
            <p>Share your details and photos. We handle the website work and guide you clearly.</p>
          </article>
          <article className="service-card">
            <span className="material-symbols-outlined service-icon">search_check</span>
            <h3>Help customers find you</h3>
            <p>Your pages are written so local customers can understand, trust, and call you.</p>
          </article>
        </div>
      </section>

      <section className="section white" id="faq">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Questions</span>
            <h2>Clear answers before you start</h2>
            <p className="section-copy">
              No confusing words. No pressure. We explain the package in everyday language.
            </p>
          </div>
          <div className="faq-grid">
            <FaqList items={faqs} />
            <aside className="help-card">
              <span className="material-symbols-outlined">support_agent</span>
              <h3>Still have questions?</h3>
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
            <article className="mini-card">
              <span className="material-symbols-outlined">payments</span>
              <h3>Clear billing</h3>
              <p>We tell you the package price and any extra work before payment.</p>
            </article>
            <article className="mini-card">
              <span className="material-symbols-outlined">settings_suggest</span>
              <h3>Guided support</h3>
              <p>We guide you after launch so you know what was done.</p>
            </article>
            <article className="mini-card">
              <span className="material-symbols-outlined">verified_user</span>
              <h3>Consent first</h3>
              <p>We store form details only after the visitor agrees to be contacted.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
