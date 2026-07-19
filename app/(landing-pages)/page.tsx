import type { Metadata } from "next";
import Link from "next/link";
import { CursorExploreCta } from "@/components/landing/CursorExploreCta";
import { HeroGrowthDashboard } from "@/components/landing/HeroGrowthDashboard";
import { HomePalettePreview } from "@/components/landing/HomePalettePreview";
import { HomeProcessStack, type HomeProcessStep } from "@/components/landing/HomeProcessStack";
import { blogPosts } from "@/data/blog";
import { LocalBusinessJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Digital Growth Services For Local Businesses",
  description:
    "DSE Consultancy connects website development, social media management and SEO to help local businesses get discovered, build trust and generate enquiries."
};

const serviceCards = [
  {
    number: "01",
    eyebrow: "Website Development",
    title: "Turn Your Business Into A Digital Destination.",
    titleLines: ["Turn Your Business", "Into A Digital", "Destination."],
    text: "A fast, mobile-first website that explains your services clearly and makes calling, WhatsApp and enquiry simple.",
    href: "/website-development",
    cta: "Explore Website Development",
    video: "/videos/growth_visibility_assistant_search.mp4",
    className: "website"
  },
  {
    number: "02",
    eyebrow: "Social Media Management + SEO",
    title: "Be Found, Stay Active And Build Customer Trust.",
    titleLines: ["Be Found, Stay Active", "And Build Customer", "Trust."],
    text: "One connected system for local search visibility, useful content, social proof and quality enquiry paths.",
    href: "/social-media-management-plus-seo",
    cta: "Explore SMM + SEO",
    video: "/videos/growth_social_proof_scroll.mp4",
    className: "social"
  }
] as const;

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We understand the business, audience, location, services and the action customers should take.",
    video: "/videos/home-process/discover.mp4",
    poster: "/videos/home-process/discover-poster.jpg",
    tags: ["Business Goals", "Customer Journey", "Local Demand"]
  },
  {
    number: "02",
    title: "Design",
    description: "We shape the message, visual direction, page structure and channel plan around that customer journey.",
    video: "/videos/home-process/design.mp4",
    poster: "/videos/home-process/design-poster.jpg",
    tags: ["Message", "Visual Direction", "Page Structure"]
  },
  {
    number: "03",
    title: "Build",
    description: "We create, connect and test the website, search, content and enquiry touchpoints.",
    video: "/videos/home-process/build.mp4",
    poster: "/videos/home-process/build-poster.jpg",
    tags: ["Website", "Search Setup", "Enquiry Paths"]
  },
  {
    number: "04",
    title: "Improve",
    description: "We review useful signals and refine the system as the business, content and customer needs evolve.",
    video: "/videos/home-process/improve.mp4",
    poster: "/videos/home-process/improve-poster.jpg",
    tags: ["Useful Signals", "Content Refinement", "Ongoing Optimisation"]
  }
] as const satisfies readonly HomeProcessStep[];

export default function ConsultancyHomePage() {
  return (
    <main className="consultancy-home" data-home-palette="blaze" id="top">
      <LocalBusinessJsonLd />
      <HomePalettePreview />

      <section className="consultancy-home-hero">
        <video aria-hidden="true" autoPlay loop muted playsInline preload="metadata">
          <source src="/videos/banner_section_Hero_video.mp4" type="video/mp4" />
        </video>
        <div className="consultancy-home-hero-shade" />
        <div className="container consultancy-home-hero-grid">
          <div className="consultancy-home-hero-copy">
            <span className="consultancy-home-kicker">Digital Growth, Connected</span>
            <h1>
              <span>Build Your Presence.</span>
              <span className="outline">Earn Attention.</span>
              <span>Create Enquiries.</span>
            </h1>
            <p>
              DSE Consultancy brings website development, social media management and SEO together
              so local businesses can look credible, stay visible and make the next step easy for customers.
            </p>
            <div className="consultancy-home-actions">
              <Link className="consultancy-home-button primary" href="#services">
                Explore Our Services <span aria-hidden="true">↘</span>
              </Link>
              <Link className="consultancy-home-button glass" href="/contact-us">
                Start A Conversation <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <HeroGrowthDashboard />
        </div>
        <CursorExploreCta />
      </section>

      <section className="consultancy-home-services" id="services">
        <div className="container">
          <div className="consultancy-home-heading split">
            <div>
              <span className="consultancy-home-kicker dark">Our Services</span>
              <h2>
                <span>Two Growth Engines.</span>
                <span>One Clear Business Story.</span>
              </h2>
            </div>
            <p>
              Start with the service your business needs now. Both pages are designed as focused,
              conversion-ready experiences and connect back into the wider DSE ecosystem.
            </p>
          </div>

          <div className="consultancy-service-grid">
            {serviceCards.map((service) => (
              <Link
                className={`consultancy-service-card ${service.className}`}
                href={service.href}
                key={service.href}
              >
                <video aria-hidden="true" autoPlay loop muted playsInline preload="metadata">
                  <source src={service.video} type="video/mp4" />
                </video>
                <span className="consultancy-service-overlay" />
                <span className="consultancy-service-number">{service.number}</span>
                <span className="consultancy-service-content">
                  <small>{service.eyebrow}</small>
                  <strong aria-label={service.title}>
                    {service.titleLines.map((line) => <span key={line}>{line}</span>)}
                  </strong>
                  <span>{service.text}</span>
                  <b>{service.cta} <i aria-hidden="true">↗</i></b>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="consultancy-home-system" id="connected-advantage">
        <div className="container consultancy-home-system-grid">
          <div className="consultancy-home-system-copy">
            <div>
              <span className="consultancy-home-kicker dark">The Connected Advantage</span>
              <h2>
                <span>Every Customer Touchpoint.</span>
                <span>One Consistent Business.</span>
              </h2>
            </div>
            <div className="consultancy-home-system-intro">
              <p>
                Your website, Google presence, social content and contact journey work better when
                they use one message and guide customers toward one clear action.
              </p>
              <Link href="/about-us">See How We Think <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="consultancy-system-canvas">
            <article className="consultancy-system-tile tile-discovery">
              <video aria-hidden="true" autoPlay loop muted playsInline preload="metadata">
                <source src="/videos/connected_discovery_navigation.mp4" type="video/mp4" />
              </video>
              <span className="consultancy-system-tile-overlay" />
              <span className="material-symbols-outlined">travel_explore</span>
              <span className="consultancy-system-tile-copy">
                <small>01 / Discovery</small>
                <strong>Customers Find You</strong>
                <p>Search-ready pages and local visibility create the first meaningful connection.</p>
              </span>
            </article>
            <article className="consultancy-system-tile tile-trust">
              <video aria-hidden="true" autoPlay loop muted playsInline preload="metadata">
                <source src="/videos/connected_trust_seminar_audience.mp4" type="video/mp4" />
              </video>
              <span className="consultancy-system-tile-overlay" />
              <span className="material-symbols-outlined">verified</span>
              <span className="consultancy-system-tile-copy">
                <small>02 / Trust</small>
                <strong>Your Presence Feels Active</strong>
                <p>Clear information, useful content and consistent visual signals reduce uncertainty.</p>
              </span>
            </article>
            <article className="consultancy-system-tile tile-action">
              <video aria-hidden="true" autoPlay loop muted playsInline preload="metadata">
                <source src="/videos/connected_action_meeting.mp4" type="video/mp4" />
              </video>
              <span className="consultancy-system-tile-overlay" />
              <span className="material-symbols-outlined">north_east</span>
              <span className="consultancy-system-tile-copy">
                <small>03 / Action</small>
                <strong>Attention Becomes An Enquiry</strong>
                <p>Calls, WhatsApp, forms and appointments create a simple path to conversation.</p>
              </span>
            </article>
          </div>
        </div>
      </section>

      <section className="consultancy-home-process" id="process">
        <div className="container">
          <div className="consultancy-home-heading center">
            <span className="consultancy-home-kicker">How We Work</span>
            <h2>
              <span>A Clear Process From First Conversation</span>
              <span>To Continuous Improvement.</span>
            </h2>
          </div>
          <HomeProcessStack steps={processSteps} />
        </div>
      </section>

      <section className="consultancy-home-insights" id="insights">
        <div className="container">
          <div className="consultancy-home-heading split compact">
            <div>
              <span className="consultancy-home-kicker dark">Latest Thinking</span>
              <h2>
                <span>Useful Ideas For Building A</span>
                <span>Stronger Digital Presence.</span>
              </h2>
            </div>
            <Link className="consultancy-text-link" href="/blog">View All Articles ↗</Link>
          </div>
          <div className="consultancy-insight-grid">
            {blogPosts.map((post, index) => (
              <Link className={`consultancy-insight-card ${post.accent}`} href={`/blog/${post.slug}`} key={post.slug}>
                <span className="consultancy-insight-index">0{index + 1}</span>
                <small>{post.category}</small>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="consultancy-insight-meta">{post.readingTime} <b>↗</b></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="consultancy-home-closing" id="contact">
        <div className="container consultancy-home-closing-inner">
          <span>Ready When You Are.</span>
          <h2>
            <span>Let&apos;s Build The Digital Presence</span>
            <span>Your Business Deserves.</span>
          </h2>
          <p>Tell us where your business is today and what you want the next customer to do.</p>
          <Link href="/contact-us">Contact DSE Consultancy <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
