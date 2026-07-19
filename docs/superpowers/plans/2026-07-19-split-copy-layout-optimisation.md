# Split-Copy Layout Optimisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the homepage’s narrow body-and-CTA split while preserving all balanced split layouts and existing responsive fallbacks across the DSE Consultancy website.

**Architecture:** Add one focused static UI contract test that audits the current split-copy inventory and asserts the approved desktop and responsive CSS contracts. Make the smallest production change in the existing global stylesheet: replace only the homepage system header’s extreme desktop ratio and gap; retain the existing 960px stacked fallback.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Grid, Node.js built-in test runner

## Global Constraints

- Do not change website copy, typography, colours, CTA styling, card layout, or section spacing.
- Preserve the About-page “Principles Behind Every DSE Experience” section as the balanced visual reference.
- At desktop widths above 960px, give the homepage body/CTA column a 420px minimum and allow it to grow.
- At widths at or below 960px, preserve the existing one-column stack and readable intro maximum width.
- Treat the two-to-three-line desktop copy arrangement as a visual target, not a forced line count.
- Preserve every unrelated existing change in the dirty working tree.
- If publishing, stage only the focused `.consultancy-home-system-copy` hunk from `app/globals.css`; leave all unrelated stylesheet changes unstaged.

---

### Task 1: Protect and correct the split-copy layout contract

**Files:**
- Create: `tests/split-copy-layout.test.mjs`
- Modify: `app/globals.css:4524-4529`

**Interfaces:**
- Consumes: the existing `.consultancy-home-system-copy`, `.consultancy-home-heading.split`, `.dse-inner-hero-grid`, and `.social-section-head` selectors plus their existing page markup.
- Produces: a regression contract in `tests/split-copy-layout.test.mjs` and the desktop CSS rule `grid-template-columns: minmax(0, 1.4fr) minmax(420px, 1fr)` with `gap: clamp(24px, 3vw, 44px)`.

- [ ] **Step 1: Write the failing regression test**

Create `tests/split-copy-layout.test.mjs` with:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [homePage, aboutPage, contactPage, socialPage, css] = await Promise.all([
  readFile("app/(landing-pages)/page.tsx", "utf8"),
  readFile("app/(website-pages)/about-us/page.tsx", "utf8"),
  readFile("app/(website-pages)/contact-us/page.tsx", "utf8"),
  readFile("app/(landing-pages)/social-media-management-plus-seo/page.tsx", "utf8"),
  readFile("app/globals.css", "utf8")
]);

function blockAt(source, markerIndex) {
  const openIndex = source.indexOf("{", markerIndex);
  assert.notEqual(openIndex, -1, "missing opening brace");

  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openIndex + 1, index);
  }

  assert.fail("missing closing brace");
}

function ruleBlock(source, selector) {
  const markerIndex = source.indexOf(selector);
  assert.notEqual(markerIndex, -1, `missing selector: ${selector}`);
  return blockAt(source, markerIndex);
}

function mediaBlock(query, requiredSelector) {
  let markerIndex = css.indexOf(query);

  while (markerIndex !== -1) {
    const block = blockAt(css, markerIndex);
    if (block.includes(requiredSelector)) return block;
    markerIndex = css.indexOf(query, markerIndex + query.length);
  }

  assert.fail(`missing media block ${query} containing ${requiredSelector}`);
}

test("site-wide split-copy audit keeps every identified layout in scope", () => {
  assert.equal((homePage.match(/consultancy-home-heading split/g) ?? []).length, 2);
  assert.match(homePage, /className="consultancy-home-system-copy"/);
  assert.match(aboutPage, /className="container dse-inner-hero-grid"/);
  assert.match(aboutPage, /className="consultancy-home-heading split compact"/);
  assert.equal((contactPage.match(/consultancy-home-heading split compact/g) ?? []).length, 2);
  assert.match(socialPage, /className="social-section-head"/);
});

test("homepage system copy uses a balanced desktop heading and body ratio", () => {
  const systemCopy = ruleBlock(css, ".consultancy-home-system-copy {");

  assert.match(
    systemCopy,
    /grid-template-columns:\s*minmax\(0,\s*1\.4fr\)\s+minmax\(420px,\s*1fr\)/
  );
  assert.match(systemCopy, /gap:\s*clamp\(24px,\s*3vw,\s*44px\)/);
  assert.doesNotMatch(systemCopy, /minmax\(0,\s*4fr\).*minmax\(210px,\s*1fr\)/s);
});

test("split-copy layouts retain the existing tablet and mobile stack", () => {
  const responsive = mediaBlock("@media (max-width: 960px)", ".consultancy-home-system-copy");

  assert.match(responsive, /\.consultancy-home-heading\.split\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(responsive, /\.consultancy-home-system-copy\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(responsive, /\.consultancy-home-system-intro\s*\{\s*max-width:\s*720px/);
});
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
node --test tests/split-copy-layout.test.mjs
```

Expected: the audit and responsive tests pass, while `homepage system copy uses a balanced desktop heading and body ratio` fails because the stylesheet still contains `minmax(0, 4fr) minmax(210px, 1fr)`.

- [ ] **Step 3: Apply the minimal production CSS change**

In `app/globals.css`, change only `.consultancy-home-system-copy` to:

```css
.consultancy-home-system-copy {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(420px, 1fr);
  align-items: end;
  gap: clamp(24px, 3vw, 44px);
}
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
node --test tests/split-copy-layout.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 5: Run the complete automated verification suite**

Run:

```bash
npm run test:ui
npm run typecheck
npm run build
```

Expected: all UI tests pass, TypeScript exits with no errors, and the Next.js production build exits successfully.

- [ ] **Step 6: Verify the real layouts in the browser**

Start the development server and inspect:

- `/` at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844.
- `/about-us` at 1440×900, 768×1024, and 390×844.
- `/contact-us` at 1440×900, 768×1024, and 390×844.
- `/social-media-management-plus-seo` at 1440×900, 768×1024, and 390×844.

Confirm that the homepage Connected Advantage body is approximately two or three lines at the supplied desktop scale, its CTA sits directly beneath it, balanced reference sections are unchanged, and stacked layouts have no overflow or clipped content.

- [ ] **Step 7: Review the exact working-tree change**

Run:

```bash
git diff -- app/globals.css tests/split-copy-layout.test.mjs
```

Expected: the production change is limited to the `.consultancy-home-system-copy` ratio and gap, plus the new focused regression test. When publishing, stage only that exact stylesheet hunk.
