import { websitePackages } from "@/data/service-pricing";
import { siteConfig } from "@/data/site";

type JsonLdProps = {
  pageUrl?: string;
  city?: string;
  description?: string;
};

export function LocalBusinessJsonLd({ pageUrl, city, description }: JsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: pageUrl || siteConfig.siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.basePrice,
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
      priceCurrency: "INR",
      price: String(websitePackages[0].price),
      description: "Business website with 1 year of free Google ranking help."
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
