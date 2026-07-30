# About Page Hostinger Structure Merge Design

## Goal

Rebuild the Vercel About page from the approved Hostinger About-page structure through the end of the eight-step operating-philosophy timeline, while preserving the newer Vercel FAQ system and every shared site-wide element.

This is a controlled section merge, not a full-page replacement.

## Approved Source Boundary

The Hostinger page is the visual and content source for these sections only:

1. the dark split About hero;
2. the light “Our Story” section with the D, S, and E visual;
3. the “Our Operating Philosophy” introduction;
4. all eight timeline chapters and their associated visuals;
5. the end of timeline chapter 08, “Ownership And Growth.”

The import stops immediately after chapter 08.

## Vercel Sections That Must Remain

The following current Vercel elements remain authoritative and must not be replaced by Hostinger markup:

1. the shared header and navigation;
2. the shared desktop and mobile contact controls;
3. the existing About FAQ content;
4. the FAQ JSON-LD generated from the same About FAQ data;
5. the shared orange-and-pink gradient CTA;
6. the shared footer;
7. the floating WhatsApp and mobile call controls.

The shared layout continues to render the header, the `Footer` component, and the floating contact controls. The shared `Footer` owns both the gradient CTA band and the footer grid, so the About page must not duplicate either part locally.

## Content Decisions

### Hero

Use the Hostinger hero content:

- kicker: “About DSE Consultancy”;
- heading: “Digital Work Should Feel Clear, Connected And Useful.”;
- panel kicker: “Our Point Of View”;
- panel body: “A strong digital presence is not one website, one post or one ranking. It is the complete experience a customer has from first discovery to first conversation.”

The desktop layout remains a dark two-column composition with the heading on the left and the supporting panel on the right.

### Our Story

Use the Hostinger story content:

- kicker: “Our Story”;
- heading: “Built For Businesses That Need A Practical Digital Growth Partner.”;
- both approved explanatory paragraphs from the Hostinger page;
- the existing D, S, and E visual treatment associated with this section.

The heading and copy column must retain a readable desktop width and avoid excessive line breaks. Tablet and mobile layouts must stack without clipping.

### Operating Philosophy Timeline

Use the Hostinger eight-chapter sequence, descriptions, labels, and associated visual states as the structural baseline.

Chapter 05 retains the previously approved Vercel wording:

1. “Prepare For Roadblocks”
2. “Before They Slow Growth.”

This replaces Hostinger’s longer “Plan Ahead For The Roadblocks That Come Next” title and preserves the established two-line desktop rhythm.

All other timeline chapter content follows the Hostinger source.

## Explicit Exclusions

Do not import:

1. the Hostinger “Team Model” section;
2. the Hostinger “Specialist Thinking, One Connected Delivery System” content;
3. the Hostinger “Let’s Work Together” gradient section;
4. Hostinger header or footer markup;
5. Hostinger FAQ omissions;
6. any duplicate pre-footer CTA.

After chapter 08, the page flows directly into the current Vercel About FAQ. The shared `Footer` component then supplies the Vercel gradient CTA and footer grid.

## Component Structure

The About route remains responsible for:

1. page metadata;
2. FAQ JSON-LD;
3. the Hostinger-derived hero;
4. the Hostinger-derived story section;
5. the timeline component;
6. the current FAQ component.

The timeline stays in its dedicated client component so scroll-state and animation code do not expand the route file.

The hero and story sections should use About-specific semantic classes. Shared layout components and unrelated page styles must not be changed to reproduce the Hostinger page.

## Animation and Interaction

This pass restores the Hostinger timeline as the baseline for review. It does not introduce an unrelated animation redesign.

The existing Vercel timeline behaviour remains the implementation foundation:

- normal page scrolling controls the active chapter;
- the visual state changes when the corresponding chapter reaches the viewport’s central reading position;
- desktop keeps the visual stack and text journey coordinated;
- smaller screens use the existing accessible vertical presentation;
- reduced-motion behaviour must remain usable;
- timeline content must remain readable when JavaScript is unavailable or delayed.

Any further alignment or animation refinements will be made on Vercel after the imported baseline is visible for review.

## Responsive Behaviour

Desktop should match the Hostinger composition and reading order while retaining Vercel’s responsive safeguards.

Verification widths:

- 1440 × 900 desktop;
- 1024 × 768 tablet/compact desktop;
- 768 × 1024 tablet;
- 390 × 844 mobile.

At every width:

- headings must not clip or overflow;
- paragraph columns must not become unnecessarily narrow;
- the story visual must not overlap the copy;
- all eight timeline chapters must remain reachable;
- the FAQ, CTA, and footer must retain their current responsive behaviour.

## Accessibility and SEO

- Retain one page-level `h1`.
- Preserve logical heading order from hero through timeline, FAQ, and CTA.
- Keep decorative timeline visuals hidden from assistive technology.
- Keep all meaningful timeline copy present as semantic text.
- Preserve keyboard-operable FAQ controls.
- Keep visible FAQ content and FAQ JSON-LD driven from `aboutFaqs`.
- Do not introduce duplicate FAQ structured data.

## Test Strategy

Add regression tests before implementation to prove:

1. the About route contains the Hostinger hero and story content;
2. the route still renders `FaqJsonLd`, `FaqList`, and `aboutFaqs`;
3. the timeline still contains eight chapters;
4. chapter 05 uses the approved two-line wording;
5. Hostinger’s Team Model and extra “Let’s Work Together” section are absent;
6. no page-local header or footer is introduced;
7. the shared `Footer` component remains unchanged and continues to provide the gradient CTA and footer grid;
8. timeline animation selectors and responsive fallbacks remain present.

Run:

- focused About-page regression tests;
- the complete UI test suite;
- TypeScript checking;
- the production build;
- browser verification at the four target widths.

## Publication Gate

Do not deploy merely because the build succeeds.

Before publishing:

1. verify the branch diff contains only the intended About-page merge and its tests;
2. confirm the current Vercel project link;
3. merge the verified branch into `main`;
4. push the exact commit to GitHub;
5. deploy that commit to the existing Vercel production project;
6. verify the live About route, shared assets, FAQ, CTA, footer, and responsive layout.

Hostinger remains unchanged throughout this process.

## Success Criteria

The work is complete when:

1. Vercel shows the Hostinger About hero, story, and timeline through chapter 08;
2. chapter 05 keeps the approved two-line title;
3. the current Vercel About FAQ and FAQ structured data remain intact;
4. the shared gradient CTA, header, footer, and contact controls remain consistent with the rest of the Vercel site;
5. no Hostinger Team Model or duplicate CTA is present;
6. desktop, tablet, and mobile layouts have no clipping or unintended overlap;
7. tests, type checking, build, and live browser verification pass.
