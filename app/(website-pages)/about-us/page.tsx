import type { Metadata } from "next";
import { AboutVisionStory } from "@/components/about/AboutVisionStory";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { FaqList } from "@/components/faq/FaqList";
import { aboutFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DSE Consultancy and how we help small Indian businesses get websites and Google visibility."
};

export default function AboutUsPage() {
  return (
    <main>
      <FaqJsonLd items={aboutFaqs} />
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
      <AboutVisionStory />
      <section className="dse-page-faq" id="faq">
        <div className="container">
          <div className="consultancy-home-heading center">
            <span className="consultancy-home-kicker dark">FAQs</span>
            <h2>
              <span>How DSE Works</span>
              <span>With Your Business.</span>
            </h2>
          </div>
          <div className="social-faq-wrap">
            <FaqList items={aboutFaqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
