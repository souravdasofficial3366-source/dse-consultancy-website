# Website Development Performance Scroll Cards — Design Specification

## Objective

Replace the existing percentage-ring and video-placeholder area inside the website-development page section titled **“Turn Local Searches Into Real Business Leads”** with a premium three-stage scroll story.

The interaction may take inspiration from the numbered narrative-left and animated-interface-right presentation on [Patch AI](https://thepatchsystem.com/ai), but the implementation, interface artwork, copy, code, and brand treatment must be original to DSE Consultancy.

## Scope

- Modify only the `#results` section on `/website-development` and any dedicated component, styling, and tests required by that section.
- Preserve the current section heading:
  - `Turn Local Searches Into Real Business Leads`
- Remove:
  - the looping circular percentage animations;
  - the website walkthrough video placeholder;
  - the current proof-panel illustration and quote tied to that placeholder.
- Do not add a video to this section.
- Do not present Message, Voice Engine, CRM, or Lead Tracking as services included in a DSE website package.
- Preserve all surrounding website-development sections and their order.

## Experience Structure

The section contains three large numbered cards. On supported desktop and laptop viewports, the section becomes a pinned horizontal scroll sequence driven by the user’s normal vertical mouse-wheel or trackpad scrolling:

1. The section pins below the site header.
2. The first full-width card is visible.
3. Continued vertical page scrolling translates the horizontal card track from right to left.
4. Each card becomes active as it occupies the central stage; only that card runs its detailed interface loop.
5. The progress indicator advances horizontally beneath the cards.
6. After the third card reaches its completed position, the section releases naturally into pricing.

The implementation must not intercept, cancel, or reverse the user’s wheel event. Normal document scroll controls a section-scoped progress value, and that value controls horizontal translation.

Each card uses a two-column composition:

- **Left:** number, eyebrow, title, concise explanation, and one supporting result statement.
- **Right:** an original DSE-themed interface illustration animated with CSS and lightweight React state/timers.

The left-side content remains stable and highly readable. Motion is concentrated on the right.

## Card Content

### 01 — Google-Ready Visibility

**Eyebrow:** Search Visibility

**Title:** Built So Google And Local Customers Understand Your Business

**Body:** Clear service pages, location details, structured headings, and search-friendly technical foundations help the right people discover what you offer.

**Proof statement:** `98 / 100 Google-readiness target`

This is a readiness target and must not be described as a guaranteed first-page ranking or as verified historical performance.

**Right-side interface loop:**

1. A local-service search query types itself.
2. A DSE-branded local result enters the result list.
3. The result highlights and receives a simulated click.
4. A compact website preview opens.
5. The interface resets through a soft fade and repeats.

### 02 — Customer-Friendly Experience

**Eyebrow:** UI And UX Readiness

**Title:** Designed To Feel Clear On Every Screen

**Body:** Mobile-first layouts, readable content, familiar navigation, and prominent actions help visitors understand the business without unnecessary friction.

**Proof statement:** `95 / 100 usability target`

This is a design-readiness target, not a claim that 95 percent of delivered websites have been independently audited.

**Right-side interface loop:**

1. Desktop and mobile website frames move into position.
2. A cursor travels through navigation and a primary CTA.
3. Four interface checks activate in sequence:
   - mobile responsive;
   - clear navigation;
   - readable content;
   - visible contact action.
4. A completion indicator reaches its final state.
5. The interface resets and repeats.

### 03 — Enquiry-Focused Structure

**Eyebrow:** Conversion Path

**Title:** Give Every Interested Customer A Clear Next Step

**Body:** Calls, WhatsApp, and enquiry forms connect attention to an organised follow-up path, making it easier for the business to respond promptly.

**Proof statement:** `80 / 100 enquiry-path target`

This represents the desired completeness of the website enquiry journey. It must not be described as a guarantee that 80 percent of leads will be qualified.

**Right-side interface loop:**

1. A customer enquiry message appears.
2. The message becomes a contact record.
3. The record enters a small DSE lead pipeline.
4. The status moves from `New` to `Contacted` to `Qualified`.
5. Call, WhatsApp, and form counters update.
6. The interface resets and repeats.

## Visual Direction

- DSE brand background: Vampire Black `#09080E` with a restrained grid.
- Primary accent: Blaze Orange `#FE6807`.
- Supporting accents: Heat Orange `#FF8124` and Glow Orange `#FFAD45`.
- Text: Warm White `#FFF9F5` and muted warm-grey secondary copy.
- Headings: Anek.
- Supporting copy and interface labels: Poppins.
- Cards use rounded corners, fine warm-orange borders, subtle inner highlights, and controlled depth.
- The interface modules should feel like credible software screens, not abstract decorative shapes.
- Motion should resemble realistic product interaction: typing, selection, cursor movement, status changes, list insertion, and progress completion.
- No Patch AI branding, assets, text, phone mockup, screenshots, or copied source code may be used.

## Interaction And Motion

- Use native CSS sticky positioning and lightweight React logic rather than a heavy animation dependency.
- A passive, requestAnimationFrame-throttled scroll measurement is allowed only while the pinned story is near the viewport because vertical page progress must drive horizontal translation.
- Do not call `preventDefault()` on wheel, touch, or scroll events.
- Use transforms and opacity for the primary movement to remain GPU-friendly.
- Only the active or near-active card should run its detailed interface loop.
- Pause loops when the section leaves the viewport.
- Do not rely on hover to reveal essential copy.
- Desktop cards should support subtle pointer parallax on the right-side interface only.
- Pointer parallax must not shift the stable left-side text.
- All loops should reset without a visible jump.

## Responsive Behaviour

### Desktop And Laptop

- Pinned horizontal three-card sequence controlled by normal vertical page scrolling.
- Left/right ratio approximately `42 / 58`.
- Each card must fit comfortably within the usable viewport below the site header.
- The horizontal track uses three full-stage cards and translates by exactly two stage widths from the first card to the third.
- A visible horizontal progress rail communicates position in the sequence.
- No heading, interface control, or card edge may be clipped in the active stage.

### Tablet

- Use the pinned horizontal experience only for wide landscape tablets when both columns remain readable.
- Portrait and short-height tablets use normal vertical card flow.

### Mobile

- Use three normally stacked vertical cards.
- Place the interface artwork below the copy.
- Shorten each automatic loop.
- Prevent horizontal scrolling and preserve comfortable tap targets.

### Reduced Motion

- Disable pinning, horizontal translation, parallax, typing, cursor travel, list movement, and automatic state loops.
- Show each interface in a complete, representative final state.
- Keep all copy and proof statements visible.

## Accessibility

- Use semantic section and article structure.
- The animated interface artwork is supplementary and should be `aria-hidden` unless it communicates information not already present in text.
- Do not use animation alone to communicate the card’s benefit.
- Maintain WCAG AA contrast for all meaningful text.
- Respect `prefers-reduced-motion` in both CSS and component logic.
- Keyboard navigation must not become trapped inside the sticky sequence.

## Component Architecture

Create one dedicated client component for the section, with isolated subcomponents for the three interface demonstrations:

- `WebsitePerformanceStory`
- `SearchVisibilityDemo`
- `UsabilityDemo`
- `EnquiryPipelineDemo`

The card content should be defined in a typed data array. The parent component owns viewport/active-card state. Each demo receives only an `active` flag and renders its own deterministic loop.

This boundary keeps the current page file readable and allows individual interface demonstrations to be tested without coupling them to the rest of the website-development page.

## Performance Requirements

- No video or image downloads are required for this section.
- No new animation framework should be added.
- Use `IntersectionObserver` to attach the passive, requestAnimationFrame-throttled scroll measurement only while the story is near the viewport, and remove it when the section leaves.
- The scroll measurement may update only section progress and active-card index; it must not mutate unrelated page state.
- Suspend timers and animation state while a card is inactive or offscreen.
- The section must not create layout shift after hydration.

## Testing And Acceptance Criteria

### Automated

- The old `score-ring`, score SVG, and video-placeholder markup are absent from the `#results` section.
- All three approved titles, body copy, proof statements, and interface demonstrations are present in order.
- No first-page ranking or qualified-lead guarantee appears in the section.
- Active-card logic cleans up observers and timers.
- Desktop horizontal pinning, landscape-tablet eligibility, portrait/mobile flow, short-height fallback, and reduced-motion rules are covered.
- Progress clamps to `0...1`, horizontal translation clamps to exactly two card widths, and active-card selection resolves to `0`, `1`, or `2` at the correct thirds of the sequence.
- No wheel listener calls `preventDefault()`.
- Full UI tests, typecheck, and production build pass.

### Browser Verification

Verify at minimum:

- `1440 × 900` desktop;
- `1280 × 720` short-height laptop;
- `1024 × 768` tablet;
- `390 × 844` mobile;
- reduced-motion mode when browser tooling permits.

Confirm:

- normal vertical mouse-wheel scrolling moves the card track horizontally from right to left;
- the three cards introduce themselves sequentially and become active in order;
- left-side text remains stable and readable;
- each right-side interface loop is distinct and realistic;
- no percentage ring or video placeholder remains;
- the sequence exits naturally into pricing;
- no horizontal overflow or clipped title is visible;
- reduced-motion and short-height layouts remain readable in normal flow.

## Out Of Scope

- Building a real CRM, voice engine, messaging service, or lead-management backend.
- Adding new website-development package features.
- Changing pricing, package contents, forms, industries, or other page sections.
- Copying reference-site assets, source code, or proprietary branding.
