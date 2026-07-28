import assert from "node:assert/strict";
import test from "node:test";

const pricingPath = new URL("../data/service-pricing.ts", import.meta.url);
const localPageContentPath = new URL("../lib/local-page-content.ts", import.meta.url);
const localBusinessDataPath = new URL("../lib/local-business-data.ts", import.meta.url);

test("a changed website catalogue produces one reusable pricing snapshot", async () => {
  const pricing = await import(pricingPath.href);
  const changedPackages = [
    {
      id: "essential",
      name: "Essential",
      price: 12345,
      billing: "one-time",
      gst: "additional"
    },
    {
      id: "advanced",
      name: "Advanced",
      price: 23456,
      billing: "one-time",
      gst: "additional"
    }
  ];

  const snapshot = pricing.createWebsitePricingSnapshot(changedPackages);

  assert.equal(snapshot.startingPrice, 12345);
  assert.equal(snapshot.startingPriceLabel, "₹12,345");
  assert.equal(snapshot.startingPackageName, "Essential");
});

test("every sitemap-generated local page consumes the supplied website pricing snapshot", async () => {
  const { getLocalPageContent } = await import(localPageContentPath.href);
  const changedPricing = {
    startingPrice: 12345,
    startingPriceLabel: "₹12,345",
    startingPackageName: "Essential"
  };
  const cases = [
    "website-design-for-shops-in-kolkata",
    "make-website-for-my-clinic-in-kolkata",
    "get-my-business-on-google-kolkata"
  ];

  for (const slug of cases) {
    const page = getLocalPageContent(slug, changedPricing);

    assert.ok(page, `Expected generated content for ${slug}`);
    assert.deepEqual(page.pricing, changedPricing);
  }

  const shopPage = getLocalPageContent(cases[0], changedPricing);
  assert.match(shopPage.title, /₹12,345/);
  assert.match(shopPage.h1, /₹12,345/);
});

test("SEO structured data uses the same supplied price for priceRange and offer", async () => {
  const { createLocalBusinessData } = await import(localBusinessDataPath.href);
  const data = createLocalBusinessData({
    site: {
      name: "DSE Consultancy",
      siteUrl: "https://example.com",
      phone: "+91 90000 00000",
      email: "hello@example.com"
    },
    pricing: {
      startingPrice: 12345,
      startingPriceLabel: "₹12,345",
      startingPackageName: "Essential"
    },
    pageUrl: "https://example.com/website-design-for-shops-in-kolkata",
    city: "Kolkata",
    description: "A generated local landing page."
  });

  assert.equal(data.priceRange, "₹12,345");
  assert.equal(data.makesOffer.price, "12345");
  assert.equal(data.makesOffer.name, "Essential");
  assert.equal(data.areaServed, "Kolkata, India");
});
