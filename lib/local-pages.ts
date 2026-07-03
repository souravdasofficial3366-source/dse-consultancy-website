import { siteConfig } from "@/data/site";
import { toTitle } from "@/data/local-seo";

export type LocalPageKind = "shops-in-city" | "business-in-city" | "google-in-city";

export type LocalPageContent = {
  kind: LocalPageKind;
  city: string;
  businessType?: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  subtext: string;
};

function cityName(slugPart: string) {
  return toTitle(slugPart);
}

function businessName(slugPart: string) {
  return slugPart.replace(/-/g, " ");
}

export function getLocalPageContent(slug: string): LocalPageContent | null {
  const shopMatch = slug.match(/^website-design-for-shops-in-([a-z0-9-]+)$/);
  if (shopMatch) {
    const city = cityName(shopMatch[1]);
    return {
      kind: "shops-in-city",
      city,
      slug,
      title: `Website for shops in ${city} from ${siteConfig.basePrice}`,
      description: `Get a website for your shop in ${city}. We help people find your business on Google and call you directly.`,
      h1: `Get a beautiful website for your shop in ${city} for just ${siteConfig.basePrice}.`,
      subtext:
        "We build your website and help your business show on Google for 1 full year, free."
    };
  }

  const businessMatch = slug.match(/^make-website-for-my-([a-z0-9-]+)-in-([a-z0-9-]+)$/);
  if (businessMatch) {
    const businessType = businessName(businessMatch[1]);
    const city = cityName(businessMatch[2]);
    return {
      kind: "business-in-city",
      city,
      businessType,
      slug,
      title: `Website for your ${businessType} in ${city}`,
      description: `Make a simple website for your ${businessType} in ${city} and get customer calls from Google.`,
      h1: `Get your ${businessType} found on Google in ${city}.`,
      subtext:
        "Start getting customer calls and WhatsApp messages directly on your mobile phone."
    };
  }

  const simpleBusinessMatch = slug.match(/^make-website-for-my-([a-z0-9-]+)$/);
  if (simpleBusinessMatch) {
    const businessType = businessName(simpleBusinessMatch[1]);
    return {
      kind: "business-in-city",
      city: "your town",
      businessType,
      slug,
      title: `Website for your ${businessType}`,
      description: `Make a simple website for your ${businessType} and get customer calls from Google.`,
      h1: `Get your ${businessType} found on Google.`,
      subtext:
        "Start getting customer calls and WhatsApp messages directly on your mobile phone."
    };
  }

  const googleMatch = slug.match(/^get-my-business-on-google-([a-z0-9-]+)$/);
  if (googleMatch) {
    const city = cityName(googleMatch[1]);
    return {
      kind: "google-in-city",
      city,
      slug,
      title: `Get your business on Google in ${city}`,
      description: `DSE Consultancy helps small businesses in ${city} get a website and appear when customers search nearby.`,
      h1: `Get your business on Google in ${city}.`,
      subtext:
        "We make your website, set up your Google details, and help nearby customers call you."
    };
  }

  return null;
}
