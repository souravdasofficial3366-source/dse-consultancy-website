# Split-Copy Layout Optimisation Design

## Goal

Audit the complete DSE Consultancy website for sections that place a title or large heading in a left column and body copy with an optional call to action in a right column. Correct layouts where the right column is unnecessarily narrow, the copy becomes vertically stretched, or excessive negative space separates the two columns.

The desktop target is balanced copy that normally resolves to roughly two or three lines when the content and viewport allow it. This is a visual target rather than a rigid line-count rule. Tablet and mobile layouts must remain naturally stacked and readable.

## Approved Visual Reference

The About-page “Principles Behind Every DSE Experience” section is the positive reference. Its heading and body columns use the row well without forcing the body into a tall, narrow block.

The homepage “Every Customer Touchpoint. One Consistent Business.” section is the negative reference. Its current `4fr / 1fr` desktop ratio assigns only about one-fifth of the usable row to the body and CTA, causing excessive wrapping.

## Site-Wide Audit Findings

The audit covers all current page routes and reusable landing-page sections.

- Shared `.consultancy-home-heading.split` sections appear on the homepage, About page, and Contact page. Their current `1.8fr / 1fr` ratio is visually balanced at the supplied desktop width and already collapses below 960px.
- The homepage `.consultancy-home-system-copy` section is the confirmed outlier. Its `4fr / 1fr` ratio produces the exact failure shown in the second screenshot.
- The About-page hero uses a wider right note card and does not exhibit the narrow unboxed-copy problem.
- The Social + SEO page’s non-centred section header places its short description with the heading and only a CTA on the right, so it does not match the problematic pattern.
- Centred headers, hero/form layouts, media/content grids, cards, FAQ layouts, footer layouts, and legal/article content are outside this pattern and should not be changed.

## Considered Approaches

### 1. Change every split layout globally

Change the shared `.consultancy-home-heading.split` ratio and allow that rule to affect every page.

Trade-off: this is simple, but it would alter the About-page reference that the user already considers balanced and could widen short copy unnecessarily.

### 2. Target only confirmed narrow outliers — recommended

Keep already-balanced shared sections intact. Replace the homepage system section’s extreme ratio with the established balanced proportion, give the body/CTA column a useful desktop minimum, and reduce the gap modestly so the body moves left.

Trade-off: this uses a small targeted override, but it best matches the instruction to fix this arrangement wherever it is actually wrong without disturbing good layouts.

### 3. Build a new shared React split-header component

Replace current page markup with a configurable component that accepts heading, body, and CTA slots.

Trade-off: this could enforce future consistency, but it is an unnecessary structural refactor for a CSS layout correction and would increase risk in the heavily edited working tree.

## Selected Layout Behaviour

For desktop widths above 960px:

- Change `.consultancy-home-system-copy` from `minmax(0, 4fr) minmax(210px, 1fr)` to a balanced heading/body ratio aligned with the good About-page reference.
- Give the body/CTA column a practical minimum of approximately 360px while allowing it to grow.
- Use a slightly tighter fluid gap so the right column begins farther left without crowding the heading.
- Keep bottom alignment so the CTA remains visually connected to the body and the heading baseline.
- Do not change copy, font sizes, colours, CTA styling, card layout, or section spacing.

For widths at or below 960px:

- Preserve the existing one-column stack.
- Preserve the existing maximum readable width on `.consultancy-home-system-intro`.
- Do not force a two- or three-line count; allow natural responsive wrapping.

## Regression Protection

Add a focused UI contract test before changing production CSS. The test will initially fail because the homepage section still contains the extreme `4fr / 1fr` ratio. It will then verify:

- The system section no longer uses the narrow `4fr / 1fr` desktop split.
- The body/CTA column has the agreed practical desktop minimum.
- The desktop gap follows the tighter fluid range.
- The existing 960px one-column fallback remains present.
- All currently identified split-copy sections remain included in the audit inventory.

## Visual Verification

After automated tests, type checking, and the production build pass, inspect the relevant routes in a browser at representative desktop, tablet, and mobile sizes.

Required checks:

- Homepage: Services split header, Connected Advantage split, and Latest Thinking split.
- About page: hero note and Principles split header.
- Contact page: Custom Plan and Location split headers.
- Social + SEO page: the non-centred Monthly Management header.
- Desktop: the homepage Connected Advantage body should occupy about two or three balanced lines at the supplied screenshot scale, with the CTA directly below it.
- Tablet/mobile: all split layouts should stack without overflow, clipped copy, or awkward CTA alignment.

## Non-Goals

- No wording changes.
- No typography redesign.
- No global spacing overhaul.
- No unrelated responsive changes.
- No modification of existing user work outside the selectors and tests required for this optimisation.
