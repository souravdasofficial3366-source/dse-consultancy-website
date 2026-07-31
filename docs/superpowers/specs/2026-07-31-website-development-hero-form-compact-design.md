# Website Development Hero Form Compact Design

## Goal

Refine only the Website Development hero so the dynamic starting price is fully
visible, the lead form no longer has a decorative top stripe, and the desktop
form feels balanced rather than vertically stretched.

## Approved Direction

Use a moderate, page-scoped compaction. Keep every field in its current order
and layout, while tightening the spacing inside the desktop form. Do not create
additional field columns or remove any information.

## Heading And Price

- Keep the current H1 wording, font family, font size, colour treatment, and
  dynamic price source.
- Prevent the top of `₹5,999` and future prices from being clipped by giving the
  headline sufficient line-box height.
- Preserve the current natural desktop wrapping and responsive wrapping.
- Do not type a static price into the page or stylesheet.

## Form Card

- Remove the orange-to-pink decorative stripe at the top of the Website
  Development hero form.
- Keep the card's subtle outer border, radius, background, and shadow so it
  remains visually separate from the hero.
- Moderately reduce desktop-only card padding, vertical form gaps, control
  padding, and message-area height.
- Preserve a minimum touch-friendly control height and keep mobile spacing
  comfortable.
- Keep the current form title, labels, field order, two-column name/mobile row,
  package selector, consent, Turnstile, submit action, and note.

## Behaviour Boundary

Do not change:

1. shared pricing or package generation;
2. validation or error messages;
3. lead submission and storage;
4. consent behaviour;
5. Turnstile behaviour;
6. responsive field stacking;
7. hero artwork or animation;
8. any other page or shared form presentation.

All style overrides must remain beneath `.website-development-page` and, where
appropriate, the desktop breakpoint.

## Verification

Verify the Website Development route at desktop, laptop, tablet, and mobile
widths. Confirm that:

- the complete dynamic price is visible;
- the decorative top stripe is absent;
- the form is shorter and visually balanced on desktop;
- all fields, consent, Turnstile, and the submit button remain reachable;
- mobile controls retain comfortable spacing and sizing;
- there is no horizontal overflow;
- the focused Website Development regression tests, full test suite, type
  check, and production build pass.
