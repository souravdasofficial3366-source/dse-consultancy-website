import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile("integrations/google-sheets/Code.gs", "utf8");
const context = {};

vm.runInNewContext(`${source}\nthis.validateLead = validateLead;`, context);

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
    form_context: "website",
    message: "Please call me about a website.",
    ...overrides
  };
}

test("Google Sheets accepts a trusted audit without email or message", () => {
  assert.equal(
    context.validateLead(
      validLead({
        email_address: "",
        message: "",
        pricing_package: "Social + SEO Audit – Free",
        form_context: "audit",
        source_path: "/social-media-management-plus-seo"
      })
    ),
    true
  );
});

test("Google Sheets requires email and message for website and general leads", () => {
  for (const form_context of ["website", "general"]) {
    assert.equal(context.validateLead(validLead({ form_context, email_address: "" })), false);
    assert.equal(context.validateLead(validLead({ form_context, message: "" })), false);
  }
});

test("Google Sheets rejects unknown contexts and incomplete common fields", () => {
  assert.equal(context.validateLead(validLead({ form_context: "invented" })), false);
  assert.equal(context.validateLead(validLead({ owner_name: "" })), false);
  assert.equal(context.validateLead(validLead({ privacy_consent: false })), false);
});
