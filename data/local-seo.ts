import { businessTypes, focusCities } from "@/data/site";

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toTitle(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getLocalSeoSlugs() {
  const shopPages = focusCities.map((city) => `website-design-for-shops-in-${city}`);
  const googlePages = focusCities.map((city) => `get-my-business-on-google-${city}`);
  const businessPages = focusCities.flatMap((city) =>
    businessTypes.map((business) => `make-website-for-my-${toSlug(business)}-in-${city}`)
  );

  return [...shopPages, ...googlePages, ...businessPages];
}
