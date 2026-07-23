import type { Metadata } from "next";
import Link from "next/link";
import { CustomBundlePlanner } from "@/components/forms/CustomBundlePlanner";
import { LeadForm } from "@/components/forms/LeadForm";
import { FaqList } from "@/components/faq/FaqList";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact DSE Consultancy to discuss website development, social media management, SEO and a connected digital growth plan."
};

export default function ContactUsPage() {
  return (
    <main className="dse-inner-page dse-contact-page">
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
                <span>In Kalna.</span>
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
              <span>Common Questions about</span>
              <span>Our Services</span>
            </h2>
          </div>
          <div className="social-faq-wrap" style={{ maxWidth: "800px", marginInline: "auto", marginTop: "34px" }}>
            <FaqList items={contactFaqs} />
          </div>
        </div>
      </section>
    </main>
  );
}

const contactFaqs = [
  {
    question: "Can DSE Consultancy manage local SEO and website design for businesses in Kalna, Burdwan, and Kolkata?",
    answer: "Yes, we specialize in local SEO and custom web development specifically for local businesses across Burdwan, Kalna, and the wider Kolkata region. We design fast, mobile-friendly websites and optimize Google Business Profiles to help you rank when nearby customers search for your services."
  },
  {
    question: "How do website development and SMM + SEO work together to grow my business?",
    answer: "Your website is your digital storefront, while social media and local SEO drive traffic to it. By connecting them, we ensure that prospective clients who discover your business on Google Maps or Instagram find a consistent message, active reviews, and a smooth path to call or WhatsApp you directly."
  },
  {
    question: "Do you offer support and maintenance after my website goes live?",
    answer: "Yes, all our website packages include dedicated launch support, and our higher-tier plans include up to 1 year of free maintenance. We ensure your site remains secure, fast, and optimized for search engine updates."
  },
  {
    question: "How does DSE Consultancy track the success of my digital campaigns?",
    answer: "We focus on real enquiry signals—such as WhatsApp clicks, direction requests, phone calls on Google Business Profile, and form submissions—rather than just vanity metrics. You receive a clear monthly report outlining these conversions and your search visibility."
  }
];
