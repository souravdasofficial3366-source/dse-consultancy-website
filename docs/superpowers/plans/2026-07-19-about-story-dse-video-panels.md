# About Story DSE Video Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About story's static DSE mark with three video-backed expanding letter panels and constrain the right-hand story heading to three intentional desktop lines.

**Architecture:** Add one focused client component that owns the D/S/E panel markup and viewport-aware video playback. Mount it from the existing server page, and keep all interaction styling under About-specific class names so the Website Development gallery remains unchanged.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Node test runner

## Global Constraints

- Reuse only the expansion interaction idea from the Website Development gallery; do not reuse its card design, copy, or CTA.
- Use only existing local videos and add no third-party media.
- Keep the current tilted square, rounded silhouette, and D/S/E identity.
- The right-hand `Built For Businesses...` heading must use exactly three intentional desktop lines.
- Hover is desktop fine-pointer-only; keyboard focus gets equivalent expansion.
- Touch and reduced-motion modes retain equal-width panels.
- Do not push or deploy until the user approves the wider editing pass.

---

### Task 1: About Story Video Mark Component

**Files:**
- Create: `components/about/AboutStoryVideoMark.tsx`
- Create: `tests/about-story-video-mark.test.mjs`

**Interfaces:**
- Produces: `export function AboutStoryVideoMark(): JSX.Element`
- Consumes: three existing files under `public/videos/connected_*.mp4`

- [ ] **Step 1: Write the failing component test**

Create a Node test that reads the future component and asserts all three letters, exact video paths, focusability, `IntersectionObserver`, `prefers-reduced-motion`, `play()`, `pause()`, and cleanup are present.

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile("components/about/AboutStoryVideoMark.tsx", "utf8").catch(() => "");

test("about story mark renders three focusable local video panels", () => {
  for (const [letter, video] of [
    ["D", "/videos/connected_discovery_navigation.mp4"],
    ["S", "/videos/connected_trust_seminar_audience.mp4"],
    ["E", "/videos/connected_action_meeting.mp4"]
  ]) {
    assert.match(component, new RegExp(`letter: "${letter}"`));
    assert.match(component, new RegExp(video.replaceAll("/", "\\/")));
  }
  assert.match(component, /tabIndex={0}/);
});

test("about story videos stop offscreen and for reduced motion", () => {
  assert.match(component, /new IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /video\.play\(\)/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /observer\.disconnect\(\)/);
  assert.match(component, /removeEventListener/);
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test tests/about-story-video-mark.test.mjs`

Expected: FAIL because `components/about/AboutStoryVideoMark.tsx` does not exist.

- [ ] **Step 3: Implement the minimal component**

Create a client component with a root ref, the three constant panel records, muted looping metadata-only videos, focusable panels, and one effect that synchronizes playback with intersection and reduced-motion state.

```tsx
"use client";

import { useEffect, useRef } from "react";

const panels = [
  { letter: "D", label: "D — Discovery", video: "/videos/connected_discovery_navigation.mp4" },
  { letter: "S", label: "S — Strategy", video: "/videos/connected_trust_seminar_audience.mp4" },
  { letter: "E", label: "E — Execution", video: "/videos/connected_action_meeting.mp4" }
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
        if (visible && !motion.matches) void video.play().catch(() => undefined);
        else video.pause();
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.2 });
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
    <div className="dse-about-story-mark dse-about-story-video-mark" ref={markRef} role="group" aria-label="DSE digital growth approach">
      {panels.map((panel) => (
        <span className="dse-about-story-video-panel" key={panel.letter} tabIndex={0} role="img" aria-label={panel.label}>
          <video aria-hidden="true" loop muted playsInline preload="metadata" src={panel.video} />
          <span className="dse-about-story-video-scrim" />
          <strong aria-hidden="true">{panel.letter}</strong>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `node --test tests/about-story-video-mark.test.mjs`

Expected: 2 tests pass.

### Task 2: Page Integration, Expansion Styling, and Three-Line Heading

**Files:**
- Modify: `app/(website-pages)/about-us/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/about-story-video-mark.test.mjs`

**Interfaces:**
- Consumes: `AboutStoryVideoMark` from Task 1
- Produces: About story markup and `.dse-about-story-video-*` CSS contract

- [ ] **Step 1: Extend the test for page and CSS integration**

Assert that the About page imports and mounts `<AboutStoryVideoMark />`, the heading contains the three exact line spans, the old static spans are gone, and CSS includes tilted clipping, video coverage, fine-pointer hover expansion, keyboard focus expansion, mobile equal sizing, focus-visible outline, and reduced-motion transition removal.

- [ ] **Step 2: Run the test and confirm RED**

Run: `node --test tests/about-story-video-mark.test.mjs`

Expected: FAIL because the page still renders the static mark and the About-specific expansion CSS is absent.

- [ ] **Step 3: Mount the component and set exact heading lines**

```tsx
import { AboutStoryVideoMark } from "@/components/about/AboutStoryVideoMark";

<AboutStoryVideoMark />

<h2>
  <span>Built For Businesses</span>
  <span>That Need A Practical</span>
  <span>Digital Growth Partner.</span>
</h2>
```

- [ ] **Step 4: Add isolated interaction CSS**

Keep `.dse-about-story-mark` as the tilted clipped frame. Make each video panel a flex child with absolute full-cover video, scrim, and centered letter. At `min-width: 1100px`, use `:has()` to reduce inactive panels to `.68` and expand the hovered or focused panel to `1.64`. Limit hover rules to `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. Add focus-visible outline and reduced-motion overrides. Update the story grid ratio and use three block heading spans.

```css
.dse-about-story-grid {
  grid-template-columns: minmax(280px, .58fr) minmax(0, 1.12fr);
  gap: 72px;
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
.dse-about-story-video-panel video { object-fit: cover; }
.dse-about-story-video-scrim { background: linear-gradient(180deg, rgba(9,8,14,.12), rgba(9,8,14,.58)); }
.dse-about-story-video-panel strong { position: relative; z-index: 1; color: #fff; font-size: clamp(3rem,7vw,6rem); }
.dse-about-story-video-panel:focus-visible { outline: 4px solid #ffad45; outline-offset: -6px; }
.dse-about-story h2 { max-width: 930px; font-size: clamp(2.5rem,4.25vw,4.4rem); }
.dse-about-story h2 > span { display: block; }
@media (min-width: 1100px) and (prefers-reduced-motion: no-preference) {
  .dse-about-story-video-panel { transition: flex-grow 600ms cubic-bezier(.2,.8,.2,1); }
  .dse-about-story-video-mark:has(.dse-about-story-video-panel:focus-visible) .dse-about-story-video-panel { flex-grow: .68; }
  .dse-about-story-video-mark:has(.dse-about-story-video-panel:focus-visible) .dse-about-story-video-panel:focus-visible { flex-grow: 1.64; }
}
@media (min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .dse-about-story-video-mark:has(.dse-about-story-video-panel:hover):not(:has(.dse-about-story-video-panel:focus-visible)) .dse-about-story-video-panel { flex-grow: .68; }
  .dse-about-story-video-mark:has(.dse-about-story-video-panel:hover):not(:has(.dse-about-story-video-panel:focus-visible)) .dse-about-story-video-panel:hover { flex-grow: 1.64; }
}
@media (prefers-reduced-motion: reduce) {
  .dse-about-story-video-panel,
  .dse-about-story-video-panel video { transition: none !important; }
}
```

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `node --test tests/about-story-video-mark.test.mjs`

Expected: all About story tests pass.

### Task 3: Regression and Browser Verification

**Files:**
- Verify only; no new production files

**Interfaces:**
- Consumes: completed About story component and CSS
- Produces: verified localhost handoff

- [ ] **Step 1: Run automated regression checks**

Run: `npm run test:ui`

Expected: all UI tests pass.

Run: `npm run typecheck`

Expected: TypeScript exits successfully.

- [ ] **Step 2: Verify desktop browser geometry and interaction**

At a 1440px desktop viewport, confirm the story heading has exactly three rendered lines, the D/S/E frame remains square and tilted, and focusing or hovering each panel increases only its width while siblings compress.

- [ ] **Step 3: Verify mobile and reduced-motion fallbacks**

At a 390px viewport, confirm the section stacks without horizontal overflow and all panels remain equal width. Emulate reduced motion and confirm videos are paused and flex transitions are disabled.

- [ ] **Step 4: Keep localhost open for approval**

Refresh `/about-us`, retain the preview tab, and do not commit production code or push until the user approves the visual result.
