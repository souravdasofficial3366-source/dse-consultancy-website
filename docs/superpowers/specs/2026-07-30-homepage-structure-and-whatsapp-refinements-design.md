# Homepage Structure and WhatsApp Refinements Design

**Date:** 2026-07-30

**Status:** Approved visual direction; written specification awaiting final review

**Primary scope:** Desktop homepage refinements in the clean Vercel source, plus the shared header and footer WhatsApp interaction corrections described below. Existing tablet and mobile behaviour must not regress.

## 1. Objective

Refine the current DSE Consultancy homepage according to the supplied screenshots without importing the Hostinger homepage structure, which is not an accurate source for the full page.

Hostinger is a reference only for:

- the orange-to-pink About-page call-to-action gradient;
- the top-right header WhatsApp button;
- the expected visible-icon behaviour of the footer contact buttons.

The work must preserve the current page order, copy, typography, videos, cards, animation timing, footer structure, and responsive behaviour unless this specification explicitly changes them.

## 2. Source and Release Safety

Implementation will start from the clean Vercel-aligned source at commit `960e66b`, not from the known inaccurate local checkout or from downloaded Hostinger homepage markup.

The work will be isolated on:

`codex/homepage-structure-and-whatsapp-refinements`

No Hostinger deployment or Hostinger file replacement is part of this change. The About page will not be imported, rebuilt, or structurally modified.

## 3. Considered Approaches

### 3.1 Import the Hostinger homepage

Copy the Hostinger homepage sections into the Vercel code and then layer the requested changes over them.

This is rejected because the user confirmed that the Hostinger homepage is not fully accurate. It would risk changing approved Vercel structure, text placement, animations, and page content.

### 3.2 Redesign the affected sections as new components

Replace the current hero, split-copy, process, closing, header, and footer sections with new component structures.

This is rejected because the requested changes are refinements, not a redesign. A broad component rewrite would increase regression risk without improving the requested result.

### 3.3 Apply targeted markup and style corrections — selected

Keep the current components and content hierarchy. Add only the small semantic hooks needed for arrow circles and the footer WhatsApp icon, remove only the visible process-number markup, and apply section-specific desktop layout rules.

This approach is selected because it preserves the current site while directly correcting every supplied screenshot.

## 4. Approved Homepage Changes

### 4.1 Hero button arrow circles

Both homepage hero buttons keep their current:

- wording;
- destination;
- dimensions and responsive stacking;
- primary or glass treatment;
- hover lift and sheen effects.

Each existing arrow will be placed inside a dedicated 32px circular element based on the service-card CTA treatment.

- The glass button uses an orange circle with a dark arrow.
- The orange primary button uses a dark circle with a light arrow so the circle remains distinct from the button background.
- Hover may rotate or diagonally shift the arrow circle in the same restrained manner as the service-card CTA.
- The arrow remains decorative and excluded from the accessible label.

### 4.2 Services-to-system spacing

Only the bottom padding of `.consultancy-home-services` becomes `0`.

The services section keeps its existing top padding. The following Connected Advantage section keeps its existing internal top spacing. No negative margins or absolute positioning will be introduced.

This removes the duplicated vertical gap shown between the service cards and the next section without affecting spacing elsewhere.

### 4.3 Connected Advantage split

The heading remains:

> Every Customer Touchpoint.  
> One Consistent Business.

At wide desktop widths, each existing heading span must remain one visual line so the heading resolves to two lines in total.

The desktop grid will be changed from the current generic split to a section-specific proportion that:

- gives the heading enough width for both controlled lines;
- keeps the body and CTA in a practical column of approximately 400–440px;
- reduces the empty gap without crowding either column;
- keeps the right copy to a compact, readable number of lines;
- preserves bottom alignment between the two columns.

The font family, font size, font weight, letter spacing, copy, colours, and CTA remain unchanged.

At narrower desktop and tablet widths, the heading may wrap naturally rather than overflow. At the existing responsive breakpoint, the section continues to stack into one column.

### 4.4 Process-card numbers and scroll-matched centre titles

Remove all visible numbering from the four process cards:

- remove the `01`, `02`, `03`, and `04` before the card titles;
- remove the circular `01 of 04`, `02 of 04`, `03 of 04`, and `04 of 04` indicators.

For laptop and desktop widths, replace the current top title row with a new centred title treatment:

- each card owns its associated Discover, Design, Build, or Improve title;
- the active card title is positioned in the horizontal and vertical centre of the visible slide;
- the title sits on the highest local stacking layer, in front of the video, scrim, and other card content;
- the title is large, centred, and high-contrast without changing the title wording;
- as normal page scrolling advances the sticky stack, the title changes with its own card so the visible title always matches the visible slide;
- the interaction remains driven by normal page scrolling, with no carousel controls, timer, forced snap, or intercepted wheel event;
- the bottom description and outcome tags remain in their current zones and must not cover the centred title.

For mobile widths:

- do not force the title into the middle of the smaller card;
- keep a compact title near the top of each card, without the removed number;
- preserve natural vertical scrolling and readable spacing.

Keep:

- descriptions and outcome tags;
- background videos and overlays;
- card borders, heights, sticky stacking, offsets, and animation behaviour.

The internal array index may continue to control sticky offsets and card order, but it must not be rendered as visible text. The data type should no longer require a display number solely for the removed elements.

### 4.5 Latest Thinking split

The heading remains:

> Useful Ideas For Building A  
> Stronger Digital Presence.

At wide desktop widths, each existing heading span must remain one visual line, producing two lines in total.

This section receives its own grid rule instead of inheriting a wide fixed minimum for the CTA column:

- the heading receives the available flexible width;
- the “View All Articles” CTA uses only the width it needs;
- the CTA remains right-aligned and vertically aligned with the heading block;
- the gap remains balanced without pushing the heading into four lines.

Typography, wording, article cards, and CTA styling remain unchanged. Natural wrapping and the existing stacked responsive behaviour remain available at narrower widths.

### 4.6 Closing gradient section

Only the homepage closing section immediately before the footer receives the visual treatment from the Hostinger About-page CTA.

Use the reference gradient:

`linear-gradient(135deg, #fe6807 0%, #ff8124 58%, #d739a4 100%)`

The current approved content remains unchanged:

- “Built Around Better Enquiries” kicker;
- “Turn Digital Attention Into / Real Business Opportunities.” heading;
- supporting paragraph;
- “Plan Your Digital Growth” CTA and `/contact-us` destination.

Against the bright gradient:

- kicker and heading use the dark ink colour `#09080e`;
- supporting copy uses a readable dark translucent colour;
- CTA becomes a black pill with white text;
- existing centred alignment and section dimensions remain intact;
- hover and focus states retain clear contrast.

The dark Blaze-palette override must no longer replace this section’s approved gradient. The About page and shared footer are not altered by this rule.

## 5. WhatsApp Interaction Corrections

### 5.1 Header WhatsApp button

The top-right desktop header WhatsApp button must match the Hostinger reference.

Base state:

- retain the existing 40px square and 8px corner radius;
- use WhatsApp green `#25d366` for the border and icon;
- retain the dark header-compatible background;
- keep the current WhatsApp destination, new-tab behaviour, and accessible label.

Hover and keyboard-focus state:

- use a solid WhatsApp-green background;
- change the icon to dark ink/black so it remains visible;
- preserve a clear focus indicator;
- use only a small lift or existing transition, with no unrelated header movement.

The phone number and other navigation items remain unchanged.

### 5.2 Footer WhatsApp icon

The footer structure, logo, explanatory text, link columns, colours, spacing, and contact-button positions remain unchanged.

Add a dedicated semantic class to the WhatsApp contact link so its image can follow the same visual contrast rule as the neighbouring phone and email icons.

- The existing footer contact-circle base appearance stays unchanged.
- In the normal state, the WhatsApp glyph uses the same orange tone as the neighbouring phone and email glyphs instead of white.
- On hover and keyboard focus, the circle keeps the existing orange background.
- The WhatsApp glyph changes to dark ink/black, matching the phone and email glyphs.
- The glyph must remain visible throughout the transition.
- The WhatsApp URL and accessible label remain unchanged.

The floating green “Chat now” button is already correct and must not change.

## 6. Files Expected to Change

Primary implementation files:

- `app/(landing-pages)/page.tsx`
- `components/landing/HomeProcessStack.tsx`
- `components/layout/LayoutParts.tsx`
- `app/globals.css`

Focused tests may be added or updated under `tests/`.

No pricing data, FAQ content, lead forms, service-page content, About-page structure, footer copy, or Hostinger files are in scope.

## 7. Test-First Regression Protection

Before production edits, add focused tests that fail against the current implementation and verify:

1. Both hero arrows use the dedicated circular wrapper.
2. Homepage services bottom padding is zero without changing the shared section group.
3. Connected Advantage has a section-specific wide-desktop split and controlled two-line spans.
4. Process-card display numbers and `of 04` indicators are absent while index-driven stacking remains.
5. Each laptop/desktop process card owns a centred, foreground title that changes with the visible sticky slide; mobile keeps a compact top title.
6. Latest Thinking uses a flexible heading plus intrinsic-width CTA layout and controlled two-line spans.
7. The homepage closing section uses the approved orange-pink gradient, dark text, and black pill CTA despite the Blaze palette.
8. The header WhatsApp button uses green base and hover treatments.
9. The footer WhatsApp link has a dedicated hook, matches neighbouring orange glyphs normally, and has a dark visible glyph on hover/focus.
10. The floating WhatsApp button remains green and unchanged.
11. Responsive rules still prevent overflow and preserve existing one-column fallbacks.

Tests should assert user-visible behaviour and stable structural contracts, not incidental formatting.

## 8. Verification

After focused tests pass:

- run the complete relevant test suite;
- run lint/type checks available in the project;
- run the production build;
- inspect the homepage in a browser at representative wide desktop, laptop, tablet, and mobile widths;
- inspect keyboard focus for both WhatsApp controls;
- confirm every header, footer, hero, CTA, phone, email, and WhatsApp destination still works;
- confirm the About page has not changed;
- compare the closing gradient and header WhatsApp control with the Hostinger references;
- confirm there is no horizontal overflow, clipped heading, invisible icon, or mobile regression.

Deployment is not complete until the intended Vercel project and production URL are verified after merge.

## 9. Acceptance Criteria

The work is accepted when:

- all eight approved corrections are visible on the Vercel candidate;
- the two requested desktop headings resolve to two controlled lines at the supplied desktop scale;
- the right-side copy and CTA columns remain readable rather than stretched or excessively wrapped;
- no process numbers remain visible;
- the laptop/desktop process title appears in the centre foreground of its own slide and changes with the card reached through normal scrolling;
- mobile process titles remain compact and readable near the top rather than being forced into the centre;
- the closing section matches the About-page gradient reference without copying the About page;
- the header WhatsApp button matches Hostinger;
- the footer WhatsApp glyph matches the neighbouring orange glyphs normally and remains visible in black on orange hover/focus;
- the floating WhatsApp button and footer layout are unchanged;
- automated checks and browser verification pass;
- no unrelated page, animation, content, pricing, form, or responsive structure changes.

## 10. Non-Goals

- Rebuilding or importing the Hostinger homepage.
- Correcting the Vercel About page in this change.
- Publishing files to Hostinger.
- Changing footer content or layout.
- Changing the floating “Chat now” button.
- Rewriting page copy.
- Redesigning service cards, article cards, videos, animations, or mobile layouts.
- Modifying pricing, forms, FAQs, metadata, or structured data.
