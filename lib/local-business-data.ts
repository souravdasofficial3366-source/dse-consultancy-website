import type { WebsitePricingSnapshot } from "../data/service-pricing.ts";

type LocalBusinessSite = {
  name: string;
  siteUrl: string;
  phone: string;
  email: string;
};

type LocalBusinessDataInput = {
  site: LocalBusinessSite;
  pricing: WebsitePricingSnapshot;
  pageUrl?: string;
  city?: string;
  description?: string;
};

export function createLocalBusinessData({
  site,
  pricing,
  pageUrl,
  city,
  description
}: LocalBusinessDataInput) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: pageUrl || site.siteUrl,
    telephone: site.phone,
    email: site.email,
    priceRange: pricing.startingPriceLabel,
    areaServed: city ? `${city}, India` : "India",
    description:
      description ||
      "Affordable business websites for small Indian shops, clinics, stores, and local service owners.",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kalna",
      addressLocality: "Burdwan",
      addressRegion: "West Bengal",
      postalCode: "713409",
      addressCountry: "IN"
    },
    makesOffer: {
      "@type": "Offer",
      name: pricing.startingPackageName,
      priceCurrency: "INR",
      price: String(pricing.startingPrice),
      description: "Business website with 1 year of free Google ranking help."
    }
  };
}
