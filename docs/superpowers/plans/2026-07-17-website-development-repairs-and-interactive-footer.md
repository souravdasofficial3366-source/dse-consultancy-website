# Website Development Repairs and Interactive Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the Website Development page regressions and introduce a responsive, accessible, mouse-reactive DSE footer across the site.

**Architecture:** Keep service-page fixes scoped to `.website-development-page`. Introduce one focused client component for the shared footer interaction and compose the existing semantic footer content inside it. Add dependency-free source regression tests with Node’s built-in test runner, then verify the real Next.js routes in the browser.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, Node.js built-in test runner.

## Global Constraints

- Do not change Website Development copy, pricing values, or header navigation.
- Do not add the final walkthrough video; provide a stable 16:10 placeholder.
- Preserve every existing footer link, contact field, logo, social action, and legal line.
- Use only DSE orange, amber, coral, pink, black, white, and translucent variants in the new interaction.
- Do not add animation or graphics dependencies.
- Honor `prefers-reduced-motion` and keep decorative pixels hidden from assistive technology.

---

### Task 1: Add UI Regression Checks

**Files:**
- Create: `tests/website-development-repairs.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: source files under `app/`, `components/`, and `app/globals.css`.
- Produces: `npm run test:ui`, a dependency-free regression command.

- [ ] **Step 1: Write the failing tests**

Create tests that read the page, footer component, and stylesheet and assert:

```js
test("comparison accent is owned by the first cell", () => {
  assert.match(css, /comparison tbody tr > td:first-child::before/);
  assert.doesNotMatch(css, /comparison tbody tr::before/);
});

test("results use a stable video placeholder and looping score animation", () => {
  assert.match(page, /className="wd-video-placeholder"/);
  assert.doesNotMatch(page, /<InteractiveWebsiteJourney \/>/);
  assert.match(css, /animation:\s*wd-score-loop[^;]*infinite/);
});

test("featured badge can extend beyond the pricing card", () => {
  assert.match(css, /website-development-page \.price-card[\s\S]*overflow:\s*visible/);
});

test("support icon and interactive footer are present", () => {
  assert.match(page, />edit_note<\/span>/);
  assert.match(layout, /<InteractiveFooter>/);
  assert.match(footer, /aria-hidden="true"/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/website-development-repairs.test.mjs`

Expected: failures for the missing first-cell accent, video placeholder, looping animation, visible pricing overflow, `edit_note`, and `InteractiveFooter`.

- [ ] **Step 3: Add the test script**

Add to `package.json`:

```json
"test:ui": "node --test tests/website-development-repairs.test.mjs"
```

- [ ] **Step 4: Re-run and preserve the expected RED state**

Run: `npm run test:ui`

Expected: the same feature failures, invoked through the project script.

---

### Task 2: Repair the Website Development Page

**Files:**
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing `performanceStats`, pricing cards, and service cards.
- Produces: `.wd-video-placeholder`, `.wd-video-placeholder-frame`, and corrected scoped styles.

- [ ] **Step 1: Move the comparison accent to the first cell**

Replace the row pseudo-element selector with:

```css
.website-development-page .comparison tbody tr > td:first-child {
  position: relative;
}

.website-development-page .comparison tbody tr > td:first-child::before {
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 0;
  width: 4px;
  border-radius: 999px;
  background: linear-gradient(#fe6807, #ff3d93);
  content: "";
  opacity: 0;
  transform: scaleY(.35);
  transition: opacity .25s ease, transform .25s ease;
}
```

Update hover and focus selectors to target that cell pseudo-element.

- [ ] **Step 2: Make percentage rings loop and refine their cards**

Apply `animation: wd-score-loop 4.8s cubic-bezier(.2,.8,.2,1) infinite` to `.score-progress`. Define keyframes that draw, hold, and reset the ring. Add a subtle radial orange glow and consistent spacing to `.score-item`, with per-row delays preserved from the current inline styles.

- [ ] **Step 3: Replace the right animation with the video placeholder**

Remove the `InteractiveWebsiteJourney` import and render:

```tsx
<div aria-label="Website walkthrough video placeholder" className="wd-video-placeholder" role="img">
  <span className="wd-video-placeholder-status">Video Coming Soon</span>
  <span aria-hidden="true" className="material-symbols-outlined wd-video-placeholder-play">play_arrow</span>
  <div className="wd-video-placeholder-copy">
    <strong>Website Walkthrough Video</strong>
    <span>Your project video will play here.</span>
  </div>
</div>
```

Style it as a responsive 16:10 dark browser frame with orange glow and adequate contrast.

- [ ] **Step 4: Repair pricing overflow and normalize the icon**

Set the scoped `.price-card` to `overflow: visible`, add `border-radius: inherit` to its spotlight pseudo-element, and replace the first support icon text from `article` to `edit_note`.

- [ ] **Step 5: Run the Website Development checks**

Run: `npm run test:ui`

Expected: comparison, results, badge, and support-icon checks pass; footer checks remain failing.

---

### Task 3: Build the Shared Interactive Footer

**Files:**
- Create: `components/layout/InteractiveFooter.tsx`
- Modify: `components/layout/LayoutParts.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: React `PointerEvent`, `requestAnimationFrame`, existing footer children.
- Produces: `InteractiveFooter({ children }: { children: React.ReactNode })`.

- [ ] **Step 1: Implement the bounded pointer interaction**

Create a client component that renders a decorative 12-by-5 pixel grid and the footer children. On pointer movement, calculate normalized pointer coordinates, batch updates with requestAnimationFrame, and assign each pixel a distance-based `--pixel-energy` value. Reset to a neutral state on pointer leave. Keep the grid `aria-hidden="true"`.

- [ ] **Step 2: Compose the existing footer content**

Wrap the footer contents in `<InteractiveFooter>`. Add the closing CTA above the existing footer grid:

```tsx
<div className="footer-cta">
  <span>Ready When You Are</span>
  <h2>Let’s Build the Digital Presence Your Business Deserves.</h2>
  <Link className="footer-cta-link" href="/contact-us">
    Start a Conversation
    <span aria-hidden="true" className="material-symbols-outlined">north_east</span>
  </Link>
</div>
```

Do not remove or rewrite the existing footer grid or footer bottom content.

- [ ] **Step 3: Style desktop, tablet, mobile, and reduced motion**

Add isolated `.interactive-footer-*` styles. Ensure the pixel layer has `pointer-events: none`, the CTA and footer content stay above it, the grid count compresses at tablet/mobile breakpoints, and `prefers-reduced-motion: reduce` disables transitions and automatic motion.

- [ ] **Step 4: Run the full UI regression suite**

Run: `npm run test:ui`

Expected: all tests pass.

---

### Task 4: Validate the Application

**Files:**
- Modify only if validation exposes a scoped defect.

**Interfaces:**
- Consumes: the completed implementation.
- Produces: build and browser evidence for all requested behavior.

- [ ] **Step 1: Run static verification**

Run: `npm run typecheck`

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 2: Run production verification**

Run: `npm run build`

Expected: exit code 0 and successful generation of `/`, `/contact-us`, and `/website-development`.

- [ ] **Step 3: Inspect Website Development at three viewport classes**

Verify at approximately 1440px, 900px, and 390px widths:

- comparison rows retain three aligned columns;
- score rings loop without obscuring percentage text;
- the video placeholder remains proportional;
- the Most Popular badge is fully visible;
- all three support icons share one visual treatment.

- [ ] **Step 4: Inspect the footer across routes**

Verify `/`, `/contact-us`, and `/website-development`:

- all existing links and contact details are present;
- pointer movement activates nearby pixels without blocking links;
- mobile uses a compact layout;
- keyboard focus remains visible;
- reduced motion produces a static pixel field.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors and only intentional files changed for this implementation, alongside the user’s preserved pre-existing worktree changes.
