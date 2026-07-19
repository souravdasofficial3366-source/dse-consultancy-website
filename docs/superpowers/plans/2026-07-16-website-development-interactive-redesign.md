# Website Development Interactive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/website-development` with bold, conversion-focused motion and interaction while leaving every existing marketing statement, price, form field, FAQ, link destination, and section order unchanged.

**Architecture:** Keep the existing server-rendered page as the content source. Add one focused client interaction controller for progress, reveal, pointer spotlight, tilt, and magnetic CTA behaviour; add one presentational component for the search-to-enquiry visual; and scope all new styles beneath `.website-development-page` so the homepage and SMM + SEO page cannot regress.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, browser-native `IntersectionObserver`, `requestAnimationFrame`, pointer media queries, and CSS transforms/animations. No new runtime dependency.

## Global Constraints

- Preserve all current headings, paragraphs, pricing, package features, FAQs, form fields, consent language, links, and business claims.
- Preserve the existing section order and internal anchors.
- Retain the light, conversion-focused foundation rather than turning the entire page dark.
- Use the approved DSE orange, warm gradient, dark neutral, Anek Telugu heading font, Poppins body font, and Montserrat accent font.
- Keep the lead form visible in the hero on desktop and near the top on smaller screens.
- Maintain SEO metadata, structured data, semantic headings, and crawlable text.
- All essential information and controls must work without hover or JavaScript.
- Do not add a CMS, analytics service, animation framework, or remote video dependency.

## File Structure

- Create `components/landing/WebsiteDevelopmentExperience.tsx`: owns page-progress state, section reveals, pointer spotlight, card tilt, and magnetic CTA movement through progressive enhancement.
- Create `components/landing/InteractiveWebsiteJourney.tsx`: renders the decorative browser/search/call journey inside the existing results visual without owning marketing content.
- Modify `app/(landing-pages)/website-development/page.tsx`: adds scoped classes and data hooks, mounts both focused components, and preserves all existing copy/data.
- Modify `app/globals.css`: adds the scoped desktop, tablet, mobile, keyboard, and reduced-motion presentation.

---

### Task 1: Add the Progressive Interaction Controller

**Files:**
- Create: `components/landing/WebsiteDevelopmentExperience.tsx`
- Modify: `app/(landing-pages)/website-development/page.tsx`

**Interfaces:**
- Consumes: DOM hooks `[data-wd-reveal]`, `[data-wd-tilt]`, `[data-wd-spotlight]`, and `[data-wd-magnetic]` rendered by the page, plus the existing `.lead-form button`.
- Produces: `WebsiteDevelopmentExperience(): JSX.Element`, CSS variables `--wd-page-progress`, `--wd-pointer-x`, `--wd-pointer-y`, `--wd-tilt-x`, `--wd-tilt-y`, `--wd-magnet-x`, and `--wd-magnet-y`, plus `.is-visible` state classes.

- [ ] **Step 1: Record the failing rendered-markup check**

Run with the dev server active:

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'website-development-page|wd-page-progress|data-wd-reveal'
```

Expected: exit code `1` because the interaction hooks do not exist yet.

- [ ] **Step 2: Create the controller**

Create `components/landing/WebsiteDevelopmentExperience.tsx` with this complete behaviour:

```tsx
"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a,button,input,select,textarea,[role='button']";

export function WebsiteDevelopmentExperience() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".website-development-page");
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const revealNodes = [...page.querySelectorAll<HTMLElement>("[data-wd-reveal]")];
    const frameIds = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8%" }
    );
    revealNodes.forEach((node) => observer.observe(node));

    const updateProgress = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const value = Math.min(Math.max(window.scrollY / max, 0), 1);
      progressRef.current?.style.setProperty("--wd-page-progress", String(value));
    };

    const updatePointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const target = event.currentTarget as HTMLElement;
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const previous = frameIds.get(target);
      if (previous) cancelAnimationFrame(previous);
      frameIds.set(target, requestAnimationFrame(() => {
        target.style.setProperty("--wd-pointer-x", `${x * 100}%`);
        target.style.setProperty("--wd-pointer-y", `${y * 100}%`);
        if (target.matches("[data-wd-tilt]")) {
          target.style.setProperty("--wd-tilt-x", `${(0.5 - y) * 8}deg`);
          target.style.setProperty("--wd-tilt-y", `${(x - 0.5) * 8}deg`);
        }
      }));
    };

    const resetPointer = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.removeProperty("--wd-tilt-x");
      target.style.removeProperty("--wd-tilt-y");
    };

    const updateMagnet = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const target = event.currentTarget as HTMLElement;
      if ((event.target as Element | null)?.closest(INTERACTIVE) !== target) return;
      const bounds = target.getBoundingClientRect();
      target.style.setProperty("--wd-magnet-x", `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`);
      target.style.setProperty("--wd-magnet-y", `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`);
    };

    const resetMagnet = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.removeProperty("--wd-magnet-x");
      target.style.removeProperty("--wd-magnet-y");
    };

    const pointerNodes = [...page.querySelectorAll<HTMLElement>("[data-wd-spotlight], [data-wd-tilt]")];
    const magneticNodes = [...page.querySelectorAll<HTMLElement>("[data-wd-magnetic], .lead-form button")];
    pointerNodes.forEach((node) => {
      node.addEventListener("pointermove", updatePointer);
      node.addEventListener("pointerleave", resetPointer);
    });
    magneticNodes.forEach((node) => {
      node.addEventListener("pointermove", updateMagnet);
      node.addEventListener("pointerleave", resetMagnet);
    });

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      observer.disconnect();
      frameIds.forEach((id) => cancelAnimationFrame(id));
      pointerNodes.forEach((node) => {
        node.removeEventListener("pointermove", updatePointer);
        node.removeEventListener("pointerleave", resetPointer);
      });
      magneticNodes.forEach((node) => {
        node.removeEventListener("pointermove", updateMagnet);
        node.removeEventListener("pointerleave", resetMagnet);
      });
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return <span aria-hidden="true" className="wd-page-progress" ref={progressRef} />;
}
```

- [ ] **Step 3: Add the page scope and controller mount**

Modify the imports and root element in `app/(landing-pages)/website-development/page.tsx`:

```tsx
import { WebsiteDevelopmentExperience } from "@/components/landing/WebsiteDevelopmentExperience";

export default function HomePage() {
  return (
    <main className="landing-page website-development-page">
      <WebsiteDevelopmentExperience />
      <LocalBusinessJsonLd />
```

Add `data-wd-reveal` to each top-level section content container, add `data-wd-spotlight` to the lead card and comparison wrapper, and add `data-wd-magnetic` to existing CTA anchors and the existing form submit control through a scoped descendant selector rather than changing its text.

- [ ] **Step 4: Run the markup and type checks**

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'website-development-page|wd-page-progress|data-wd-reveal'
npm run typecheck
```

Expected: markup check returns matches and TypeScript exits `0`.

- [ ] **Step 5: Commit the controller boundary**

```bash
git add components/landing/WebsiteDevelopmentExperience.tsx 'app/(landing-pages)/website-development/page.tsx'
git commit -m "Add website landing interaction controller"
```

---

### Task 2: Build the Hero and Global Journey Presentation

**Files:**
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `WebsiteDevelopmentExperience` variables and classes from Task 1.
- Produces: `.wd-page-progress`, `.wd-hero-grid-art`, `.wd-hero-fragment`, scoped reveal, spotlight, tilt, and magnetic CTA styles.

- [ ] **Step 1: Verify the new hero art is absent**

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'wd-hero-grid-art|wd-hero-fragment'
```

Expected: exit code `1`.

- [ ] **Step 2: Add decorative hero markup without changing copy**

Inside the existing hero section, before `.container.hero-grid`, add:

```tsx
<div aria-hidden="true" className="wd-hero-grid-art">
  <span className="wd-hero-fragment fragment-browser"><i /><i /><i /><b /></span>
  <span className="wd-hero-fragment fragment-mobile"><b /><i /><i /></span>
  <span className="wd-hero-fragment fragment-search">
    <span className="material-symbols-outlined">search</span>
  </span>
  <span className="wd-hero-fragment fragment-enquiry">
    <span className="material-symbols-outlined">call</span>
  </span>
</div>
```

Add `data-wd-reveal` to `.hero-content`, `data-wd-spotlight data-wd-tilt` to `.lead-card`, and `data-wd-magnetic` to the existing primary form submit button through `.website-development-page .lead-form button` styling.

- [ ] **Step 3: Add scoped hero and global motion CSS**

Append a dedicated `/* Website development interactive experience */` block to `app/globals.css` containing:

```css
.website-development-page { position: relative; overflow: clip; }
.wd-page-progress { position: fixed; z-index: 70; top: 80px; left: 0; width: 100%; height: 3px; pointer-events: none; }
.wd-page-progress::after { display: block; width: calc(var(--wd-page-progress, 0) * 100%); height: 100%; background: linear-gradient(90deg,#fe6807,#ffad45,#ff3d93); box-shadow: 0 0 18px rgba(254,104,7,.56); content: ""; transition: width 80ms linear; }
.website-development-page [data-wd-reveal] { opacity: 0; transform: translateY(34px); transition: opacity .75s ease, transform .75s cubic-bezier(.2,.8,.2,1); }
.website-development-page [data-wd-reveal].is-visible { opacity: 1; transform: none; }
.website-development-page [data-wd-spotlight]::after { position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(circle at var(--wd-pointer-x,50%) var(--wd-pointer-y,50%),rgba(254,104,7,.16),transparent 34%); pointer-events: none; content: ""; opacity: 0; transition: opacity .25s ease; }
.website-development-page [data-wd-spotlight]:hover::after,
.website-development-page [data-wd-spotlight]:focus-within::after { opacity: 1; }
.website-development-page [data-wd-tilt] { transform: perspective(1100px) rotateX(var(--wd-tilt-x,0deg)) rotateY(var(--wd-tilt-y,0deg)); transform-style: preserve-3d; transition: transform .2s ease, box-shadow .25s ease; }
.website-development-page [data-wd-magnetic] { transform: translate(var(--wd-magnet-x,0),var(--wd-magnet-y,0)); }
.website-development-page .hero { isolation: isolate; min-height: calc(100svh - 80px); background: linear-gradient(125deg,#fff9f5 0%,#eef4ff 58%,#fff0e7 100%); }
.wd-hero-grid-art { position: absolute; z-index: -1; inset: 0; overflow: hidden; pointer-events: none; }
.wd-hero-grid-art::before { position: absolute; inset: 0; background-image: linear-gradient(rgba(254,104,7,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(254,104,7,.055) 1px,transparent 1px); background-size: 54px 54px; mask-image: linear-gradient(90deg,#000,transparent 70%); content: ""; animation: wd-grid-drift 18s linear infinite; }
.wd-hero-fragment { position: absolute; border: 1px solid rgba(254,104,7,.2); background: rgba(255,255,255,.5); box-shadow: 0 24px 70px rgba(74,29,0,.1); backdrop-filter: blur(12px); animation: wd-float 7s ease-in-out infinite; }
.fragment-browser { top: 13%; left: 43%; width: 260px; height: 150px; border-radius: 18px; opacity: .46; }
.fragment-mobile { bottom: 8%; left: 48%; width: 90px; height: 160px; border-radius: 22px; animation-delay: -2s; }
.fragment-search { top: 18%; right: 5%; display: grid; width: 74px; height: 74px; border-radius: 50%; place-items: center; }
.fragment-enquiry { right: 30%; bottom: 9%; display: grid; width: 64px; height: 64px; border-radius: 18px; place-items: center; animation-delay: -4s; }
@keyframes wd-grid-drift { to { transform: translate3d(54px,54px,0); } }
@keyframes wd-float { 50% { transform: translate3d(0,-16px,0) rotate(2deg); } }
```

Add the fragment internals, hero form depth, CTA sweep, focus-visible, and form-focus motion suppression with this CSS. Do not change any button label.

```css
.fragment-browser > i { position: relative; display: inline-block; width: 7px; height: 7px; margin: 14px 0 0 8px; border-radius: 50%; background: rgba(9,8,14,.28); }
.fragment-browser > b { position: absolute; inset: 36px 14px 14px; border-radius: 10px; background: linear-gradient(135deg,rgba(254,104,7,.18),rgba(255,255,255,.42)); }
.fragment-mobile > b { position: absolute; inset: 10px; border-radius: 15px; background: linear-gradient(180deg,rgba(254,104,7,.18),rgba(255,255,255,.6)); }
.fragment-mobile > i { position: relative; display: block; width: 46px; height: 6px; margin: 42px auto -28px; border-radius: 999px; background: rgba(9,8,14,.18); }
.website-development-page .lead-card[data-wd-tilt] { position: relative; z-index: 2; transform-origin: center; box-shadow: 0 30px 90px rgba(74,29,0,.15); }
.website-development-page .lead-card:focus-within { transform: none; box-shadow: 0 34px 100px rgba(254,104,7,.2); }
.website-development-page :is(.primary-button,.outline-button,.secondary-button,.lead-form button) { position: relative; overflow: hidden; isolation: isolate; transition: transform .2s ease,box-shadow .2s ease,background .2s ease,color .2s ease; }
.website-development-page :is(.primary-button,.outline-button,.secondary-button,.lead-form button)::before { position: absolute; z-index: -1; inset: 0; background: linear-gradient(110deg,transparent 25%,rgba(255,255,255,.42) 48%,transparent 72%); content: ""; transform: translateX(-120%); transition: transform .55s ease; }
.website-development-page :is(.primary-button,.outline-button,.secondary-button,.lead-form button):hover::before,
.website-development-page :is(.primary-button,.outline-button,.secondary-button,.lead-form button):focus-visible::before { transform: translateX(120%); }
.website-development-page :is(a,button,input,select):focus-visible { outline: 3px solid #ffad45; outline-offset: 4px; }
```

- [ ] **Step 4: Verify hero render and form usability**

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'wd-hero-grid-art|Get Your Business Website|Book your website from ₹3,999'
npm run typecheck
```

Expected: all three strings match and TypeScript exits `0`.

- [ ] **Step 5: Commit the hero experience**

```bash
git add 'app/(landing-pages)/website-development/page.tsx' app/globals.css
git commit -m "Build interactive website landing hero"
```

---

### Task 3: Upgrade the Comparison and Industry Cards

**Files:**
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: pointer and reveal hooks from Task 1.
- Produces: interactive comparison rows and `.wd-industry-browser` preview chrome for every industry card.

- [ ] **Step 1: Confirm card hooks and preview chrome are absent**

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'data-wd-tilt|wd-industry-browser'
```

Expected: `wd-industry-browser` does not match.

- [ ] **Step 2: Add hooks and decorative card chrome**

Keep each card's existing title, paragraph, image, and link. Change only the wrapper attributes and append decorative markup:

```tsx
<article className="industry-card" data-wd-reveal data-wd-spotlight data-wd-tilt key={card.title}>
  <div aria-hidden="true" className="wd-industry-browser">
    <i /><i /><i />
    <span className="material-symbols-outlined">north_east</span>
  </div>
  <div className="industry-image" style={{ backgroundImage: `url("${card.image}")` }} />
  <div className="industry-content">
    <h3>{card.title}</h3>
    <p>{card.text}</p>
    <a className="secondary-button" data-wd-magnetic href="#lead-form">
      View package
      <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
    </a>
  </div>
</article>
```

Add `data-wd-spotlight data-wd-reveal` to `.comparison`, and add a reveal delay CSS variable to the existing rows without changing cell text.

- [ ] **Step 3: Add the interaction styles**

Add scoped CSS that:

- keeps table layout and every cell visible;
- introduces an orange left trace and spotlight on the active comparison row;
- animates included status icons once the table is visible;
- positions `.wd-industry-browser` above the image and reveals it on hover/focus;
- shifts the industry image by no more than `4%` and scales it to no more than `1.08`;
- reveals the arrow without changing the link's accessible name;
- falls back to static cards on coarse pointers.

Use these limits:

```css
.website-development-page .industry-card { min-height: 270px; border-radius: 22px; }
.website-development-page .industry-card:hover,
.website-development-page .industry-card:focus-within { box-shadow: 0 28px 70px rgba(9,8,14,.22); }
.wd-industry-browser { position: absolute; z-index: 2; top: 18px; left: 18px; right: 18px; height: 34px; border: 1px solid rgba(255,255,255,.24); border-radius: 10px; background: rgba(9,8,14,.42); opacity: 0; transform: translateY(-12px); transition: opacity .3s ease, transform .3s ease; }
.industry-card:hover .wd-industry-browser,
.industry-card:focus-within .wd-industry-browser { opacity: 1; transform: none; }
```

- [ ] **Step 4: Check content preservation and types**

```bash
rg -n 'Basic Website SEO|Google My Business Setup and Manage|Pre-Schooling|Doctors & Clinics|E-commerce Stores|View package' 'app/(landing-pages)/website-development/page.tsx'
npm run typecheck
```

Expected: every original content string still matches and TypeScript exits `0`.

- [ ] **Step 5: Commit the card upgrades**

```bash
git add 'app/(landing-pages)/website-development/page.tsx' app/globals.css
git commit -m "Enhance website comparison and industry cards"
```

---

### Task 4: Replace the Static Results Placeholder with an Interactive Journey

**Files:**
- Create: `components/landing/InteractiveWebsiteJourney.tsx`
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing results-section wrapper, heading, metrics, and proof quote.
- Produces: `InteractiveWebsiteJourney(): JSX.Element` containing decorative search, browser, trust, and enquiry stages.

- [ ] **Step 1: Confirm the journey is absent**

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'wd-website-journey'
```

Expected: exit code `1`.

- [ ] **Step 2: Create the presentational journey component**

Create `components/landing/InteractiveWebsiteJourney.tsx`:

```tsx
import type { CSSProperties } from "react";

const stages = [
  ["search", "Search"],
  ["language", "Website"],
  ["verified", "Trust"],
  ["call", "Enquiry"]
] as const;

export function InteractiveWebsiteJourney() {
  return (
    <div aria-hidden="true" className="wd-website-journey">
      <div className="wd-journey-browser">
        <span className="wd-journey-browser-bar"><i /><i /><i /><b /></span>
        <div className="wd-journey-canvas">
          <span className="wd-journey-copy-line long" />
          <span className="wd-journey-copy-line" />
          <span className="wd-journey-button" />
          <span className="wd-journey-phone"><i /><b /><i /></span>
        </div>
      </div>
      <div className="wd-journey-track">
        {stages.map(([icon, label], index) => (
          <span className="wd-journey-stage" key={label} style={{ "--wd-stage": index } as CSSProperties}>
            <i className="material-symbols-outlined">{icon}</i>
            <b>{label}</b>
          </span>
        ))}
      </div>
      <span className="wd-journey-signal"><i /></span>
    </div>
  );
}
```

- [ ] **Step 3: Replace only the placeholder artwork**

Import the component and replace the current `.video-placeholder` element with:

```tsx
<div className="wd-journey-shell" data-wd-reveal data-wd-spotlight data-wd-tilt>
  <InteractiveWebsiteJourney />
</div>
```

Keep the existing `.proof-quote` paragraph directly below it with its exact current text.

- [ ] **Step 4: Style the cinematic journey**

Add scoped CSS for a dark browser canvas, animated orange signal, four staged nodes, a responsive phone mockup, and paused-on-hover timing. Use only transforms and opacity for continuous animation. The core layout must remain visible when animation is disabled:

```css
.wd-journey-shell { position: relative; min-height: 390px; overflow: hidden; border-radius: 24px 24px 0 0; background: radial-gradient(circle at var(--wd-pointer-x,72%) var(--wd-pointer-y,20%),rgba(254,104,7,.34),transparent 34%),#15131a; }
.wd-website-journey { position: absolute; inset: 0; padding: clamp(24px,4vw,46px); }
.wd-journey-browser { position: relative; width: min(82%,620px); height: 72%; border: 1px solid rgba(255,255,255,.18); border-radius: 20px; background: rgba(255,255,255,.08); box-shadow: 0 35px 90px rgba(0,0,0,.32); }
.wd-journey-stage { animation: wd-stage-pulse 4.8s ease-in-out infinite; animation-delay: calc(var(--wd-stage) * .35s); }
@keyframes wd-stage-pulse { 0%,100% { opacity: .48; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-5px); } }
```

- [ ] **Step 5: Run component and content checks**

```bash
curl -sS http://127.0.0.1:3000/website-development | rg 'wd-website-journey|A Clear Website Helps Customers Understand What You Sell and Contact You Faster'
npm run typecheck
```

Expected: both strings match and TypeScript exits `0`.

- [ ] **Step 6: Commit the results journey**

```bash
git add components/landing/InteractiveWebsiteJourney.tsx 'app/(landing-pages)/website-development/page.tsx' app/globals.css
git commit -m "Add interactive search to enquiry journey"
```

---

### Task 5: Finish Pricing, Support, Responsive, and Accessibility States

**Files:**
- Modify: `app/(landing-pages)/website-development/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: data hooks and variables from Task 1.
- Produces: spotlight pricing cards, animated checks, consistent CTA focus/hover treatment, touch-safe layouts, and reduced-motion fallbacks.

- [ ] **Step 1: Add hooks without touching plan data**

Add `data-wd-reveal data-wd-spotlight data-wd-tilt` to each `.price-card`, add `data-wd-magnetic` and an `arrow_forward` icon to each existing pricing CTA, and add `data-wd-reveal data-wd-spotlight` to service, FAQ-side, and mini cards. Do not edit `prices`, `faqs`, `performanceStats`, or `industryCards`.

- [ ] **Step 2: Add the final scoped interaction styles**

Implement:

```css
.website-development-page .price-card { overflow: hidden; border-radius: 24px; }
.website-development-page .price-card::before { position: absolute; inset: 0; background: radial-gradient(circle at var(--wd-pointer-x,50%) var(--wd-pointer-y,50%),rgba(254,104,7,.13),transparent 32%); pointer-events: none; content: ""; opacity: 0; transition: opacity .25s ease; }
.website-development-page .price-card:hover::before,
.website-development-page .price-card:focus-within::before { opacity: 1; }
.website-development-page .check-list li { transition: transform .25s ease, opacity .25s ease; }
.website-development-page .is-visible .check-list li { animation: wd-check-in .45s ease both; }
@keyframes wd-check-in { from { opacity: 0; transform: translateX(-10px); } }
.website-development-page :is(.primary-button,.outline-button,.secondary-button) .material-symbols-outlined { font-size: 1.1rem; transition: transform .2s ease; }
.website-development-page :is(.primary-button,.outline-button,.secondary-button):hover .material-symbols-outlined,
.website-development-page :is(.primary-button,.outline-button,.secondary-button):focus-visible .material-symbols-outlined { transform: translateX(5px); }
.website-development-page :is(a,button):focus-visible { outline: 3px solid #ffad45; outline-offset: 4px; }
```

Apply stagger delays with `:nth-child()` selectors only; do not add inline timing props to content data.

- [ ] **Step 3: Add tablet, mobile, and reduced-motion rules**

Add exact behavioural fallbacks:

```css
@media (max-width: 960px), (hover: none), (pointer: coarse) {
  .website-development-page [data-wd-tilt],
  .website-development-page [data-wd-magnetic] { transform: none; }
  .wd-industry-browser { opacity: 1; transform: none; }
  .wd-hero-fragment { animation-duration: 11s; opacity: .24; }
}
@media (max-width: 640px) {
  .wd-page-progress { top: 70px; }
  .website-development-page .hero { min-height: auto; }
  .wd-hero-grid-art { opacity: .52; }
  .fragment-browser { left: 35%; width: 190px; }
  .fragment-mobile { display: none; }
  .wd-journey-shell { min-height: 300px; }
  .wd-journey-browser { width: 94%; height: 64%; }
  .wd-journey-track { overflow-x: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .website-development-page *,
  .website-development-page *::before,
  .website-development-page *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .website-development-page [data-wd-reveal] { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Verify all content anchors and pricing remain intact**

```bash
rg -n '₹3,999|₹6,999|₹8,999|#lead-form|#pricing|#faq|Get Your Professional Website Starting from|Clear Answers Before You Start' 'app/(landing-pages)/website-development/page.tsx'
npm run typecheck
```

Expected: all original prices, anchors, and headings match; TypeScript exits `0`.

- [ ] **Step 5: Commit the final interaction states**

```bash
git add 'app/(landing-pages)/website-development/page.tsx' app/globals.css
git commit -m "Finish website landing responsive interactions"
```

---

### Task 6: Full Regression and Visual Verification

**Files:**
- Verify: `app/(landing-pages)/website-development/page.tsx`
- Verify: `components/landing/WebsiteDevelopmentExperience.tsx`
- Verify: `components/landing/InteractiveWebsiteJourney.tsx`
- Verify: `app/globals.css`

**Interfaces:**
- Consumes: the complete `/website-development` experience.
- Produces: verified desktop, tablet, mobile, keyboard, reduced-motion, and production-build behaviour.

- [ ] **Step 1: Run static verification**

```bash
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit `0`; build output includes `/website-development`.

- [ ] **Step 2: Verify the live page at desktop size**

Open `http://127.0.0.1:3000/website-development` at `1440 × 1000` and verify:

- the hero form is above the fold and fully usable;
- the page progress rail advances while scrolling;
- the hero art stays behind copy and form;
- comparison rows illuminate without obscuring text;
- industry cards tilt without clipping;
- the results journey is visible and the existing quote is unchanged;
- pricing cards do not overlap and every CTA reaches `#lead-form`;
- floating call and WhatsApp controls remain unobstructed.

- [ ] **Step 3: Verify tablet and mobile sizes**

At `820 × 1180` and `390 × 844`, verify:

- no horizontal page overflow;
- the comparison remains usable through its intended horizontal container;
- cursor-only effects are disabled;
- industry previews remain understandable without hover;
- the journey becomes compact rather than increasing page height excessively;
- headings, prices, buttons, consent copy, and form inputs are not clipped.

- [ ] **Step 4: Verify keyboard and reduced motion**

Navigate all anchors, form inputs, pricing CTAs, FAQ controls, and contact actions with the keyboard. Confirm visible focus rings. Emulate `prefers-reduced-motion: reduce` and confirm reveals are immediately visible and continuous animations stop.

- [ ] **Step 5: Compare protected content**

```bash
rg -n 'Get Your Professional Website Starting from|What.s Included|Websites for Everyday Businesses|Turn.*Local Searches.*Into Real|Pocket-Friendly Pricing|Clear Answers Before You Start' 'app/(landing-pages)/website-development/page.tsx'
rg -n '4–5 Static Pages|Admin Dashboard|E-Commerce / Storefront|Is ₹3,999 the final price of the website' 'app/(landing-pages)/website-development/page.tsx'
```

Expected: all protected strings remain present.

- [ ] **Step 6: Commit any verification-only fixes**

If verification required scoped CSS or accessibility corrections, commit only those files:

```bash
git add 'app/(landing-pages)/website-development/page.tsx' components/landing/WebsiteDevelopmentExperience.tsx components/landing/InteractiveWebsiteJourney.tsx app/globals.css
git commit -m "Verify website landing interactive redesign"
```

If no fixes were required, do not create an empty commit.
