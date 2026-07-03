import Link from "next/link";
import {
  hasConfiguredPhone,
  hasConfiguredWhatsApp,
  siteConfig
} from "@/data/site";

export function Header() {
  const phoneIsReady = hasConfiguredPhone();
  const whatsappIsReady = hasConfiguredWhatsApp();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand" href="/">
          DSE Consultancy
        </Link>
        <nav aria-label="Main navigation" className="nav-links">
          <Link href="/about-us">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/case-studies">Cases</Link>
          <a href="/#industries">Businesses</a>
          <a href="/#pricing">Pricing</a>
          <Link href="/contact-us">Contact</Link>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Main navigation menu">
            <span aria-hidden="true" className="material-symbols-outlined">menu</span>
          </summary>
          <nav aria-label="Mobile navigation" className="mobile-menu-panel">
            <Link href="/about-us">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/case-studies">Case studies</Link>
            <a href="/#industries">Businesses</a>
            <a href="/#pricing">Pricing</a>
            <Link href="/contact-us">Contact</Link>
          </nav>
        </details>
        <div className="nav-actions">
          {phoneIsReady ? (
            <a aria-label="Call DSE Consultancy" className="mini-proof" href={`tel:${siteConfig.phone}`}>
              <span className="material-symbols-outlined">call</span>
              <span className="phone-label">{siteConfig.phone}</span>
            </a>
          ) : null}
          {whatsappIsReady ? (
            <a
              aria-label="WhatsApp DSE Consultancy"
              className="icon-button"
              href={`https://wa.me/${siteConfig.whatsapp}`}
              rel="noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined">chat</span>
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const whatsappIsReady = hasConfiguredWhatsApp();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">DSE Consultancy</div>
            <p>
              We help small Indian shops, clinics, stores, and local service owners get a fast website
              and get found on Google.
            </p>
            {siteConfig.socialLinks.length || whatsappIsReady ? (
              <div className="socials" aria-label="Social links">
                {siteConfig.socialLinks.map((link) => (
                  <a
                    aria-label={link.label}
                    href={link.url}
                    key={link.label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.shortLabel}
                  </a>
                ))}
                {whatsappIsReady ? (
                  <a
                    aria-label="WhatsApp"
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    wa
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          <div>
            <h3>Services</h3>
            <nav className="footer-links">
              <Link href="/website-design-for-shops-in-kolkata">Shop websites</Link>
              <Link href="/services">Services</Link>
              <Link href="/get-my-business-on-google-kolkata">Google help</Link>
              <Link href="/make-website-for-my-clinic-in-kolkata">Clinic websites</Link>
            </nav>
          </div>
          <div>
            <h3>Helpful Links</h3>
            <nav className="footer-links">
              <Link href="/about-us">About us</Link>
              <Link href="/contact-us">Contact us</Link>
              <Link href="/case-studies">Case studies</Link>
              <a href="/#pricing">Pricing</a>
              <a href="/sitemap.xml">Sitemap</a>
            </nav>
          </div>
          <div>
            <h3>Contact</h3>
            <p>{hasConfiguredPhone() ? siteConfig.phone : "Phone number will be added before launch."}</p>
            <p>{siteConfig.email}</p>
            <p>Business address will be added when you provide final details.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DSE Consultancy. All rights reserved.</span>
          <span>Privacy details are shown before every form submission.</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  if (!hasConfiguredWhatsApp()) {
    return null;
  }

  return (
    <a
      aria-label="Chat with DSE Consultancy on WhatsApp"
      className="whatsapp-fab"
      href={`https://wa.me/${siteConfig.whatsapp}`}
      rel="noreferrer"
      target="_blank"
    >
      <span className="material-symbols-outlined">chat</span>
      <span>Chat now</span>
    </a>
  );
}
