# About Timeline Uniform Titles And Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all eight About timeline titles occupy exactly two desktop lines and restore the internal SVG motion that is present on Hostinger but missing from the committed Vercel source.

**Architecture:** Keep the existing `AboutVisionStory` scroll controller and SVG templates unchanged. Make title wrapping deterministic by storing every heading as a two-item tuple, then restore the missing visual motion as About-timeline-scoped CSS that runs only beneath `.dse-vision-story__card.active`; inactive cards stay quiet and the existing reduced-motion fallback exposes a complete static state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, global CSS, inline SVG templates, Node test runner, Vercel CLI, in-app browser verification.

## Global Constraints

- Preserve every approved title word and punctuation mark.
- Desktop and compact desktop must show exactly two intentional lines for every timeline title.
- Tablet and mobile may wrap naturally and must never clip or create horizontal overflow.
- Do not modify the About hero, story section, FAQ, gradient CTA, header, footer, contact controls, timeline descriptions, or page order.
- Do not alter the existing centre-of-viewport scroll controller, progress rail, active dot, or visual-stack state model.
- Every moving SVG selector must be scoped beneath `.dse-vision-story__card.active`.
- Hidden and inactive timeline cards must not run continuous internal animations.
- `prefers-reduced-motion: reduce` must disable motion while exposing the meaningful final SVG state.
- Hostinger remains unchanged during implementation and Vercel review.

## File Map

- Modify `components/about/AboutVisionStory.tsx`
  - Owns the scroll-state controller and title rendering.
- Create `components/about/aboutVisionChapters.ts`
  - Owns the eight chapter records and explicit title pairs as importable data.
- Modify `app/globals.css`
  - Owns the About timeline typography, SVG initial states, active-card animation selectors, keyframes, responsive rules, and reduced-motion fallback.
- Create `tests/about-timeline-uniform-animation.test.mjs`
  - Proves the exact title pairs, active-card scoping, animation coverage, mobile wrapping, and reduced-motion contract.
- Reference `components/about/aboutVisionVisuals.ts`
  - Provides the existing SVG class names; its markup does not change.
- Reference `docs/superpowers/specs/2026-07-31-about-timeline-uniform-titles-and-animation-design.md`
  - Defines the approved line pairs, scope, and success criteria.

---

### Task 1: Make Every Timeline Title An Explicit Two-Line Tuple

**Files:**
- Create: `components/about/aboutVisionChapters.ts`
- Modify: `components/about/AboutVisionStory.tsx:3-65`
- Modify: `components/about/AboutVisionStory.tsx:215-225`
- Create: `tests/about-timeline-uniform-animation.test.mjs`

**Interfaces:**
- Consumes: the existing chapter content and `.dse-vision-story__heading-line` renderer.
- Produces: an importable `chapters` collection containing eight `readonly [string, string]` heading tuples and two rendered heading-line spans per chapter.

- [ ] **Step 1: Write the failing title-pair regression test**

Create `tests/about-timeline-uniform-animation.test.mjs` with:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { chapters } from "../components/about/aboutVisionChapters.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const approvedHeadingPairs = [
  ["Make Digital Work", "Easier To Trust"],
  ["Understand The Problem", "Before Choosing The Tool"],
  ["Let Useful Data", "Guide The Direction"],
  ["Test Feasibility", "And Make The Cost Visible"],
  ["Prepare For Roadblocks", "Before They Slow Growth."],
  ["Automate What Does Not", "Need Constant Attention"],
  ["Move Every Workstream", "Forward As One System"],
  ["Build A System The Client", "Can Own And Improve"]
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("all eight About timeline titles use the approved two-line desktop pairs", async () => {
  assert.equal(chapters.length, 8);
  assert.deepEqual(chapters.map((chapter) => [...chapter.heading]), approvedHeadingPairs);
  assert.ok(chapters.every((chapter) => chapter.heading.length === 2));
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` because the importable chapter-data module does not exist yet.

- [ ] **Step 3: Replace all eight headings with the approved tuples**

Create `components/about/aboutVisionChapters.ts`, move the existing chapter
records into it without changing their order or non-heading fields, export the
collection, and make the heading fields exactly:

```ts
heading: ["Make Digital Work", "Easier To Trust"] as const
heading: ["Understand The Problem", "Before Choosing The Tool"] as const
heading: ["Let Useful Data", "Guide The Direction"] as const
heading: ["Test Feasibility", "And Make The Cost Visible"] as const
heading: ["Prepare For Roadblocks", "Before They Slow Growth."] as const
heading: ["Automate What Does Not", "Need Constant Attention"] as const
heading: ["Move Every Workstream", "Forward As One System"] as const
heading: ["Build A System The Client", "Can Own And Improve"] as const
```

Do not change the descriptions, tags, eyebrows, numbers, or order.

In `components/about/AboutVisionStory.tsx`, remove the local chapter collection
and import the exported data:

```ts
import { chapters } from "./aboutVisionChapters";
```

- [ ] **Step 4: Simplify the heading renderer to the now-uniform tuple contract**

Replace the conditional body of the existing `<h3>` with:

```tsx
<h3>
  {chapter.heading.map((line) => (
    <span className="dse-vision-story__heading-line" key={line}>
      {line}
    </span>
  ))}
</h3>
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: PASS for the title-pair test.

- [ ] **Step 6: Commit the deterministic title structure**

```bash
git add components/about/AboutVisionStory.tsx components/about/aboutVisionChapters.ts tests/about-timeline-uniform-animation.test.mjs
git commit -m "feat: standardize About timeline titles"
```

---

### Task 2: Restore The Missing Active-Card SVG Animation Layer

**Files:**
- Modify: `tests/about-timeline-uniform-animation.test.mjs`
- Modify: `app/globals.css:9261-9277`
- Modify: `app/globals.css:9587-9615`
- Reference: `components/about/aboutVisionVisuals.ts`
- Reference source: `https://dseconsultancy.com/_next/static/chunks/1g6b2-8bxtj20.css`

**Interfaces:**
- Consumes: SVG classes already emitted by `visualTemplates`, the existing `.dse-vision-story__card.active` state, and the reduced-motion media query.
- Produces: initial visual states, active-card-only animation assignments, the required keyframes, and a complete static reduced-motion fallback.

- [ ] **Step 1: Extend the regression test with the active-motion contract**

Append to `tests/about-timeline-uniform-animation.test.mjs`:

```js
const activeMotionClasses = [
  "phase-a",
  "phase-b",
  "phase-a-pulse",
  "phase-a-x-1",
  "phase-a-x-2",
  "phase-b-lines",
  "phase-b-pulse",
  "phase-b-center",
  "anim-radar-sweep",
  "anim-spotlight-1",
  "anim-spotlight-2",
  "anim-spotlight-3",
  "anim-spotlight-4",
  "anim-ripple-1",
  "anim-ripple-2",
  "anim-ripple-3",
  "anim-ripple-4",
  "anim-path-draw",
  "anim-evidence-flow",
  "anim-label-fade",
  "anim-needle",
  "anim-check-1",
  "anim-check-2",
  "anim-check-3",
  "anim-layer-1",
  "anim-layer-2",
  "anim-layer-3",
  "anim-donut-fill",
  "anim-bridge-pillar-1",
  "anim-bridge-pillar-2",
  "anim-bridge-pillar-3",
  "anim-bridge-pillar-4",
  "anim-bridge-deck",
  "anim-bridge-user",
  "anim-roadblock-obstacle",
  "anim-noti-1",
  "anim-noti-2",
  "anim-noti-3",
  "anim-noti-4",
  "anim-noti-5",
  "anim-noti-6",
  "arch-left",
  "arch-right",
  "keystone",
  "anim-laser-flow",
  "anim-backend-engine",
  "anim-engine-flow",
  "anim-owner-cockpit",
  "anim-cockpit-owner",
  "anim-owner-control",
  "anim-simple-guide"
];

const requiredKeyframes = [
  "phase-a-fade",
  "phase-b-fade",
  "stall-pulse",
  "draw-x-1",
  "draw-x-2",
  "sector-lines-seq",
  "flow-both-ways",
  "center-dse-pop",
  "radar-sweep",
  "spotlight-1",
  "spotlight-2",
  "spotlight-3",
  "spotlight-4",
  "ripple-wave",
  "path-draw",
  "evidence-flow",
  "label-fade",
  "needle-loop",
  "check-draw-loop-1",
  "check-draw-loop-2",
  "check-draw-loop-3",
  "layer-rise-loop-1",
  "layer-rise-loop-2",
  "layer-rise-loop-3",
  "donut-pop-loop",
  "pillar-seq-1",
  "pillar-seq-2",
  "pillar-seq-3",
  "pillar-seq-4",
  "deck-seq",
  "user-seq",
  "roadblock-fade",
  "noti-1-seq",
  "noti-2-seq",
  "noti-3-seq",
  "noti-4-seq",
  "noti-5-seq",
  "noti-6-seq",
  "arch-left-seq",
  "arch-right-seq",
  "keystone-seq",
  "laser-seq",
  "backend-engine-cockpit",
  "cockpit-engine-flow",
  "owner-cockpit-rise",
  "cockpit-owner-enter",
  "cockpit-controls-reveal"
];

test("every About SVG motion class runs only under the active timeline card", async () => {
  const css = await read("app/globals.css");

  for (const className of activeMotionClasses) {
    assert.match(
      css,
      new RegExp(
        `\\.dse-vision-story__card\\.active\\s+\\.${escapeRegExp(className)}(?:\\s*,|\\s*\\{)`
      ),
      `${className} must have an active-card-scoped motion rule`
    );
  }

  for (const keyframe of requiredKeyframes) {
    assert.match(css, new RegExp(`@keyframes\\s+${escapeRegExp(keyframe)}\\b`));
  }
});

test("About SVG motion has a complete reduced-motion final state", async () => {
  const css = await read("app/globals.css");
  const reducedMotion = css.match(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g
  )?.join("\n") ?? "";

  assert.match(reducedMotion, /\.dse-vision-story__canvas \[class\*="anim-"\]/);
  assert.match(reducedMotion, /animation:\s*none\s*!important/);
  assert.match(reducedMotion, /stroke-dashoffset:\s*0\s*!important/);
  assert.match(reducedMotion, /\.phase-a\s*\{[^}]*display:\s*none/);
  assert.match(reducedMotion, /\.phase-b\s*\{[^}]*opacity:\s*1\s*!important/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: the title test passes; the animation tests FAIL because the Vercel stylesheet has no active-card SVG assignments or associated keyframes.

- [ ] **Step 3: Add the SVG initial-state rules**

Immediately after `.dse-vision-story__canvas svg` in `app/globals.css`, add the bounded initial states used by the current Hostinger timeline. Include the existing current-template classes only:

```css
.dse-vision-story .phase-a { opacity: 1; }
.dse-vision-story .phase-b { opacity: 0; }
.dse-vision-story .phase-a-pulse { stroke-dasharray: 10 150; stroke-dashoffset: 200px; }
.dse-vision-story .phase-a-x-1,
.dse-vision-story .phase-a-x-2 { stroke-dasharray: 120; stroke-dashoffset: 120px; }

.dse-vision-story .anim-spotlight-1,
.dse-vision-story .anim-spotlight-2,
.dse-vision-story .anim-spotlight-3,
.dse-vision-story .anim-spotlight-4 {
  opacity: .3;
  fill: none;
  stroke: rgba(254, 104, 7, .3);
}

.dse-vision-story .anim-ripple-1,
.dse-vision-story .anim-ripple-2,
.dse-vision-story .anim-ripple-3,
.dse-vision-story .anim-ripple-4 {
  opacity: 0;
  transform: scale(1);
}

.dse-vision-story .anim-radar-sweep { transform-origin: 200px 195px; }
.dse-vision-story .anim-path-draw { stroke-dasharray: 400; stroke-dashoffset: 400px; }
.dse-vision-story .anim-evidence-flow { stroke-dasharray: 15 30; stroke-dashoffset: 400px; }
.dse-vision-story .anim-label-fade { opacity: 0; }
.dse-vision-story .anim-needle {
  transform-origin: 65px 130px;
  transform: rotate(-90deg);
}
.dse-vision-story .anim-check-1,
.dse-vision-story .anim-check-2,
.dse-vision-story .anim-check-3 { stroke-dasharray: 12; stroke-dashoffset: 12px; }
.dse-vision-story .anim-layer-1,
.dse-vision-story .anim-layer-2,
.dse-vision-story .anim-layer-3 { opacity: 0; transform: translateY(40px); }
.dse-vision-story .anim-donut-fill {
  opacity: 0;
  transform: scale(0);
  transform-origin: 0 0;
}
```

The remaining current SVG classes begin from the values already present in
their SVG markup; they require active animation assignments and keyframes but no
additional global initial-state override.

- [ ] **Step 4: Add active-card-only animation assignments**

Add the current Hostinger timings beneath `.dse-vision-story__card.active`, including these exact assignments:

```css
.dse-vision-story__card.active .phase-a { animation: phase-a-fade 8s linear infinite; }
.dse-vision-story__card.active .phase-b { animation: phase-b-fade 8s linear infinite; }
.dse-vision-story__card.active .anim-radar-sweep { animation: radar-sweep 6s linear infinite; }
.dse-vision-story__card.active .anim-spotlight-1 { animation: spotlight-1 6s linear infinite; }
.dse-vision-story__card.active .anim-spotlight-2 { animation: spotlight-2 6s linear infinite; }
.dse-vision-story__card.active .anim-spotlight-3 { animation: spotlight-3 6s linear infinite; }
.dse-vision-story__card.active .anim-spotlight-4 { animation: spotlight-4 6s linear infinite; }
.dse-vision-story__card.active .anim-ripple-1 { animation: ripple-wave 6s linear .75s infinite; }
.dse-vision-story__card.active .anim-ripple-2 { animation: ripple-wave 6s linear 5.25s infinite; }
.dse-vision-story__card.active .anim-ripple-3 { animation: ripple-wave 6s linear 3.75s infinite; }
.dse-vision-story__card.active .anim-ripple-4 { animation: ripple-wave 6s linear 2.25s infinite; }
.dse-vision-story__card.active .anim-path-draw {
  animation: path-draw 2.5s cubic-bezier(.25, 1, .5, 1) forwards;
}
.dse-vision-story__card.active .anim-evidence-flow {
  animation: evidence-flow 3.5s linear infinite;
}
.dse-vision-story__card.active .anim-label-fade {
  animation: label-fade 1.2s ease-out .8s forwards;
}
.dse-vision-story__card.active .anim-needle {
  transform-origin: 0 0;
  animation: needle-loop 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-check-1 {
  animation: check-draw-loop-1 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-check-2 {
  animation: check-draw-loop-2 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-check-3 {
  animation: check-draw-loop-3 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-layer-1 {
  animation: layer-rise-loop-1 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-layer-2 {
  animation: layer-rise-loop-2 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-layer-3 {
  animation: layer-rise-loop-3 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-donut-fill {
  animation: donut-pop-loop 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-bridge-pillar-1 {
  animation: pillar-seq-1 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-bridge-pillar-2 {
  animation: pillar-seq-2 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-bridge-pillar-3 {
  animation: pillar-seq-3 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-bridge-pillar-4 {
  animation: pillar-seq-4 8s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-bridge-deck {
  animation: deck-seq 8s linear infinite;
}
.dse-vision-story__card.active .anim-bridge-user {
  animation: user-seq 8s ease-in-out infinite;
}
.dse-vision-story__card.active .anim-roadblock-obstacle {
  animation: roadblock-fade 8s ease-in-out infinite;
}
.dse-vision-story__card.active .anim-noti-1 {
  animation: noti-1-seq 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-noti-2 {
  animation: noti-2-seq 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-noti-3 {
  animation: noti-3-seq 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-noti-4 {
  animation: noti-4-seq 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-noti-5 {
  animation: noti-5-seq 8s ease-out infinite;
}
.dse-vision-story__card.active .anim-noti-6 {
  animation: noti-6-seq 8s ease-out infinite;
}
.dse-vision-story__card.active .arch-left {
  transform-origin: 45px 15px;
  animation: arch-left-seq 8s ease-in-out infinite;
}
.dse-vision-story__card.active .arch-right {
  transform-origin: 45px 15px;
  animation: arch-right-seq 8s ease-in-out infinite;
}
.dse-vision-story__card.active .keystone {
  transform-origin: 45px 15px;
  animation: keystone-seq 8s ease-in-out infinite;
}
.dse-vision-story__card.active .anim-laser-flow {
  animation: laser-seq 8s linear infinite;
}
.dse-vision-story__card.active .anim-backend-engine {
  animation: backend-engine-cockpit 10s ease-in-out infinite;
}
.dse-vision-story__card.active .anim-engine-flow {
  animation: cockpit-engine-flow 1.6s linear infinite;
}
.dse-vision-story__card.active .anim-owner-cockpit {
  animation: owner-cockpit-rise 10s cubic-bezier(.25, 1, .5, 1) infinite;
}
.dse-vision-story__card.active .anim-cockpit-owner {
  animation: cockpit-owner-enter 10s ease-in-out infinite;
}
.dse-vision-story__card.active .anim-owner-control,
.dse-vision-story__card.active .anim-simple-guide {
  animation: cockpit-controls-reveal 10s ease-in-out infinite;
}
```

Do not create unscoped `.anim-* { animation: ... }` assignments.

- [ ] **Step 5: Add every required keyframe with the Hostinger values**

Copy the exact keyframe bodies named in `requiredKeyframes` from the referenced public Hostinger stylesheet into the About timeline section of `app/globals.css`.

Keep the cycle semantics:

- chapter 01 alternates the failing and DSE partner-network phases;
- chapter 02 spotlights four business questions in sequence while the radar rotates;
- chapter 03 draws the evidence path and loops the signal flow;
- chapter 04 reveals checks and cost layers in order;
- chapter 05 builds pillars, deck, and user crossing in order;
- chapter 06 reveals six notifications in sequence;
- chapter 07 assembles the connected structure before running the laser flow;
- chapter 08 brings up the backend engine, owner cockpit, and simplified controls.

Do not copy Hostinger layout selectors, title typography, header/footer rules, or unused legacy animation classes.

- [ ] **Step 6: Strengthen the existing reduced-motion block**

Inside the existing `@media (prefers-reduced-motion: reduce)` block, retain the current transition reset and add:

```css
.dse-vision-story .dse-vision-story__canvas [class*="anim-"],
.dse-vision-story .dse-vision-story__canvas [class*="phase-"],
.dse-vision-story .dse-vision-story__canvas .arch-left,
.dse-vision-story .dse-vision-story__canvas .arch-right,
.dse-vision-story .dse-vision-story__canvas .keystone {
  opacity: 1 !important;
  visibility: visible !important;
  stroke-dashoffset: 0 !important;
  animation: none !important;
}

.dse-vision-story .dse-vision-story__canvas .phase-a {
  display: none;
}

.dse-vision-story .dse-vision-story__canvas .phase-b {
  opacity: 1 !important;
}
```

- [ ] **Step 7: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: all title, active-motion, keyframe, and reduced-motion tests PASS.

- [ ] **Step 8: Commit the restored animation layer**

```bash
git add app/globals.css tests/about-timeline-uniform-animation.test.mjs
git commit -m "fix: restore About timeline visual motion"
```

---

### Task 3: Lock The Two-Line Desktop Typography And Responsive Fallback

**Files:**
- Modify: `tests/about-timeline-uniform-animation.test.mjs`
- Modify: `app/globals.css:9338-9353`
- Modify: `app/globals.css:9433-9505`

**Interfaces:**
- Consumes: the eight heading-line spans from Task 1.
- Produces: a bounded desktop font constraint, non-wrapping desktop line spans, and normal tablet/mobile wrapping.

- [ ] **Step 1: Add the failing responsive typography test**

Append:

```js
test("About timeline title pairs stay two lines on desktop and wrap safely on mobile", async () => {
  const css = await read("app/globals.css");

  assert.match(
    css,
    /\.dse-vision-story__chapter-copy h3\s*\{[^}]*font-size:\s*clamp\(3rem,\s*3\.7vw,\s*3\.5rem\)/
  );
  assert.match(
    css,
    /\.dse-vision-story__heading-line\s*\{[^}]*display:\s*block[^}]*white-space:\s*nowrap/
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*900px\)[\s\S]*?\.dse-vision-story__heading-line\s*\{[^}]*white-space:\s*normal/
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: FAIL because the desktop heading still uses `clamp(3.05rem, 4.7vw, 4.65rem)`.

- [ ] **Step 3: Apply the bounded desktop heading size**

Change only the font-size declaration in `.dse-vision-story__chapter-copy h3`:

```css
font-size: clamp(3rem, 3.7vw, 3.5rem);
```

Retain its weight, letter spacing, line height, margins, colour, and z-index.

Retain:

```css
.dse-vision-story__heading-line {
  display: block;
  white-space: nowrap;
}
```

Retain the existing `max-width: 900px` and `max-width: 520px` typography rules, including:

```css
.dse-vision-story__heading-line {
  white-space: normal;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 5: Start the local site and verify desktop geometry**

Run:

```bash
npm run dev
```

In the browser at `http://localhost:3000/about-us`, use a 1440 × 900 viewport and verify:

- eight chapter headings exist;
- each `h3` height is approximately two computed line heights;
- each `.dse-vision-story__heading-line` has `scrollWidth <= clientWidth`;
- chapter 07 and chapter 08 do not clip;
- the left visual width and sticky position are unchanged.

If one line exceeds its container, reduce only the final `3.5rem` maximum in
`.dse-vision-story__chapter-copy h3` by `0.1rem`, update the test to the exact
verified value, and repeat until all eight lines fit. Do not change the timeline
grid ratio.

- [ ] **Step 6: Verify responsive geometry**

Use browser viewport checks at:

- 1024 × 768;
- 768 × 1024;
- 390 × 844.

At each width verify:

- no title or visual creates horizontal overflow;
- all eight chapters remain reachable;
- at `900px` and below the desktop sticky visual is hidden and each chapter owns its mobile visual;
- heading-line spans may wrap naturally;
- the FAQ follows chapter 08 without overlap.

- [ ] **Step 7: Commit the verified typography**

```bash
git add app/globals.css tests/about-timeline-uniform-animation.test.mjs
git commit -m "style: align About timeline title rhythm"
```

---

### Task 4: Full Verification, GitHub Merge, And Vercel Publication

**Files:**
- Verify: `components/about/AboutVisionStory.tsx`
- Verify: `components/about/aboutVisionVisuals.ts`
- Verify: `app/globals.css`
- Verify: `tests/about-timeline-uniform-animation.test.mjs`
- Verify: `.vercel/project.json`

**Interfaces:**
- Consumes: the verified branch from Tasks 1–3.
- Produces: a clean `main` commit on GitHub and a Ready Vercel production deployment with live route verification.

- [ ] **Step 1: Run the focused regression test**

```bash
node --test tests/about-timeline-uniform-animation.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 2: Run the complete UI suite**

```bash
npm run test:ui
```

Expected: all tests PASS with zero failures.

- [ ] **Step 3: Run TypeScript checking**

```bash
npm run typecheck
```

Expected: exit code `0`.

- [ ] **Step 4: Run the production build**

```bash
npm run build
```

Expected: successful Next.js build with `/about-us` generated and the current route set intact.

- [ ] **Step 5: Check the final diff**

```bash
git diff --check
git status --short
git diff main...HEAD --stat
```

Expected:

- no whitespace errors;
- only the approved spec, plan, timeline component, timeline CSS, and focused test are changed;
- no Hostinger files, shared header/footer files, or unrelated page files appear.

- [ ] **Step 6: Verify the complete local animation story**

At desktop width, scroll from chapter 01 through chapter 08 and verify after each activation:

- the corresponding article receives `.active`;
- the matching stack position receives `.active`;
- the rail progresses;
- the active dot glows;
- at least one expected internal SVG element reports an `animation-name` other than `none`;
- the visible SVG matches the current chapter;
- only the active card reports running internal motion.

Verify reduced motion by checking the media-query contract in the focused test and confirming the static final phase remains visible without clipping.

- [ ] **Step 7: Complete the branch using the approved local-merge workflow**

Use `superpowers:finishing-a-development-branch`.

The already-approved integration choice for this DSE workflow is:

```text
1. Merge back to main locally
```

Before merging, fetch `origin/main` and confirm it has not diverged. Use a
fast-forward merge when possible, then rerun `npm run test:ui` on `main`.

- [ ] **Step 8: Push the exact merged commit to GitHub**

```bash
git push origin main
```

Confirm `HEAD` and `origin/main` resolve to the same commit.

- [ ] **Step 9: Confirm the linked Vercel target**

Read `.vercel/project.json` and confirm:

```json
{
  "projectName": "dse-consultancy-website"
}
```

- [ ] **Step 10: Deploy production and wait for Ready**

```bash
DSE_DEPLOYMENT_URL="$(npx --yes vercel@50.28.0 deploy --prod --yes)"
npx --yes vercel@50.28.0 inspect "$DSE_DEPLOYMENT_URL" --wait
```

Expected:

- target: `production`;
- status: `Ready`;
- stable alias: `https://dse-consultancy-website.vercel.app`.

- [ ] **Step 11: Verify the live stable About route**

Open:

```text
https://dse-consultancy-website.vercel.app/about-us
```

Confirm:

- all eight desktop headings occupy two lines;
- the scroll controller advances from chapter 01 to chapter 08;
- active SVG elements report real animation names;
- hidden cards do not run internal motion;
- chapter 05 remains `Prepare For Roadblocks` / `Before They Slow Growth.`;
- the existing FAQ, gradient CTA, footer, header, and contact controls remain unchanged;
- no Hostinger Team Model or duplicate CTA appears.

- [ ] **Step 12: Report the release evidence**

Report:

- GitHub commit;
- stable and unique Vercel URLs;
- focused and full test counts;
- typecheck and build result;
- measured desktop line count;
- live active-card animation evidence;
- explicit confirmation that Hostinger was not modified.
