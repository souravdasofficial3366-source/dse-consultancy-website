# Responsive Performance Story And Split Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the performance story animate horizontally on short 13-inch laptops, remain lightweight and vertical on touch-first phones/tablets, and restore balanced homepage split-copy alignment.

**Architecture:** Keep mode selection and scroll progress inside `WebsitePerformanceStory.tsx`, keep phase ownership inside the three demo components, and keep geometry in `app/globals.css`. Extend the existing static UI contract tests first, then make the smallest matching production edits; no new component or dependency is required.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS Grid and media queries, Node.js built-in test runner

## Global Constraints

- Horizontal mode requires at least `1200px` width, at least `620px` usable height, a hover-capable fine primary pointer, and no reduced-motion preference.
- Normal vertical document scrolling must translate the three-card track from `0` to exactly `-200%`; do not add a wheel listener, sideways dragging, `preventDefault()`, or scroll interception.
- All viewports below `1200px` and wider touch-first devices must use normal vertical flow.
- In compact vertical mode, animate only the viewport-centred card, run one finite sequence, then rest on its final phase.
- Reduced-motion mode must remain static and timer-free.
- Homepage alignment changes must be scoped to the homepage and must not alter About or Contact page split headings.
- Preserve the existing `960px` one-column homepage fallback.
- Do not change copy, claims, colours, CTA styling, card order, or unrelated animation systems.
- Preserve all unrelated user and Antigravity changes in the dirty working tree.
- Do not deploy unless the user separately authorizes publishing.

---

## File Map

- `tests/website-performance-story.test.mjs`: source-level regression contracts for breakpoint parity, scroll behavior, finite compact animation, and fallback geometry.
- `components/landing/WebsitePerformanceStory.tsx`: runtime media-query selection, active-card state, and horizontal progress.
- `components/landing/website-performance/SearchVisibilityDemo.tsx`: six-phase search demo lifecycle.
- `components/landing/website-performance/UsabilityDemo.tsx`: seven-phase usability demo lifecycle.
- `components/landing/website-performance/EnquiryPipelineDemo.tsx`: seven-phase enquiry demo lifecycle.
- `tests/split-copy-layout.test.mjs`: homepage-scoped desktop and responsive alignment contracts.
- `app/globals.css`: responsive performance-story geometry and homepage split-copy grid.

---

### Task 1: Correct laptop eligibility and tablet fallback

**Files:**
- Modify: `tests/website-performance-story.test.mjs:231-300`
- Modify: `components/landing/WebsitePerformanceStory.tsx:50-72`
- Modify: `app/globals.css:7972-8265`

**Interfaces:**
- Consumes: `horizontalMode: boolean`, `reducedMotion: boolean`, and CSS custom property `--wd-performance-progress` already owned by `WebsitePerformanceStory`.
- Produces: one shared eligibility contract, `(min-width: 1200px) and (min-height: 620px) and (hover: hover) and (pointer: fine)`, used by runtime and CSS.

- [ ] **Step 1: Replace the breakpoint regression test with the approved laptop contract**

In `tests/website-performance-story.test.mjs`, replace the existing `performance story uses exact desktop and landscape-tablet horizontal pinning` test with:

```js
test("performance story uses the same fine-pointer laptop threshold in JavaScript and CSS", () => {
  const laptopQuery = "(min-width: 1200px) and (min-height: 620px) and (hover: hover) and (pointer: fine)";
  const laptopMedia =
    "@media (min-width: 1200px) and (min-height: 620px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
  const desktop = mediaBlock(laptopMedia, ".wd-performance-track");
  const desktopStory = ruleBlock(desktop, ".wd-performance-story {");
  const desktopStack = ruleBlock(desktop, ".wd-performance-stack {");
  const desktopTrack = ruleBlock(desktop, ".wd-performance-track {");
  const desktopCard = ruleBlock(desktop, ".wd-performance-card {");

  assert.ok(story.includes(laptopQuery));
  assert.match(desktopStory, /min-height:\s*300vh/);
  assert.match(desktopStack, /position:\s*sticky/);
  assert.match(desktopStack, /top:\s*88px/);
  assert.match(desktopStack, /height:\s*calc\(100svh - 104px\)/);
  assert.match(desktopTrack, /grid-template-columns:\s*repeat\(3,\s*100%\)/);
  assert.match(desktopTrack, /-200%/);
  assert.match(desktopCard, /height:\s*100%/);
  assert.doesNotMatch(
    css,
    /@media \(min-width: 1024px\) and \(max-width: 1199px\)[^{]*orientation:\s*landscape[\s\S]*?\.wd-performance-story\s*\{\s*min-height:\s*300vh/
  );
});

test("short laptop geometry compacts content without disabling horizontal mode", () => {
  const compactLaptop = mediaBlock(
    "@media (min-width: 1200px) and (min-height: 620px) and (max-height: 759px) and (hover: hover) and (pointer: fine)",
    ".wd-performance-card-copy"
  );

  assert.match(ruleBlock(compactLaptop, ".wd-performance-card-copy {"), /padding:\s*clamp\(26px,\s*3vw,\s*40px\)/);
  assert.match(ruleBlock(compactLaptop, ".wd-performance-card-copy h3 {"), /font-size:\s*clamp\(1\.75rem,\s*2\.5vw,\s*2\.4rem\)/);
  assert.match(ruleBlock(compactLaptop, ".wd-performance-demo {"), /padding:\s*clamp\(18px,\s*3vw,\s*34px\)/);
  assert.match(ruleBlock(compactLaptop, ".wd-usability-desktop {"), /min-height:\s*220px/);
  assert.match(ruleBlock(compactLaptop, ".wd-usability-mobile {"), /min-height:\s*200px/);

  const viewportHeight = 650;
  const stickyTop = 88;
  const stackHeight = viewportHeight - 104;
  assert.ok(stickyTop + stackHeight <= viewportHeight);
});
```

In the fallback test, change the old short-height query entry from:

```js
["@media (min-width: 768px) and (max-height: 759px)", ".wd-performance-track"]
```

to:

```js
["@media (min-width: 768px) and (max-height: 619px)", ".wd-performance-track"]
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
node --test tests/website-performance-story.test.mjs
```

Expected: FAIL because the runtime and CSS still require `760px`, the landscape-tablet horizontal block still exists, and the short-laptop compact media block is absent.

- [ ] **Step 3: Update the runtime eligibility query**

In `WebsitePerformanceStory.tsx`, replace `horizontalQuery` with:

```ts
const horizontalQuery = window.matchMedia(
  "(min-width: 1200px) and (min-height: 620px) and (hover: hover) and (pointer: fine)"
);
```

Keep the existing `change` listener registration and cleanup unchanged.

- [ ] **Step 4: Replace the horizontal CSS eligibility and add the short-laptop variant**

In `app/globals.css`:

1. Change the existing desktop media query to:

```css
@media (min-width: 1200px) and (min-height: 620px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
```

2. Delete the complete horizontal block beginning with:

```css
@media (min-width: 1024px) and (max-width: 1199px) and (min-height: 760px) and (orientation: landscape) and (prefers-reduced-motion: no-preference) {
```

3. Immediately after the laptop horizontal block, add:

```css
@media (min-width: 1200px) and (min-height: 620px) and (max-height: 759px) and (hover: hover) and (pointer: fine) {
  .wd-performance-stack {
    gap: 10px;
  }

  .wd-performance-card-copy {
    padding: clamp(26px, 3vw, 40px);
  }

  .wd-performance-eyebrow {
    margin-bottom: 12px;
  }

  .wd-performance-card-copy h3 {
    font-size: clamp(1.75rem, 2.5vw, 2.4rem);
  }

  .wd-performance-card-copy p {
    margin: 14px 0 18px;
    font-size: .88rem;
    line-height: 1.5;
  }

  .wd-performance-proof {
    min-height: 36px;
    padding: 7px 12px;
  }

  .wd-performance-demo {
    padding: clamp(18px, 3vw, 34px);
  }

  .wd-usability-desktop {
    min-height: 220px;
  }

  .wd-usability-mobile {
    min-height: 200px;
  }
}
```

4. Change the generic short-height fallback from `max-height: 759px` to `max-height: 619px` so it does not override the new laptop mode.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
node --test tests/website-performance-story.test.mjs
```

Expected: all performance-story tests pass.

- [ ] **Step 6: Commit the breakpoint repair**

```bash
git add tests/website-performance-story.test.mjs components/landing/WebsitePerformanceStory.tsx app/globals.css
git commit -m "fix: enable performance story on short laptops"
```

---

### Task 2: Make compact phone and tablet demos finite and shorter

**Files:**
- Modify: `tests/website-performance-story.test.mjs:180-230`
- Modify: `components/landing/website-performance/SearchVisibilityDemo.tsx:1-30`
- Modify: `components/landing/website-performance/UsabilityDemo.tsx:1-31`
- Modify: `components/landing/website-performance/EnquiryPipelineDemo.tsx:1-31`
- Modify: `app/globals.css:8085-8190`

**Interfaces:**
- Consumes: `PerformanceDemoProps { active: boolean; compact?: boolean; reducedMotion: boolean }`.
- Produces: compact mode advances from phase `0` to `FINAL_PHASE` using cancellable `window.setTimeout`; non-compact laptop mode retains the existing repeating interval.

- [ ] **Step 1: Replace the compact timing contract with a finite-sequence contract**

In the existing `each demo has its exact finite active-only loop and static final phase` test, replace:

```js
assert.match(source, /window\.setInterval\([\s\S]*?phaseDuration/);
```

with:

```js
assert.match(source, /window\.setInterval\([\s\S]*?PHASE_DURATION/);
```

Replace the existing `compact fallback cards use a separate shorter deterministic timing policy` test with:

```js
test("compact demos run one cancellable finite sequence while laptop demos may loop", () => {
  const contracts = [
    { source: searchDemo, compactDuration: 700 },
    { source: usabilityDemo, compactDuration: 600 },
    { source: enquiryDemo, compactDuration: 650 }
  ];

  contracts.forEach(({ source, compactDuration }) => {
    assert.match(source, new RegExp(`const COMPACT_PHASE_DURATION = ${compactDuration};`));
    assert.match(source, /if \(compact\) \{/);
    assert.match(source, /window\.setTimeout\(advanceCompactPhase, COMPACT_PHASE_DURATION\)/);
    assert.match(source, /nextPhase < FINAL_PHASE/);
    assert.match(source, /window\.clearTimeout\(timeoutId\)/);
    assert.match(source, /window\.setInterval/);
    assert.match(source, /window\.clearInterval\(interval\)/);
  });
});

test("mobile demo geometry shortens the vertical story without hiding its interface", () => {
  const mobile = mediaBlock("@media (max-width: 767px)", ".wd-performance-demo");
  const narrow = mediaBlock("@media (max-width: 380px)", ".wd-performance-demo");

  assert.match(ruleBlock(mobile, ".wd-performance-demo {"), /min-height:\s*340px/);
  assert.match(ruleBlock(mobile, ".wd-usability-desktop {"), /min-height:\s*190px/);
  assert.match(ruleBlock(mobile, ".wd-usability-mobile {"), /min-height:\s*170px/);
  assert.match(ruleBlock(narrow, ".wd-performance-demo {"), /min-height:\s*320px/);
});
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
node --test tests/website-performance-story.test.mjs
```

Expected: FAIL because compact demos still loop with `setInterval` and the mobile demo minimum remains `400px`.

- [ ] **Step 3: Implement the finite compact lifecycle in all three demo components**

In each demo component, preserve the existing inactive/reduced-motion guard, then replace the interval-only portion of the effect with this exact structure:

```ts
setPhase(0);

if (compact) {
  let nextPhase = 1;
  let timeoutId = 0;

  const advanceCompactPhase = () => {
    setPhase(nextPhase);
    if (nextPhase < FINAL_PHASE) {
      nextPhase += 1;
      timeoutId = window.setTimeout(advanceCompactPhase, COMPACT_PHASE_DURATION);
    }
  };

  timeoutId = window.setTimeout(advanceCompactPhase, COMPACT_PHASE_DURATION);
  return () => window.clearTimeout(timeoutId);
}

const interval = window.setInterval(
  () => setPhase((current) => (current + 1) % PHASE_COUNT),
  PHASE_DURATION
);

return () => window.clearInterval(interval);
```

Keep each component's existing `PHASE_COUNT`, `FINAL_PHASE`, `PHASE_DURATION`, and `COMPACT_PHASE_DURATION` values and keep the dependency list `[active, compact, reducedMotion]`.

- [ ] **Step 4: Compact the mobile CSS geometry**

Inside `@media (max-width: 767px)`, use:

```css
.wd-performance-track {
  gap: 18px;
}

.wd-performance-demo {
  min-height: 340px;
  border-top: 1px solid rgba(255, 255, 255, .08);
  border-left: 0;
  padding: clamp(18px, 6vw, 28px);
  transform: none;
}

.wd-usability-desktop {
  min-height: 190px;
}

.wd-usability-mobile {
  min-height: 170px;
}
```

Inside `@media (max-width: 380px)`, change the demo minimum to:

```css
.wd-performance-demo {
  min-height: 320px;
  padding: 18px;
}
```

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
node --test tests/website-performance-story.test.mjs
```

Expected: all performance-story tests pass.

- [ ] **Step 6: Commit the compact lifecycle repair**

```bash
git add tests/website-performance-story.test.mjs components/landing/website-performance/SearchVisibilityDemo.tsx components/landing/website-performance/UsabilityDemo.tsx components/landing/website-performance/EnquiryPipelineDemo.tsx app/globals.css
git commit -m "fix: lighten performance demos on touch devices"
```

---

### Task 3: Restore balanced homepage split-copy alignment

**Files:**
- Modify: `tests/split-copy-layout.test.mjs:35-64`
- Modify: `app/globals.css:4373-4385,5928-5945`

**Interfaces:**
- Consumes: `.consultancy-home`, `.consultancy-home-heading.split`, `.consultancy-home-system-copy`, and the existing `@media (max-width: 960px)` stack.
- Produces: homepage-only desktop grid `minmax(0, 1.4fr) minmax(420px, 1fr)` with `clamp(24px, 3vw, 44px)` gap.

- [ ] **Step 1: Add a failing homepage-scoping regression test**

Replace the first two tests in `tests/split-copy-layout.test.mjs` with:

```js
test("homepage split-copy audit keeps both shared headings and the system section in scope", () => {
  assert.equal((homePage.match(/consultancy-home-heading split/g) ?? []).length, 2);
  assert.match(homePage, /className="consultancy-home-system-copy"/);
});

test("homepage split headings and system copy use the same balanced desktop family", () => {
  const homepageSplit = ruleBlock(css, ".consultancy-home .consultancy-home-heading.split {");
  const systemCopy = ruleBlock(css, ".consultancy-home-system-copy {");
  const balancedColumns = /grid-template-columns:\s*minmax\(0,\s*1\.4fr\)\s+minmax\(420px,\s*1fr\)/;

  assert.match(homepageSplit, balancedColumns);
  assert.match(homepageSplit, /gap:\s*clamp\(24px,\s*3vw,\s*44px\)/);
  assert.match(systemCopy, balancedColumns);
  assert.match(systemCopy, /gap:\s*clamp\(24px,\s*3vw,\s*44px\)/);
});
```

Extend the responsive test with:

```js
assert.match(
  responsive,
  /\.consultancy-home \.consultancy-home-heading\.split\s*\{\s*grid-template-columns:\s*1fr/
);
```

- [ ] **Step 2: Run the split-copy test and verify the intended failure**

Run:

```bash
node --test tests/split-copy-layout.test.mjs
```

Expected: FAIL because no homepage-scoped balanced override exists.

- [ ] **Step 3: Add the homepage-scoped desktop and responsive rules**

Immediately after the base `.consultancy-home-heading.split` rule, add:

```css
.consultancy-home .consultancy-home-heading.split {
  grid-template-columns: minmax(0, 1.4fr) minmax(420px, 1fr);
  gap: clamp(24px, 3vw, 44px);
}
```

Inside the existing `@media (max-width: 960px)` block, add the matching-specificity fallback:

```css
.consultancy-home .consultancy-home-heading.split {
  grid-template-columns: 1fr;
  gap: 22px;
}
```

Do not change the unscoped base rule or the existing `.consultancy-home-system-copy` rule.

- [ ] **Step 4: Run the split-copy test and verify it passes**

Run:

```bash
node --test tests/split-copy-layout.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 5: Commit the alignment repair**

```bash
git add tests/split-copy-layout.test.mjs app/globals.css
git commit -m "fix: restore homepage split-copy balance"
```

---

### Task 4: Run complete automated and browser verification

**Files:**
- Verify only: all files changed in Tasks 1-3
- Store artifacts: `work/verification/responsive-performance-story/`

**Interfaces:**
- Consumes: the completed laptop, compact-demo, and split-alignment changes.
- Produces: fresh automated results and viewport evidence proving the requested behavior.

- [ ] **Step 1: Run the complete automated verification suite**

Run:

```bash
npm run test:ui
npm run typecheck
npm run build
git diff --check
```

Expected: all UI tests pass, TypeScript exits successfully, the Next.js production build exits successfully, and `git diff --check` prints no errors.

- [ ] **Step 2: Start the local development server and verify the initial page**

Run:

```bash
npm run dev
```

Use browser verification to confirm `/website-development` loads meaningful content, has no Next.js error overlay, and reports no console errors before responsive checks continue.

- [ ] **Step 3: Verify mode selection and geometry at every required viewport**

Inspect `/website-development#results` at:

```text
390x844   Android phone          vertical, finite centred-card animation
360x800   narrow Android phone   vertical, no clipped demo content
834x1194  iPad portrait          vertical
1024x768  iPad landscape         vertical
1366x650  13-inch Windows        horizontal, compact short-laptop geometry
1280x720  short laptop           horizontal, compact short-laptop geometry
1440x900  standard laptop        horizontal, standard geometry
1920x1080 desktop                horizontal, standard geometry
```

At each viewport, record `data-horizontal`, computed stack position, track columns, body scroll width versus viewport width, active-card index, framework overlay status, and console errors.

- [ ] **Step 4: Verify complete interaction sequences**

For `1366x650`, `1280x720`, and `1440x900`, scroll from the performance section's start to end and confirm:

```text
progress 0.00 -> card 01 active
progress ~0.50 -> card 02 active
progress 1.00 -> card 03 active
track translation 0% -> -200%
```

For `390x844`, `834x1194`, and `1024x768`, centre each vertical card and confirm only that card has `data-active="true"`; wait one full compact sequence and confirm its demo rests on `FINAL_PHASE` rather than returning to phase `0`.

- [ ] **Step 5: Verify homepage split alignment**

Inspect `/` at `1440x900`, `1280x720`, `1024x768`, and `390x844`.

Confirm:

```text
Services right paragraph width is at least 420px on desktop.
Services and Connected Advantage right columns begin at the same balanced horizontal family.
Latest Thinking uses the same homepage split rule.
At 1024px and below, copy remains readable with no overflow.
At 960px and below, split headings stack to one column.
```

- [ ] **Step 6: Review the exact final diff and working-tree boundaries**

Run:

```bash
git diff HEAD~3 -- tests/website-performance-story.test.mjs tests/split-copy-layout.test.mjs components/landing/WebsitePerformanceStory.tsx components/landing/website-performance/SearchVisibilityDemo.tsx components/landing/website-performance/UsabilityDemo.tsx components/landing/website-performance/EnquiryPipelineDemo.tsx app/globals.css
git status --short
```

Expected: the implementation diff is limited to the approved tests, responsive story code, demo lifecycle code, and scoped CSS. Unrelated pre-existing dirty files remain present and untouched.

- [ ] **Step 7: Commit verification artifacts only if they are suitable for repository history**

If the project convention keeps `work/verification` ignored or untracked, do not stage it. Otherwise:

```bash
git add work/verification/responsive-performance-story
git commit -m "test: record responsive performance story verification"
```

Do not commit unrelated files.
