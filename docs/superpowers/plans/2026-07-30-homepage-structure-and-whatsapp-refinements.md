# Homepage Structure and WhatsApp Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved homepage layout refinements and WhatsApp interaction fixes from the clean Vercel-aligned source, then merge, push, deploy, and verify the production Vercel site.

**Architecture:** Preserve the existing Next.js page and shared layout components. Add narrowly scoped semantic hooks in the homepage and layout JSX, replace only the visible process-number/title structure, and use section-specific CSS overrides rather than global redesigns. Existing Node UI-contract tests will protect markup and responsive CSS contracts, followed by a production build and real-browser geometry/interaction verification.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, Node.js built-in test runner, Git, Vercel CLI, browser verification.

## Global Constraints

- Start from clean Vercel-aligned commit `960e66b` plus the approved specification commits on `codex/homepage-structure-and-whatsapp-refinements`.
- Do not import or rebuild the Hostinger homepage.
- Do not modify the About page, pricing, forms, FAQs, metadata, structured data, service content, footer layout/copy, or floating green “Chat now” button.
- Preserve current page order, text, videos, cards, animation timing, destinations, and responsive stacking unless explicitly changed below.
- Normal vertical page scrolling must continue to drive the process-card stack; do not intercept wheel events or add carousel controls, timers, or forced snapping.
- The homepage closing gradient must be exactly `linear-gradient(135deg, #fe6807 0%, #ff8124 58%, #d739a4 100%)`.
- Header WhatsApp green must be `#25d366`.
- Footer WhatsApp must match the neighbouring orange glyphs normally and become dark/black on orange hover and keyboard focus.
- No Hostinger deployment is part of this plan.

---

## File Map

- `app/(landing-pages)/page.tsx`
  - Owns homepage hero button markup, process-step data, split headings, and the closing section.
- `components/landing/HomeProcessStack.tsx`
  - Owns process-card rendering, sticky index variables, video lifecycle, centred desktop titles, and compact mobile titles.
- `components/layout/LayoutParts.tsx`
  - Owns the shared header and footer WhatsApp links.
- `app/globals.css`
  - Owns hero circles, homepage spacing/splits, process-card layers, closing gradient, and shared WhatsApp states.
- `public/icons/whatsapp-orange.svg`
  - Provides the footer’s normal-state glyph in the same orange as neighbouring contact glyphs.
- `tests/homepage-structure-refinements.test.mjs`
  - Protects hero circles, section spacing, split headings, and closing CTA presentation.
- `tests/homepage-process-mask-cards.test.mjs`
  - Protects number removal, centred slide-matched titles, sticky behaviour, and mobile fallback.
- `tests/whatsapp-controls.test.mjs`
  - Protects header green states, footer orange-to-dark states, destinations, and the unchanged floating control.

---

### Task 1: Homepage hero, spacing, split headings, and closing gradient

**Files:**
- Create: `tests/homepage-structure-refinements.test.mjs`
- Modify: `app/(landing-pages)/page.tsx:90-110`
- Modify: `app/globals.css:3997-4031`
- Modify: `app/globals.css:4381-4435`
- Modify: `app/globals.css:4519-4545`
- Modify: `app/globals.css:4873-4910`
- Modify: `app/globals.css:5209-5232`

**Interfaces:**
- Consumes: Existing `.consultancy-home-button`, `.consultancy-home-services`, `.consultancy-home-system-copy`, `.consultancy-home-heading.split`, `.consultancy-home-closing`, and Blaze palette hooks.
- Produces: `.consultancy-home-button-arrow` wrappers and section-specific desktop layout/closing rules used by browser verification.

- [ ] **Step 1: Write the failing homepage refinement tests**

Create `tests/homepage-structure-refinements.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [home, css] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

function cssBlock(marker) {
  const start = css.indexOf(marker);
  assert.notEqual(start, -1, `missing CSS marker: ${marker}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(start, index + 1);
  }
  assert.fail(`unterminated CSS block: ${marker}`);
}

test("both hero actions render their arrows in dedicated circular hooks", () => {
  assert.equal(
    (home.match(/className="consultancy-home-button-arrow"/g) ?? []).length,
    2
  );
  assert.match(
    cssBlock(".consultancy-home-button-arrow {"),
    /width:\s*32px[\s\S]*height:\s*32px[\s\S]*border-radius:\s*50%/
  );
});

test("services remove only their bottom gap before Connected Advantage", () => {
  assert.match(
    cssBlock(".consultancy-home-services {"),
    /padding-bottom:\s*0/
  );
});

test("wide desktop gives both approved headings two controlled visual lines", () => {
  const desktop = cssBlock("@media (min-width: 1200px)");
  assert.match(
    desktop,
    /\.consultancy-home-system-copy[\s\S]*grid-template-columns:\s*minmax\(0,\s*1\.75fr\)\s+minmax\(400px,\s*\.9fr\)/
  );
  assert.match(
    desktop,
    /\.consultancy-home-insights \.consultancy-home-heading\.split[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/
  );
  assert.match(
    desktop,
    /\.consultancy-home-system-copy h2 span[\s\S]*white-space:\s*nowrap/
  );
  assert.match(
    desktop,
    /\.consultancy-home-insights \.consultancy-home-heading h2 span[\s\S]*white-space:\s*nowrap/
  );
});

test("the Blaze homepage closing section keeps the approved bright CTA treatment", () => {
  const closing = cssBlock(
    '.consultancy-home[data-home-palette="blaze"] .consultancy-home-closing {'
  );
  assert.match(
    closing,
    /linear-gradient\(135deg,\s*#fe6807 0%,\s*#ff8124 58%,\s*#d739a4 100%\)/
  );
  assert.match(
    css,
    /\.consultancy-home\[data-home-palette="blaze"\] \.consultancy-home-closing :is\(h2,[^}]*color:\s*#09080e/
  );
  assert.match(
    css,
    /\.consultancy-home\[data-home-palette="blaze"\] \.consultancy-home-closing a\s*\{[^}]*border-radius:\s*999px[^}]*background:\s*#09080e[^}]*color:\s*#fff/
  );
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test tests/homepage-structure-refinements.test.mjs
```

Expected: FAIL because arrow wrapper hooks, targeted services padding, section-specific wide-desktop rules, and the bright Blaze closing override do not exist.

- [ ] **Step 3: Add the two hero arrow wrappers**

In `app/(landing-pages)/page.tsx`, change the two decorative arrow spans:

```tsx
<Link className="consultancy-home-button primary" href="#services">
  Explore Our Services
  <span aria-hidden="true" className="consultancy-home-button-arrow">↘</span>
</Link>
<Link className="consultancy-home-button glass" href="/contact-us">
  Start A Conversation
  <span aria-hidden="true" className="consultancy-home-button-arrow">↗</span>
</Link>
```

- [ ] **Step 4: Add the minimal scoped homepage CSS**

Add the following rules in the corresponding homepage CSS sections:

```css
.consultancy-home-button-arrow {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  place-items: center;
  border-radius: 50%;
  transition: background 240ms ease, color 240ms ease, transform 240ms ease;
}

.consultancy-home-button.primary .consultancy-home-button-arrow {
  background: #09080e;
  color: #fff;
}

.consultancy-home-button.glass .consultancy-home-button-arrow {
  background: #fe6807;
  color: #09080e;
}

.consultancy-home-button:hover .consultancy-home-button-arrow {
  transform: scale(1.08);
}

.consultancy-home-services {
  padding-bottom: 0;
}

@media (min-width: 1200px) {
  .consultancy-home-system-copy {
    grid-template-columns: minmax(0, 1.75fr) minmax(400px, .9fr);
  }

  .consultancy-home-insights .consultancy-home-heading.split {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .consultancy-home-system-copy h2 span,
  .consultancy-home-insights .consultancy-home-heading h2 span {
    white-space: nowrap;
  }
}

.consultancy-home[data-home-palette="blaze"] .consultancy-home-closing {
  background: linear-gradient(135deg, #fe6807 0%, #ff8124 58%, #d739a4 100%);
  color: #09080e;
}

.consultancy-home[data-home-palette="blaze"] .consultancy-home-closing :is(
  h2,
  .consultancy-home-closing-inner > span
) {
  color: #09080e;
  -webkit-text-fill-color: currentColor;
}

.consultancy-home[data-home-palette="blaze"] .consultancy-home-closing p {
  color: rgba(9, 8, 14, .72);
}

.consultancy-home[data-home-palette="blaze"] .consultancy-home-closing a {
  border-radius: 999px;
  background: #09080e;
  color: #fff;
}
```

Keep the existing `@media (max-width: 960px)` stacked fallbacks unchanged.

- [ ] **Step 5: Run focused and split-layout tests**

Run:

```bash
node --test tests/homepage-structure-refinements.test.mjs tests/split-copy-layout.test.mjs
```

Expected: PASS. If the pre-existing split test rejects the intentional section-specific Connected Advantage ratio, update only that assertion to the new approved ratio while retaining its 960px fallback assertions.

- [ ] **Step 6: Commit Task 1**

```bash
git add "app/(landing-pages)/page.tsx" app/globals.css tests/homepage-structure-refinements.test.mjs tests/split-copy-layout.test.mjs
git commit -m "feat: refine homepage structure and closing CTA"
```

---

### Task 2: Scroll-matched centre titles and number-free process cards

**Files:**
- Modify: `app/(landing-pages)/page.tsx:44-78`
- Modify: `components/landing/HomeProcessStack.tsx:6-111`
- Modify: `app/globals.css:4647-4868`
- Modify: `app/globals.css:5012-5026`
- Modify: `app/globals.css:5216-5225`
- Modify: `tests/homepage-process-mask-cards.test.mjs`

**Interfaces:**
- Consumes: `HomeProcessStep.title`, `description`, `video`, `poster`, and `tags`; existing `--process-index`, `--process-offset`, and `--process-tablet-offset` sticky variables.
- Produces: `.consultancy-process-stack-title`, centred for widths at or above 768px and compact at or below 767px.

- [ ] **Step 1: Replace obsolete number/header assertions with failing title-layer assertions**

In `tests/homepage-process-mask-cards.test.mjs`:

```js
const processStepsStart = page.indexOf("const processSteps = [");
const processStepsEnd = page.indexOf("] as const;", processStepsStart);
const processStepsSource = page.slice(processStepsStart, processStepsEnd);

test("process cards render no visible sequence labels", () => {
  assert.doesNotMatch(component, /step\.number/);
  assert.doesNotMatch(component, /consultancy-process-stack-progress/);
  assert.doesNotMatch(component, /<small>of 04<\/small>/);
  assert.doesNotMatch(processStepsSource, /number:\s*"0[1-4]"/);
});

test("each process title owns the highest centred slide layer", () => {
  assert.match(
    component,
    /<h3 className="consultancy-process-stack-title">\{step\.title\}<\/h3>/
  );
  assert.match(
    css,
    /\.consultancy-process-stack-title\s*\{[^}]*position:\s*absolute[^}]*z-index:\s*4[^}]*top:\s*50%[^}]*left:\s*50%[^}]*transform:\s*translate\(-50%,\s*-50%\)/
  );
});

test("mobile titles return to a compact top position", () => {
  const mobile = mediaRule("(max-width: 767px)");
  assert.match(
    mobile,
    /\.consultancy-process-stack-title\s*\{[^}]*position:\s*relative[^}]*top:\s*auto[^}]*left:\s*auto[^}]*transform:\s*none/
  );
});
```

Update the semantic card assertion to expect the classed title:

```js
assert.match(
  component,
  /<h3 className="consultancy-process-stack-title">{step\.title}<\/h3>/
);
```

Replace the obsolete “previous phase label in its exposed strip” test with:

```js
test("sticky overlap retains indexed card offsets without visible header labels", () => {
  const desktop = mediaRule("(min-width: 1200px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
  const tablet = mediaRule("(min-width: 768px) and (max-width: 1199px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)");

  assert.match(desktop, /top:\s*calc\(var\(--process-sticky-top\) \+ var\(--process-offset\)\)/);
  assert.match(tablet, /top:\s*calc\(var\(--process-sticky-top\) \+ var\(--process-tablet-offset\)\)/);
  assert.doesNotMatch(component, /consultancy-process-stack-header/);
});
```

Remove short-height and reduced-motion assertions that require `.consultancy-process-stack-header`; continue asserting that sticky positioning is disabled in those modes.

- [ ] **Step 2: Run the focused process test and verify RED**

Run:

```bash
node --test tests/homepage-process-mask-cards.test.mjs
```

Expected: FAIL because number data/markup remains and titles still render in the top header.

- [ ] **Step 3: Remove display numbers from the data contract**

In `app/(landing-pages)/page.tsx`, remove the `number` property from all four `processSteps`.

In `components/landing/HomeProcessStack.tsx`, change the type and key:

```tsx
export type HomeProcessStep = {
  title: string;
  description: string;
  video: string;
  poster: string;
  tags: readonly [string, string, string];
};
```

```tsx
<article className="consultancy-process-stack-card" key={step.title} style={style}>
```

- [ ] **Step 4: Replace the top header and progress badge with the card-owned title**

Use:

```tsx
<div className="consultancy-process-stack-inner">
  <h3 className="consultancy-process-stack-title">{step.title}</h3>
  <div className="consultancy-process-stack-content">
    <p>{step.description}</p>
    <ul aria-label={`${step.title} outcomes`}>
      {step.tags.map((tag) => <li key={tag}>{tag}</li>)}
    </ul>
  </div>
</div>
```

Do not change video observation/playback logic or the CSS custom properties derived from `index`.

- [ ] **Step 5: Replace header/progress CSS with the centred and mobile title rules**

Use:

```css
.consultancy-process-stack-title {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  width: min(90%, 980px);
  margin: 0;
  color: #fff9f5;
  font-family: var(--font-heading);
  font-size: clamp(3rem, 7vw, 6.8rem);
  font-weight: 500;
  letter-spacing: -.055em;
  line-height: .92;
  text-align: center;
  text-shadow: 0 10px 36px rgba(0, 0, 0, .58);
  transform: translate(-50%, -50%);
}

@media (max-width: 767px) {
  .consultancy-process-stack-title {
    position: relative;
    z-index: 4;
    top: auto;
    left: auto;
    width: auto;
    align-self: start;
    font-size: clamp(2rem, 12vw, 3.35rem);
    text-align: left;
    text-shadow: 0 8px 24px rgba(0, 0, 0, .48);
    transform: none;
  }
}
```

Delete the unused `.consultancy-process-stack-header`, header child, and `.consultancy-process-stack-progress` rules. Update palette selectors that reference the removed header so they target `.consultancy-process-stack-title`.

Keep card sticky rules, index offsets, content layout, scrim, videos, and reduced-motion positioning intact.

- [ ] **Step 6: Run the process tests**

Run:

```bash
node --test tests/homepage-process-mask-cards.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

```bash
git add "app/(landing-pages)/page.tsx" components/landing/HomeProcessStack.tsx app/globals.css tests/homepage-process-mask-cards.test.mjs
git commit -m "feat: centre homepage process slide titles"
```

---

### Task 3: Header and footer WhatsApp states

**Files:**
- Create: `public/icons/whatsapp-orange.svg`
- Create: `tests/whatsapp-controls.test.mjs`
- Modify: `components/layout/LayoutParts.tsx:37-46`
- Modify: `components/layout/LayoutParts.tsx:86-96`
- Modify: `app/globals.css:150-160`
- Modify: `app/globals.css:8685-8702`

**Interfaces:**
- Consumes: Existing `/icons/whatsapp-green.svg`, `siteConfig.whatsapp`, `.whatsapp-header-btn`, `.footer-contact-actions`, and `.whatsapp-fab`.
- Produces: `.footer-whatsapp-link`, orange footer asset, and explicit hover/focus icon-contrast states.

- [ ] **Step 1: Write the failing WhatsApp control tests**

Create `tests/whatsapp-controls.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [layout, css] = await Promise.all([
  readFile("components/layout/LayoutParts.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

test("header WhatsApp keeps its configured destination and green asset", () => {
  assert.match(layout, /className="icon-button whatsapp-header-btn"/);
  assert.match(layout, /href={`https:\/\/wa\.me\/\${siteConfig\.whatsapp}`}/);
  assert.match(layout, /src="\/icons\/whatsapp-green\.svg"/);
  assert.match(
    css,
    /\.whatsapp-header-btn\s*\{[^}]*border-color:\s*#25d366/
  );
  assert.match(
    css,
    /\.whatsapp-header-btn:is\(:hover,\s*:focus-visible\)\s*\{[^}]*background:\s*#25d366/
  );
  assert.match(
    css,
    /\.whatsapp-header-btn:is\(:hover,\s*:focus-visible\) img\s*\{[^}]*filter:\s*brightness\(0\)/
  );
});

test("footer WhatsApp matches orange neighbours and turns dark on interaction", () => {
  assert.match(layout, /className="footer-whatsapp-link"/);
  assert.match(layout, /src="\/icons\/whatsapp-orange\.svg"/);
  assert.match(
    css,
    /\.footer-whatsapp-link:is\(:hover,\s*:focus-visible\) img\s*\{[^}]*filter:\s*brightness\(0\)/
  );
});

test("the floating WhatsApp control remains the existing green control", () => {
  assert.match(layout, /className="whatsapp-fab"/);
  assert.match(css, /\.whatsapp-fab\s*\{[^}]*background:\s*#25d366/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/whatsapp-controls.test.mjs
```

Expected: FAIL because explicit header green hover rules, footer class, orange asset, and dark footer image state do not exist.

- [ ] **Step 3: Add the orange WhatsApp asset**

Create `public/icons/whatsapp-orange.svg` using the same view box and path as `public/icons/whatsapp.svg`, changing only the root fill:

```xml
<svg fill="#ffad45" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <title>WhatsApp</title>
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
</svg>
```

- [ ] **Step 4: Add the footer semantic hook and asset**

In `components/layout/LayoutParts.tsx`:

```tsx
<a
  aria-label="Message DSE Consultancy on WhatsApp"
  className="footer-whatsapp-link"
  href={`https://wa.me/${siteConfig.whatsapp}`}
  rel="noreferrer"
  target="_blank"
>
  <Image alt="" height={22} src="/icons/whatsapp-orange.svg" width={22} />
</a>
```

Leave the header asset, URLs, labels, and floating WhatsApp markup unchanged.

- [ ] **Step 5: Add explicit header and footer interaction CSS**

```css
.whatsapp-header-btn {
  border-color: #25d366;
}

.whatsapp-header-btn:is(:hover, :focus-visible) {
  border-color: #25d366;
  background: #25d366;
  transform: translateY(-2px);
}

.whatsapp-header-btn img,
.footer-whatsapp-link img {
  transition: filter 180ms ease;
}

.whatsapp-header-btn:is(:hover, :focus-visible) img,
.footer-whatsapp-link:is(:hover, :focus-visible) img {
  filter: brightness(0);
}
```

Place the header rule after the Blaze palette’s generic `.icon-button` rule so the green border wins. Keep the existing footer contact-circle orange background rules unchanged.

- [ ] **Step 6: Run the WhatsApp and full UI tests**

Run:

```bash
node --test tests/whatsapp-controls.test.mjs
npm run test:ui
```

Expected: PASS.

- [ ] **Step 7: Commit Task 3**

```bash
git add components/layout/LayoutParts.tsx app/globals.css public/icons/whatsapp-orange.svg tests/whatsapp-controls.test.mjs
git commit -m "fix: align header and footer WhatsApp states"
```

---

### Task 4: Production checks and real-browser verification

**Files:**
- Modify only if verification exposes a scoped regression in the files already listed.

**Interfaces:**
- Consumes: Completed Tasks 1–3.
- Produces: A verified release candidate with recorded test/build/browser evidence.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
npm run test:ui
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit successfully.

- [ ] **Step 2: Start the production-equivalent local site**

Run:

```bash
npm run dev
```

Keep the returned local URL for browser verification.

- [ ] **Step 3: Verify desktop and laptop behaviour in the real browser**

At 1920×1080 and 1440×900, verify:

- both hero arrows are visibly centred in circles;
- services-to-system spacing no longer contains the duplicated blank gap;
- Connected Advantage and Latest Thinking headings each resolve to two lines;
- right-side copy/CTA columns remain compact and readable;
- every process title is centred over its own visible card and remains above the media/scrim/content;
- normal vertical scrolling advances Discover → Design → Build → Improve without wheel interception;
- no process number or `of 04` badge appears;
- the closing section uses the exact orange-pink gradient, dark heading, readable paragraph, and black pill CTA;
- header WhatsApp is green normally and shows a dark icon on green hover/focus;
- footer WhatsApp is orange normally and shows a dark icon on orange hover/focus;
- phone, email, CTA, and WhatsApp destinations remain correct.

- [ ] **Step 4: Verify responsive and accessibility fallbacks**

At 1024×768, 768×1024, 390×844, and with reduced motion:

- no horizontal overflow or clipped text;
- wide headings may wrap naturally below the 1200px control point;
- process titles remain centred on laptop/tablet widths and return to compact top placement below 768px;
- sticky positioning disables in the existing mobile, short-height, and reduced-motion modes;
- keyboard focus visibly reaches both WhatsApp controls;
- the floating “Chat now” control remains unchanged and green;
- the About page shows no visual or content change.

- [ ] **Step 5: Fix only scoped verification defects and rerun gates**

For each defect, first add or tighten the focused regression test, verify it fails, apply the minimal fix, then rerun:

```bash
npm run test:ui
npm run typecheck
npm run build
```

- [ ] **Step 6: Commit any verification-only corrections**

If Step 5 changed files:

```bash
git add "app/(landing-pages)/page.tsx" components/landing/HomeProcessStack.tsx components/layout/LayoutParts.tsx app/globals.css public/icons/whatsapp-orange.svg tests
git commit -m "fix: close homepage verification gaps"
```

If Step 5 changed nothing, do not create an empty commit.

---

### Task 5: Merge, push, deploy, and verify Vercel production

**Files:**
- No source edits expected.

**Interfaces:**
- Consumes: Verified branch `codex/homepage-structure-and-whatsapp-refinements`.
- Produces: Updated GitHub `main`, a successful Vercel production deployment, and verified production routes.

- [ ] **Step 1: Confirm the release branch is clean and ahead of main only by reviewed commits**

Run:

```bash
git status --short --branch
git log --oneline main..HEAD
git diff --stat main...HEAD
```

Expected: clean status and only the approved specification/implementation commits.

- [ ] **Step 2: Fast-forward local main**

Run:

```bash
git switch main
git merge --ff-only codex/homepage-structure-and-whatsapp-refinements
```

Expected: local `main` advances without a merge conflict or unrelated commit.

- [ ] **Step 3: Push GitHub main**

Run:

```bash
git push origin main
```

Expected: GitHub accepts the updated main branch.

- [ ] **Step 4: Deploy the intended project to Vercel production**

First confirm the linked project/root does not point to a duplicate project. Then run:

```bash
npx --yes vercel@50.28.0 deploy --prod --yes
```

Capture the deployment URL and wait for a successful terminal deployment state.

- [ ] **Step 5: Verify the deployed production routes**

Verify the deployment URL and the public Vercel alias:

- `/`
- `/about-us`
- `/website-development`
- `/social-media-management-plus-seo`
- `/contact-us`

On `/`, repeat the desktop process-title, gradient, spacing, and WhatsApp interaction checks. On the other routes, confirm header/footer rendering, assets, navigation, and responsive layout remain intact.

- [ ] **Step 6: Record release evidence**

Record:

- final Git commit SHA;
- GitHub push result;
- Vercel deployment URL;
- production alias status;
- automated test/typecheck/build results;
- verified viewport list;
- confirmation that Hostinger was not modified.
