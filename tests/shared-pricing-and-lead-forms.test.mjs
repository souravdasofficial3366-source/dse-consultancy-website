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
    form_context: "website",
    city_town: "Kalna",
    message: "Please call me about a business website.",
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

test("package resolution rejects globally recognized values from the wrong form context", async () => {
  const pricing = await import(pricingPath.href);
  const websiteValues = pricing.websitePackages.map(pricing.formatLeadPackageOption);
  const socialValues = pricing.socialSeoPackages.map(pricing.formatLeadPackageOption);

  for (const value of [
    pricing.GENERAL_ENQUIRY_PACKAGE,
    pricing.SOCIAL_SEO_AUDIT_PACKAGE,
    ...socialValues
  ]) {
    assert.equal(pricing.resolveLeadPackage(value, "website"), null);
  }

  for (const value of [
    ...websiteValues,
    pricing.GENERAL_ENQUIRY_PACKAGE,
    ...socialValues
  ]) {
    assert.equal(pricing.resolveLeadPackage(value, "audit"), null);
  }

  for (const value of [
    ...websiteValues,
    pricing.SOCIAL_SEO_AUDIT_PACKAGE,
    ...socialValues
  ]) {
    assert.equal(pricing.resolveLeadPackage(value, "general"), null);
  }

  assert.equal(
    pricing.resolveLeadPackage(pricing.SOCIAL_SEO_AUDIT_PACKAGE, "audit"),
    pricing.SOCIAL_SEO_AUDIT_PACKAGE
  );
  assert.equal(
    pricing.resolveLeadPackage(pricing.GENERAL_ENQUIRY_PACKAGE, "general"),
    pricing.GENERAL_ENQUIRY_PACKAGE
  );
});

const [leadForm, contactPage, leadModuleSource, auditForm, globalStyles] = await Promise.all([
  readFile("components/forms/LeadForm.tsx", "utf8"),
  readFile("app/(website-pages)/contact-us/page.tsx", "utf8"),
  readFile("lib/leads.ts", "utf8"),
  readFile("components/forms/SocialSeoAuditForm.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

test("the Contact hero requests a general LeadForm without a package field", () => {
  assert.match(contactPage, /<LeadForm mode="general" sourcePath="\/contact-us" \/>/);
  assert.match(leadForm, /mode === "website"/);
  assert.match(leadForm, /Request A Call Back/);
  assert.match(leadForm, /contact me about digital services/);
  assert.doesNotMatch(contactPage, /pricing_package/);
});

test("the shared LeadForm renders and submits a required enquiry message", () => {
  assert.match(leadForm, /message:\s*formData\.get\("message"\)/);
  assert.match(leadForm, /<textarea[\s\S]*maxLength=\{1000\}[\s\S]*name="message"[\s\S]*required/);
  assert.match(leadForm, />\s*How can we help\?\s*<textarea/);
  assert.match(globalStyles, /button,\s*input,\s*select,\s*textarea\s*\{\s*font:\s*inherit/);
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

  const lead = cleanLead(
    validLead({
      email_address: "",
      message: "",
      pricing_package: "Social + SEO Audit – Free",
      form_context: "audit",
      source_path: "/social-media-management-plus-seo"
    })
  );

  assert.equal(lead.email_address, "");
  assert.equal(lead.form_context, "audit");
  assert.match(lead.message, /audit request/i);
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

  const lead = cleanLead(
    validLead({
      pricing_package: null,
      form_context: "general",
      source_path: "/contact-us"
    })
  );

  assert.equal(lead.pricing_package, "General enquiry – package to be discussed");
  assert.equal(lead.form_context, "general");
});

test("unknown non-empty packages remain rejected", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(
    () => cleanLead(validLead({ pricing_package: "Invented Package – ₹1" })),
    /Please select a valid pricing package\./
  );
});

test("website and general leads require a bounded message", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(() => cleanLead(validLead({ message: "" })), /Please enter your message\./);
  assert.throws(
    () =>
      cleanLead(
        validLead({
          pricing_package: null,
          form_context: "general",
          source_path: "/contact-us",
          message: ""
        })
      ),
    /Please enter your message\./
  );
  assert.throws(
    () => cleanLead(validLead({ message: "x".repeat(1001) })),
    /Message is too long\./
  );
});

test("source and context tampering cannot cross package or message contracts", async () => {
  const cleanLead = await loadCleanLead();

  assert.throws(
    () =>
      cleanLead(
        validLead({
          form_context: "general",
          source_path: "/website-development",
          pricing_package: "General enquiry – package to be discussed",
          message: ""
        })
      ),
    /Please select a valid pricing package\./
  );
  assert.throws(
    () =>
      cleanLead(
        validLead({
          form_context: "audit",
          source_path: "/website-development",
          pricing_package: "Social + SEO Audit – Free",
          email_address: "",
          message: ""
        })
      ),
    /Please enter your email address\./
  );
});

test("database and notification/storage sources retain form context and message", async () => {
  const [schema, sheets, docs] = await Promise.all([
    readFile("database/schema.sql", "utf8"),
    readFile("integrations/google-sheets/Code.gs", "utf8"),
    readFile("docs/GOOGLE_SHEETS_SETUP.md", "utf8")
  ]);

  assert.match(schema, /form_context\s+text/i);
  assert.match(schema, /message\s+text/i);
  assert.match(leadModuleSource, /`Context: \$\{lead\.form_context\}`/);
  assert.match(leadModuleSource, /`Message: \$\{lead\.message\}`/);
  assert.match(sheets, /"Form Context"/);
  assert.match(sheets, /"Message"/);
  assert.match(sheets, /safeCell\(lead\.form_context\)/);
  assert.match(sheets, /safeCell\(lead\.message(?:\s*\|\|\s*"")?\)/);
  assert.match(docs, /Form Context/);
  assert.match(docs, /Message/);
});

test("SMS alerts identify website, general, and audit enquiries accurately", async () => {
  const { cleanLead, sendLeadSms } = await import(leadsPath.href);
  const originalFetch = globalThis.fetch;
  const originalWebhook = process.env.SMS_WEBHOOK_URL;
  const messages = [];

  process.env.SMS_WEBHOOK_URL = "https://example.com/lead-alert";
  globalThis.fetch = async (_url, options) => {
    messages.push(JSON.parse(options.body).message);
    return { ok: true };
  };

  try {
    await sendLeadSms(cleanLead(validLead()));
    await sendLeadSms(
      cleanLead(
        validLead({
          pricing_package: null,
          form_context: "general",
          source_path: "/contact-us"
        })
      )
    );
    await sendLeadSms(
      cleanLead(
        validLead({
          email_address: "",
          message: "",
          pricing_package: "Social + SEO Audit – Free",
          form_context: "audit",
          source_path: "/social-media-management-plus-seo"
        })
      )
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWebhook === undefined) {
      delete process.env.SMS_WEBHOOK_URL;
    } else {
      process.env.SMS_WEBHOOK_URL = originalWebhook;
    }
  }

  assert.match(messages[0], /website development enquiry/i);
  assert.match(messages[1], /general digital-services enquiry/i);
  assert.match(messages[2], /social and SEO audit request/i);
});
