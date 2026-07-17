# Homepage Process Mask Cards — Design Specification

**Project:** DSE Consultancy website

**Page:** Homepage `/`

**Section:** `#process` / “How We Work”

**Date:** 17 July 2026

**Status:** Approved interaction direction; ready for implementation planning after owner review

## 1. Objective

Replace the homepage’s current static four-column process presentation with an immersive four-card stacking sequence inspired by the interaction pattern on [Studio Modular](https://studiomodular.be/).

The implementation must adapt the interaction to DSE Consultancy rather than reproduce the reference website’s branding or content. It must preserve the current process message while making the section feel premium, cinematic, and clearly connected to DSE’s Discover → Design → Build → Improve methodology.

This change applies only to the homepage process section. It does not authorize a hero redesign, homepage restructuring, service-page rewrite, or unrelated visual refactor.

## 2. Existing Content To Preserve

The section retains this heading:

> A Clear Process From First Conversation To Continuous Improvement.

The four steps retain their current numbering and copy:

### 01 — Discover

> We understand the business, audience, location, services and the action customers should take.

### 02 — Design

> We shape the message, visual direction, page structure and channel plan around that customer journey.

### 03 — Build

> We create, connect and test the website, search, content and enquiry touchpoints.

### 04 — Improve

> We review useful signals and refine the system as the business, content and customer needs evolve.

Minor punctuation or line-breaking changes are allowed only to improve display and accessibility. The meaning must not change.

## 3. Recommended Interaction Model

Use native CSS sticky positioning for the card stack, supported by a small client component for visibility-aware video playback and progressive enhancement.

The section flow is:

1. The existing “How We Work” kicker and heading introduce the process.
2. Discover enters as the first large rounded card.
3. As the page scrolls, Design rises from below and covers most of Discover.
4. A narrow Discover header strip remains visible above Design.
5. Build rises and covers most of Design while the Discover and Design strips remain visible.
6. Improve rises last, leaving the three earlier card headers visible as a layered stack.
7. Improve completes normally and the section releases into “Latest Thinking” without trapping the scroll position.

The cards must not animate by changing document-layout dimensions on every scroll frame. Sticky positioning, transforms, opacity, and CSS custom properties should provide the effect.

## 4. Card Anatomy

Each card contains:

- A full-bleed background video.
- A dark-to-transparent overlay that preserves text contrast.
- Step number and short phase label in the persistent top strip.
- Large phase title.
- Existing process description.
- Three short outcome tags that clarify the phase without introducing unsupported claims.
- A subtle vertical or circular progress marker that shows the card’s position in the four-step journey.

The outcome tags are:

| Phase | Tags |
|---|---|
| Discover | Business Goals; Customer Journey; Local Demand |
| Design | Message; Visual Direction; Page Structure |
| Build | Website; Search Setup; Enquiry Paths |
| Improve | Useful Signals; Content Refinement; Ongoing Optimisation |

The full card is informational rather than a separate navigation destination. No new CTA is required inside the cards. The normal page journey continues into the existing insights and final contact sections.

## 5. Video Direction

Each card uses a different relevant video:

### Discover

Show a consultation, business owner planning, customer research, local search behaviour, map navigation, or service discovery. The clip should communicate listening and understanding rather than generic office decoration.

### Design

Show wireframes, UI composition, website layouts, brand systems, customer-flow planning, or a designer arranging interface components.

### Build

Show website development, coding, responsive testing, integration, QA, or a controlled launch workflow. Avoid unreadable walls of code as the only visual.

### Improve

Show analytics review, SEO signals, social performance, lead notifications, content refinement, or a team making evidence-based improvements.

### Asset requirements

- Use properly licensed commercial-use video or approved user-provided footage.
- Store final local assets under `public/videos/home-process/` as:
  - `discover.mp4`
  - `design.mp4`
  - `build.mp4`
  - `improve.mp4`
- Prefer MP4 H.264 with dimensions appropriate for the rendered card and no audio track.
- Keep each clip short and seamless enough to loop without distracting jumps.
- Target a practical compressed size, ideally below 4 MB per clip and no more than 6 MB unless visual quality clearly requires it.
- Set a meaningful poster frame for reduced-motion and data-saving situations.
- Record each externally sourced asset’s source URL, author/provider, and licence in `docs/VIDEO_SOURCES.md`.

## 6. DSE Visual Direction

The reference contributes the stacking pattern and card proportions only. DSE branding remains authoritative.

Use:

- Vampire Black `#09080E` for the surrounding section.
- Blaze Orange `#FE6807` for active progress, borders, and small accents.
- Heat Orange `#FF8124` and Glow Orange `#FFAD45` for restrained gradients.
- Warm White `#FFF9F5` for high-priority copy.
- Anek Telugu for headings and phase titles.
- Poppins for descriptions, tags, and interface labels.

Card treatment:

- Large rounded corners consistent with existing homepage cards.
- Full-bleed video with a dark neutral overlay and a subtle orange edge glow.
- Warm-white text with WCAG-compliant contrast.
- Orange is an accent rather than an opaque layer that hides the video.
- Each exposed header strip remains readable when later cards cover the body.

Do not import the reference’s green, blue, pink, purple, or yellow palette.

## 7. Component Architecture

Create one focused client component:

`components/landing/HomeProcessStack.tsx`

Responsibilities:

- Render the four cards from a typed data array.
- Manage visibility-aware video playback with `IntersectionObserver`.
- Apply the active-card state used for progressive enhancement and accessibility announcements where appropriate.
- Respect reduced-motion preferences.
- Avoid direct window access before client hydration.

The homepage file `app/(landing-pages)/page.tsx` remains responsible for:

- The page-level process data.
- Section ordering.
- Rendering the section heading and passing the four steps to `HomeProcessStack`.

Styles remain in `app/globals.css` using a unique `consultancy-process-stack-*` prefix to match the project’s current styling architecture and avoid affecting service-page cards.

No GSAP or Framer Motion dependency should be introduced for this section. Native sticky behavior is the default. A dependency may be reconsidered only if browser verification proves that the approved effect cannot be delivered reliably with the native approach.

## 8. Playback And Data Flow

The component receives static step objects containing:

```text
number
title
description
videoSrc
posterSrc
tags
```

Playback rules:

1. Videos are muted, looping, inline, and free of controls.
2. Only cards intersecting the expanded viewport attempt playback.
3. Videos pause when the section is well outside the viewport.
4. Failure to autoplay must not hide content or leave a blank card; the poster frame remains visible.
5. The card copy is regular HTML and never embedded inside video imagery.

There is no API request, database dependency, or persistent user state for this feature.

## 9. Responsive Behaviour

### Desktop and large laptop — 1200 px and above

- Use the complete sticky stack.
- Cards are approximately 78–86 viewport-height units, capped to avoid oversized layouts on short screens.
- The first card’s sticky top accounts for the fixed site header.
- Each subsequent card uses a progressively larger top offset so earlier headers remain visible.
- The content uses a two-zone composition: main copy on the left and tags/progress on the right.

### Tablet and small laptop — 768–1199 px

- Keep a shallower sticky stack when the viewport height can support it.
- Reduce the exposed header-strip height and card copy size.
- Move tags beneath the description if the horizontal composition becomes crowded.
- Disable sticky behavior for unusually short landscape viewports.

### Mobile — below 768 px

- Present the cards in normal vertical flow.
- Do not pin or trap scrolling.
- Use a cinematic video-card height of approximately 62–72 viewport-height units with a sensible pixel cap.
- Keep every title, description, and tag readable without hover.
- Use poster frames if browser autoplay or data-saving settings prevent video playback.

## 10. Accessibility And Motion Safety

- Maintain logical heading order: the section has one `h2`; card titles use `h3`.
- Videos are decorative and use `aria-hidden="true"`; all meaning is present in text.
- Do not rely on hover for information.
- Ensure keyboard users can pass through the section without extra focus stops.
- Preserve a minimum 4.5:1 contrast ratio for body copy.
- Under `prefers-reduced-motion: reduce`, disable sticky transitions and autoplay attempts, show static poster cards, and retain normal vertical document flow.
- The feature must remain usable when JavaScript fails; CSS and semantic HTML provide the readable fallback.

## 11. Performance Requirements

- Do not preload all four video files eagerly.
- Use poster images and `preload="metadata"` or `preload="none"` as verified appropriate.
- Pause videos outside the active section.
- Avoid scroll handlers that run on every frame.
- Avoid layout thrashing and forced synchronous measurement during scroll.
- Verify the section does not introduce horizontal overflow or meaningful cumulative layout shift.
- Preserve acceptable homepage interaction responsiveness on mid-range mobile devices.

## 12. Failure And Fallback Behaviour

- Missing or failed video: show the poster and preserve the overlay/text layout.
- Autoplay blocked: leave the poster visible; do not show an error message.
- Sticky unsupported or unsafe for the viewport: fall back to the normal vertical stack.
- JavaScript unavailable: all cards and their copy remain visible in document order.
- Reduced motion: no pinning, scaling, parallax, or automatic video playback.

## 13. Verification Plan

### Automated checks

- Run TypeScript checking.
- Run the production build.
- Run existing UI tests.
- Add focused tests that confirm four process cards render in the correct order with the approved titles and descriptions.
- Confirm each card has a poster, video source, and three tags.

### Browser checks

Verify the visible homepage at:

- 1440 × 900 desktop.
- 1280 × 720 short laptop.
- 1024 × 1366 tablet portrait.
- 834 × 1194 tablet portrait.
- 390 × 844 mobile.
- 360 × 800 narrow mobile.

Confirm:

- Cards stack in the correct order.
- Exposed header strips do not overlap or clip text.
- Videos correspond to their phase.
- Text remains legible over every point in each loop.
- The fixed header does not cover the active card.
- The final card releases naturally into “Latest Thinking.”
- Mobile never uses a scroll trap.
- Reduced-motion mode displays static readable cards.
- There are no relevant console errors.

## 14. Acceptance Criteria

The feature is complete only when:

- The old four-column process grid is removed from the homepage.
- The heading and all four approved process descriptions remain present.
- Four large cards appear in Discover → Design → Build → Improve order.
- Desktop and supported tablet layouts use the approved overlapping mask-card effect.
- Each card uses a distinct, relevant, licensed local video.
- Earlier card headers remain visibly layered while later cards cover their bodies.
- The DSE black/orange/warm-neutral brand is preserved.
- Mobile uses a readable vertical fallback.
- Reduced-motion mode is supported.
- Videos pause away from the section and fail gracefully to posters.
- The section exits naturally into the existing homepage insights section.
- Type checking, build, UI tests, and required browser checks pass.
