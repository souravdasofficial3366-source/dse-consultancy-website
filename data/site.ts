export const siteConfig = {
  name: "DSE Consultancy",
  basePrice: "₹3,999",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: process.env.NEXT_PUBLIC_DSE_PHONE || "+91 82405 32600",
  whatsapp: process.env.NEXT_PUBLIC_DSE_WHATSAPP || "918240532600",
  email: process.env.NEXT_PUBLIC_DSE_EMAIL || "hello@dseconsultancy.in",
  address:
    process.env.NEXT_PUBLIC_DSE_ADDRESS ||
    "Ballygunge, Kolkata, West Bengal, India",
  socialLinks: [
    { label: "LinkedIn", shortLabel: "in", url: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    { label: "Facebook", shortLabel: "f", url: process.env.NEXT_PUBLIC_FACEBOOK_URL },
    { label: "Instagram", shortLabel: "ig", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL }
  ].filter((link): link is { label: string; shortLabel: string; url: string } =>
    Boolean(link.url)
  )
};

export function hasConfiguredPhone() {
  return !siteConfig.phone.includes("X");
}

export function hasConfiguredWhatsApp() {
  return !siteConfig.whatsapp.includes("X");
}

export const siteNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Website Development", href: "/website-development" },
  { label: "SMM + SEO", href: "/social-media-management-plus-seo" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Blog Page", href: "/blog" }
] as const;

export const landingNavigation = siteNavigation;

export const socialSeoNavigation = [
  { label: "Growth System", href: "/social-media-management-plus-seo#growth-system" },
  { label: "Content Plan", href: "/social-media-management-plus-seo#content-plan" },
  { label: "Platforms", href: "/social-media-management-plus-seo#platforms" },
  { label: "Pricing", href: "/social-media-management-plus-seo#pricing" },
  { label: "FAQs", href: "/social-media-management-plus-seo#faq" }
] as const;

export const businessTypes = [
  "pre-schooling",
  "salon",
  "clinic",
  "e-commerce store",
  "transport and logistics",
  "restaurant",
  "pharmacy",
  "education",
  "hardware shop",
  "real estate business"
];

export const focusCities = [
  "kolkata",
  "delhi",
  "mumbai",
  "bengaluru",
  "chennai",
  "hyderabad",
  "pune",
  "ahmedabad",
  "jaipur",
  "lucknow",
  "patna",
  "bhubaneswar"
];

export const industryCards = [
  {
    title: "Pre-Schooling",
    text: "Share programs, timings, facilities, admission details, and parent enquiry options.",
    video: "/videos/industries/pre-schooling.mp4",
    poster: "/videos/industries/pre-schooling-poster.jpg"
  },
  {
    title: "Doctors & Clinics",
    text: "Help patients call, find your address, and book visits.",
    video: "/videos/industries/doctors-clinics.mp4",
    poster: "/videos/industries/doctors-clinics-poster.jpg"
  },
  {
    title: "Education (LMS/Schools/Colleges/Tuition Centre)",
    text: "Show courses, classes, learning portals, admissions, and enquiry details clearly.",
    video: "/videos/industries/education.mp4",
    poster: "/videos/industries/education-poster.jpg"
  },
  {
    title: "Transport and Logistics",
    text: "Show routes, fleet services, delivery coverage, and make enquiries easy.",
    video: "/videos/industries/transport-logistics.mp4",
    poster: "/videos/industries/transport-logistics-poster.jpg"
  },
  {
    title: "Real Estate Businesses",
    text: "Showcase properties and collect buyer and seller enquiries on mobile.",
    video: "/videos/industries/real-estate.mp4",
    poster: "/videos/industries/real-estate-poster.jpg"
  },
  {
    title: "E-commerce Stores",
    text: "Display products, offers, payments, and ordering options in one place.",
    video: "/videos/industries/ecommerce.mp4",
    poster: "/videos/industries/ecommerce-poster.jpg"
  }
];
