import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, css, leadForm] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("app/globals.css", "utf8"),
  readFile("components/forms/LeadForm.tsx", "utf8")
]);

test("hero keeps dynamic pricing and the current website lead form", () => {
  assert.match(page, /siteConfig\.basePrice/);
  assert.match(page, /<LeadForm sourcePath="\/website-development" \/>/);
  assert.match(leadForm, /websitePackages\.map/);
  assert.match(leadForm, /formatLeadPackageOption/);
  assert.match(leadForm, /name="message"[\s\S]*required/);
  assert.doesNotMatch(page, /Starting from ₹[0-9,]+/);
});

test("hero owns four deliberate visual lines without changing its words", () => {
  const lines = page.match(/className="wd-hero-title-line"/g) ?? [];
  assert.equal(lines.length, 4);
  assert.match(page, /<span className="wd-hero-title-line">Get Your<\/span>/);
  assert.match(page, /<span className="wd-hero-title-line">Professional<\/span>/);
  assert.match(page, /<span className="wd-hero-title-line">Website<\/span>/);
  assert.match(
    page,
    /<span className="wd-hero-title-line">\s*Starting from <span className="accent">\{siteConfig\.basePrice\}<\/span>\s*<\/span>/
  );
});

test("dark hero styling is isolated to the Website Development page", () => {
  assert.match(
    css,
    /\.website-development-page \.wd-hero\s*\{[\s\S]*?background:[\s\S]*?#09080e/
  );
  assert.match(
    css,
    /\.website-development-page \.wd-hero \.hero-content h1\s*\{[\s\S]*?color:\s*#fff9f5/
  );
  assert.doesNotMatch(css, /(?:^|\n)\.hero\s*\{[^}]*#09080e/);
});

test("desktop hero proportions reset safely on narrow screens", () => {
  assert.match(
    css,
    /@media \(min-width: 981px\)[\s\S]*?\.website-development-page \.wd-hero \.hero-grid/
  );
  assert.match(
    css,
    /@media \(max-width: 980px\)[\s\S]*?\.website-development-page \.wd-hero-title-line/
  );
});

test("only the three approved content headings receive the large visual hook", () => {
  assert.equal((page.match(/wd-large-section-heading/g) ?? []).length, 3);
  assert.equal((page.match(/wd-visual-section/g) ?? []).length, 3);
  assert.match(page, /className="section soft wd-support-section" id="support"/);
  assert.doesNotMatch(
    page,
    /id="faq"[\s\S]{0,180}wd-large-section-heading/
  );
});

test("large heading and wide-card rules remain page scoped", () => {
  assert.match(
    css,
    /\.website-development-page \.wd-large-section-heading h2/
  );
  assert.match(
    css,
    /\.website-development-page \.wd-visual-section/
  );
  assert.match(
    css,
    /\.website-development-page \.wd-support-section \.service-card/
  );
  assert.match(
    css,
    /\.website-development-page #pricing \.price-card\s*\{[\s\S]*?border-color:\s*rgba\(254,\s*104,\s*7,\s*\.14\)/
  );
  assert.doesNotMatch(css, /(?:^|\n)\.wd-large-section-heading h2/);
});

test("desktop visual lines unwrap on tablet and mobile", () => {
  assert.match(
    css,
    /@media \(min-width: 981px\)[\s\S]*?\.website-development-page \.wd-large-section-heading h2 > span[\s\S]*?white-space:\s*nowrap/
  );
  assert.match(
    css,
    /@media \(max-width: 980px\)[\s\S]*?\.website-development-page \.wd-large-section-heading h2 > span[\s\S]*?white-space:\s*normal/
  );
});

test("FAQ data, visible FAQ, and JSON-LD remain paired", () => {
  assert.match(page, /<FaqJsonLd items=\{websiteDevelopmentFaqs\} \/>/);
  assert.match(page, /<FaqList items=\{websiteDevelopmentFaqs\}/);
});

test("performance heading has two desktop lines and a narrow-screen reset", () => {
  assert.match(
    css,
    /\.wd-performance-story-intro h2 > \.wd-performance-title-line\s*\{[\s\S]*?display:\s*block/
  );
  assert.match(
    css,
    /@media \(min-width: 768px\)[\s\S]*?\.wd-performance-title-line[\s\S]*?white-space:\s*nowrap/
  );
  assert.match(
    css,
    /@media \(max-width: 767px\)[\s\S]*?\.wd-performance-title-line[\s\S]*?white-space:\s*normal/
  );
});
