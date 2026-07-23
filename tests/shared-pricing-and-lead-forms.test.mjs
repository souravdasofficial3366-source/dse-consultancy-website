import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pricingPath = new URL("../data/service-pricing.ts", import.meta.url);
const leadsPath = new URL("../lib/leads.ts", import.meta.url);

function validLead(overrides = {}) {
  return {
    owner_name: "DSE Customer",
    phone_number: "9876543210",
    email_address: "customer@example.com",
    shop_type: "Local business",
    pricing_package: "Essential – ₹5,999 + GST",
    city_town: "Kalna",
    privacy_consent: true,
    source_path: "/website-development",
    ...overrides
  };
}

async function loadCleanLead() {
  const { cleanLead } = await import(leadsPath.href);
  return cleanLead;
}

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

const [leadForm, contactPage, leadModuleSource, auditForm] = await Promise.all([
  readFile("components/forms/LeadForm.tsx", "utf8"),
  readFile("app/(website-pages)/contact-us/page.tsx", "utf8"),
  readFile("lib/leads.ts", "utf8"),
  readFile("components/forms/SocialSeoAuditForm.tsx", "utf8")
]);

test("the Contact hero requests a general LeadForm without a package field", () => {
  assert.match(contactPage, /<LeadForm mode="general" sourcePath="\/contact-us" \/>/);
  assert.match(leadForm, /mode === "website"/);
  assert.match(leadForm, /Request A Call Back/);
  assert.match(leadForm, /contact me about digital services/);
  assert.doesNotMatch(contactPage, /pricing_package/);
});

test("website mode derives options and CTA from the shared catalogue", () => {
  assert.match(leadForm, /websitePackages\.map/);
  assert.match(leadForm, /formatLeadPackageOption/);
  assert.match(leadForm, /formatInr\(websitePackages\[0\]\.price\)/);
  assert.doesNotMatch(leadForm, /const packageOptions/);
  assert.doesNotMatch(leadForm, /₹5,999/);
});

test("the audit form uses the shared free-audit value", () => {
  assert.match(auditForm, /SOCIAL_SEO_AUDIT_PACKAGE/);
  assert.doesNotMatch(auditForm, /pricing_package: "Social \+ SEO Audit – Free"/);
});

test("lead validation imports the shared package allow-list", () => {
  assert.match(leadModuleSource, /resolveLeadPackage/);
  assert.doesNotMatch(leadModuleSource, /const packageOptions = new Set/);
});

test("website leads require an email address", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(
    () => cleanLead(validLead({ email_address: "" })),
    /Please enter your email address\./
  );
});

test("general Contact leads require an email address", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(
    () =>
      cleanLead(
        validLead({
          email_address: "",
          pricing_package: null,
          form_context: "general",
          source_path: "/contact-us"
        })
      ),
    /Please enter your email address\./
  );
});

test("audit leads may omit an email address", async () => {
  const cleanLead = await loadCleanLead();

  assert.equal(
    cleanLead(
      validLead({
        email_address: "",
        pricing_package: "Social + SEO Audit – Free",
        form_context: "audit",
        source_path: "/social-media-management-plus-seo"
      })
    ).email_address,
    ""
  );
});

test("website sources reject a general-context attempt to bypass package selection", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(
    () => cleanLead(validLead({ pricing_package: null, form_context: "general" })),
    /Please select a valid pricing package\./
  );
});

test("general Contact requests receive the internal general-enquiry package", async () => {
  const cleanLead = await loadCleanLead();

  assert.equal(
    cleanLead(
      validLead({
        pricing_package: null,
        form_context: "general",
        source_path: "/contact-us"
      })
    ).pricing_package,
    "General enquiry – package to be discussed"
  );
});

test("unknown non-empty packages remain rejected", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(
    () => cleanLead(validLead({ pricing_package: "Invented Package – ₹1" })),
    /Please select a valid pricing package\./
  );
});
