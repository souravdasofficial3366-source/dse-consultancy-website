# Website Development Industry Video Grid and Footer Spotlight Design

**Date:** 2026-07-17

## Goal

Make the Website Development service page feel more dynamic without changing its existing business copy. Replace the six still-image industry cards with lightweight looping video cards arranged as a 3-by-2 desktop gallery, and strengthen the shared footer with a clearly visible cursor-following light effect.

## Scope

This release changes two focused presentation components:

1. The six-card "Websites for Everyday Businesses" section on `/website-development`.
2. The shared interactive footer used across the DSE Consultancy website.

No headings, descriptions, CTA labels, pricing, forms, navigation, routes, or service information will be rewritten.

## Industry Video Gallery

### Content

Keep all six existing businesses and their current copy:

1. Pre-Schooling
2. Doctors & Clinics
3. Education (LMS/Schools/Colleges/Tuition Centre)
4. Transport and Logistics
5. Real Estate Businesses
6. E-commerce Stores

Each card receives one relevant locally hosted video:

- Pre-Schooling: children learning or taking part in a classroom activity.
- Doctors & Clinics: a doctor, patient, or clinic consultation scene.
- Education: a learner using a digital course, classroom, or educational interface.
- Transport and Logistics: parcel packing, dispatch, or a package moving through delivery.
- Real Estate Businesses: a property viewing, agent consultation, or building walkthrough.
- E-commerce Stores: online-order fulfilment, product packing, or checkout activity.

The videos will be royalty-free, muted, looping, inline-playing, and cropped with `object-fit: cover`. Each video will have a locally generated poster frame so the card never appears empty while media loads.

### Desktop Layout and Interaction

- At widths of 1100 pixels and above, render two independent rows of three cards: a 3-by-2 gallery.
- All three cards in an idle row have equal width and equal height, with a near-square visual proportion.
- Hovering or keyboard-focusing one card expands only that card to a landscape proportion.
- The other two cards in the same row compress to portrait proportions; the second row is unaffected.
- Use a fixed row height and animated flex ratios so the overall page width and vertical layout do not jump.
- Use a smooth 500-650 millisecond easing curve. Cards must not overlap or leave the container.
- The title remains visible at all times. Supporting copy and the existing "View package" CTA remain readable during both expanded and compressed states.
- A dark video scrim protects text contrast. The active card receives a warmer orange edge glow and slightly brighter video treatment.
- Keyboard focus produces the same expanded state as hover, and visible focus rings remain intact.

### Tablet and Mobile Behavior

- Between 700 and 1099 pixels, use a stable two-column by three-row grid. Do not compress neighbouring cards on touch devices.
- Below 700 pixels, use a single-column six-card layout with a compact landscape card ratio.
- Touch interaction uses the existing CTA and a subtle pressed/focus state; it does not depend on hover.
- Videos pause when the section is outside the viewport and resume when visible, reducing background resource use.
- With `prefers-reduced-motion: reduce`, the poster frames remain visible and automatic video playback and card resizing are disabled.

### Component Boundary

Create a focused client component for the gallery. It will receive the six existing data objects, split them into rows of three, manage the active card for pointer and keyboard interaction, and manage in-viewport video playback. The page remains responsible only for the section heading and passing the card data.

Extend each `industryCards` data object with local `video` and `poster` paths. Keep the current `title` and `text` values unchanged.

## Footer Cursor Spotlight

### Pointer Behavior

- Preserve the existing pixel-field background and footer content.
- Track the pointer position relative to the entire footer through request-animation-frame updates.
- Set normalized pointer coordinates as CSS custom properties on the footer root.
- Render a restrained orange-to-coral radial light centered on those coordinates, with a 280-360 pixel influence radius and no hard edge.
- Keep the maximum spotlight opacity between 0.16 and 0.24 so the existing pixel animation remains the main visual texture.
- Increase the brightness, opacity, and saturation of nearby pixel cells only slightly while keeping distant cells dim.
- Update the light position on every animation frame and use an 80-120 millisecond visual transition so it catches the cursor quickly without jitter.
- Fade the spotlight out over 220-300 milliseconds when the pointer leaves the footer.
- The effect is visual only and cannot intercept clicks or obscure footer text.

### Touch and Accessibility

- Preserve the existing slow automatic pixel pulse on coarse-pointer and touch devices.
- Disable cursor-following movement when reduced motion is requested, leaving a calm static glow.
- Keep existing footer links, CTA, address, phone number, email, and layout unchanged.
- Maintain readable contrast over the brightest spotlight position.

## Media Optimization

- Store final clips and poster frames under `public/videos/industries/`.
- Trim each loop to approximately 6-10 seconds.
- Remove audio tracks.
- Encode an H.264 MP4 suitable for current browsers, with the long edge capped at 1280 pixels and web-optimized metadata.
- Keep each optimized MP4 at or below 3 MB and the combined six-video payload at or below 18 MB; keep every poster image at or below 150 KB.
- Record the original source URL and commercial-use license source for every clip in `work/video-sources.md`.
- Use `preload="metadata"` and local poster images.

## Testing and Verification

Automated checks must confirm:

- Six cards remain present with unchanged titles and descriptions.
- Every card has local video and poster paths.
- The desktop structure creates two rows of three.
- The card videos use `muted`, `loop`, `playsInline`, and poster attributes.
- The footer sets pointer-position custom properties and renders a radial spotlight layer.
- Reduced-motion and touch fallbacks exist.

Browser verification must cover:

- Desktop 3-by-2 layout at 1440 pixels.
- Row-local hover expansion without overlap or page-width overflow.
- Keyboard focus expansion and usable CTAs.
- Tablet two-column layout.
- Mobile single-column layout without horizontal scrolling.
- Video playback, poster fallback, and offscreen pausing.
- Footer spotlight tracking, leave-state fade, and link usability.

Run the focused UI tests, TypeScript check, and production build before completion.

## Non-Goals

- Rewriting the existing six business descriptions.
- Changing the section heading or CTA wording.
- Adding new businesses or removing any of the six businesses.
- Replacing the overall Website Development page layout.
- Changing footer content, navigation, or contact details.
