# About Hostinger Structure Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the Hostinger About hero and story above the existing Vercel eight-step timeline while retaining the approved two-line chapter 05 title, current FAQ system, shared gradient CTA, header, footer, and contact controls.

**Architecture:** Keep `app/(website-pages)/about-us/page.tsx` as the server-rendered page composition and keep timeline scroll state inside the existing `AboutVisionStory` client component. Add one focused client component for the D/S/E media mark, use existing local media only, and scope all new presentation rules to About-specific classes in `app/globals.css`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, Node test runner

## Global Constraints

- Import Hostinger content only through the end of timeline chapter 08.
- Keep the approved chapter 05 wording: “Prepare For Roadblocks” and “Before They Slow Growth.”
- Preserve `aboutFaqs`, `FaqJsonLd`, and `FaqList` as the single FAQ content path.
- Do not import the Hostinger Team Model or its extra “Let’s Work Together” section.
- Do not add page-local header, footer, gradient CTA, WhatsApp, or mobile-call markup.
- The shared `Footer` remains the owner of both the gradient CTA and footer grid.
- Use only existing local media under `public/videos`.
- Retain normal page-scroll activation, keyboard accessibility, reduced-motion support, and the existing tablet/mobile timeline fallback.
- Do not modify or deploy Hostinger.

---

## File Structure

- Create `components/about/AboutStoryVideoMark.tsx`
  - Owns the three D/S/E media panels, accessible labels, viewport-aware playback, and reduced-motion playback state.
- Modify `app/(website-pages)/about-us/page.tsx`
  - Owns the Hostinger-derived hero and story composition, then mounts the unchanged timeline and current FAQ.
- Modify `app/globals.css`
  - Owns only the About hero/story layout and media-panel interaction rules.
- Create `tests/about-hostinger-structure-merge.test.mjs`
  - Protects the Hostinger upper-page content boundary, Vercel lower-page preservation, D/S/E component behavior, and responsive CSS contracts.
- Verify `components/about/AboutVisionStory.tsx`
  - Remains the source of the eight timeline chapters and the approved chapter 05 heading.
- Verify `components/layout/LayoutParts.tsx`
  - Remains unchanged and continues to supply the shared gradient CTA and footer.

---

### Task 1: D/S/E Story Media Component

**Files:**
- Create: `components/about/AboutStoryVideoMark.tsx`
- Create: `tests/about-hostinger-structure-merge.test.mjs`

**Interfaces:**
- Produces: `export function AboutStoryVideoMark(): JSX.Element`
- Consumes:
  - `/videos/connected_discovery_navigation.mp4`
  - `/videos/connected_trust_seminar_audience.mp4`
  - `/videos/connected_action_meeting.mp4`

- [ ] **Step 1: Write the failing component regression test**

Create `tests/about-hostinger-structure-merge.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8").catch(() => "");

test("the About story media mark exposes three local, focusable DSE panels", async () => {
  const component = await read("components/about/AboutStoryVideoMark.tsx");

  for (const [letter, video] of [
    ["D", "/videos/connected_discovery_navigation.mp4"],
    ["S", "/videos/connected_trust_seminar_audience.mp4"],
    ["E", "/videos/connected_action_meeting.mp4"]
  ]) {
    assert.match(component, new RegExp(`letter: "${letter}"`));
    assert.match(component, new RegExp(video.replaceAll("/", "\\/")));
  }

  assert.match(component, /tabIndex={0}/);
  assert.match(component, /aria-label={panel\.label}/);
  assert.match(component, /preload="metadata"/);
});

test("the About story media pauses offscreen and when reduced motion is requested", async () => {
  const component = await read("components/about/AboutStoryVideoMark.tsx");

  assert.match(component, /new IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /video\.play\(\)/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /observer\.disconnect\(\)/);
  assert.match(component, /removeEventListener/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/about-hostinger-structure-merge.test.mjs
```

Expected: both tests fail because `components/about/AboutStoryVideoMark.tsx` does not exist.

- [ ] **Step 3: Implement the minimal media component**

Create `components/about/AboutStoryVideoMark.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

const panels = [
  {
    letter: "D",
    label: "D — Discovery",
    video: "/videos/connected_discovery_navigation.mp4"
  },
  {
    letter: "S",
    label: "S — Strategy",
    video: "/videos/connected_trust_seminar_audience.mp4"
  },
  {
    letter: "E",
    label: "E — Execution",
    video: "/videos/connected_action_meeting.mp4"
  }
] as const;

export function AboutStoryVideoMark() {
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    const videos = Array.from(mark.querySelectorAll<HTMLVideoElement>("video"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const syncPlayback = () => {
      videos.forEach((video) => {
        if (visible && !motion.matches) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.2 }
    );
    const handleMotionChange = () => syncPlayback();

    observer.observe(mark);
    motion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      visible = false;
      syncPlayback();
    };
  }, []);

  return (
    <div
      aria-label="DSE digital growth approach"
      className="dse-about-story-mark dse-about-story-video-mark"
      ref={markRef}
      role="group"
    >
      {panels.map((panel) => (
        <span
          aria-label={panel.label}
          className="dse-about-story-video-panel"
          key={panel.letter}
          role="img"
          tabIndex={0}
        >
          <video
            aria-hidden="true"
            loop
            muted
            playsInline
            preload="metadata"
            src={panel.video}
          />
          <span aria-hidden="true" className="dse-about-story-video-scrim" />
          <strong aria-hidden="true">{panel.letter}</strong>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/about-hostinger-structure-merge.test.mjs
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit the component**

```bash
git add components/about/AboutStoryVideoMark.tsx tests/about-hostinger-structure-merge.test.mjs
git commit -m "feat: restore About story media mark"
```

---

### Task 2: Hostinger Hero and Story Composition

**Files:**
- Modify: `app/(website-pages)/about-us/page.tsx`
- Modify: `tests/about-hostinger-structure-merge.test.mjs`

**Interfaces:**
- Consumes:
  - `AboutStoryVideoMark` from Task 1
  - `AboutVisionStory`
  - `aboutFaqs`
  - `FaqJsonLd`
  - `FaqList`
- Produces: the full About-page section order from hero through FAQ

- [ ] **Step 1: Add a failing page-composition regression test**

Append to `tests/about-hostinger-structure-merge.test.mjs`:

```js
test("the About page merges the Hostinger upper structure with the Vercel lower structure", async () => {
  const [page, layout] = await Promise.all([
    read("app/(website-pages)/about-us/page.tsx"),
    read("components/layout/LayoutParts.tsx")
  ]);

  assert.match(page, /AboutStoryVideoMark/);
  assert.match(page, /About DSE Consultancy/);
  assert.match(page, /Digital Work/);
  assert.match(page, /Should Feel Clear,/);
  assert.match(page, /Connected And Useful\./);
  assert.match(page, /Our Point Of View/);
  assert.match(page, /A strong digital presence is not one website/);
  assert.match(page, /Built For Businesses/);
  assert.match(page, /That Need A Practical/);
  assert.match(page, /Digital Growth Partner\./);
  assert.match(page, /DSE Consultancy is a Kolkata-focused digital consultancy/);
  assert.match(page, /Our work begins with the business/);

  assert.ok(page.indexOf("<AboutStoryVideoMark />") < page.indexOf("<AboutVisionStory />"));
  assert.ok(page.indexOf("<AboutVisionStory />") < page.indexOf('id="faq"'));
  assert.match(page, /<FaqJsonLd items={aboutFaqs} \/>/);
  assert.match(page, /<FaqList items={aboutFaqs} \/>/);

  assert.doesNotMatch(page, /Specialist Thinking/);
  assert.doesNotMatch(page, /One Connected Delivery System/);
  assert.doesNotMatch(page, /Bring Us The Business Challenge/);
  assert.doesNotMatch(page, /<Header|<Footer|<WhatsAppFab|<MobileCallFab/);

  assert.match(layout, /export function Footer\(\)/);
  assert.match(layout, /className="footer-cta"/);
  assert.match(layout, /Let&apos;s Build the Digital Presence Your Business Deserves\./);
  assert.match(layout, /className="footer-grid"/);
});

test("the existing timeline remains eight chapters with the approved chapter five title", async () => {
  const timeline = await read("components/about/AboutVisionStory.tsx");

  assert.equal((timeline.match(/number: "0[1-8]"/g) ?? []).length, 8);
  assert.match(
    timeline,
    /heading: \["Prepare For Roadblocks", "Before They Slow Growth\."\] as const/
  );
  assert.doesNotMatch(timeline, /Plan Ahead For The Roadblocks That Come Next/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/about-hostinger-structure-merge.test.mjs
```

Expected: the composition test fails because the current route still renders the generic white SEO hero and has no Hostinger story section.

- [ ] **Step 3: Replace the generic hero and add the Hostinger story**

Update `app/(website-pages)/about-us/page.tsx`:

```tsx
import type { Metadata } from "next";
import { AboutStoryVideoMark } from "@/components/about/AboutStoryVideoMark";
import { AboutVisionStory } from "@/components/about/AboutVisionStory";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { FaqList } from "@/components/faq/FaqList";
import { aboutFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how DSE Consultancy connects practical website development, search visibility and content systems for growing local businesses."
};

export default function AboutUsPage() {
  return (
    <main className="dse-about-page">
      <FaqJsonLd items={aboutFaqs} />

      <section className="dse-inner-hero dse-about-hero">
        <div className="container dse-inner-hero-grid">
          <div>
            <span className="consultancy-home-kicker">About DSE Consultancy</span>
            <h1>
              <span>Digital Work</span>
              <span>Should Feel Clear,</span>
              <span>Connected And Useful.</span>
            </h1>
          </div>
          <aside className="dse-inner-hero-note">
            <span>Our Point Of View</span>
            <p>
              A strong digital presence is not one website, one post or one ranking. It is the
              complete experience a customer has from first discovery to first conversation.
            </p>
          </aside>
        </div>
      </section>

      <section className="section white dse-about-story">
        <div className="container dse-about-story-grid">
          <AboutStoryVideoMark />
          <div>
            <span className="consultancy-home-kicker dark">Our Story</span>
            <h2>
              <span>Built For Businesses</span>
              <span>That Need A Practical</span>
              <span>Digital Growth Partner.</span>
            </h2>
            <p>
              DSE Consultancy is a Kolkata-focused digital consultancy created to help local and
              growing businesses build a credible online presence without unnecessary complexity.
              We combine website development, search visibility, content planning and social media
              management into systems that customers can understand and businesses can use.
            </p>
            <p>
              Our work begins with the business: what it offers, who it serves, where customers
              search, what creates trust, and which action matters most. Design and technology then
              support that strategy.
            </p>
          </div>
        </div>
      </section>

      <AboutVisionStory />

      <section className="dse-page-faq" id="faq">
        <div className="container">
          <div className="consultancy-home-heading center">
            <span className="consultancy-home-kicker dark">FAQs</span>
            <h2>
              <span>How DSE Works</span>
              <span>With Your Business.</span>
            </h2>
          </div>
          <div className="social-faq-wrap">
            <FaqList items={aboutFaqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/about-hostinger-structure-merge.test.mjs
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit the composition**

```bash
git add app/\(website-pages\)/about-us/page.tsx tests/about-hostinger-structure-merge.test.mjs
git commit -m "feat: restore Hostinger About structure"
```

---

### Task 3: About-Specific Layout and Interaction Styling

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/about-hostinger-structure-merge.test.mjs`

**Interfaces:**
- Consumes: About hero/story class names from Task 2
- Produces:
  - `.dse-about-hero`
  - `.dse-about-story-video-mark`
  - `.dse-about-story-video-panel`
  - responsive and reduced-motion presentation contracts

- [ ] **Step 1: Add a failing CSS contract test**

Append to `tests/about-hostinger-structure-merge.test.mjs`:

```js
test("the About hero and story retain their desktop composition and responsive fallback", async () => {
  const css = await read("app/globals.css");

  assert.match(css, /\.dse-about-hero h1 > span\s*\{\s*display:\s*block/);
  assert.match(
    css,
    /\.dse-about-story-grid\s*\{[^}]*grid-template-columns:\s*minmax\(280px,\s*\.58fr\)\s+minmax\(0,\s*1\.12fr\)/
  );
  assert.match(css, /\.dse-about-story h2 > span\s*\{\s*display:\s*block/);
  assert.match(css, /\.dse-about-story-video-panel\s*\{[^}]*flex:\s*1 1 0/);
  assert.match(css, /\.dse-about-story-video-panel video\s*\{[^}]*object-fit:\s*cover/);
  assert.match(css, /\.dse-about-story-video-panel:focus-visible\s*\{[^}]*outline:/);
  assert.match(
    css,
    /@media \(min-width: 1100px\) and \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\)/
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.dse-about-story-video-panel/
  );
  assert.match(
    css,
    /@media \(max-width: 960px\)[\s\S]*?\.dse-about-story-grid[\s\S]*?grid-template-columns:\s*1fr/
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/about-hostinger-structure-merge.test.mjs
```

Expected: the CSS test fails because the video-panel rules and exact Hostinger-derived story ratio do not yet exist.

- [ ] **Step 3: Add the scoped desktop layout and panel styles**

Update the existing inner-page/About block in `app/globals.css`:

```css
.dse-about-hero h1 > span,
.dse-about-story h2 > span {
  display: block;
}

.dse-about-hero .dse-inner-hero-note {
  align-self: center;
}

.dse-about-story-grid {
  display: grid;
  grid-template-columns: minmax(280px, .58fr) minmax(0, 1.12fr);
  align-items: center;
  gap: clamp(48px, 6vw, 84px);
}

.dse-about-story-mark {
  display: flex;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 36px;
  background: #09080e;
  transform: rotate(-3deg);
  isolation: isolate;
}

.dse-about-story-video-panel {
  position: relative;
  display: grid;
  flex: 1 1 0;
  min-width: 0;
  place-items: center;
  overflow: hidden;
}

.dse-about-story-video-panel video,
.dse-about-story-video-scrim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.dse-about-story-video-panel video {
  object-fit: cover;
  transform: scale(1.03);
}

.dse-about-story-video-scrim {
  background: linear-gradient(180deg, rgba(9, 8, 14, .12), rgba(9, 8, 14, .58));
}

.dse-about-story-video-panel strong {
  position: relative;
  z-index: 1;
  color: #fff;
  font-family: var(--font-heading);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 900;
}

.dse-about-story-video-panel:focus-visible {
  outline: 4px solid #ffad45;
  outline-offset: -6px;
}

.dse-about-story h2 {
  max-width: 930px;
  font-size: clamp(2.5rem, 4.25vw, 4.4rem);
}

.dse-about-story p + p {
  margin-top: 18px;
}

@media (min-width: 1100px) and (prefers-reduced-motion: no-preference) {
  .dse-about-story-video-panel {
    transition: flex-grow 600ms cubic-bezier(.2, .8, .2, 1);
  }

  .dse-about-story-video-mark:has(.dse-about-story-video-panel:focus-visible)
    .dse-about-story-video-panel {
    flex-grow: .68;
  }

  .dse-about-story-video-mark:has(.dse-about-story-video-panel:focus-visible)
    .dse-about-story-video-panel:focus-visible {
    flex-grow: 1.64;
  }
}

@media (min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .dse-about-story-video-mark:has(.dse-about-story-video-panel:hover):not(:has(.dse-about-story-video-panel:focus-visible))
    .dse-about-story-video-panel {
    flex-grow: .68;
  }

  .dse-about-story-video-mark:has(.dse-about-story-video-panel:hover):not(:has(.dse-about-story-video-panel:focus-visible))
    .dse-about-story-video-panel:hover {
    flex-grow: 1.64;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dse-about-story-video-panel,
  .dse-about-story-video-panel video {
    transition: none !important;
  }
}
```

Retain the existing `@media (max-width: 960px)` rule that stacks `.dse-about-story-grid` to one column and limits `.dse-about-story-mark` to `520px`.

In the existing `@media (max-width: 700px)` block, ensure:

```css
.dse-about-hero h1 > span,
.dse-about-story h2 > span {
  white-space: normal;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/about-hostinger-structure-merge.test.mjs
```

Expected: 5 tests pass.

- [ ] **Step 5: Run the complete automated verification**

Run:

```bash
npm run test:ui
npm run typecheck
npm run build
```

Expected:

- every UI test passes;
- TypeScript exits successfully;
- the production build completes and generates `/about-us`.

- [ ] **Step 6: Commit the styling**

```bash
git add app/globals.css tests/about-hostinger-structure-merge.test.mjs
git commit -m "style: match Hostinger About composition"
```

---

### Task 4: Browser Verification and Publication

**Files:**
- Verify only

**Interfaces:**
- Consumes: completed About page, timeline, FAQ, and shared layout
- Produces: reviewed GitHub `main` commit and verified Vercel production deployment

- [ ] **Step 1: Start the local production-equivalent preview**

Run:

```bash
npm run dev
```

Open `/about-us`.

- [ ] **Step 2: Verify desktop at 1440 × 900**

Confirm:

- the dark hero uses the Hostinger split composition;
- all hero and story headings are fully visible;
- the story heading follows the intended three-line desktop rhythm;
- the D/S/E mark stays square, tilted, clipped, and aligned with the story copy;
- hovering or keyboard-focusing one D/S/E panel expands only that panel;
- scrolling activates the corresponding timeline chapter and visual;
- chapter 05 renders exactly two title lines;
- chapter 08 flows directly into the existing FAQ;
- the Team Model and duplicate “Let’s Work Together” section are absent;
- the shared gradient CTA and footer remain unchanged.

- [ ] **Step 3: Verify compact desktop and tablet**

At 1024 × 768 and 768 × 1024, confirm:

- no heading or story-copy clipping;
- the hero and story stack at the approved breakpoint;
- the D/S/E mark remains within the container;
- every timeline chapter remains reachable;
- the FAQ, gradient CTA, and footer retain their existing layout.

- [ ] **Step 4: Verify mobile at 390 × 844**

Confirm:

- there is no horizontal overflow;
- the hero and story remain readable;
- D/S/E panels stay equal-width and do not require hover;
- the timeline uses its vertical mobile presentation;
- FAQ controls remain keyboard/touch operable;
- shared contact controls do not overlap important content.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm:

- story videos remain paused;
- D/S/E flex transitions are disabled;
- timeline content remains readable and navigable.

- [ ] **Step 6: Run the final branch gate**

Run:

```bash
git diff --check
git status --short --branch
npm run test:ui
npm run typecheck
npm run build
```

Expected: clean diff checks, only intended branch commits, all tests green, and a successful production build.

- [ ] **Step 7: Complete and publish the branch**

Use `superpowers:finishing-a-development-branch`.

After confirming the branch is safe to merge:

```bash
git switch main
git merge --ff-only codex/about-hostinger-structure-merge
git push origin main
```

Deploy the exact merged commit to the already-linked Vercel production project.

- [ ] **Step 8: Verify the live Vercel release**

Confirm the production deployment reports `Ready`, then verify:

- `/about-us` returns successfully;
- the live page has the Hostinger hero/story and all eight timeline chapters;
- chapter 05 retains the approved title;
- the FAQ, gradient CTA, header, footer, and contact controls remain intact;
- desktop, tablet, and mobile have no clipping or horizontal overflow.

Hostinger remains unchanged.
