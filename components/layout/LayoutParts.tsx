import Image from "next/image";
import Link from "next/link";
import { HeaderBrandLink, HeaderNavLinks } from "@/components/layout/HeaderNavigation";
import { InteractiveFooter } from "@/components/layout/InteractiveFooter";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
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
        <HeaderBrandLink>
          <Image
            alt="DSE Consultancy Services"
            className="primary-logo"
            height={420}
            priority
            src="/branding/dse-consultancy-logo-orange.png"
            width={2100}
          />
        </HeaderBrandLink>
        <HeaderNavLinks />
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
              className="icon-button whatsapp-header-btn"
              href={`https://wa.me/${siteConfig.whatsapp}`}
              rel="noreferrer"
              target="_blank"
            >
              <Image alt="" height={21} src="/icons/whatsapp-green.svg" width={21} />
            </a>
          ) : null}
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}

export function Footer() {
  const phoneIsReady = hasConfiguredPhone();
  const whatsappIsReady = hasConfiguredWhatsApp();

  return (
    <footer className="site-footer">
      <InteractiveFooter>
        <div className="container">
          <div className="footer-cta">
            <span>Ready When You Are</span>
            <h2>Let&apos;s Build the Digital Presence Your Business Deserves.</h2>
            <Link className="footer-cta-link" href="/contact-us">
              Start a Conversation
              <span aria-hidden="true" className="material-symbols-outlined">north_east</span>
            </Link>
          </div>
          <div className="footer-grid">
            <div>
              <Link aria-label="DSE Consultancy home" className="brand brand-logo footer-logo" href="/#top">
                <Image
                  alt="DSE Consultancy Services"
                  className="primary-logo"
                  height={420}
                  src="/branding/dse-consultancy-logo-orange.png"
                  width={2100}
                />
              </Link>
              <p>
                We connect website development, social media management and SEO so local businesses
                can get discovered, build trust and create clearer enquiry journeys.
              </p>
              <div className="footer-contact-actions" aria-label="Contact DSE Consultancy">
                {whatsappIsReady ? (
                  <a
                    aria-label="Message DSE Consultancy on WhatsApp"
                    className="footer-whatsapp-link"
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image alt="" height={22} src="/icons/whatsapp-orange.svg" width={22} />
                  </a>
                ) : null}
                {phoneIsReady ? (
                  <a aria-label={`Call DSE Consultancy at ${siteConfig.phone}`} href={`tel:${siteConfig.phone}`}>
                    <span aria-hidden="true" className="material-symbols-outlined">call</span>
                  </a>
                ) : null}
                <a aria-label={`Email DSE Consultancy at ${siteConfig.email}`} href={`mailto:${siteConfig.email}`}>
                  <span aria-hidden="true" className="material-symbols-outlined">mail</span>
                </a>
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
              </div>
            </div>
            <div>
              <h3>Services</h3>
              <nav className="footer-links">
                <Link href="/website-development">Website Development</Link>
                <Link href="/social-media-management-plus-seo">SMM + SEO</Link>
              </nav>
            </div>
            <div>
              <h3>Contact</h3>
              <p>{hasConfiguredPhone() ? siteConfig.phone : "Phone number will be added before launch."}</p>
              <p>{siteConfig.email}</p>
              <p>{siteConfig.address}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 DSE Consultancy. All rights reserved.</span>
            <span style={{ display: "inline-flex", gap: "16px" }}>
              <Link href="/privacy-policy" style={{ textDecoration: "underline", color: "rgba(255,255,255,0.68)" }}>Privacy Policy</Link>
              <Link href="/terms-and-conditions" style={{ textDecoration: "underline", color: "rgba(255,255,255,0.68)" }}>Terms & Conditions</Link>
            </span>
            <span>Privacy details are shown before every form submission.</span>
          </div>
        </div>
      </InteractiveFooter>
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
      <Image alt="" height={22} src="/icons/whatsapp.svg" width={22} />
      <span>Chat now</span>
    </a>
  );
}
