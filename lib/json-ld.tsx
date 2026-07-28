import {
  websitePricing,
  type WebsitePricingSnapshot
} from "@/data/service-pricing";
import { siteConfig } from "@/data/site";
import { createLocalBusinessData } from "@/lib/local-business-data";

type JsonLdProps = {
  pageUrl?: string;
  city?: string;
  description?: string;
  pricing?: WebsitePricingSnapshot;
};

export function LocalBusinessJsonLd({
  pageUrl,
  city,
  description,
  pricing = websitePricing
}: JsonLdProps) {
  const data = createLocalBusinessData({
    site: siteConfig,
    pricing,
    pageUrl,
    city,
    description
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
