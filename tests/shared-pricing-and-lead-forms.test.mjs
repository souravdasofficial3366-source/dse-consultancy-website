import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pricingPath = new URL("../data/service-pricing.ts", import.meta.url);

test("the shared catalogue owns every approved package price", async () => {
  const pricing = await import(pricingPath.href);

  assert.deepEqual(
    pricing.websitePackages.map(({ id, name, price }) => ({ id, name, price })),
    [
      { id: "essential", name: "Essential", price: 5999 },
      { id: "dynamic", name: "Dynamic", price: 7999 },
      { id: "advanced", name: "Advanced", price: 10999 }
    ]
  );
  assert.deepEqual(
    pricing.socialSeoPackages.map(({ id, name, price }) => ({ id, name, price })),
    [
      { id: "essential-presence", name: "Essential Presence", price: 6999 },
      { id: "business-growth", name: "Business Growth", price: 9999 },
      { id: "complete-growth", name: "Complete Growth", price: 15999 }
    ]
  );
});

test("catalogue formatters produce page and lead-form labels", async () => {
  const pricing = await import(pricingPath.href);

  assert.equal(pricing.formatPackagePrice(pricing.websitePackages[0]), "₹5,999");
  assert.equal(pricing.formatPackagePrice(pricing.socialSeoPackages[0]), "₹6,999/month");
  assert.equal(
    pricing.formatLeadPackageOption(pricing.websitePackages[0]),
    "Essential – ₹5,999 + GST"
  );
});

test("the lead allow-list is derived from current catalogue values", async () => {
  const pricing = await import(pricingPath.href);

  assert.ok(pricing.validLeadPackageValues.has("Essential – ₹5,999 + GST"));
  assert.ok(pricing.validLeadPackageValues.has("Social + SEO Audit – Free"));
  assert.ok(pricing.validLeadPackageValues.has(pricing.GENERAL_ENQUIRY_PACKAGE));
  assert.equal(pricing.validLeadPackageValues.has("Essential – ₹3,999 + GST"), false);
});

test("general enquiries normalize safely while invalid packages return null", async () => {
  const pricing = await import(pricingPath.href);

  assert.equal(
    pricing.resolveLeadPackage(null, "general"),
    "General enquiry – package to be discussed"
  );
  assert.equal(
    pricing.resolveLeadPackage("Essential – ₹5,999 + GST", "website"),
    "Essential – ₹5,999 + GST"
  );
  assert.equal(pricing.resolveLeadPackage("Invented Package – ₹1", "website"), null);
  assert.equal(pricing.resolveLeadPackage("", "website"), null);
});
