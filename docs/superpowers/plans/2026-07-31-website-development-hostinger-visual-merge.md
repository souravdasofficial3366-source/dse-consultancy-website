# Website Development Hostinger Visual Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Vercel Website Development page the approved Hostinger dark hero, larger two-line headings, wider desktop cards, and section rhythm while preserving the current dynamic pricing, lead form, videos, horizontal performance story, FAQ, and shared layout.

**Architecture:** Keep the current Next.js route and all existing interactive components. Add only semantic, page-specific styling hooks in the Website Development route, introduce deliberate visual line spans where a desktop line contract is required, and implement the merge through selectors scoped beneath `.website-development-page`. Protect the shared data and component boundaries with source-level Node regression tests before each visual change.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS in `app/globals.css`, Node’s built-in test runner, Vercel.

## Global Constraints

- Hostinger is a read-only visual reference and must remain unchanged.
- Keep the current section order: hero, comparison, industries, performance story, pricing, support, FAQ, shared gradient CTA, shared footer.
- Keep all approved Vercel wording.
- `data/service-pricing.ts` remains the only package-price catalogue.
- `LeadForm` keeps `sourcePath="/website-development"`, its required message field, dynamic package options, validation, and submission behaviour.
- `IndustryVideoGrid` and its video, poster, hover, focus, and reduced-motion behaviour remain intact.
- Normal vertical page scrolling continues to drive the horizontal performance cards; do not add wheel interception or sideways dragging.
- `websiteDevelopmentFaqs` drives both `FaqList` and `FaqJsonLd`.
- Do not change or duplicate the shared header, navigation, contact controls, gradient CTA, or footer.
- All new visual rules must be scoped beneath `.website-development-page`.
- Desktop two-line heading contracts apply at laptop and desktop widths; tablet and mobile may wrap naturally.
- Verify 1440 × 900, 1280 × 800, 1024 × 768, 768 × 1024, and 390 × 844.
- Preserve keyboard focus, semantic heading order, form labels, accessible errors, reduced motion, and readable colour contrast.

---

## File Map

- Modify: `app/(landing-pages)/website-development/page.tsx`
  - Adds semantic visual hooks and deliberate hero title lines without changing wording or data sources.
- Modify: `components/landing/WebsitePerformanceStory.tsx`
  - Splits the approved performance heading into two semantic desktop lines while preserving one readable heading.
- Modify: `app/globals.css`
  - Owns every page-scoped Hostinger-inspired visual rule and responsive reset.
- Create: `tests/website-development-hostinger-visual-merge.test.mjs`
  - Protects data/component boundaries, semantic hooks, scoping, and responsive line contracts.
- Modify: `tests/website-performance-story.test.mjs`
  - Updates the approved heading assertion to the deliberate two-line markup without weakening the interaction tests.

No shared layout, form, pricing catalogue, FAQ data, industry component, or unrelated route file is modified.

---

### Task 1: Merge The Dark Hero Without Replacing The Form Or Pricing Data

**Files:**
- Create: `tests/website-development-hostinger-visual-merge.test.mjs`
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `siteConfig.basePrice`, `LeadForm`, and the existing `.website-development-page` root.
- Produces: `.wd-hero-title-line` markup and page-scoped `.website-development-page .wd-hero` visual rules.

- [ ] **Step 1: Write the failing hero boundary tests**

Create `tests/website-development-hostinger-visual-merge.test.mjs`:

```js
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
    /<span className="wd-hero-title-line">Starting from <span className="accent">\{siteConfig\.basePrice\}<\/span><\/span>/
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
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```bash
node --test tests/website-development-hostinger-visual-merge.test.mjs
```

Expected: FAIL because `.wd-hero-title-line` and the new dark hero rules do not exist.

- [ ] **Step 3: Add the deliberate dynamic hero lines**

Replace the current hero `h1` in
`app/(landing-pages)/website-development/page.tsx` with:

```tsx
<h1>
  <span className="wd-hero-title-line">Get Your</span>
  <span className="wd-hero-title-line">Professional</span>
  <span className="wd-hero-title-line">Website</span>
  <span className="wd-hero-title-line">
    Starting from <span className="accent">{siteConfig.basePrice}</span>
  </span>
</h1>
```

Do not change the kicker, supporting paragraph, trust list, lead card, or
`LeadForm`.

- [ ] **Step 4: Implement the page-scoped dark hero**

In the existing `/* Website development interactive experience */` section of
`app/globals.css`, replace the light Website Development hero overrides with:

```css
.website-development-page .wd-hero {
  isolation: isolate;
  min-height: calc(100svh - 80px);
  background:
    radial-gradient(circle at 84% 24%, rgba(254, 104, 7, .34), transparent 34%),
    radial-gradient(circle at 18% 82%, rgba(215, 57, 164, .12), transparent 30%),
    linear-gradient(118deg, #09080e 0%, #100d13 58%, #1b0e09 100%);
}

.website-development-page .wd-hero::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, .12), transparent 54%, rgba(254, 104, 7, .1));
  content: "";
  pointer-events: none;
}

.website-development-page .wd-hero .hero-content {
  color: #fff9f5;
}

.website-development-page .wd-hero .hero-content h1 {
  max-width: 780px;
  color: #fff9f5;
  font-size: clamp(3.7rem, 5.7vw, 6.5rem);
  letter-spacing: -.045em;
  line-height: .92;
  text-wrap: initial;
}

.website-development-page .wd-hero-title-line {
  display: block;
}

.website-development-page .wd-hero .hero-copy,
.website-development-page .wd-hero .trust-list {
  color: rgba(255, 249, 245, .76);
}

.website-development-page .wd-hero .eyebrow {
  border-color: rgba(255, 173, 69, .38);
  background: rgba(254, 104, 7, .1);
  color: #ffad45;
}

.website-development-page .wd-hero-fragment {
  border-color: rgba(255, 173, 69, .2);
  background: rgba(255, 255, 255, .06);
  box-shadow: 0 24px 70px rgba(0, 0, 0, .34);
}

@media (min-width: 981px) {
  .website-development-page .wd-hero {
    padding-block: clamp(100px, 8vw, 136px);
  }

  .website-development-page .wd-hero .hero-grid {
    grid-template-columns: minmax(0, 1.22fr) minmax(380px, .78fr);
    gap: clamp(48px, 5vw, 82px);
  }
}

@media (max-width: 980px) {
  .website-development-page .wd-hero-title-line {
    display: inline;
  }

  .website-development-page .wd-hero-title-line::after {
    content: " ";
  }
}
```

Retain the existing `.lead-card` styling so the working white form remains
visually distinct and fully readable.

- [ ] **Step 5: Run the focused and lead-form tests**

Run:

```bash
node --test tests/website-development-hostinger-visual-merge.test.mjs tests/shared-pricing-and-lead-forms.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the hero merge**

```bash
git add app/\(landing-pages\)/website-development/page.tsx app/globals.css tests/website-development-hostinger-visual-merge.test.mjs
git commit -m "style: merge website development hero treatment"
```

---

### Task 2: Restore The Large Section Rhythm And Wider Cards

**Files:**
- Modify: `tests/website-development-hostinger-visual-merge.test.mjs`
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the existing comparison table, `IndustryVideoGrid`, pricing map, and support-card markup.
- Produces: `.wd-visual-section`, `.wd-large-section-heading`, and `.wd-support-section` hooks with desktop-only width and heading contracts.

- [ ] **Step 1: Add the failing section-contract tests**

Append to `tests/website-development-hostinger-visual-merge.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```bash
node --test tests/website-development-hostinger-visual-merge.test.mjs
```

Expected: FAIL because the new section hooks and scoped rules do not exist.

- [ ] **Step 3: Add semantic styling hooks without changing content**

In `app/(landing-pages)/website-development/page.tsx`:

```tsx
<section className="section white wd-visual-section" id="why-us">
```

```tsx
<div className="section-head center wd-large-section-heading">
```

Apply `wd-large-section-heading` to the existing section heads in `#why-us`,
`#industries`, and `#pricing` only.

Use:

```tsx
<section className="section wd-visual-section" id="industries">
```

```tsx
<section className="section white wd-visual-section" id="pricing">
```

```tsx
<section className="section soft wd-support-section" id="support">
```

Do not add either heading hook to `#faq`.

- [ ] **Step 4: Implement the large heading, wider content, and card rhythm**

Add these page-scoped rules near the existing Website Development section
styles in `app/globals.css`:

```css
.website-development-page .wd-visual-section {
  padding-block: clamp(110px, 9vw, 156px);
}

.website-development-page .wd-large-section-heading {
  margin-bottom: clamp(48px, 6vw, 76px);
}

.website-development-page .wd-large-section-heading .eyebrow {
  position: relative;
  border: 0;
  border-radius: 0;
  background: transparent;
  padding: 0 0 0 34px;
}

.website-development-page .wd-large-section-heading .eyebrow::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 24px;
  height: 2px;
  background: #fe6807;
  content: "";
  transform: translateY(-50%);
}

.website-development-page .wd-large-section-heading h2 {
  margin-top: 24px;
  color: #fe6807;
  font-size: clamp(3.65rem, 6.2vw, 6.6rem);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: .94;
}

.website-development-page .wd-large-section-heading h2 > span {
  display: block;
}

.website-development-page .wd-support-section {
  padding-block: clamp(96px, 8vw, 132px);
}

.website-development-page .wd-support-section .service-card {
  min-height: 270px;
  padding: clamp(30px, 3vw, 42px);
}

.website-development-page #pricing .price-card {
  border-color: rgba(254, 104, 7, .14);
  box-shadow: 0 20px 60px rgba(74, 29, 0, .08);
}

@media (min-width: 981px) {
  .website-development-page .wd-hero > .container,
  .website-development-page .wd-visual-section > .container,
  .website-development-page .wd-support-section > .container {
    width: min(1440px, calc(100% - 64px));
  }

  .website-development-page .wd-large-section-heading h2 > span {
    white-space: nowrap;
  }

  .website-development-page #industries .industry-grid {
    gap: clamp(26px, 2.6vw, 38px);
  }

  .website-development-page #industries .industry-card {
    min-height: 350px;
  }

  .website-development-page #pricing .pricing-grid,
  .website-development-page #support .service-grid {
    gap: clamp(26px, 2.6vw, 38px);
  }

  .website-development-page #pricing .price-card {
    padding: 46px 32px 32px;
  }
}

@media (max-width: 980px) {
  .website-development-page .wd-large-section-heading h2 > span {
    white-space: normal;
  }
}

@media (max-width: 640px) {
  .website-development-page .wd-visual-section {
    padding-block: 78px;
  }

  .website-development-page .wd-large-section-heading h2 {
    font-size: clamp(2.65rem, 12vw, 4rem);
    line-height: 1;
  }

  .website-development-page .wd-support-section {
    padding-block: 72px;
  }
}
```

Preserve the existing comparison, industry, pricing, spotlight, tilt, and card
animation rules. Do not add spacing to `#faq`.

- [ ] **Step 5: Run focused visual-boundary tests**

Run:

```bash
node --test tests/website-development-hostinger-visual-merge.test.mjs tests/website-development-industry-video-grid.test.mjs tests/shared-pricing-and-lead-forms.test.mjs tests/page-faq-coverage.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the section merge**

```bash
git add app/\(landing-pages\)/website-development/page.tsx app/globals.css tests/website-development-hostinger-visual-merge.test.mjs
git commit -m "style: restore website development section rhythm"
```

---

### Task 3: Make The Performance Heading Deliberately Two Lines

**Files:**
- Modify: `components/landing/WebsitePerformanceStory.tsx`
- Modify: `app/globals.css`
- Modify: `tests/website-performance-story.test.mjs`
- Modify: `tests/website-development-hostinger-visual-merge.test.mjs`

**Interfaces:**
- Consumes: the existing `WebsitePerformanceStory` scroll controller and `.wd-performance-story-intro`.
- Produces: `.wd-performance-title-line` spans that preserve the full accessible heading and form exactly two desktop lines.

- [ ] **Step 1: Replace the single-string test with a failing line contract**

In `tests/website-performance-story.test.mjs`, remove
`"Turn Local Searches Into Real Business Leads"` from the `approved` array and
add this assertion before the array loop:

```js
assert.match(
  story,
  /<span className="wd-performance-title-line">Turn Local Searches<\/span>/
);
assert.match(
  story,
  /<span className="wd-performance-title-line">Into Real Business Leads<\/span>/
);
```

Append to `tests/website-development-hostinger-visual-merge.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the focused tests and confirm the expected failure**

Run:

```bash
node --test tests/website-performance-story.test.mjs tests/website-development-hostinger-visual-merge.test.mjs
```

Expected: FAIL because the title spans and responsive rules do not exist.

- [ ] **Step 3: Add the two semantic title lines**

Replace the performance-story heading in
`components/landing/WebsitePerformanceStory.tsx` with:

```tsx
<h2>
  <span className="wd-performance-title-line">Turn Local Searches</span>{" "}
  <span className="wd-performance-title-line">Into Real Business Leads</span>
</h2>
```

The explicit whitespace keeps the spoken and copied heading readable as one
sentence while CSS controls the visual lines.

- [ ] **Step 4: Widen the performance introduction without touching scroll logic**

Update the existing performance intro styles in `app/globals.css`:

```css
.wd-performance-story-intro {
  position: relative;
  z-index: 1;
  display: grid;
  max-width: none;
  gap: 16px;
  margin-bottom: clamp(40px, 6vw, 76px);
}

.wd-performance-story-intro h2 {
  max-width: 1180px;
  margin: 0;
  color: #fff9f5;
  font-size: clamp(2.7rem, 6vw, 5.7rem);
  font-weight: 500;
  letter-spacing: -.035em;
  line-height: .98;
  text-wrap: initial;
}

.wd-performance-story-intro h2 > .wd-performance-title-line {
  display: block;
}

@media (min-width: 981px) {
  .website-development-page .wd-performance-story > .container {
    width: min(1440px, calc(100% - 64px));
  }
}

@media (min-width: 768px) {
  .wd-performance-title-line {
    white-space: nowrap;
  }
}

@media (max-width: 767px) {
  .wd-performance-title-line {
    display: inline;
    white-space: normal;
  }
}
```

Do not change `WebsitePerformanceStory` hooks, observer logic, progress
calculation, card content, demos, or reduced-motion handling.

- [ ] **Step 5: Run performance and responsive regression tests**

Run:

```bash
node --test tests/website-performance-story.test.mjs tests/website-development-hostinger-visual-merge.test.mjs tests/website-development-repairs.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the performance-heading merge**

```bash
git add components/landing/WebsitePerformanceStory.tsx app/globals.css tests/website-performance-story.test.mjs tests/website-development-hostinger-visual-merge.test.mjs
git commit -m "style: balance website performance heading"
```

---

### Task 4: Prove Shared Boundaries And Production Build

**Files:**
- Test: `tests/website-development-hostinger-visual-merge.test.mjs`
- Test: all existing `tests/*.test.mjs`
- Verify: entire Next.js application

**Interfaces:**
- Consumes: the completed visual merge.
- Produces: a test- and build-verified candidate with no unrelated source changes.

- [ ] **Step 1: Add the final shared-layout exclusion test**

Append to `tests/website-development-hostinger-visual-merge.test.mjs`:

```js
test("route does not duplicate shared page chrome or the gradient CTA", () => {
  assert.doesNotMatch(page, /<header|<footer|site-header|site-footer/);
  assert.doesNotMatch(page, /Bring Us The Business Challenge|Let'?s Build The Digital Presence/);
});
```

- [ ] **Step 2: Run the complete UI test suite**

Run:

```bash
npm run test:ui
```

Expected: all tests PASS, including the new visual-merge contract.

- [ ] **Step 3: Run TypeScript checking**

Run:

```bash
npm run typecheck
```

Expected: exit code 0 with no TypeScript diagnostics.

- [ ] **Step 4: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0 and `/website-development` is generated without build or
route errors.

- [ ] **Step 5: Audit the branch diff**

Run:

```bash
git status --short
git diff --check
git diff --stat b7aa1b0...HEAD
git diff --name-only b7aa1b0...HEAD
```

Expected implementation paths:

```text
app/(landing-pages)/website-development/page.tsx
app/globals.css
components/landing/WebsitePerformanceStory.tsx
tests/website-development-hostinger-visual-merge.test.mjs
tests/website-performance-story.test.mjs
docs/superpowers/specs/2026-07-31-website-development-hostinger-visual-merge-design.md
docs/superpowers/plans/2026-07-31-website-development-hostinger-visual-merge.md
```

No shared layout, form, pricing, FAQ data, industry component, or unrelated
route may appear.

- [ ] **Step 6: Commit the final boundary test**

```bash
git add tests/website-development-hostinger-visual-merge.test.mjs
git commit -m "test: protect website development shared boundaries"
```

---

### Task 5: Browser Verification At Every Approved Width

**Files:**
- Verify: `/website-development`
- Verify: `/`, `/about-us`, `/contact-us`, `/social-media-management-plus-seo`
- Output: temporary screenshots under `work/verification/` only; do not commit them.

**Interfaces:**
- Consumes: the production build from Task 4.
- Produces: visual and interaction evidence that the merge works without affecting shared pages.

- [ ] **Step 1: Start the verified production build locally**

Run:

```bash
npm run start
```

Expected: the application serves the completed production build on the reported
localhost port.

- [ ] **Step 2: Verify the Website Development route at all five widths**

Using browser automation, inspect `/website-development` at:

```text
1440 × 900
1280 × 800
1024 × 768
768 × 1024
390 × 844
```

For every width, confirm:

- no page-level horizontal overflow;
- no clipped heading, form field, price, card, FAQ, or footer content;
- the form remains usable;
- comparison content remains reachable;
- industry videos show video or poster content;
- performance cards remain reachable;
- FAQ, gradient CTA, footer, and contact controls remain present.

- [ ] **Step 3: Verify the desktop visual contracts**

At 1440 × 900 and 1280 × 800, measure and confirm:

- the hero is dark black-and-orange;
- its title has four visible lines;
- “What’s Included,” “Websites for Everyday Businesses,” and
  “Pocket-Friendly Pricing” each have exactly two visible lines;
- “Turn Local Searches Into Real Business Leads” has exactly two visible lines;
- pricing and support cards are wider and more generously spaced than the
  pre-merge Vercel version;
- no large blank gap appears before the FAQ.

- [ ] **Step 4: Verify interactions and motion**

Confirm:

- invalid form submission exposes the existing accessible validation;
- the package field contains current shared-catalogue labels;
- industry cards retain hover/focus and poster behaviour;
- normal vertical scrolling advances the horizontal performance track on an
  eligible desktop viewport;
- no wheel handler or sideways drag is required;
- pricing CTA links move to `#lead-form`;
- FAQ questions open by keyboard and pointer;
- reduced-motion mode leaves all content readable and reachable.

- [ ] **Step 5: Smoke-test shared pages**

At 1440 × 900 and 390 × 844, inspect:

```text
/
/about-us
/contact-us
/social-media-management-plus-seo
```

Expected: header, WhatsApp treatment, gradient CTA, footer, page structure, and
responsive layout are unchanged.

- [ ] **Step 6: Stop the local server and confirm a clean worktree**

Stop only the server process started in Step 1, then run:

```bash
git status --short --branch
```

Expected: no uncommitted source or test changes. Temporary screenshots remain
untracked or are removed from the verification folder before publication.

---

### Task 6: Publish The Exact Verified Commit To GitHub And Vercel

**Files:**
- Publish: current `main` commit
- Verify live: `https://dse-consultancy-website.vercel.app/website-development`

**Interfaces:**
- Consumes: the exact clean commit verified in Tasks 4 and 5.
- Produces: the updated Vercel production page while leaving Hostinger untouched.

- [ ] **Step 1: Record and validate the release commit**

Run:

```bash
git status --short --branch
git rev-parse HEAD
git log -5 --oneline --decorate
```

Expected: clean `main`; record the exact `HEAD` SHA for deployment verification.

- [ ] **Step 2: Push the verified commit to GitHub**

Run:

```bash
git push origin main
```

Expected: `origin/main` advances to the recorded SHA.

- [ ] **Step 3: Deploy that source state to the existing Vercel production project**

Run:

```bash
npx --yes vercel@50.28.0 deploy --prod
```

Expected: successful production deployment for the existing
`dse-consultancy-website` project and a deployment URL.

- [ ] **Step 4: Confirm deployment state and aliases**

Inspect the returned deployment and verify that the stable Vercel alias resolves
to the new production deployment:

```text
https://dse-consultancy-website.vercel.app
```

Expected: the deployment is ready and the stable alias serves the recorded
release commit.

- [ ] **Step 5: Repeat focused live verification**

On the stable Vercel alias, verify:

- `/website-development` at 1440 × 900, 1024 × 768, and 390 × 844;
- hero, three large section headings, performance heading, pricing, support,
  FAQ, gradient CTA, and footer;
- current dynamic prices in the hero, pricing cards, and package selector;
- form validation and package selection;
- performance scrolling at the eligible desktop width;
- Home and About shared header/footer smoke checks.

Expected: live behaviour matches the verified local build.

- [ ] **Step 6: Confirm Hostinger was not changed**

Open `https://dseconsultancy.com/website-development/` read-only and confirm it
still serves its existing version. Do not upload, delete, edit, or publish any
Hostinger file.

---

## Completion Evidence

Before reporting completion, provide:

1. the final Git commit SHA;
2. the GitHub push result;
3. the Vercel production deployment URL;
4. the stable Vercel alias;
5. focused test, full test, typecheck, and build results;
6. browser verification results for all five approved widths;
7. confirmation that Home, About, Contact, SMM + SEO, shared header/footer, and
   Hostinger remained unchanged.
