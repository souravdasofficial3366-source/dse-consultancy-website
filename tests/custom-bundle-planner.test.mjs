import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [websitePage, socialPage, planner, siteData, jsonLd, layout, css] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("app/(landing-pages)/social-media-management-plus-seo/page.tsx", "utf8"),
  readFile("components/forms/CustomBundlePlanner.tsx", "utf8"),
  readFile("data/site.ts", "utf8"),
  readFile("lib/json-ld.tsx", "utf8"),
  readFile("app/layout.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

test("landing-page prices come from the shared catalogue", () => {
  assert.match(websitePage, /websitePackages/);
  assert.match(websitePage, /formatPackagePrice/);
  assert.match(socialPage, /socialSeoPackages/);
  assert.match(socialPage, /formatPackagePrice/);
  assert.doesNotMatch(websitePage, /price: "₹(?:5,999|7,999|10,999)"/);
  assert.doesNotMatch(socialPage, /price: "₹(?:5,999|8,999|14,999)\/month"/);
});

test("the planner imports services instead of duplicating package prices", () => {
  assert.match(planner, /pricingServices/);
  assert.match(planner, /formatInr/);
  assert.doesNotMatch(planner, /price:\s*(?:3999|5999|6999|7999|8999|9999|10999|14999|15999)/);
});

test("the planner starts with no packages and clears deselected services", () => {
  assert.match(planner, /useState<Record<string, string \| null>>\(\{\}\)/);
  assert.match(planner, /Select a package/);
  assert.match(planner, /value={selectedPlans\[service\.id\] \?\? ""}/);
  assert.match(planner, /const checked = event\.target\.checked/);
  assert.match(planner, /\[service\.id\]: checked \? current\[service\.id\] \?\? null : null/);
  assert.doesNotMatch(planner, /\|\| 0/);
});

test("an incomplete plan cannot generate a WhatsApp action", () => {
  assert.match(planner, /const isComplete =/);
  assert.match(planner, /isComplete \?/);
  assert.match(planner, /Select A Package To Continue/);
  assert.match(planner, /aria-disabled="true"/);
});

test("the future placeholder is removed from markup and CSS", () => {
  assert.doesNotMatch(planner, /Designed To Grow|dse-bundle-future-note/);
  assert.doesNotMatch(css, /\.dse-bundle-future-note/);
});

test("site metadata and LocalBusiness offers use the reusable website pricing snapshot", () => {
  assert.match(siteData, /websitePricing/);
  assert.match(siteData, /basePrice:\s*websitePricing\.startingPriceLabel/);
  assert.doesNotMatch(siteData, /basePrice:\s*"₹5,999"/);
  assert.match(jsonLd, /pricing = websitePricing/);
  assert.match(jsonLd, /createLocalBusinessData/);
  assert.doesNotMatch(jsonLd, /price: "3999"/);
});

test("root metadata covers the broader service offering without obsolete pricing", () => {
  assert.doesNotMatch(layout, /₹3,999|Website for Shops from/);
  assert.match(
    layout,
    /default: "DSE Consultancy \| Website Development, SMM And SEO"/
  );
  assert.match(
    layout,
    /DSE Consultancy connects website development, social media management and SEO/
  );
});
