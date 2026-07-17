import Image from "next/image";
import Link from "next/link";
import { InteractiveFooter } from "@/components/layout/InteractiveFooter";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import {
  hasConfiguredPhone,
  hasConfiguredWhatsApp,
  landingNavigation,
  siteConfig
} from "@/data/site";

export function Header() {
  const phoneIsReady = hasConfiguredPhone();
  const whatsappIsReady = hasConfiguredWhatsApp();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link aria-label="DSE Consultancy home" className="brand brand-logo" href="/#top">
          <Image
            alt="DSE Consultancy Services"
            className="primary-logo"
            height={420}
            priority
            src="/branding/dse-consultancy-logo.png"
            width={2100}
          />
        </Link>
        <nav aria-label="Landing page navigation" className="nav-links">
          {landingNavigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
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
        <div className="footer-grid">
          <div>
            <Link aria-label="DSE Consultancy home" className="brand brand-logo footer-logo" href="/#top">
              <Image
                alt="DSE Consultancy Services"
                className="primary-logo"
                height={420}
                src="/branding/dse-consultancy-logo.png"
                width={2100}
              />
            </Link>
            <p>
              We help small Indian shops, clinics, stores, and local service owners get a fast website
              and get found on Google.
            </p>
            <div className="footer-contact-actions" aria-label="Contact DSE Consultancy">
              {whatsappIsReady ? (
                <a
                  aria-label="Message DSE Consultancy on WhatsApp"
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Image alt="" height={22} src="/icons/whatsapp.svg" width={22} />
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
            <h3>Who We Help</h3>
            <nav className="footer-links">
              <a href="/#industries">Pre-Schooling</a>
              <a href="/#industries">Doctors &amp; Clinics</a>
              <a href="/#industries">Education</a>
              <a href="/#industries">Transport &amp; Logistics</a>
              <a href="/#industries">Real Estate Businesses</a>
              <a href="/#industries">E-Commerce Stores</a>
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
