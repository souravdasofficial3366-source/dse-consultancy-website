# Website Development Industry Video Grid and Footer Spotlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six Website Development industry still-image cards with a responsive 3-by-2 interactive video gallery and make the existing shared footer illumination follow the cursor faster while remaining subtle.

**Architecture:** A focused client component owns the video gallery, groups the existing six data records into rows of three, and pauses its media outside the viewport. CSS owns desktop row expansion and responsive fallbacks. The existing footer client component continues to calculate pixel proximity, while new root-level pointer coordinates drive one restrained radial light layer.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, CSS, Node test runner, local H.264 MP4 media, temporary `ffmpeg-static` binary for offline optimization.

## Global Constraints

- Keep all six existing business titles, descriptions, section headings, and CTA labels unchanged.
- At widths of 1100 pixels and above, render two independent rows of three cards.
- Default desktop cards have equal dimensions; an active card expands to landscape while its two row neighbours compress to portrait.
- Between 700 and 1099 pixels, use a stable two-column by three-row grid with no neighbour compression.
- Below 700 pixels, use a single-column six-card layout with no horizontal overflow.
- Videos must be muted, looped, inline-playing, locally hosted, and paused outside the viewport.
- Reduced-motion mode must show poster frames without autoplay or layout resizing.
- Each MP4 must be at or below 3 MB; the six MP4 files together must be at or below 18 MB; each poster must be at or below 150 KB.
- Preserve the existing footer pixel animation, content, links, CTA, address, phone number, email, and layout.
- Footer cursor light radius must remain between 280 and 360 pixels with opacity between 0.16 and 0.24.
- Footer pointer response must be 80-120 milliseconds; pointer-leave fade must be 220-300 milliseconds.

---

### Task 1: Prepare the Six Licensed Local Video Loops

**Files:**
- Create: `tests/website-development-industry-video-grid.test.mjs`
- Create: `public/videos/industries/pre-schooling.mp4`
- Create: `public/videos/industries/pre-schooling-poster.jpg`
- Create: `public/videos/industries/doctors-clinics.mp4`
- Create: `public/videos/industries/doctors-clinics-poster.jpg`
- Create: `public/videos/industries/education.mp4`
- Create: `public/videos/industries/education-poster.jpg`
- Create: `public/videos/industries/transport-logistics.mp4`
- Create: `public/videos/industries/transport-logistics-poster.jpg`
- Create: `public/videos/industries/real-estate.mp4`
- Create: `public/videos/industries/real-estate-poster.jpg`
- Create: `public/videos/industries/ecommerce.mp4`
- Create: `public/videos/industries/ecommerce-poster.jpg`
- Create: `work/video-sources.md`

**Interfaces:**
- Consumes: Six Pexels source pages and the Pexels commercial-use license.
- Produces: Twelve bounded local media assets consumed by `industryCards` in Task 2.

- [ ] **Step 1: Write the failing media-budget test**

Create `tests/website-development-industry-video-grid.test.mjs` with:

```js
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

const names = [
  "pre-schooling",
  "doctors-clinics",
  "education",
  "transport-logistics",
  "real-estate",
  "ecommerce"
];

test("six local industry video loops and posters stay inside the media budget", async () => {
  let totalVideoBytes = 0;

  for (const name of names) {
    const video = await stat(`public/videos/industries/${name}.mp4`);
    const poster = await stat(`public/videos/industries/${name}-poster.jpg`);

    assert.ok(video.size <= 3 * 1024 * 1024, `${name}.mp4 exceeds 3 MB`);
    assert.ok(poster.size <= 150 * 1024, `${name}-poster.jpg exceeds 150 KB`);
    totalVideoBytes += video.size;
  }

  assert.ok(totalVideoBytes <= 18 * 1024 * 1024, "combined videos exceed 18 MB");
});
```

- [ ] **Step 2: Run the test and verify the expected red state**

Run:

```bash
node --test tests/website-development-industry-video-grid.test.mjs
```

Expected: FAIL with `ENOENT` for `public/videos/industries/pre-schooling.mp4`.

- [ ] **Step 3: Download the selected Pexels clips at HD resolution**

Create `/tmp/dse-industry-sources/`, open each source page, select **Free download → HD**, and save the files with these exact names:

| Business | Pexels source | Temporary file |
|---|---|---|
| Pre-Schooling | `https://www.pexels.com/video/preschoolers-inside-the-classroom-8363634/` | `/tmp/dse-industry-sources/pre-schooling-source.mp4` |
| Doctors & Clinics | `https://www.pexels.com/video/doctor-talking-to-the-patient-7579338/` | `/tmp/dse-industry-sources/doctors-clinics-source.mp4` |
| Education | `https://www.pexels.com/video/students-working-on-a-laptop-in-a-classroom-5200028/` | `/tmp/dse-industry-sources/education-source.mp4` |
| Transport and Logistics | `https://www.pexels.com/video/people-working-with-parcels-10472376/` | `/tmp/dse-industry-sources/transport-logistics-source.mp4` |
| Real Estate Businesses | `https://www.pexels.com/video/a-realtor-showing-an-apartment-to-a-couple-7647567/` | `/tmp/dse-industry-sources/real-estate-source.mp4` |
| E-commerce Stores | `https://www.pexels.com/video/a-seller-packing-the-purchase-order-7855154/` | `/tmp/dse-industry-sources/ecommerce-source.mp4` |

Record these six URLs plus `https://www.pexels.com/legal-pages/license/` in `work/video-sources.md`. State that the clips were trimmed, muted, compressed, and used as illustrative website backgrounds without implying endorsement.

- [ ] **Step 4: Encode the loops and poster frames**

Install a temporary ffmpeg binary without changing `package.json` or the lockfile:

```bash
npm install --no-save --package-lock=false ffmpeg-static@5.2.0
mkdir -p public/videos/industries
FFMPEG="$(node -p 'require("ffmpeg-static")')"
```

Run this zsh function and the six explicit calls:

```bash
encode_industry_clip() {
  local name="$1"
  local start="$2"
  "$FFMPEG" -y -ss "$start" -t 8 \
    -i "/tmp/dse-industry-sources/${name}-source.mp4" \
    -an -vf "scale='min(1280,iw)':-2,fps=24" \
    -c:v libx264 -preset medium -crf 29 -pix_fmt yuv420p \
    -movflags +faststart "public/videos/industries/${name}.mp4"
  "$FFMPEG" -y -ss 2 -i "public/videos/industries/${name}.mp4" \
    -frames:v 1 -vf "scale='min(960,iw)':-2" -q:v 5 \
    "public/videos/industries/${name}-poster.jpg"
}

encode_industry_clip pre-schooling 0
encode_industry_clip doctors-clinics 1
encode_industry_clip education 0
encode_industry_clip transport-logistics 1
encode_industry_clip real-estate 1
encode_industry_clip ecommerce 0
```

- [ ] **Step 5: Run the media test and correct only any oversized asset**

Run:

```bash
node --test tests/website-development-industry-video-grid.test.mjs
```

Expected: PASS. If a named MP4 exceeds 3 MB, rerun its first ffmpeg command with `-crf 32`, regenerate its poster, and rerun the test.

- [ ] **Step 6: Commit the local media library and provenance**

```bash
git add tests/website-development-industry-video-grid.test.mjs public/videos/industries work/video-sources.md
git commit -m "feat: add optimized industry video loops"
```

---

### Task 2: Build the Viewport-Aware Industry Video Component

**Files:**
- Create: `components/landing/IndustryVideoGrid.tsx`
- Modify: `data/site.ts:75-119`
- Modify: `app/(landing-pages)/website-development/page.tsx:269-295`
- Modify: `tests/website-development-industry-video-grid.test.mjs`

**Interfaces:**
- Consumes: `industryCards: Array<{ title: string; text: string; video: string; poster: string }>`.
- Produces: `IndustryVideoGrid({ cards })`, rendering two semantic rows of three video cards.

- [ ] **Step 1: Add failing structure and media-attribute tests**

Append these reads and tests to `tests/website-development-industry-video-grid.test.mjs`:

```js
import { readFile } from "node:fs/promises";

const [page, component, data] = await Promise.all([
  readFile("app/(landing-pages)/website-development/page.tsx", "utf8"),
  readFile("components/landing/IndustryVideoGrid.tsx", "utf8").catch(() => ""),
  readFile("data/site.ts", "utf8")
]);

test("industry data maps every business to local video and poster media", () => {
  for (const name of names) {
    assert.match(data, new RegExp(`/videos/industries/${name}\\.mp4`));
    assert.match(data, new RegExp(`/videos/industries/${name}-poster\\.jpg`));
  }
});

test("the page delegates the six cards to the video grid", () => {
  assert.match(page, /<IndustryVideoGrid cards={industryCards} \/>/);
  assert.doesNotMatch(page, /industryCards\.map/);
});

test("the gallery renders rows of three accessible looping videos", () => {
  assert.match(component, /cards\.slice\(rowIndex \* 3, rowIndex \* 3 \+ 3\)/);
  assert.match(component, /<video/);
  assert.match(component, /muted/);
  assert.match(component, /loop/);
  assert.match(component, /playsInline/);
  assert.match(component, /preload="metadata"/);
  assert.match(component, /poster={card\.poster}/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /prefers-reduced-motion/);
});
```

- [ ] **Step 2: Run the focused test and verify the expected red state**

```bash
node --test tests/website-development-industry-video-grid.test.mjs
```

Expected: the media-budget test passes; the new data/component/page tests fail because the component and local paths do not exist.

- [ ] **Step 3: Extend all six data records without changing copy**

In `data/site.ts`, remove each remote `image` property and add the exact local pair below. Do not modify any `title` or `text` value.

| Title | `video` | `poster` |
|---|---|---|
| Pre-Schooling | `/videos/industries/pre-schooling.mp4` | `/videos/industries/pre-schooling-poster.jpg` |
| Doctors & Clinics | `/videos/industries/doctors-clinics.mp4` | `/videos/industries/doctors-clinics-poster.jpg` |
| Education (LMS/Schools/Colleges/Tuition Centre) | `/videos/industries/education.mp4` | `/videos/industries/education-poster.jpg` |
| Transport and Logistics | `/videos/industries/transport-logistics.mp4` | `/videos/industries/transport-logistics-poster.jpg` |
| Real Estate Businesses | `/videos/industries/real-estate.mp4` | `/videos/industries/real-estate-poster.jpg` |
| E-commerce Stores | `/videos/industries/ecommerce.mp4` | `/videos/industries/ecommerce-poster.jpg` |

- [ ] **Step 4: Create the client video-grid component**

Create `components/landing/IndustryVideoGrid.tsx` with this public shape and playback lifecycle:

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";

type IndustryVideoCard = {
  title: string;
  text: string;
  video: string;
  poster: string;
};

type IndustryVideoGridProps = {
  cards: IndustryVideoCard[];
};

export function IndustryVideoGrid({ cards }: IndustryVideoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(
    () => Array.from({ length: Math.ceil(cards.length / 3) }, (_, rowIndex) =>
      cards.slice(rowIndex * 3, rowIndex * 3 + 3)
    ),
    [cards]
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const videos = Array.from(grid.querySelectorAll<HTMLVideoElement>("video"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let isVisible = false;

    const syncPlayback = () => {
      videos.forEach((video) => {
        if (isVisible && !motion.matches) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.15 }
    );
    const handleMotionChange = () => syncPlayback();

    observer.observe(grid);
    motion.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      isVisible = false;
      syncPlayback();
    };
  }, []);

  return (
    <div className="industry-video-grid" ref={gridRef}>
      {rows.map((row, rowIndex) => (
        <div className="industry-video-row" key={`industry-row-${rowIndex}`}>
          {row.map((card) => (
            <article className="industry-video-card" key={card.title}>
              <video
                aria-hidden="true"
                loop
                muted
                playsInline
                poster={card.poster}
                preload="metadata"
                src={card.video}
              />
              <div className="industry-video-scrim" />
              <div className="industry-content">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <a className="secondary-button" href="#lead-form">
                  View package
                  <span aria-hidden="true" className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Replace the old mapped markup on the page**

Import `IndustryVideoGrid` and replace the existing `<div className="industry-grid">...</div>` block with:

```tsx
<IndustryVideoGrid cards={industryCards} />
```

- [ ] **Step 6: Run the focused test and TypeScript check**

```bash
node --test tests/website-development-industry-video-grid.test.mjs
npm run typecheck
```

Expected: both commands PASS.

- [ ] **Step 7: Commit the component boundary**

```bash
git add components/landing/IndustryVideoGrid.tsx data/site.ts 'app/(landing-pages)/website-development/page.tsx' tests/website-development-industry-video-grid.test.mjs
git commit -m "feat: add viewport-aware industry video grid"
```

---

### Task 3: Add the 3-by-2 Expansion and Responsive Layout

**Files:**
- Modify: `app/globals.css:591-650,6525-6575`
- Modify: `tests/website-development-industry-video-grid.test.mjs`

**Interfaces:**
- Consumes: `.industry-video-grid`, `.industry-video-row`, and `.industry-video-card` from Task 2.
- Produces: Equal desktop cards, row-local expansion, stable tablet/mobile layouts, and reduced-motion behavior.

- [ ] **Step 1: Add failing responsive-layout tests**

Add a CSS read and tests:

```js
const css = await readFile("app/globals.css", "utf8");

test("desktop industry rows expand one card without affecting the other row", () => {
  assert.match(css, /@media \(min-width: 1100px\)[\s\S]*?\.industry-video-row\s*\{[\s\S]*?display:\s*flex/);
  assert.match(css, /\.industry-video-row:has\(\.industry-video-card:is\(:hover, :focus-within\)\)/);
  assert.match(css, /flex-grow:\s*1\.64/);
  assert.match(css, /flex-grow:\s*\.68/);
});

test("industry video cards have tablet, mobile, and reduced-motion fallbacks", () => {
  assert.match(css, /@media \(min-width: 700px\) and \(max-width: 1099px\)[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 699px\)[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?\.industry-video-card/);
});
```

- [ ] **Step 2: Run the focused test and verify the expected red state**

```bash
node --test tests/website-development-industry-video-grid.test.mjs
```

Expected: the two CSS tests FAIL because the new selectors do not exist.

- [ ] **Step 3: Replace the obsolete bento-card rules with the video-gallery rules**

Remove the old `.industry-grid`, `.industry-card`, `.industry-image`, and `.wd-industry-browser` rules that only support the still-image layout. Add:

```css
.industry-video-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.industry-video-row {
  display: contents;
}

.industry-video-card {
  position: relative;
  min-width: 0;
  min-height: 330px;
  overflow: hidden;
  border: 1px solid rgba(254, 104, 7, .18);
  border-radius: 24px;
  background: #09080e;
  color: #fff;
  isolation: isolate;
}

.industry-video-card video,
.industry-video-scrim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.industry-video-card video {
  object-fit: cover;
  transform: scale(1.02);
  transition: filter 520ms ease, transform 620ms cubic-bezier(.2, .8, .2, 1);
}

.industry-video-scrim {
  z-index: 1;
  background: linear-gradient(180deg, rgba(9, 8, 14, .1), rgba(9, 8, 14, .88));
}

.industry-video-card .industry-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 100%;
  height: 100%;
  padding: 28px;
}

.industry-video-card:is(:hover, :focus-within) {
  border-color: rgba(255, 173, 69, .72);
  box-shadow: 0 28px 70px rgba(254, 104, 7, .2);
}

.industry-video-card:is(:hover, :focus-within) video {
  filter: saturate(1.08) brightness(1.06);
  transform: scale(1.07);
}

@media (min-width: 700px) and (max-width: 1099px) {
  .industry-video-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 699px) {
  .industry-video-grid {
    grid-template-columns: 1fr;
  }

  .industry-video-card {
    min-height: 0;
    aspect-ratio: 4 / 3;
  }

  .industry-video-card .industry-content {
    padding: 22px;
  }

  .industry-video-card .industry-content h3 {
    font-size: 1.25rem;
  }

  .industry-video-card .industry-content p {
    font-size: .9rem;
    line-height: 1.45;
  }
}

@media (min-width: 1100px) {
  .industry-video-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  .industry-video-row {
    display: flex;
    gap: 18px;
    height: clamp(330px, 28vw, 410px);
  }

  .industry-video-card {
    flex: 1 1 0;
    min-height: 0;
  }
}

@media (min-width: 1100px) and (hover: hover) and (pointer: fine) {
  .industry-video-card {
    transition: flex-grow 600ms cubic-bezier(.2, .8, .2, 1),
      border-color 240ms ease, box-shadow 320ms ease;
  }

  .industry-video-row:has(.industry-video-card:is(:hover, :focus-within)) .industry-video-card {
    flex-grow: .68;
  }

  .industry-video-row:has(.industry-video-card:is(:hover, :focus-within))
    .industry-video-card:is(:hover, :focus-within) {
    flex-grow: 1.64;
  }
}

@media (prefers-reduced-motion: reduce) {
  .industry-video-card,
  .industry-video-card video {
    transition: none !important;
  }
}
```

Retain the existing heading, paragraph, button, and section-background styles that do not target the obsolete card markup.

- [ ] **Step 4: Run the focused UI tests**

```bash
node --test tests/website-development-industry-video-grid.test.mjs
node --test tests/website-development-repairs.test.mjs
```

Expected: both test files PASS.

- [ ] **Step 5: Commit the responsive gallery styling**

```bash
git add app/globals.css tests/website-development-industry-video-grid.test.mjs
git commit -m "feat: add row-responsive industry video expansion"
```

---

### Task 4: Tune the Footer to Follow the Cursor Quickly and Subtly

**Files:**
- Modify: `components/layout/InteractiveFooter.tsx:1-94`
- Modify: `app/globals.css:7306-7575`
- Modify: `tests/website-development-repairs.test.mjs`

**Interfaces:**
- Consumes: Existing twelve-column pixel field and pointer-energy calculation.
- Produces: CSS variables `--footer-pointer-x`, `--footer-pointer-y`, and `data-pointer-active` on `.interactive-footer`.

- [ ] **Step 1: Write the failing footer-response test**

Extend the final test in `tests/website-development-repairs.test.mjs` and add a separate timing assertion:

```js
test("footer exposes a fast restrained cursor spotlight", () => {
  assert.match(footer, /--footer-pointer-x/);
  assert.match(footer, /--footer-pointer-y/);
  assert.match(footer, /pointerActive/);
  assert.match(css, /\.interactive-footer::before/);
  assert.match(css, /width:\s*clamp\(280px,[^;]*360px\)/);
  assert.match(css, /opacity:\s*\.2/);
  assert.match(css, /left\s*100ms\s*linear/);
  assert.match(css, /top\s*100ms\s*linear/);
  assert.match(css, /opacity\s*260ms\s*ease/);
});
```

- [ ] **Step 2: Run the repair test and verify the expected red state**

```bash
node --test tests/website-development-repairs.test.mjs
```

Expected: the new footer spotlight test FAILS because root coordinates and the pseudo-element do not exist.

- [ ] **Step 3: Add root pointer coordinates without adding React render work**

In `InteractiveFooter.tsx`:

1. Add `const rootRef = useRef<HTMLDivElement>(null);`.
2. In `renderPixelEnergy`, before iterating pixels, set the root custom properties from `pointerRef.current`:

```ts
const root = rootRef.current;
const pointer = pointerRef.current;

if (root && pointer) {
  root.style.setProperty("--footer-pointer-x", `${(pointer.x * 100).toFixed(2)}%`);
  root.style.setProperty("--footer-pointer-y", `${(pointer.y * 100).toFixed(2)}%`);
  root.dataset.pointerActive = "true";
} else if (root) {
  root.dataset.pointerActive = "false";
}
```

3. Reuse the single `pointer` variable inside the pixel loop and tighten the energy falloff from `distance * 2.6` to `distance * 3.1`.
4. Attach `ref={rootRef}` to the root `.interactive-footer` element.

- [ ] **Step 4: Add the subtle fast spotlight and shorten pixel response**

Add these rules next to the existing footer styles:

```css
.interactive-footer {
  --footer-pointer-x: 50%;
  --footer-pointer-y: 30%;
}

.interactive-footer::before {
  position: absolute;
  z-index: 0;
  top: var(--footer-pointer-y);
  left: var(--footer-pointer-x);
  width: clamp(280px, 24vw, 360px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(254, 104, 7, .32), rgba(255, 103, 77, .1) 42%, transparent 72%);
  content: "";
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 100ms linear, top 100ms linear, opacity 260ms ease;
}

.interactive-footer[data-pointer-active="true"]::before {
  opacity: .2;
}

.interactive-footer-pixels > span {
  opacity: calc(.035 + var(--pixel-energy) * .28);
  filter: saturate(calc(.72 + var(--pixel-energy) * .38));
  transform: scale(calc(.97 + var(--pixel-energy) * .02));
  transition: opacity 100ms linear, filter 100ms linear, transform 100ms linear;
}

.interactive-footer[data-pointer-active="false"] .interactive-footer-pixels > span {
  transition-duration: 260ms;
}
```

Keep `.interactive-footer-content` at `z-index: 1`, leaving the new visual unable to cover or intercept the links. In the existing reduced-motion block, force `::before` to `top: 22%; left: 50%; opacity: .08; transition: none;`.

- [ ] **Step 5: Run the repair and industry tests**

```bash
node --test tests/website-development-repairs.test.mjs
node --test tests/website-development-industry-video-grid.test.mjs
```

Expected: both test files PASS.

- [ ] **Step 6: Commit the footer response refinement**

```bash
git add components/layout/InteractiveFooter.tsx app/globals.css tests/website-development-repairs.test.mjs
git commit -m "feat: refine footer cursor response"
```

---

### Task 5: Integrate the Test Script and Verify the Complete Experience

**Files:**
- Modify: `package.json:6-11`
- Verify: `app/(landing-pages)/website-development/page.tsx`
- Verify: `components/landing/IndustryVideoGrid.tsx`
- Verify: `components/layout/InteractiveFooter.tsx`
- Verify: `app/globals.css`

**Interfaces:**
- Consumes: All tasks above.
- Produces: A tested production build and a browser-verified local preview.

- [ ] **Step 1: Make the UI script run every UI test file**

Change the `test:ui` script to:

```json
"test:ui": "node --test tests/*.test.mjs"
```

- [ ] **Step 2: Run the complete automated verification**

```bash
npm run test:ui
npm run typecheck
npm run build
```

Expected: all UI tests PASS, TypeScript reports no errors, and the production build exits successfully with the existing routes intact.

- [ ] **Step 3: Review the edited React files for rendering and lifecycle issues**

Use the `vercel:react-best-practices` skill to review the new gallery, its page integration, and the footer pointer loop. Resolve any unnecessary rerenders, missing effect cleanup, unstable list keys, or client/server boundary problems, then rerun Step 2.

- [ ] **Step 4: Verify desktop interaction in the live browser**

At `http://192.168.0.202:3000/website-development` with a 1440-pixel viewport:

- Confirm exactly six cards in two rows of three.
- Confirm each idle row has three equal cards.
- Hover each card in the first row; confirm it expands while only its two neighbours compress.
- Confirm the second row does not resize when the first row is active.
- Repeat for the second row.
- Confirm every title, description, and "View package" CTA remains readable and clickable.
- Confirm all six videos play while the section is visible and pause after the section leaves the viewport.
- Tab through all six CTAs and confirm keyboard focus produces the same row-local expansion.
- Move the cursor quickly across the footer and confirm the restrained light catches it within approximately 100 milliseconds without overpowering the pixel field.
- Move the cursor out of the footer and confirm the light fades smoothly.

- [ ] **Step 5: Verify responsive layouts and overflow**

Repeat browser inspection at:

- 1024 pixels: two columns by three rows, no hover compression.
- 768 pixels: two columns by three rows, readable copy, no horizontal overflow.
- 390 pixels: one card per row, compact landscape ratio, no horizontal overflow.

At each width, confirm the footer CTA and links remain clickable and the touch fallback does not depend on hover.

- [ ] **Step 6: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm:

- The six posters remain visible.
- Videos do not autoplay.
- Cards do not resize or animate.
- The footer uses a calm static light with no pointer-following motion.

- [ ] **Step 7: Commit final integration and test configuration**

```bash
git add package.json
git commit -m "test: verify industry gallery and footer interaction"
```

Use `superpowers:verification-before-completion` before reporting completion. Keep the local Website Development preview open for the user.
