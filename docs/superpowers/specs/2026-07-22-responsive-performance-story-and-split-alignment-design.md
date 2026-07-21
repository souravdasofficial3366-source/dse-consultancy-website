# Responsive Performance Story And Split Alignment Design

## Goal

Restore the intended homepage split-copy alignment and make the website-development performance story behave correctly across phones, iPads, short 13-inch Windows laptops, conventional laptops, and desktop displays.

The normal vertical page scroll must continue to drive the horizontal story on eligible laptops and desktops. Phones and tablets must use a lighter vertical presentation that animates only the card currently at the centre of the viewport. Existing unrelated Antigravity changes in the dirty working tree must remain untouched.

## Confirmed Root Causes

Live browser checks reproduced the animation failure:

- `1440x900` enters horizontal mode.
- `1366x650` and `1280x720`, representative of 13-inch Windows laptop browser viewports, enter the vertical fallback even though they have laptop widths.
- The JavaScript and CSS both require a minimum height of `760px`, so a normal Windows browser toolbar makes these laptops ineligible.
- `1024x768` landscape iPad currently enters the heavier horizontal mode.
- Phone layouts give every demo a `400px` minimum height, producing an unnecessarily long section.
- Compact demos use faster endlessly repeating timers, which does not reduce work on mobile.

The homepage Services split header also uses `4fr / 1fr` with a narrow `210px` right column. At `1440px`, the live right-hand paragraph is only about `229px` wide and begins near the far edge of the container. The Connected Advantage section already uses the repaired `1.4fr / minmax(420px, 1fr)` layout.

## Considered Approaches

### 1. Width-first laptop mode with a compact short-height variant — selected

Use horizontal mode from `1200px` wide when at least `620px` of usable height remains and the primary input reports hover plus a fine pointer. Add a short-laptop CSS variant between `620px` and `759px` that reduces card typography and internal padding without changing the interaction. Keep phones and touch-first iPads in vertical mode.

This directly separates laptops from tablets, covers common `1366x650` and `1280x720` browser viewports, and retains enough height to fit the pinned card safely.

### 2. Remove the height requirement at every desktop width

Enable horizontal mode whenever the viewport is at least `1200px` wide.

This is simpler, but extremely short split-screen windows can no longer fit the header, card, and progress indicator and may clip content.

### 3. Enable horizontal mode from tablet landscape upward

Keep the existing `1024px` landscape-tablet mode and lower its height requirement.

This provides more animation on iPad, but it keeps the heavier pinned interaction on touch-first hardware and works against the request to avoid an oversized or laggy tablet/mobile section.

## Selected Responsive Behaviour

### Laptop and desktop

- Eligible viewport: at least `1200px` wide and at least `620px` high, with a hover-capable fine primary pointer and reduced motion disabled.
- Normal vertical scrolling moves the three-card track horizontally from `0` to `-200%`.
- No wheel listener, scroll interception, sideways dragging, or `preventDefault()` is introduced.
- The active card advances in thirds: `0`, `1`, then `2`.
- Viewports from `620px` through `759px` high use tighter padding, smaller fluid headings, reduced demo spacing, and the existing sticky-header clearance.
- Viewports below `620px` use the safe vertical fallback even when wide.

### Phone and tablet

- All viewports below `1200px`, plus wider touch-first devices without a fine hover-capable primary pointer, use the normal vertical card stack. This keeps portrait and landscape iPads out of horizontal mode, including wider iPad Pro configurations.
- Only the card crossing the viewport centre becomes active.
- Each compact demo runs one finite sequence and rests on its final state instead of looping indefinitely.
- Leaving the card cancels pending timers and resets the demo, allowing the sequence to replay if the user returns.
- Mobile demo height and padding are reduced carefully while preserving every label and interface element.
- Reduced-motion users see the final static state and no timers.

## Homepage Split Alignment

- Add a homepage-scoped correction for `.consultancy-home-heading.split`, replacing its `4fr / 1fr` desktop ratio with the same balanced family used by the repaired Connected Advantage section.
- Give the right copy a practical desktop minimum width and reduce the gap so it begins farther left.
- Keep the existing bottom alignment.
- Preserve the one-column layout at and below `960px`.
- Do not change wording, typography, colours, CTA styling, cards, or section spacing.
- Verify both screenshot sections plus the other homepage split heading that shares the selector.
- Do not change the shared split-heading behavior on the About or Contact pages as a side effect.

## Component Boundaries

- `WebsitePerformanceStory.tsx` remains responsible for mode selection, visibility, active-card selection, and document-scroll progress.
- The three demo components remain responsible for their own phase sequences and timer cleanup.
- `app/globals.css` remains responsible for horizontal eligibility, the short-laptop compact geometry, phone/tablet vertical geometry, and split-copy alignment.
- Existing static UI contract tests remain the regression layer; no new runtime dependency is required.

## Testing Strategy

Use test-first changes and verify each new test fails for the expected current behavior before editing production code.

The performance-story tests will assert:

- JavaScript and CSS share the `1200px x 620px` fine-pointer laptop threshold.
- No horizontal tablet media query remains.
- A short-laptop layout exists and preserves sticky containment.
- Below-threshold and reduced-motion fallbacks remain vertical.
- Compact demos use finite, cancellable timeout sequences rather than endlessly repeating intervals.
- Normal document scroll still drives exactly `-200%` horizontal movement without wheel interception.

The split-copy tests will assert:

- The homepage-scoped split heading has a balanced desktop right column and tighter gap without changing About or Contact page selectors.
- The repaired Connected Advantage layout remains unchanged.
- The `960px` stacked fallback remains present.

After focused tests, run the full UI suite, TypeScript check, production build, and `git diff --check`.

## Browser Verification Matrix

Verify the local production-equivalent result at these representative viewports:

- Android phone: `390x844` and `360x800`
- iPad portrait: `834x1194`
- iPad landscape: `1024x768`
- 13-inch Windows laptop: `1366x650`
- Short laptop: `1280x720`
- Standard laptop: `1440x900`
- Wider desktop: `1920x1080`

For each size, confirm mode selection, card order, active-demo lifecycle, no horizontal overflow, no clipped text, no framework error overlay, and no console errors. On horizontal sizes, scroll through the complete section and confirm all three cards become active. On phone/tablet sizes, confirm only the centred vertical card animates and then rests.

## Non-Goals

- No copy rewrite or visual redesign.
- No changes to other animation systems unless browser QA reveals a directly related regression.
- No deployment in this implementation cycle unless the user separately authorizes publishing.
- No cleanup, staging, or modification of unrelated user or Antigravity files.
