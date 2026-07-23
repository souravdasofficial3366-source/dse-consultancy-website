import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { FaqList } from "@/components/faq/FaqList";
import { CustomBundlePlanner } from "@/components/forms/CustomBundlePlanner";
import { LeadForm } from "@/components/forms/LeadForm";
import { contactFaqs } from "@/data/faqs";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact DSE Consultancy to discuss website development, social media management, SEO and a connected digital growth plan."
};

export default function ContactUsPage() {
  return (
    <main className="dse-inner-page dse-contact-page">
      <FaqJsonLd items={contactFaqs} />
      <section className="dse-contact-hero">
        <div className="container dse-contact-hero-grid">
          <div className="dse-contact-copy">
            <span className="consultancy-home-kicker">Contact DSE Consultancy</span>
            <h1>
              <span>Tell Us What You Want</span>
              <span>Your Digital Presence</span>
              <span>To Do Better.</span>
            </h1>
            <p>
              Share a little about your business. We&apos;ll understand the immediate need and help you
              choose the right starting point—website development, SMM + SEO, or a connected plan.
            </p>
            <div className="dse-contact-direct">
              <a href={`tel:${siteConfig.phone}`}>
                <span className="material-symbols-outlined">call</span>
                <small>Call Us</small>
                <strong>{siteConfig.phone}</strong>
              </a>
              <a href={`mailto:${siteConfig.email}`}>
                <span className="material-symbols-outlined">mail</span>
                <small>Email Us</small>
                <strong>{siteConfig.email}</strong>
              </a>
            </div>
          </div>
          <div className="dse-contact-form-card" id="contact-form">
            <span>Start Here</span>
            <h2>Request A Call Back</h2>
            <p>Complete the form and we&apos;ll contact you to understand the business requirement.</p>
            <LeadForm mode="general" sourcePath="/contact-us" />
          </div>
        </div>
      </section>

      <section className="dse-custom-plan-section" id="custom-plan">
        <div className="container">
          <div className="consultancy-home-heading split compact">
            <div>
              <span className="consultancy-home-kicker dark">Bundle And Save</span>
              <h2>
                <span>Build A Custom</span>
                <span>Digital Service Plan.</span>
              </h2>
            </div>
            <p>
              Choose the services and package levels that fit your business. Your estimated first
              invoice and available bundle discount update instantly.
            </p>
          </div>
          <CustomBundlePlanner whatsapp={siteConfig.whatsapp} />
        </div>
      </section>

      <section className="dse-contact-location" id="location">
        <div className="container">
          <div className="consultancy-home-heading split compact">
            <div>
              <span className="consultancy-home-kicker dark">Our Location</span>
              <h2>
                <span>Find DSE Consultancy</span>
                <span>In West Bengal.</span>
              </h2>
            </div>
            <div className="dse-contact-address-copy">
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <small>Temporary Business Address</small>
                <strong>{siteConfig.address}</strong>
              </div>
            </div>
          </div>

          <div className="dse-contact-map-shell">
            <iframe
              allowFullScreen
              aria-label={`Interactive Google map showing ${siteConfig.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Kalna%2C%20Burdwan%2C%20West%20Bengal%2C%20India&z=15&output=embed"
              title="DSE Consultancy location in Kalna, Burdwan"
            />
            <div className="dse-contact-map-card">
              <span className="material-symbols-outlined">near_me</span>
              <small>DSE Consultancy</small>
              <strong>{siteConfig.address}</strong>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Kalna%2C%20Burdwan%2C%20West%20Bengal%2C%20India"
                rel="noreferrer"
                target="_blank"
              >
                Open Directions <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="dse-contact-faq" id="faq">
        <div className="container">
          <div className="consultancy-home-heading center">
            <span className="consultancy-home-kicker dark">FAQs</span>
            <h2>
              <span>Before You</span>
              <span>Send An Enquiry.</span>
            </h2>
          </div>
          <div className="social-faq-wrap">
            <FaqList items={contactFaqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
