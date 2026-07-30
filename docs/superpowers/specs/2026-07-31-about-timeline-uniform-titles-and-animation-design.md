# About Timeline Uniform Titles And Animation Design

## Goal

Refine the existing Vercel About-page operating-philosophy timeline so all eight
desktop chapter titles use exactly two intentional lines and the internal SVG
motion visible on the current Hostinger page is preserved when the final Vercel
source is later uploaded to Hostinger.

This is a timeline-only refinement. The About hero, story section, FAQ, shared
gradient CTA, header, footer, contact controls, timeline copy, and page order
remain unchanged.

## Evidence And Root Cause

The live Vercel timeline currently has mixed desktop title heights:

- chapters 01, 03, and 05 render in two lines;
- chapters 02, 04, 06, and 08 render in three lines;
- chapter 07 renders in four lines.

The main Vercel scroll interaction is functional. Scrolling changes the active
chapter, left visual state, progress rail, and active dot.

The internal SVG motion is not functional on Vercel. The SVG templates still
contain their animation classes, but the associated timeline keyframes and
active-card animation selectors are absent from the committed Vercel CSS. The
current Hostinger page still contains those rules and runs the internal motion.
Uploading the current Vercel build to Hostinger would therefore remove that
motion; Hostinger will not restore missing source CSS automatically.

## Approaches Considered

### Selected: explicit line pairs plus scoped animation restoration

Store each chapter heading as two approved text segments and render both through
the existing heading-line element. Restore only the missing timeline SVG
animation rules, scoped to the active timeline card.

This is deterministic across desktop browsers, preserves the wording, and
avoids changing unrelated site animation.

### Rejected: CSS-only wrapping

Reduce the font size or widen the chapter column until every title happens to
wrap into two lines. This remains dependent on viewport width, font metrics, and
browser rendering, so line counts can drift again.

### Rejected: shorter rewritten titles

Rewrite the longer headings until natural wrapping becomes uniform. This would
change approved page content merely to solve a layout problem.

## Approved Desktop Title Pairs

1. `Make Digital Work` / `Easier To Trust`
2. `Understand The Problem` / `Before Choosing The Tool`
3. `Let Useful Data` / `Guide The Direction`
4. `Test Feasibility` / `And Make The Cost Visible`
5. `Prepare For Roadblocks` / `Before They Slow Growth.`
6. `Automate What Does Not` / `Need Constant Attention`
7. `Move Every Workstream` / `Forward As One System`
8. `Build A System The Client` / `Can Own And Improve`

The wording and punctuation remain unchanged. Only the line boundaries become
explicit.

## Responsive Behaviour

At desktop and compact-desktop widths, each heading-line element stays on one
line and all eight headings occupy exactly two lines.

The chapter heading size may receive one About-timeline-specific desktop
constraint if measurement shows that the longest approved line cannot fit
without clipping. The left visual and the rest of the timeline grid must not be
restructured to solve title wrapping.

At tablet and mobile widths, the existing vertical layout remains authoritative.
Heading-line elements return to normal wrapping so narrow screens cannot clip or
overflow. Mobile headings are not required to stay at exactly two lines.

## Animation Behaviour

The existing scroll controller remains unchanged:

- normal page scrolling selects the chapter nearest the viewport centre;
- the progress rail and active dot continue to update;
- the left visual stack continues to switch with the active chapter;
- inactive SVG visuals remain visually quiet.

Restore the missing internal SVG animations used by all eight visual templates.
Every moving rule must be scoped beneath the About timeline's active visual
card. This prevents the hidden seven SVGs from running continuous animations and
avoids affecting similarly named classes elsewhere.

The restored layer includes the working Hostinger behaviours represented by the
existing SVG classes, including:

- partner-network phase transitions;
- radar spotlight, ripple, and sweep motion;
- evidence-path and label reveals;
- feasibility, cost-layer, and checklist motion;
- planning bridge construction and user movement;
- notification sequence motion;
- connected-workstream flow;
- ownership and improvement controls.

Do not import Hostinger layout, typography, header, footer, or page-section CSS.

## Reduced Motion And Accessibility

The existing `prefers-reduced-motion: reduce` fallback remains mandatory.

When reduced motion is requested:

- timeline and SVG animations stop;
- meaningful final SVG content remains visible;
- the phase-one failure state does not obscure the final partner-network state;
- all chapter text and mobile visuals remain readable;
- page scrolling remains normal.

Decorative SVG visuals remain hidden from assistive technology as they are
today. Semantic chapter headings and descriptions remain the accessible source
of information.

## Test Strategy

Add regression coverage before production edits to prove:

1. all eight chapter headings are stored as exactly two text segments;
2. the approved wording is unchanged;
3. desktop heading-line elements remain non-wrapping;
4. tablet and mobile heading-line elements can wrap normally;
5. every animation class referenced by the SVG templates has an associated
   timeline animation or visible fallback rule;
6. internal motion runs only for the active timeline card;
7. reduced-motion rules disable motion and expose a readable final state;
8. the existing eight-chapter scroll controller remains intact.

Verification includes:

- the focused About timeline regression test;
- the complete UI test suite;
- TypeScript checking;
- the production build;
- live-style browser checks that scrolling changes the active chapter and at
  least one internal SVG element reports a non-`none` animation on the active
  card;
- desktop measurement confirming two lines for all eight headings;
- responsive checks confirming no title clipping or horizontal overflow.

## Publication Boundary

Implementation is prepared and reviewed on the isolated branch first. After
tests and browser verification pass, merge and deployment follow the existing
approved GitHub-to-Vercel workflow. Hostinger remains unchanged during this
refinement.

## Success Criteria

The refinement is complete when:

1. all eight desktop timeline headings visibly occupy exactly two lines;
2. no approved title wording changes;
3. Vercel retains the working scroll-driven chapter transition;
4. all eight active SVG visual states regain their intended internal motion;
5. reduced-motion users receive a complete static final state;
6. tablet and mobile layouts show no clipping or horizontal overflow;
7. the About page structure outside the timeline is unchanged;
8. automated tests, type checking, build, and browser verification pass.
