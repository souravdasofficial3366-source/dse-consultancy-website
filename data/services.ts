export type Service = {
  slug: string;
  title: string;
  shortText: string;
  pageTitle: string;
  pageText: string;
  points: string[];
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
    ]
  }
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
