export type BillingCycle = "one-time" | "monthly";

export type PricingPackage = {
  id: string;
  name: string;
  price: number;
  billing: BillingCycle;
  gst: "additional";
};

export type PricingService = {
  id: "website-development" | "smm-seo";
  name: string;
  shortName: string;
  number: string;
  billing: BillingCycle;
  description: string;
  icon: string;
  packages: readonly PricingPackage[];
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export const websitePackages = [
  { id: "essential", name: "Essential", price: 5999, billing: "one-time", gst: "additional" },
  { id: "dynamic", name: "Dynamic", price: 7999, billing: "one-time", gst: "additional" },
  { id: "advanced", name: "Advanced", price: 10999, billing: "one-time", gst: "additional" }
] as const satisfies readonly PricingPackage[];

export const socialSeoPackages = [
  {
    id: "essential-presence",
    name: "Essential Presence",
    price: 6999,
    billing: "monthly",
    gst: "additional"
  },
  {
    id: "business-growth",
    name: "Business Growth",
    price: 9999,
    billing: "monthly",
    gst: "additional"
  },
  {
    id: "complete-growth",
    name: "Complete Growth",
    price: 15999,
    billing: "monthly",
    gst: "additional"
  }
] as const satisfies readonly PricingPackage[];

export const pricingServices = [
  {
    id: "website-development",
    number: "01",
    name: "Website Development",
    shortName: "Website",
    billing: "one-time",
    description: "Mobile-first website, conversion paths and Google-ready business content.",
    icon: "language",
    packages: websitePackages
  },
  {
    id: "smm-seo",
    number: "02",
    name: "Social Media Management + SEO",
    shortName: "SMM + SEO",
    billing: "monthly",
    description: "Social content, local search visibility, Google profile support and reporting.",
    icon: "monitoring",
    packages: socialSeoPackages
  }
] as const satisfies readonly PricingService[];

export const GENERAL_ENQUIRY_PACKAGE = "General enquiry – package to be discussed";
export const SOCIAL_SEO_AUDIT_PACKAGE = "Social + SEO Audit – Free";

export function formatInr(value: number) {
  return inr.format(value);
}

export function formatPackagePrice(item: PricingPackage) {
  return `${formatInr(item.price)}${item.billing === "monthly" ? "/month" : ""}`;
}

export function formatLeadPackageOption(item: PricingPackage) {
  return `${item.name} – ${formatInr(item.price)} + GST${
    item.billing === "monthly" ? "/month" : ""
  }`;
}

export const validLeadPackageValues = new Set([
  ...websitePackages.map(formatLeadPackageOption),
  ...socialSeoPackages.map(formatLeadPackageOption),
  SOCIAL_SEO_AUDIT_PACKAGE,
  GENERAL_ENQUIRY_PACKAGE
]);

export function resolveLeadPackage(value: unknown, formContext: unknown) {
  const submitted = String(value || "").trim();

  if (formContext === "general" && !submitted) {
    return GENERAL_ENQUIRY_PACKAGE;
  }

  return validLeadPackageValues.has(submitted) ? submitted : null;
}
