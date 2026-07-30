# Website Development Page Hostinger Visual Merge Design

## Goal

Bring the approved visual proportions and section rhythm from the live Hostinger
Website Development page into the Vercel page without replacing the current
Vercel components, shared layout, dynamic pricing, form behaviour, FAQ system,
or horizontal performance story.

This is a page-scoped visual merge, not a full-page replacement.

## Source Of Truth

The live Hostinger Website Development page is the visual reference for:

1. the dark hero treatment and desktop headline scale;
2. the larger, two-line section-heading rhythm;
3. the wider desktop content areas and card proportions;
4. the more generous vertical spacing through the support section.

The current Vercel source remains authoritative for:

1. all visible wording and semantic markup;
2. shared header, navigation, footer, gradient CTA, and contact controls;
3. dynamic prices and package labels;
4. lead-form fields, validation, submission behaviour, and consent text;
5. industry videos and card interaction;
6. the scroll-driven horizontal performance story;
7. support content;
8. problem-led FAQ content, FAQ interaction, and FAQ JSON-LD;
9. responsive, reduced-motion, keyboard, and accessibility safeguards.

## Approaches Considered

### Selected: page-scoped visual merge

Keep the existing Vercel route and components, then adjust only
Website-Development-specific styling and the minimum markup hooks needed to
produce the approved Hostinger composition.

This approach retains the working data flow and interactions while limiting
regression risk to one route.

### Rejected: full Hostinger page replacement

Replacing the Vercel route with Hostinger output would reintroduce a broken
header logo, an outdated form, a Cloudflare connection error, static pricing
risk, and excessive blank space before the FAQ.

### Rejected: complete component rebuild

Rebuilding the route and its interactive components would provide additional
control but would unnecessarily disturb verified form, pricing, video, and
scroll behaviour.

## Page Structure

The route keeps its current section order:

1. hero and lead form;
2. “What’s Included” comparison;
3. “Websites for Everyday Businesses” industry grid;
4. website performance story;
5. pricing;
6. support;
7. FAQ;
8. shared gradient CTA and footer.

No section is added, removed, duplicated, or reordered.

## Hero

### Visual treatment

Adopt the Hostinger hero’s dark black-and-orange presentation:

- a deep charcoal or black base;
- restrained orange light and grid accents;
- white primary headline text;
- orange emphasis for the dynamic starting price;
- a strong left-copy/right-form desktop composition.

The current decorative Vercel hero artwork remains the implementation
foundation. It should be recoloured and repositioned only as needed to support
the darker composition; no Hostinger assets or broken header media are imported.

### Content and data

Retain the current Vercel wording:

- “Trusted by local Indian businesses”;
- “Get Your Professional Website Starting from ₹5,999”;
- the approved supporting paragraph;
- the three trust points.

The displayed starting price must continue to come from the existing shared
site and pricing data. It must not be typed as a second static value in the page
or CSS.

### Desktop layout

Use a larger stacked heading, matching the Hostinger visual weight without
changing its words. The copy column receives enough width for deliberate,
readable line breaks. The form column may be slightly narrower than the current
Vercel composition, but its fields, labels, validation messages, and submit
button must remain fully visible.

Tablet and mobile layouts continue to stack using the current Vercel order and
must not force the desktop line pattern.

### Lead form

Retain the current `LeadForm` integration and `/website-development` source
path. Preserve:

- all package options generated from shared pricing;
- the required message field;
- validation and submission states;
- consent wording;
- keyboard and screen-reader behaviour.

Do not import Hostinger’s outdated form markup or its Cloudflare error panel.

## “What’s Included” Comparison

Restore the Hostinger section’s more generous spacing and heading hierarchy:

- line-style “Included By Default” kicker;
- large two-line “What’s / Included” title on desktop;
- wider comparison-table presentation.

The existing table markup, wording, included/excluded indicators, hover states,
and responsive overflow treatment remain authoritative.

## Industry Section

Use the larger Hostinger heading rhythm:

1. “Websites for”
2. “Everyday Businesses”

The kicker returns to the line-style treatment used by the approved reference.
The desktop grid receives wider cards and more comfortable gaps and vertical
spacing.

Keep the existing `IndustryVideoGrid`, video assets, poster fallbacks, card
content, CTA, hover/focus behaviour, and reduced-motion handling unchanged.

## Website Performance Story

The current `WebsitePerformanceStory` component remains intact.

Normal vertical page scrolling must continue to drive the horizontal movement
through the performance cards. Do not introduce wheel interception, sideways
dragging, or a replacement carousel.

Only the section’s visual framing changes:

- widen the introductory heading area;
- display “Turn Local Searches / Into Real Business Leads” as two balanced
  desktop lines;
- align its desktop spacing and content width with the Hostinger reference;
- preserve all existing card content, targets, demonstrations, progress logic,
  responsive fallback, and reduced-motion behaviour.

## Pricing

Restore the larger heading composition:

1. “Pocket-Friendly”
2. “Pricing”

Use the Hostinger reference for wider desktop pricing cards, more open gaps, and
less visually restrictive borders while preserving clear separation and the
featured-plan emphasis.

All plan names, features, prices, labels, and form destinations continue to come
from the current Vercel route and `data/service-pricing.ts`. Updating the shared
catalogue in the future must update this section and its form options together.

Existing card hover, spotlight, tilt, focus, and reduced-motion behaviour
remains.

## Support And FAQ Boundary

The support section may adopt Hostinger’s wider and taller desktop card
proportions. Its wording and actions remain unchanged.

The visual import stops after the support cards.

The current Vercel FAQ remains complete and authoritative:

- problem-led questions and answers;
- FAQ accordion behaviour;
- FAQ JSON-LD generated from the same data;
- help panel and associated actions;
- responsive layout.

Do not import Hostinger’s large blank gap before the FAQ, FAQ omission, or any
duplicate pre-footer content.

## Shared Layout Boundary

Do not change or duplicate:

1. the shared header and navigation;
2. the approved header WhatsApp treatment;
3. floating contact controls;
4. the shared orange-and-pink gradient CTA;
5. the shared footer.

The Website Development route must continue to receive these elements from the
shared layout so they remain consistent with the approved Home and About pages.

## Styling Boundaries

Visual changes must be scoped beneath `.website-development-page` or a more
specific Website Development selector.

Avoid changing generic `.hero`, `.section-head`, `.pricing-grid`, `.price-card`,
or shared layout rules unless a shared change is separately justified and
approved. The Home, About, Contact, SMM + SEO, service, case-study, blog, and
local landing pages must not change as a side effect.

Prefer CSS and existing markup hooks. Add page-specific semantic classes only
when the current selectors cannot express the approved design reliably.

## Responsive Behaviour

Verification widths:

- 1440 × 900 desktop;
- 1280 × 800 laptop;
- 1024 × 768 compact desktop/tablet;
- 768 × 1024 tablet;
- 390 × 844 mobile.

At every width:

- headings must not clip or overflow;
- the hero form must remain usable;
- price text and package features must remain visible;
- industry videos must retain their poster fallback;
- performance cards must remain reachable;
- comparison content must not force page-level horizontal scrolling;
- FAQ, gradient CTA, footer, and contact controls must retain their current
  responsive behaviour.

The two-line heading requirements apply to desktop and laptop widths. Tablet
and mobile headings may wrap naturally to avoid clipping.

## Accessibility And Motion

- Retain one page-level `h1`.
- Preserve logical heading order.
- Keep visible focus states on links, buttons, fields, cards, and FAQ controls.
- Preserve form labels and error announcements.
- Decorative hero artwork remains hidden from assistive technology.
- Industry and performance content remains meaningful without animation.
- Existing `prefers-reduced-motion` handling remains mandatory.
- Colour changes must maintain readable contrast in normal, hover, focus, and
  error states.

## Dynamic Data Flow

The shared pricing catalogue remains the only package-price source.

The Website Development route may format shared package data for presentation,
but it must not introduce a second price catalogue. The same values must drive:

1. the hero starting price;
2. visible pricing cards;
3. lead-form package options;
4. related metadata or structured data already connected to the catalogue.

The FAQ component and FAQ JSON-LD must continue to consume the same
`websiteDevelopmentFaqs` data.

## Test Strategy

Add regression coverage before production styling changes to prove:

1. the route still uses `websitePackages` and `formatPackagePrice`;
2. the `LeadForm` retains the `/website-development` source path;
3. the message field and dynamic package options remain available;
4. the route still renders `IndustryVideoGrid`;
5. the route still renders `WebsitePerformanceStory`;
6. the performance story retains normal vertical-scroll-driven horizontal
   behaviour and responsive fallback;
7. the route still renders `FaqList`, `FaqJsonLd`, and
   `websiteDevelopmentFaqs`;
8. no page-local header, footer, gradient CTA, or duplicate price catalogue is
   introduced;
9. the new visual rules remain scoped to `.website-development-page`;
10. desktop heading constraints do not apply in a way that clips tablet or
    mobile content.

Verification includes:

- focused Website Development regression tests;
- shared pricing and lead-form tests;
- FAQ coverage and structured-data tests;
- the complete UI test suite;
- TypeScript checking;
- the production build;
- browser comparison at every target width;
- live interaction checks for form validation, video cards, performance
  scrolling, pricing CTAs, FAQ controls, and reduced motion.

## Publication Gate

Hostinger remains unchanged throughout this work.

Before publishing:

1. confirm the implementation diff is limited to the Website Development page,
   its scoped styles, tests, and documentation;
2. verify the correct existing Vercel project and production domain;
3. merge the verified work into `main`;
4. push the exact tested commit to GitHub;
5. deploy that commit to the existing Vercel project;
6. verify the live `/website-development` route at desktop, laptop, tablet, and
   mobile widths;
7. confirm the Home, About, Contact, SMM + SEO, and shared header/footer remain
   unchanged.

## Success Criteria

The work is complete when:

1. the Vercel Website Development page reflects the approved Hostinger dark hero,
   larger two-line headings, wider cards, and section spacing;
2. visible wording remains the approved Vercel wording;
3. pricing remains dynamic across the hero, cards, and package form;
4. the updated Vercel lead form remains fully functional;
5. industry video behaviour remains functional;
6. the scroll-driven performance story remains functional and its heading uses
   two balanced desktop lines;
7. the Vercel support and FAQ systems remain intact without Hostinger’s blank
   gap;
8. the shared header, gradient CTA, footer, and contact controls remain
   unchanged;
9. no unrelated page changes;
10. automated tests, type checking, production build, and live browser
    verification pass.
