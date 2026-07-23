"use client";

import { useState } from "react";

const industryPlaybooks = [
  {
    label: "Transport & Logistics",
    location: "Durgapur, West Bengal",
    logoName: "Route Visibility",
    logoTagline: "Route and Load Visibility",
    title: "Logistics Visibility and Customer Acquisition",
    icon: "local_shipping",
    challenge: "Businesses and individuals looking for goods transport need verified rates, route coverage, service reliability, fleet safety, and clear contact routes.",
    plan: ["Route and terminal local pages", "Fleet and service capability updates", "Google Business Profile management", "Direct enquiry routing via WhatsApp"],
    advantages: [
      ["Route Dominance", "Be the top local choice for critical transit routes."],
      ["Customer Trust", "Show verified delivery success, fleet scale, and feedback."],
      ["Fast Bookings", "Provide quick pricing quotes and dispatch confirmations."]
    ]
  },
  {
    label: "Real Estate",
    location: "Ruby, West Bengal",
    logoName: "Realty Reach",
    logoTagline: "Property Discovery",
    title: "Property Listing and Buyer Enquiry Growth",
    icon: "real_estate_agent",
    challenge: "Property buyers compare local agents and projects based on verified listings, expert advice, area guides, client reviews, and direct response times.",
    plan: ["Project and area-based search strategy", "Virtual tour and video walkthrough content", "Agent reputation and review system", "Direct buyer consultation leads"],
    advantages: [
      ["Listing Reach", "Showcase active properties to high-intent buyers searching locally."],
      ["Expert Trust", "Position agents with local market intelligence and recent reviews."],
      ["Buyer Inquiries", "Drive calls, visits, and walkthrough bookings directly from listings."]
    ]
  },
  {
    label: "Education",
    location: "Kalna, West Bengal",
    logoName: "Academic Reach",
    logoTagline: "Student Discovery",
    title: "Admissions Visibility and Student Enrollment",
    icon: "school",
    challenge: "Parents and students require clear course information, teaching standards, success updates, faculty profiles, and easy consultation paths.",
    plan: ["Class and course local SEO", "Academic achievement showcases", "Faculty introductions and videos", "WhatsApp consultation strategy"],
    advantages: [
      ["Subject Visibility", "Connect classes with local educational search demand."],
      ["Parent Trust", "Demonstrate safety, curriculum quality, and student success clearly."],
      ["Enquiry Growth", "Guide prospective students to free trials or consults."]
    ]
  },
  {
    label: "Clinic",
    location: "Siliguri, West Bengal",
    logoName: "Care Connect",
    logoTagline: "Local Care Visibility",
    title: "Clinic Visibility and Appointment Growth",
    icon: "medical_services",
    challenge: "Patients compare nearby clinics through Google Maps, reviews, treatment information, and recent social activity before booking.",
    plan: ["Google Business Profile management", "Treatment and location keyword plan", "Trust-led educational content", "Review request and response system"],
    advantages: [
      ["Local Visibility", "Be easier to find for clinic and treatment searches."],
      ["Patient Trust", "Use helpful content and authentic reviews to reduce uncertainty."],
      ["Appointment Enquiries", "Create clearer routes to call, WhatsApp, directions, and booking."]
    ]
  },
  {
    label: "Restaurant",
    location: "Jodhpur Park, Kolkata",
    logoName: "Dining Discovery",
    logoTagline: "Dining Discovery",
    title: "Restaurant Discovery and Dine-in/Order Growth",
    icon: "restaurant",
    challenge: "Diners check photos, menus, ratings, reviews, opening hours, offers, and directions before deciding where to eat or order.",
    plan: ["Menu and profile optimization", "Food, offer, and occasion content", "Review monitoring and replies", "Order, call, and direction links"],
    advantages: [
      ["Local Discovery", "Keep key business details accurate across high-intent searches."],
      ["Dining Confidence", "Use fresh content and review responses to strengthen trust."],
      ["Orders and Visits", "Create direct paths to order, reserve, call, or get directions."]
    ]
  },
  {
    label: "Salon",
    location: "Golpark, Kolkata",
    logoName: "Salon Bookings",
    logoTagline: "Beauty and Booking",
    title: "Salon Discovery and Booking Growth",
    icon: "content_cut",
    challenge: "Customers often choose salons by comparing recent work, service menus, reviews, offers, location, and booking convenience.",
    plan: ["Near-me search optimization", "Service and transformation content", "Seasonal offer calendar", "Directions and booking calls to action"],
    advantages: [
      ["Nearby Discovery", "Improve visibility for salon and beauty searches."],
      ["Visual Proof", "Show current services, standards, and results through content."],
      ["Booking Intent", "Make calling, messaging, directions, and appointments easier."]
    ]
  },
  {
    label: "E-commerce",
    location: "Camac Street, Kolkata",
    logoName: "Storefront Sales",
    logoTagline: "Online Sales System",
    title: "E-commerce Sales and Brand Discovery",
    icon: "shopping_bag",
    challenge: "Online shoppers demand fast loading times, secure checkouts, clear product details, social proof, and seamless customer support.",
    plan: ["Product schema and search feeds", "Social commerce and ad content", "Customer reviews and UGC strategy", "Fast checkout and support pathways"],
    advantages: [
      ["Product Visibility", "Appear in Google Shopping and search results for product terms."],
      ["Shopper Confidence", "Build high conversion rates with reviews and clear policies."],
      ["Revenue Growth", "Turn social attention and search queries into direct website sales."]
    ]
  }
] as const;

export function SocialSeoStudio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePlaybook = industryPlaybooks[activeIndex];

  return (
    <div className="social-studio-grid social-case-study-grid">
      <div className="social-studio-tabs social-case-study-tabs" role="tablist" aria-label="Industry growth playbooks">
        {industryPlaybooks.map((playbook, index) => (
          <button
            aria-controls="social-studio-panel"
            aria-selected={activeIndex === index}
            className={activeIndex === index ? "active" : ""}
            id={`social-studio-tab-${index}`}
            key={playbook.label}
            onClick={() => setActiveIndex(index)}
            role="tab"
            type="button"
          >
            <span className="material-symbols-outlined" aria-hidden="true">{playbook.icon}</span>
            <span>{playbook.label}</span>
            <span aria-hidden="true">{activeIndex === index ? "−" : "+"}</span>
          </button>
        ))}
      </div>

      <article
        aria-labelledby={`social-studio-tab-${activeIndex}`}
        className="social-studio-panel social-case-study-panel"
        id="social-studio-panel"
        key={activePlaybook.label}
        role="tabpanel"
      >
        <div className="social-case-study-heading">
          <div>
            <span className="social-case-study-disclaimer">DSE Industry Growth Playbook</span>
            <p>{activePlaybook.label}</p>
            <h3>{activePlaybook.title}</h3>
            <span className="social-case-study-location">
              <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
              {activePlaybook.location}
            </span>
          </div>
          <div className={`social-case-study-logo logo-${activeIndex + 1}`} aria-label={`${activePlaybook.logoName} logo`}>
            <span className="social-case-study-logo-mark" aria-hidden="true">
              <span className="material-symbols-outlined">{activePlaybook.icon}</span>
            </span>
            <span className="social-case-study-logo-type">
              <strong>{activePlaybook.logoName}</strong>
              <small>{activePlaybook.logoTagline}</small>
            </span>
          </div>
        </div>

        <div className="social-case-study-story">
          <div>
            <span>What Customers Consider</span>
            <p>{activePlaybook.challenge}</p>
          </div>
          <div>
            <span>What We Manage</span>
            <ul>
              {activePlaybook.plan.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="social-case-study-targets">
          <span>Business Advantages</span>
          <div>
            {activePlaybook.advantages.map(([title, description]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{description}</span>
              </article>
            ))}
          </div>
        </div>

        <a className="social-case-study-cta" href="#audit">
          Build My Growth Plan <span aria-hidden="true">↗</span>
        </a>
      </article>
    </div>
  );
}
