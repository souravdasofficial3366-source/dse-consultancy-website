import type { FaqItem } from "@/data/faqs";

export type Service = {
  slug: string;
  title: string;
  shortText: string;
  pageTitle: string;
  pageText: string;
  points: string[];
  faqs: readonly FaqItem[];
};

export const services: Service[] = [
  {
    slug: "business-website",
    title: "Business Website",
    shortText: "A simple website for shops, clinics, stores, and local offices.",
    pageTitle: "Business website for local shops and service owners",
    pageText:
      "We create a clear website with your phone number, WhatsApp button, address, photos, and service details so customers can contact you easily.",
    points: [
      "Mobile-friendly pages",
      "Call and WhatsApp buttons",
      "Simple service sections",
      "Google-ready page text"
    ],
    faqs: [
      {
        question: "How do I avoid receiving a generic template that does not fit my business?",
        answer:
          "The page structure, services, proof and enquiry actions should be planned around the business and its customers before visual styling begins. A template can support delivery, but it should not decide the business message or customer journey."
      },
      {
        question:
          "Will the website work properly on mobile and guide visitors towards an enquiry?",
        answer:
          "The website is designed and checked for mobile screens, clear reading and visible contact actions. Calls, WhatsApp and forms are placed where they support the visitor’s next step."
      },
      {
        question: "Who owns the domain, website files, content and administrator access?",
        answer:
          "The client should keep ownership or administrator access to the domain, website and content. DSE Consultancy documents the access used for delivery and avoids locking the business into unnecessary dependency."
      },
      {
        question:
          "Are hosting, renewal, maintenance or extra-page costs explained before payment?",
        answer:
          "Yes. The quotation should separate included first-year items, renewal costs, maintenance coverage, additional pages and paid tools. Any change outside the agreed scope is discussed before work is added."
      }
    ]
  },
  {
    slug: "google-business-help",
    title: "Google Business Help",
    shortText: "Help your business appear when nearby customers search.",
    pageTitle: "Get your business ready for Google searches",
    pageText:
      "We help write clear business details, page titles, and local service text so customers can understand what you offer and where you are located.",
    points: [
      "Local city and service words",
      "Google Business Profile guidance",
      "Clear page titles",
      "1 year free ranking help"
    ],
    faqs: [
      {
        question: "Can anyone guarantee that my Google Business Profile will rank first?",
        answer:
          "No. Rankings change with relevance, distance, competition, profile quality and Google’s systems. The work improves the profile and local signals without promising a position that no agency controls."
      },
      {
        question:
          "Will DSE Consultancy ask me to buy or create fake Google reviews?",
        answer:
          "No. We support honest review requests and useful replies, but we do not create, buy or recommend fake reviews. Genuine customer feedback is safer for the profile and more useful to future customers."
      },
      {
        question: "Who keeps ownership of the Google Business Profile?",
        answer:
          "The business owner keeps ownership. DSE Consultancy should receive only the role needed for approved work, and that access can be reviewed or removed when the engagement ends."
      },
      {
        question: "How are risky edits, verification issues or profile suspensions handled?",
        answer:
          "Important profile changes are reviewed carefully, business evidence is kept accurate and verification steps follow Google’s process. No agency can promise that a suspension will never happen or that reinstatement is guaranteed."
      },
      {
        question: "Which results matter beyond map views?",
        answer:
          "Useful results include calls, website clicks, direction requests, messages, relevant search visibility and real enquiries. Views provide context, but they should not be the only measure of progress."
      }
    ]
  },
  {
    slug: "lead-form-setup",
    title: "Lead Form Setup",
    shortText: "Collect customer names, phone numbers, and business needs.",
    pageTitle: "Lead form setup for small business websites",
    pageText:
      "We add a simple enquiry form to your website so new customers can share their details and your team can call them back.",
    points: [
      "Name and mobile number fields",
      "Business type and city fields",
      "Consent checkbox",
      "Email and SMS alert support"
    ],
    faqs: [
      {
        question: "How will the lead form reduce spam and low-quality submissions?",
        answer:
          "The form uses required fields, length and format checks, a hidden bot field and security verification. No form removes every unwanted submission, but these controls reduce common automated spam."
      },
      {
        question: "Where will new enquiries be delivered?",
        answer:
          "The delivery method is confirmed during setup. Enquiries can be stored and sent through the configured business workflow, such as Google Sheets, email or another approved destination."
      },
      {
        question: "What happens if an email notification is missed?",
        answer:
          "A stored lead record provides a second place to review enquiries when storage is configured. The final setup should document every delivery channel and who is responsible for checking it."
      },
      {
        question:
          "What customer information will the form collect and how is consent handled?",
        answer:
          "The form collects only the details needed to understand and respond to the enquiry, such as name, contact information, business type and location. A clear consent checkbox explains that the details may be stored and used for follow-up."
      },
      {
        question: "Can the form connect with WhatsApp, email or another system later?",
        answer:
          "Yes. The form can be extended when a specific workflow is confirmed. Any new integration should define where data goes, who can access it, what it costs and how failures are monitored."
      }
    ]
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
