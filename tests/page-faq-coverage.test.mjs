import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const faqDataPath = new URL("../data/faqs.ts", import.meta.url);

test("primary page FAQ collections are populated and non-repetitive", async () => {
  const data = await import(faqDataPath.href);
  const collections = [
    data.homeFaqs,
    data.aboutFaqs,
    data.contactFaqs,
    data.servicesFaqs,
    data.websiteDevelopmentFaqs,
    data.socialSeoFaqs
  ];

  collections.forEach((items) => assert.ok(items.length >= 4));
  const questions = collections.flatMap((items) => items.map((item) => item.question));
  assert.equal(new Set(questions).size, questions.length);
  questions.forEach((question) => assert.ok(question.endsWith("?")));
});

test("the approved West Bengal question and answer are exact", async () => {
  const { contactFaqs } = await import(faqDataPath.href);
  assert.deepEqual(contactFaqs[0], {
    question: "Can DSE Consultancy manage local SEO and website development in West Bengal?",
    answer:
      "Yes. DSE Consultancy supports businesses across West Bengal with local SEO, Google Business Profile optimisation, mobile-first website development, location-focused service pages and enquiry tracking. We recommend the scope after reviewing the business location, service area, competition, customer search behaviour and the enquiries the business wants to generate."
  });
});

test("FAQ JSON-LD maps the same visible question and answer objects", async () => {
  const source = await readFile("components/faq/FaqJsonLd.tsx", "utf8");
  assert.match(source, /items\.map\(\(item\) =>/);
  assert.match(source, /"@type": "FAQPage"/);
  assert.match(source, /name: item\.question/);
  assert.match(source, /text: item\.answer/);
  assert.match(source, /JSON\.stringify\(data\)/);
});

test("FaqList shows actions only when a page supplies them", async () => {
  const source = await readFile("components/faq/FaqList.tsx", "utf8");
  assert.match(source, /actions\?: FaqActions/);
  assert.match(source, /index === 0 && actions/);
  assert.doesNotMatch(source, /href="#lead-form"/);
  assert.doesNotMatch(source, /href="#pricing"/);
});

test("each service record owns a unique FAQ collection", async () => {
  const source = await readFile("data/services.ts", "utf8");
  assert.match(source, /faqs: readonly FaqItem\[\]/);
  assert.match(source, /How do I avoid receiving a generic template/);
  assert.match(source, /Will DSE Consultancy ask me to buy or create fake Google reviews/);
  assert.match(source, /How will the lead form reduce spam and low-quality submissions/);
});

const routeFiles = {
  home: "app/(landing-pages)/page.tsx",
  about: "app/(website-pages)/about-us/page.tsx",
  contact: "app/(website-pages)/contact-us/page.tsx",
  services: "app/(website-pages)/services/page.tsx",
  website: "app/(landing-pages)/website-development/page.tsx",
  social: "app/(landing-pages)/social-media-management-plus-seo/page.tsx",
  detail: "app/(website-pages)/services/[serviceSlug]/page.tsx"
};

test("every approved route renders visible FAQs and matching JSON-LD", async () => {
  const entries = await Promise.all(
    Object.entries(routeFiles).map(async ([name, path]) => [name, await readFile(path, "utf8")])
  );

  for (const [name, source] of entries) {
    assert.match(source, /<FaqJsonLd items=/, `${name} missing FAQ JSON-LD`);
    assert.match(source, /<FaqList items=/, `${name} missing visible FAQ list`);
  }
});

test("service detail routes use their service record for both outputs", async () => {
  const source = await readFile(routeFiles.detail, "utf8");
  assert.match(source, /<FaqJsonLd items={service\.faqs} \/>/);
  assert.match(source, /<FaqList items={service\.faqs}/);
});

test("the Contact heading changes only the approved visible title", async () => {
  const source = await readFile(routeFiles.contact, "utf8");
  assert.match(source, /<span>In West Bengal\.<\/span>/);
  assert.match(source, /maps\?q=Kalna/);
  assert.match(source, /location in Kalna, Burdwan/);
  assert.match(source, /destination=Kalna/);
});

test("landing pages no longer keep local FAQ arrays", async () => {
  const website = await readFile(routeFiles.website, "utf8");
  const social = await readFile(routeFiles.social, "utf8");
  assert.doesNotMatch(website, /const faqs =/);
  assert.doesNotMatch(social, /const faqs =/);
  assert.match(website, /websiteDevelopmentFaqs/);
  assert.match(social, /socialSeoFaqs/);
});

test("landing-page FAQ headings and actions retain the approved wording", async () => {
  const website = await readFile(routeFiles.website, "utf8");
  const social = await readFile(routeFiles.social, "utf8");

  for (const source of [website, social]) {
    assert.match(source, /<span>Clear Answers<\/span>/);
    assert.match(source, /<span>Before You Start\.<\/span>/);
  }

  assert.match(website, /primary: { href: "#lead-form", label: "Book a call" }/);
  assert.match(website, /secondary: { href: "#pricing", label: "See prices" }/);
  assert.match(social, /primary: { href: "#audit", label: "Book an appointment" }/);
  assert.match(social, /secondary: { href: "#pricing", label: "See packages" }/);
});
