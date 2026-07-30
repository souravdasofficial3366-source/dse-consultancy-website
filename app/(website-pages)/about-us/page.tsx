import type { Metadata } from "next";
import { AboutStoryVideoMark } from "@/components/about/AboutStoryVideoMark";
import { AboutVisionStory } from "@/components/about/AboutVisionStory";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { FaqList } from "@/components/faq/FaqList";
import { aboutFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how DSE Consultancy connects practical website development, search visibility and content systems for growing local businesses."
};

export default function AboutUsPage() {
  return (
    <main className="dse-inner-page dse-about-page">
      <FaqJsonLd items={aboutFaqs} />

      <section className="dse-inner-hero dse-about-hero">
        <div className="container dse-inner-hero-grid">
          <div>
            <span className="consultancy-home-kicker">About DSE Consultancy</span>
            <h1>
              <span>Digital Work</span>
              <span>Should Feel Clear,</span>
              <span>Connected And Useful.</span>
            </h1>
          </div>
          <aside className="dse-inner-hero-note">
            <span>Our Point Of View</span>
            <p>
              A strong digital presence is not one website, one post or one ranking. It is the
              complete experience a customer has from first discovery to first conversation.
            </p>
          </aside>
        </div>
      </section>

      <section className="section white dse-about-story">
        <div className="container dse-about-story-grid">
          <AboutStoryVideoMark />
          <div>
            <span className="consultancy-home-kicker dark">Our Story</span>
            <h2>
              <span>Built For Businesses</span>
              <span>That Need A Practical</span>
              <span>Digital Growth Partner.</span>
            </h2>
            <p>
              DSE Consultancy is a Kolkata-focused digital consultancy created to help local and
              growing businesses build a credible online presence without unnecessary complexity.
              We combine website development, search visibility, content planning and social media
              management into systems that customers can understand and businesses can use.
            </p>
            <p>
              Our work begins with the business: what it offers, who it serves, where customers
              search, what creates trust, and which action matters most. Design and technology then
              support that strategy.
            </p>
          </div>
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
