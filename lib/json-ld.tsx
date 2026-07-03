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
    makesOffer: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "3999",
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
