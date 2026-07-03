import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DSE Consultancy and how we help small Indian businesses get websites and Google visibility."
};

export default function AboutUsPage() {
  return (
    <main>
      <section className="section white">
        <div className="container seo-content">
          <div>
            <span className="eyebrow">About us</span>
            <h1>We help small businesses get found online.</h1>
            <p className="section-copy">
              DSE Consultancy builds simple, affordable websites for local Indian business owners who
              want more calls, WhatsApp messages, and Google visibility without confusing technical
              work.
            </p>
          </div>
          <aside className="seo-panel">
            <h2>Our promise</h2>
            <p>
              Clear words, clear pricing, mobile-friendly pages, and honest guidance before you start.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
