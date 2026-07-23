import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read our privacy policy to understand how we protect and manage your business information."
};

export default function PrivacyPolicyPage() {
  return (
    <main className="dse-inner-page legal-page">
      <section className="legal-hero">
        <div className="container">
          <span className="consultancy-home-kicker">Legal Details</span>
          <h1>
            <span>Privacy Policy</span>
          </h1>
          <p>Last updated: July 17, 2026</p>
        </div>
      </section>

      <section className="legal-body">
        <div className="container">
          <div className="legal-layout">
            <div className="legal-content">
              <h2>1. Introduction</h2>
              <p>
                At DSE Consultancy, we respect your privacy and are committed to protecting the
                personal and business data you share with us. This Privacy Policy explains how we collect,
                use, and safeguard your information when you visit our website or request our services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We collect information directly from you when you fill out contact forms, request audits,
                or connect with us via WhatsApp. This may include:
              </p>
              <ul>
                <li>Your name and contact details (email, phone number).</li>
                <li>Your business details (business name, category, website, location).</li>
                <li>Any specific digital project requirements or preferences you provide.</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the collected information for the following business purposes:
              </p>
              <ul>
                <li>To respond to your enquiries and coordinate callback requests.</li>
                <li>To perform free local presence audits on your Google and social pages.</li>
                <li>To build custom web development, local SEO, and SMM strategies for you.</li>
                <li>To send periodic project status reports and billing updates.</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or rent your personal or business information to third parties.
                We only share information with trusted service providers who help us operate our website,
                manage secure payments, or deliver our services, provided they agree to keep this
                information confidential.
              </p>

              <h2>5. Security of Your Data</h2>
              <p>
                We implement robust security measures to maintain the safety of your information. All
                confidential data and enquiry details are kept on secure hosting systems, and access is
                limited to authorized team members who need it to fulfill your requested tasks.
              </p>

              <h2>6. Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy, you may contact us using the
                information on our <Link href="/contact-us">Contact Us</Link> page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
