import type { Metadata } from "next";
import { FaqList } from "@/components/faq/FaqList";
import { SocialSeoAuditForm } from "@/components/forms/SocialSeoAuditForm";
import { CounterStats } from "@/components/landing/CounterStats";
import { MonthlyManagementBento } from "@/components/landing/MonthlyManagementBento";
import { SocialSeoStudio } from "@/components/landing/SocialSeoStudio";
import { ToolLogoCarousel } from "@/components/landing/ToolLogoCarousel";
import {
  formatPackagePrice,
  socialSeoPackages
} from "@/data/service-pricing";
import { siteConfig, hasConfiguredWhatsApp } from "@/data/site";
import { LocalBusinessJsonLd } from "@/lib/json-ld";

const pageUrl = `${siteConfig.siteUrl}/social-media-management-plus-seo`;

export const metadata: Metadata = {
  title: "Social Media Management + Local SEO",
  description:
    "Monthly social media management and local SEO for Indian small businesses. Get found on Google, stay active on social, and convert attention into WhatsApp enquiries.",
  alternates: {
    canonical: pageUrl
  },
  openGraph: {
    title: "Social Media Management + Local SEO for Indian Businesses",
    description:
      "A monthly growth package for Google visibility, social content, review support, and WhatsApp-ready enquiries.",
    url: pageUrl,
    type: "website"
  }
};

const proofStats = [
  { value: 1.03, suffix: "B", label: "internet users" },
  { value: 500, suffix: "M", label: "social media identities" },
  { value: 481, suffix: "M", label: "Instagram ad audience" },
  { value: 500, suffix: "M", label: "YouTube ad audience" }
] as const;

const managedItems = [
  ["Google Business Profile Updates", "Photos, posts, services, hours, and trust signals for Maps."],
  ["Local Keyword Research", "City and service keywords people actually search before calling."],
  ["Instagram/Facebook Calendar", "A monthly posting plan so your pages do not go silent."],
  ["Captions and Hashtags", "Simple copy, clear offers, and relevant local hashtags."],
  ["Reels/Shorts Direction", "Video ideas you can record without a full production team."],
  ["Review Support", "Request scripts and reply drafts that build trust."],
  ["Festival and Offer Content", "India-specific content for offers, seasons, and local moments."],
  ["WhatsApp/Call Tracking", "Clear CTAs so attention becomes an enquiry."],
  ["Simple Monthly Report", "Calls, profile actions, top posts, and next steps in plain English."]
] as const;

const platformTiles = [
  { short: "IG", slug: "instagram", title: "Instagram", text: "Reels, posts, offers, trust content, and local discovery.", logo: "/logos/tools/instagram.svg" },
  { short: "f", slug: "facebook", title: "Facebook", text: "Community updates, offers, event posts, and local brand recall.", logo: "/logos/tools/facebook.svg" },
  { short: "▶", slug: "youtube", title: "YouTube", text: "Videos, Shorts, service explainers, and authority-building content.", logo: "/logos/tools/youtube.svg" },
  { short: "G", slug: "google", title: "Google Business Profile", text: "Maps, reviews, calls, photos, posts, and profile activity.", logo: "/logos/tools/google-stitch.svg" },
  { short: "WA", slug: "whatsapp", title: "WhatsApp", text: "Enquiry flow, follow-up prompts, and call-to-action tracking.", logo: "/logos/tools/whatsapp.svg" },
  { short: "LI", slug: "linkedin", title: "LinkedIn", text: "Professional service trust, B2B visibility, and founder-led posts.", logo: "/logos/tools/linkedin.svg" }
] as const;

// Add more cards here later; the grid, video background, hover overlay, link, and CTA are data-driven.
const growthSystemCards = [
  {
    name: "Visibility",
    href: "#content-plan",
    headline: "We Improve Your Visibility",
    copy: [
      "We strengthen your Google Business Profile, local SEO, and city-based service pages around the searches your customers actually make.",
      "Your business becomes easier to discover in Google Search and Maps when nearby customers are ready to choose."
    ],
    cta: "Improve Local Visibility",
    videoSrc: "/videos/growth_visibility_assistant_search.mp4",
    visual: "visibility"
  },
  {
    name: "Social Proof",
    href: "#studio",
    headline: "Build Trust Before the Customer",
    copy: [
      "Consistent social content, current business information, real reviews, and helpful updates show that your business is active and dependable.",
      "This social proof gives customers a clear reason to choose you over a less visible competitor."
    ],
    cta: "Strengthen Social Proof",
    videoSrc: "/videos/growth_social_proof_scroll.mp4",
    visual: "social-proof"
  },
  {
    name: "Growth",
    href: "#audit",
    headline: "Turn Attention Into Quality Leads",
    copy: [
      "Clear calls to action connect Google, social media, WhatsApp, phone calls, directions, and enquiry forms into one simple customer journey.",
      "We track the signals that matter so you can focus on better enquiries and sustainable business growth."
    ],
    cta: "Get Quality Leads",
    videoSrc: "/videos/growth_business_call.mp4",
    visual: "business-call"
  }
] as const;

const planDetails = [
  {
    items: [
      "20 posts per month",
      "5 business-niche trending keywords",
      "Up to 4 blog posts per month",
      "Choose up to 2 social media platforms",
      "Basic SEO",
      "Google Business Profile Optimisation",
      "10 verified calls on GMB",
      "24/7 Chat Support",
      "Monthly performance report"
    ],
    traction: ["0.5–1% monthly growth", "Benchmark-informed monthly range"],
    featured: false
  },
  {
    items: [
      "30 posts per month",
      "10 business-niche trending keywords",
      "Up to 8 blog posts per month",
      "Choose up to 4 social media platforms",
      "Advanced SEO",
      "Google Business Profile Optimisation",
      "15 verified calls on GMB",
      "24/7 Chat Support",
      "Dedicated Support Assistant",
      "Monthly performance report"
    ],
    traction: ["1–2% monthly growth", "Benchmark-informed monthly range"],
    featured: true
  },
  {
    items: [
      "50 posts per month",
      "15 business-niche trending keywords",
      "Up to 12 blog posts per month",
      "All listed social media platforms",
      "Advanced+ SEO",
      "Google Business Profile Optimisation",
      "25 verified calls on GMB",
      "24/7 Chat Support",
      "Dedicated Support Assistant",
      "Monthly performance report"
    ],
    traction: ["2–3% monthly growth", "Benchmark-informed monthly range"],
    featured: false
  }
];

const plans = socialSeoPackages.map((pricing, index) => ({
  ...pricing,
  ...planDetails[index],
  priceLabel: formatPackagePrice(pricing)
}));

const faqs = [
  {
    question: "Will you guarantee first-page ranking?",
    answer:
      "No honest SEO partner should guarantee fixed rankings. We improve the signals Google uses, keep your profiles active, and report progress clearly."
  },
  {
    question: "How soon will I see results?",
    answer:
      "Social consistency can improve quickly. SEO and local visibility usually need steady work over a few months, depending on your city and competition."
  },
  {
    question: "Do I need to send photos and videos?",
    answer:
      "Yes, real business photos and short videos help. We guide you on what to send and can plan content shoots if you need more support."
  },
  {
    question: "Which platforms should my business use?",
    answer:
      "We choose based on your business. Most local businesses need Google Business Profile, WhatsApp, Instagram, and Facebook. Some service businesses also benefit from YouTube or LinkedIn."
  },
  {
    question: "Can you manage Google reviews?",
    answer:
      "We can help with review request systems and reply drafts. We do not create fake reviews or ask customers to post anything dishonest."
  },
  {
    question: "Is ad spend included?",
    answer:
      "No. This package is for organic social media plus local SEO. Paid ads can be quoted separately if they are needed."
  },
  {
    question: "Can this work without a website?",
    answer:
      "Yes, we can start with Google Business Profile, social pages, and WhatsApp. A website or landing page usually improves trust and tracking, so we may recommend it later."
  }
];

export default function SocialMediaSeoLandingPage() {
  const whatsappHref = hasConfiguredWhatsApp()
    ? `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
        "I want a free Social Media + SEO audit for my business."
      )}`
    : "#audit";

  return (
    <main className="social-seo-page">
      <LocalBusinessJsonLd />
      <section className="social-hero" id="top">
        <video
          aria-hidden="true"
          autoPlay
          className="social-hero-video"
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/videos/banner_section_Hero_video.mp4" type="video/mp4" />
        </video>
        <div className="container social-hero-grid">
          <div className="social-hero-copy">
            <span className="social-eyebrow">
              <span className="pulse-dot" />
              Social Media Management + Local SEO for Indian Businesses
            </span>
            <h1>
              <span>Get Found on Google & Stay Active on Social.</span>
              <span>Get More Enquiries.</span>
            </h1>
            <p>
              A monthly growth package for shops, clinics, coaching centres, salons, restaurants,
              real estate consultants, local services, and small ecommerce brands that need Google
              visibility, regular content, review support, and WhatsApp-ready leads.
            </p>
            <div className="social-button-row">
              <a className="social-primary-button" href="#audit">Book an Appointment</a>
              <a className="social-outline-button" href="#pricing">View Combo Plan</a>
            </div>
            <div className="social-trust-row" aria-label="What this package covers">
              <span>Google Business Profile</span>
              <span>Instagram/Facebook content</span>
              <span>Local SEO</span>
              <span>Monthly reports</span>
            </div>
          </div>

          <aside className="social-glass-form" id="audit">
            <h2>
              <span>Get Your Free</span>
              <span>Social + SEO Audit</span>
            </h2>
            <p>We review your Google and social pages before calling.</p>
            <SocialSeoAuditForm />
          </aside>
        </div>
      </section>

      <section className="social-proof-band" aria-label="India search and social proof">
        <CounterStats stats={proofStats} />
      </section>

      <section className="social-section social-growth-system-section" id="growth-system">
        <div className="container">
          <div className="social-section-head center">
            <span className="social-kicker">Growth system</span>
            <h2>
              <span>How Local Search and Social Media</span>
              <span>Grow Your Business</span>
            </h2>
            <p>
              Build local visibility, earn customer trust, and turn online attention into quality
              enquiries through one connected SEO and social media growth system.
            </p>
          </div>
          <div className="social-growth-card-grid">
            {growthSystemCards.map((card) => (
              <a
                className={`social-growth-card social-growth-card-${card.visual}`}
                href={card.href}
                key={card.name}
              >
                <video
                  aria-hidden="true"
                  autoPlay
                  className="social-growth-card-video"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={card.videoSrc} type="video/mp4" />
                </video>
                {card.visual === "visibility" ? (
                  <span className="social-growth-search-animation" aria-hidden="true">
                    <span className="social-growth-search-window">
                      <span className="social-growth-search-browser-bar">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="social-growth-search-field">
                        <span className="social-growth-search-icon">⌕</span>
                        <span className="social-growth-search-query">
                          Social Media Manager Near Me
                        </span>
                      </span>
                      <span className="social-growth-search-result">
                        <small>Top Search Result</small>
                        <strong>Local Social Media And SEO Support</strong>
                      </span>
                    </span>
                  </span>
                ) : null}
                {card.visual === "social-proof" ? (
                  <span className="social-growth-proof-animation" aria-hidden="true">
                    <span className="social-growth-proof-pill social-growth-proof-followers">
                      <span className="social-growth-proof-icon">↗</span>
                      <span>
                        <strong>Followers</strong>
                        <small>Growing</small>
                      </span>
                    </span>
                    <span className="social-growth-proof-pill social-growth-proof-impressions">
                      <span className="social-growth-proof-bars">
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      <span>
                        <strong>Impressions</strong>
                        <small>Rising</small>
                      </span>
                    </span>
                    <span className="social-growth-proof-pill social-growth-proof-engagement">
                      <span className="social-growth-proof-mini-icon">♥</span>
                      <span>
                        <strong>Engagement</strong>
                        <small>Increasing</small>
                      </span>
                    </span>
                    <span className="social-growth-proof-pill social-growth-proof-visits">
                      <span className="social-growth-proof-mini-icon">◎</span>
                      <span>
                        <strong>Profile Visits</strong>
                        <small>Growing</small>
                      </span>
                    </span>
                    <span className="social-growth-proof-pill social-growth-proof-saves">
                      <span className="social-growth-proof-mini-icon">▣</span>
                      <span>
                        <strong>Content Saves</strong>
                        <small>Building</small>
                      </span>
                    </span>
                  </span>
                ) : null}
                {card.visual === "business-call" ? (
                  <span className="social-growth-call-animation" aria-hidden="true">
                    <span className="social-growth-call-window">
                      <span className="social-growth-call-kicker">Business Enquiry</span>
                      <span className="social-growth-call-person">
                        <span className="social-growth-call-avatar">LE</span>
                        <span>
                          <strong>New Lead</strong>
                          <small>Call Connected</small>
                        </span>
                        <span className="social-growth-call-live">
                          <i /> Live
                        </span>
                      </span>
                      <span className="social-growth-call-topic">
                        <small>Conversation</small>
                        <strong>Discussing A Business Growth Plan</strong>
                      </span>
                      <span className="social-growth-call-wave">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    </span>
                  </span>
                ) : null}
                <span className="social-growth-card-label top">{card.name}</span>
                <span className="social-growth-card-plus" aria-hidden="true">+</span>
                <span className="social-growth-card-copy">
                  {card.copy.map((paragraph) => (
                    <span key={paragraph}>{paragraph}</span>
                  ))}
                  <span className="social-growth-card-cta">
                    {card.cta}
                    <span aria-hidden="true">↗</span>
                  </span>
                </span>
                <span className="social-growth-card-label bottom">
                  {card.name}
                  <span className="social-growth-card-hint" aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="social-section social-section-dark" id="content-plan">
        <div className="container">
          <div className="social-section-head">
            <div>
              <span className="social-kicker">Monthly management</span>
              <h2>
                <span>What We Manage</span>
                <span>Every Month</span>
              </h2>
              <p>Search, social content, reviews, and lead signals handled as one system.</p>
            </div>
            <a className="social-outline-button light" href="#pricing">View Plans</a>
          </div>
          <MonthlyManagementBento items={managedItems} />
        </div>
      </section>

      <section className="social-section white" id="studio">
        <div className="container">
          <div className="social-section-head center">
            <span className="social-kicker">Industry Growth Playbooks</span>
            <h2>
              <span>How We Build Growth</span>
              <span>for Local Businesses</span>
            </h2>
            <p>Choose an industry to see the visibility, content, trust, and enquiry system we can manage for your business.</p>
          </div>
          <SocialSeoStudio />
        </div>
      </section>

      <section className="social-section" id="platforms">
        <div className="container">
          <div className="social-section-head center">
            <span className="social-kicker">Platforms we connect</span>
            <h2>
              <span>One Message Across Search,</span>
              <span>Social, and WhatsApp</span>
            </h2>
          </div>
          <div className="social-platform-grid">
            {platformTiles.map((platform) => (
              <article key={platform.title}>
                <span className={`social-platform-icon ${platform.slug}`}>
                  <span className="social-platform-icon-short">{platform.short}</span>
                  <img alt="" aria-hidden="true" src={platform.logo} />
                </span>
                <h3>{platform.title}</h3>
                <p>{platform.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="social-section white social-tools-section" id="industries-social-seo">
        <div className="container">
          <div className="social-section-head center">
            <span className="social-kicker">Tools behind the work</span>
            <h2>
              <span>The Platforms We Use to Plan,</span>
              <span>Create, Automate, and Measure</span>
            </h2>
            <p>From content production and social publishing to SEO, analytics, reporting, CRM, and automation.</p>
          </div>
        </div>
        <ToolLogoCarousel />
      </section>

      <section className="social-section" id="pricing">
        <div className="container">
          <div className="social-section-head center">
            <span className="social-kicker">Pricing</span>
            <h2>
              <span>Clear, Pocket-Friendly</span>
              <span>Monthly Packages</span>
            </h2>
            <p>Choose the monthly content and visibility package that matches your growth goals.</p>
          </div>
          <div className="social-pricing-grid">
            {plans.map((plan) => (
              <article className={plan.featured ? "featured" : ""} key={plan.name}>
                {plan.featured ? <span className="social-popular-badge">Most Popular</span> : null}
                <h3>{plan.name}</h3>
                <strong>{plan.priceLabel}</strong>
                <div className="social-pricing-traction">
                  <span>Estimated Organic Follower Growth</span>
                  <b>{plan.traction[0]}</b>
                  <small>{plan.traction[1]}</small>
                </div>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a className={plan.featured ? "social-primary-button" : "social-outline-button"} href="#audit">
                  Book an Appointment
                </a>
              </article>
            ))}
          </div>
          <p className="social-pricing-disclaimer">
            Growth ranges are directional estimates after an initial 90-day baseline, not guarantees. Results depend on your starting audience, niche, content quality, platform mix, offer, consistency, and customer response. Paid advertising and sponsored distribution are not included.
            {" "}<a href="https://buffer.com/insights/instagram-benchmarks" rel="noreferrer" target="_blank">See the benchmark methodology.</a>
          </p>
        </div>
      </section>

      <section className="social-section white" id="faq">
        <div className="container">
          <div className="social-section-head center">
            <span className="social-kicker">FAQs</span>
            <h2>
              <span>Clear Answers</span>
              <span>Before You Start</span>
            </h2>
          </div>
          <div className="social-faq-wrap">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>

      <section className="social-final-cta">
        <div className="container social-final-card">
          <div>
            <span className="social-kicker">Free audit</span>
            <h2>
              <span>Let us check your Google</span>
              <span>and social media presence.</span>
            </h2>
            <p>
              Share your business name, city, and website/social links. We will send a clear
              improvement plan in simple English.
            </p>
          </div>
          <a
            className="social-primary-button"
            href={whatsappHref}
            rel={hasConfiguredWhatsApp() ? "noreferrer" : undefined}
            target={hasConfiguredWhatsApp() ? "_blank" : undefined}
          >
            Request Free Audit on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
