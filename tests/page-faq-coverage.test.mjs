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
