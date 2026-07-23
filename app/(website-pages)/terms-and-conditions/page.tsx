import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read our terms and conditions for using DSE Consultancy services."
};

export default function TermsAndConditionsPage() {
  return (
    <main className="dse-inner-page legal-page">
      <section className="legal-hero">
        <div className="container">
          <span className="consultancy-home-kicker">Legal Details</span>
          <h1>
            <span>Terms & Conditions</span>
          </h1>
          <p>Last updated: July 17, 2026</p>
        </div>
      </section>

      <section className="legal-body">
        <div className="container">
          <div className="legal-layout">
            <div className="legal-content">
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using the services of DSE Consultancy, you agree to be bound by these
                Terms & Conditions. If you do not agree to all of these terms, please do not use our services
                or access our website.
              </p>

              <h2>2. Services Offered</h2>
              <p>
                DSE Consultancy provides custom website development, local Search Engine Optimisation (SEO),
                and Social Media Management (SMM). All monthly packages, deliverables, and service scopes
                will be outlined in your specific project contract or invoice terms.
              </p>

              <h2>3. Client Responsibilities</h2>
              <p>
                To deliver our services effectively, you agree to:
              </p>
              <ul>
                <li>Provide accurate, truthful, and complete business information.</li>
                <li>Supply required business assets, such as logos, photos, and access keys, on schedule.</li>
                <li>Ensure you own or have permission to use all materials and media you share with us.</li>
              </ul>

              <h2>4. Payment and Billing</h2>
              <p>
                Payments for our monthly SMM + SEO packages and website development contracts are due
                according to the schedule specified on your invoice.
              </p>
              <ul>
                <li>Monthly subscription services are billed in advance.</li>
                <li>Failure to pay invoices on time may result in temporary suspension of active services.</li>
                <li>All prices listed on our site are in Indian Rupees (INR) unless otherwise specified.</li>
              </ul>

              <h2>5. Limitation of Liability</h2>
              <p>
                DSE Consultancy is not liable for any indirect, incidental, or consequential damages
                arising from your use of our services, website downtime, search engine ranking shifts, or
                social media platform policy changes. We do our best to follow SEO guidelines, but we do
                not guarantee specific search ranking positions.
              </p>

              <h2>6. Governing Law</h2>
              <p>
                These Terms & Conditions shall be governed by and construed in accordance with the laws
                of West Bengal, India. Any disputes arising from these terms will be subject to the exclusive
                jurisdiction of the courts in Kalna / Burdwan.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                For any questions regarding these Terms & Conditions, please contact us via our
                <Link href="/contact-us">Contact Us</Link> page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
