import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact DSE Consultancy for an affordable business website and Google ranking help."
};

export default function ContactUsPage() {
  return (
    <main>
      <section className="section white">
        <div className="container seo-content">
          <div>
            <span className="eyebrow">Contact us</span>
            <h1>Tell us about your business.</h1>
            <p className="section-copy">
              Share your name, phone number, business type, and city. We will call you and explain the
              right website package in simple words.
            </p>
            <div className="seo-panel">
              <h2>Direct contact</h2>
              <p>Phone: {siteConfig.phone}</p>
              <p>Email: {siteConfig.email}</p>
            </div>
          </div>
          <div className="lead-card">
            <h2>Get a call back</h2>
            <LeadForm sourcePath="/contact-us" />
          </div>
        </div>
      </section>
    </main>
  );
}
