# Website Development Interactive Redesign

## Objective

Strengthen the `/website-development` landing page so it feels as visually distinctive and interactive as the DSE Consultancy homepage and Social Media Management + SEO page, while preserving the current conversion flow.

The redesign will combine an interactive conversion journey with targeted motion upgrades. It will not rewrite, remove, reorder, or materially reinterpret the existing page content.

## Fixed Constraints

- Preserve all current headings, paragraphs, pricing, package features, FAQs, form fields, consent language, links, and business claims.
- Preserve the existing section order and internal anchors.
- Retain the light, conversion-focused foundation rather than turning the entire page dark.
- Use the approved DSE orange, warm gradient, dark neutral, and current typography system.
- Keep the lead form visible in the hero on desktop and near the top on smaller screens.
- Maintain SEO metadata, structured data, semantic headings, and crawlable text.
- All essential information and controls must work without hover.

## Experience Direction

The page will communicate a clear visual journey from business idea to an enquiry-generating website. Motion will be bold on capable desktop devices but controlled so it does not reduce readability or interfere with form completion.

Light sections will carry the information-heavy parts of the page. Dark cinematic moments will be used selectively to create contrast and make the conversion journey feel more valuable.

## Page-Level Motion System

A small client-side interaction layer will provide:

- intersection-based section reveals;
- pointer-position variables for cursor lighting and card tilt;
- magnetic movement for selected primary CTAs;
- animated progress and score elements when they enter the viewport;
- a slim page-progress indicator tied to the visitor's position;
- reduced-motion fallbacks that remove parallax, tilt, and continuous movement.

The interaction layer will use browser-native observers and pointer events. It will not add a heavy animation dependency.

## Section Design

### 1. Hero: Interactive Website Build

The current hero copy and lead form remain unchanged. The background will gain a restrained moving grid, warm cursor glow, and floating website-interface fragments that suggest layout, mobile responsiveness, search visibility, and enquiry paths.

The form card will receive a subtle perspective response on desktop, a warm focus glow, and a clear static presentation on touch devices. The form must never move while a field is focused.

A supplemental `Start My Website` interaction will point to the existing form anchor without replacing any existing form submission text. Its arrow and highlight will react to the cursor and keyboard focus.

### 2. Page Journey Indicator

A thin progress rail will show movement through the landing page. It will be decorative and unobtrusive, will not cover the header or floating contact controls, and will become a compact bar on mobile.

### 3. What's Included: Interactive Comparison

The current comparison table and every cell of content remain intact. Desktop rows will gain cursor-follow illumination, animated included-status emphasis, and a vertical orange trace showing the active row.

On smaller screens, the table will remain horizontally usable or use its existing responsive treatment. Touch feedback will replace hover-only effects.

### 4. Websites for Everyday Businesses

The existing industry cards, images, copy, and links remain unchanged. Cards will gain depth-based tilt, a soft cursor spotlight, image parallax, animated direction arrows, and a lightweight browser-frame overlay on hover or keyboard focus.

The irregular grid will remain readable and flexible. On touch devices, cards will use a brief press response and preserve direct link behavior.

### 5. Results: From Search to Enquiry

The current dark results section will become the page's cinematic centrepiece. Its existing heading, copy, metrics, and proof quote remain unchanged.

Score rings will animate only when visible. The existing video-placeholder area will be visually replaced by an original interface journey that moves through search discovery, website trust, call or WhatsApp action, and enquiry confirmation. This is a presentation change only; it will not introduce new performance claims or modify current text.

The journey will react gently to scroll position and pointer movement on desktop. It will use a compact staged animation on mobile.

### 6. Pricing

The three existing plans and all package content remain unchanged. Each card will gain a cursor spotlight, clearer depth, animated feature checks when visible, and a more distinctive CTA treatment. The featured plan remains the visual priority.

CTA interactions will use a moving arrow, orange highlight sweep, keyboard-visible focus state, and restrained magnetic movement. Pricing and disclaimers will remain continuously visible.

### 7. Support, FAQ, and Trust Cards

The remaining sections will receive coordinated staggered reveals, icon motion, hover or focus depth, and soft background traces. FAQ behavior and all existing content remain unchanged.

## Responsive Behaviour

### Desktop and Laptop

- Enable cursor lighting, card tilt, layered parallax, magnetic CTAs, and full page-progress feedback.
- Limit transformations so headings, buttons, form fields, and pricing stay within their containers.
- Pause or suppress card motion while a user interacts with a form control.

### Tablet

- Use smaller tilt angles and reduced background movement.
- Preserve two-column layouts where space allows.
- Treat hover as optional because tablet input may be touch-based.

### Mobile

- Disable cursor tracking and magnetic movement.
- Use tap or press feedback, compact scroll reveals, and lightweight staged animations.
- Keep the hero form, price cards, comparison content, and CTAs fully readable without animation.
- Avoid horizontal overflow and prevent animated layers from increasing section height.

## Accessibility

- Honour `prefers-reduced-motion: reduce` by disabling continuous motion, parallax, tilt, and magnetic movement.
- Provide visible keyboard focus states equivalent to hover states.
- Keep decorative layers out of the accessibility tree.
- Preserve text contrast over every moving or illuminated background.
- Avoid motion that starts from form focus, text input, or mandatory user interactions.

## Component Boundaries

The existing server-rendered page remains the source of all content. A focused client component will apply progressive interaction to marked page elements. Reusable pieces may include:

- `WebsiteDevelopmentExperience` for section observation and page-level progress;
- `InteractiveWebsiteJourney` for the results visual;
- a shared magnetic or spotlight CTA treatment;
- CSS classes scoped under a new website-development page class.

These components will not own pricing, FAQ, form, or marketing copy. Content will remain in the current page file and existing data sources.

## Performance and Failure Behaviour

- Animations will use transforms and opacity where possible.
- Pointer work will be scheduled through animation frames and disabled on coarse pointers.
- No interaction will require network access or remote runtime data.
- If JavaScript is unavailable, the current content, form, navigation, and links will still render and work.
- Moving decorative elements will not delay the initial page content or lead form.

## Verification

The implementation will be checked for:

- unchanged visible content and package data;
- correct lead-form submission behavior;
- correct internal anchor and CTA destinations;
- keyboard navigation and focus styles;
- reduced-motion behavior;
- desktop, tablet, and mobile layouts;
- absence of unexpected horizontal overflow;
- no overlap with the header or floating call and WhatsApp controls;
- successful TypeScript, production build, and relevant lint or formatting checks.

## Out of Scope

- Rewriting marketing copy or changing SEO claims.
- Changing prices, package inclusions, form fields, or FAQ answers.
- Reordering page sections.
- Adding a CMS, analytics service, animation framework, or new remote video dependency.
- Redesigning the homepage, Social Media Management + SEO page, About page, Contact page, or Blog page.
