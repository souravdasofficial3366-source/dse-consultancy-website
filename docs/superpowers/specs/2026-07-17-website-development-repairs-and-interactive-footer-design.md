# Website Development Repairs and Interactive Footer Design

## Goal

Repair the visible Website Development page regressions, prepare its results panel for a future video, and replace the shared footer with a responsive mouse-reactive pixel experience that preserves all existing navigation and contact information.

## Approved Scope

- Fix the Website Development comparison table so all three columns remain aligned at every supported viewport.
- Improve the three percentage rows and make each circular progress animation repeat independently.
- Replace the existing right-side results animation with a polished video placeholder. No video asset is added in this change.
- Keep the current results-section copy unchanged.
- Keep the pricing-card content unchanged and make the “Most Popular” badge fully visible.
- Normalize the first support-card icon so it matches the line weight and circular treatment of the other two icons.
- Replace the footer across Home, About, Website Development, SMM + SEO, Contact Us, Blog, and article pages.
- Preserve existing footer links, contact data, social actions, logo, legal copy, and accessibility semantics.

## Interaction Design

### Comparison Table

The hover accent will be attached to the first cell rather than the table row. This prevents the decorative pseudo-element from being treated as an extra table cell and shifting the body columns. The accent remains a slim orange-to-pink vertical trace and does not change the data layout.

### Results Panel

The left column keeps the three existing metrics and copy. Each ring will repeatedly draw from zero to its stated percentage, pause briefly, fade back to its starting state, and restart on a staggered schedule. Hovering a metric row adds a restrained orange highlight and horizontal lift.

The right column becomes a dedicated 16:10 video placeholder with a centered play control, “Website Walkthrough Video” label, subtle browser-frame details, and a small “Video Coming Soon” status. Its border and background remain within the current dark orange brand aesthetic. The placeholder is a stable replacement target for a later video element.

### Pricing and Support Cards

Pricing cards keep their spotlight effect, but the featured card allows the badge to extend above its top edge. The first support card uses the `edit_note` outlined symbol and the same icon container dimensions, color, alignment, and hover behavior as the other support cards.

### Shared Interactive Footer

The site-wide footer is divided into two layers:

1. A large closing CTA containing the message “Let’s Build the Digital Presence Your Business Deserves” and a link to Contact Us.
2. The existing logo, description, navigation, contact, social, and legal content arranged below it.

Behind both layers is a lightweight DOM pixel field. Pointer movement activates nearby cells with DSE orange, amber, coral, and pink tones; cells farther from the pointer remain dim. The effect eases out after the pointer moves away. It uses CSS custom properties and requestAnimationFrame updates rather than WebGL or a large third-party dependency.

Touch devices receive an automatic, slow-moving highlight because there is no persistent mouse pointer. Reduced-motion users receive a static branded pixel mosaic with no continuous movement. The pixel layer is decorative, hidden from assistive technology, and cannot intercept clicks.

## Component Boundaries

- `components/layout/InteractiveFooter.tsx`: owns pointer tracking, the decorative pixel field, CTA presentation, and responsive interaction behavior.
- `components/layout/LayoutParts.tsx`: continues to own footer content and composes it inside `InteractiveFooter`.
- `app/(landing-pages)/website-development/page.tsx`: replaces the results animation with semantic video-placeholder markup and normalizes the support icon.
- `app/globals.css`: contains scoped Website Development repairs and shared footer presentation.

## Responsive Behavior

- Desktop: the footer CTA is large and horizontal, with the pixel field reacting precisely to the pointer.
- Tablet: CTA and footer columns compress without hiding links; the pixel field uses fewer columns.
- Mobile: CTA, navigation, and contact content stack; the pixel field is reduced to a small grid and runs an automatic gentle highlight.
- The comparison table remains horizontally scrollable where necessary without creating a phantom fourth column.
- The results metrics and video placeholder stack cleanly below the existing tablet breakpoint.

## Accessibility and Performance

- All interactive elements remain keyboard reachable and retain visible focus states.
- Decorative pixels use `aria-hidden="true"` and `pointer-events: none`.
- Reduced-motion preferences disable looping metric motion and the animated footer trail.
- Pointer updates are batched through requestAnimationFrame and only update the closest cells.
- No external animation dependency or canvas/WebGL runtime is introduced.

## Verification

- Add source-level regression checks for the comparison accent placement, looping score animation, video placeholder, visible pricing overflow, normalized icon, and shared interactive footer.
- Run the project test command, TypeScript checking, and the production build.
- Inspect `/website-development` at desktop, tablet, and mobile widths.
- Inspect at least Home and Contact Us to confirm the shared footer renders outside the service page.
- Verify pointer reaction, keyboard navigation, touch fallback, and reduced-motion behavior in the browser.

## Non-Goals

- Supplying or integrating the final walkthrough video.
- Changing Website Development page content or pricing values.
- Rebuilding header navigation or unrelated page sections.
- Reproducing the reference website’s proprietary effect exactly; the implementation is an original DSE-branded interaction inspired by its pixel response.
