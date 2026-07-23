# Desktop Content, Shared Pricing, and FAQ Refinement Design

**Date:** 2026-07-23

**Status:** Approved direction, updated with final feedback

**Primary scope:** Desktop content and structure. Responsive behaviour must not regress; detailed mobile alignment will be reviewed separately.

## 1. Objective

Refine the current DSE Consultancy website without changing its established visual system. The work will:

- remove repeated home-page closing copy;
- shorten one About timeline heading so it follows the two-line rhythm of the other chapters;
- give the three SMM + SEO growth cards three different colourful hover treatments;
- increase all SMM + SEO packages by ₹1,000;
- make website and SMM + SEO pricing come from one shared data source;
- simplify the Contact hero form for visitors who have not chosen a service;
- make the Custom Pricing planner start with no package selected;
- remove the visible “Designed To Grow” placeholder;
- update the Contact location copy from Kalna to West Bengal in the two approved places;
- add distinct, problem-led FAQs to every important page and service page;
- keep visible FAQ content and FAQ structured data synchronized.

The visual work is deliberately limited. Existing typography, card size, animation timing, hover opacity, spacing system, and footer copy remain unchanged unless explicitly listed below.

## 2. Confirmed Decisions

### 2.1 Home page closing section

Only the gradient section immediately before the footer changes. The footer remains untouched.

**Kicker**

> Built Around Better Enquiries

**Heading, retained as two controlled lines**

> Turn Digital Attention Into<br>
> Real Business Opportunities.

**Body**

> Connect your website, local search and social presence around the actions that matter—calls, WhatsApp conversations and qualified enquiries.

**CTA**

> Plan Your Digital Growth

The CTA continues to link to `/contact-us`.

### 2.2 About timeline heading

Replace:

> Plan Ahead For The Roadblocks That Come Next

With:

> Prepare For Roadblocks<br>
> Before They Slow Growth.

The existing heading font family, size, line height, layout, and animation remain unchanged. Only the words change.

### 2.3 SMM + SEO growth-card hover colours

The existing black hover overlays will become three separate bright overlays:

| Card | Hover colour |
| --- | --- |
| Visibility | Coral-orange: `rgba(254, 104, 7, 0.56)` |
| Social Proof | Magenta: `rgba(235, 38, 151, 0.56)` |
| Growth | Violet: `rgba(126, 34, 206, 0.56)` |

The alpha value remains `0.56` on all three cards. The current hover opacity transition, animation speed, border, text, imagery, card size, and interaction remain unchanged. Each card will receive a stable modifier or data attribute so its colour is explicit rather than dependent on DOM position.

### 2.4 SMM + SEO pricing

All three monthly prices increase by ₹1,000:

| Package | Current | New |
| --- | ---: | ---: |
| Essential Presence | ₹5,999/month | ₹6,999/month |
| Business Growth | ₹8,999/month | ₹9,999/month |
| Complete Growth | ₹14,999/month | ₹15,999/month |

The package inclusions and all non-price wording stay unchanged unless a price is embedded in supporting copy.

### 2.5 Contact hero form

The Contact hero is a general enquiry entry point, so it will not ask visitors to choose a website-development package.

The Contact hero version of `LeadForm` will:

- omit the visible package field;
- use a general service-enquiry context;
- use the button label **Request A Call Back**;
- use consent wording that refers to **digital services**, not only a website;
- continue collecting the visitor’s name, phone, business type, and message;
- allow the backend to accept a general enquiry without a pricing package.

Website-specific forms elsewhere will keep their package field. Their visible options and starting-price CTA will be generated from the shared pricing catalogue.

### 2.6 Custom Pricing planner

The planner will no longer preselect the cheapest package.

For each selected service:

- the package field starts with **Select a package**;
- the internal value starts as `null`, not package index `0`;
- selecting a service does not silently select a package;
- deselecting a service clears its package selection;
- an estimate is considered incomplete until every selected service has an explicit package;
- the WhatsApp/proceed action stays disabled while the selection is incomplete;
- the visitor receives a clear inline instruction rather than an incorrect estimate.

The visible block labelled **Designed To Grow** and its supporting placeholder copy will be removed. No replacement placeholder is added.

### 2.7 Contact location changes

Change the Contact page location heading only:

> Find DSE Consultancy<br>
> In West Bengal.

Do not replace other legitimate references to Kalna elsewhere on the site.

The first Contact FAQ becomes:

> Can DSE Consultancy manage local SEO and website development in West Bengal?

Its answer becomes:

> Yes. DSE Consultancy supports businesses across West Bengal with local SEO, Google Business Profile optimisation, mobile-first website development, location-focused service pages and enquiry tracking. We recommend the scope after reviewing the business location, service area, competition, customer search behaviour and the enquiries the business wants to generate.

## 3. Shared Pricing Architecture

### 3.1 Problem being corrected

The site currently stores package prices in several components. Those copies have already drifted:

- the Website Development page shows ₹5,999 / ₹7,999 / ₹10,999;
- the Contact lead form independently repeats those website prices;
- the Custom Pricing planner still contains older website prices of ₹3,999 / ₹6,999 / ₹8,999;
- the SMM + SEO page and planner each contain separate copies of the current monthly prices.

Changing one page therefore does not reliably update forms and estimates.

### 3.2 Single source of truth

Create a server-safe data module:

`data/service-pricing.ts`

It will export typed service and package records. Each package record will include:

- stable service ID;
- stable package ID;
- display name;
- numeric price in rupees;
- billing model (`one-time` or `monthly`);
- GST display rule;
- form submission value;
- display formatter inputs;
- optional flags for package-picker visibility.

Initial shared values:

**Website Development**

- Essential — ₹5,999 one-time
- Dynamic — ₹7,999 one-time
- Advanced — ₹10,999 one-time

**SMM + SEO**

- Essential Presence — ₹6,999/month
- Business Growth — ₹9,999/month
- Complete Growth — ₹15,999/month

### 3.3 Consumers

The following must import from the catalogue instead of hardcoding prices:

- Website Development pricing cards;
- SMM + SEO pricing cards;
- website-specific `LeadForm` package options;
- the website-specific form’s “from ₹…” button copy;
- the Contact Custom Pricing planner;
- WhatsApp estimate text generated by the planner;
- server-side lead package validation;
- any related starting-price FAQ answer.

Formatting helpers will create strings such as `₹5,999`, `₹6,999/month`, and form labels from numeric source values. Components must not keep their own numeric fallback prices.

### 3.4 Future editing rule

A future package-price change should require:

1. editing the relevant number once in `data/service-pricing.ts`;
2. running the checks;
3. redeploying the site once.

It must not require paying for or manually editing each page, form, estimate, and validation rule separately. This is a shared-code solution, not a live CMS: a deployment is still needed before a source-code price change appears on Hostinger or another host.

### 3.5 Lead validation

`lib/leads.ts` will derive valid package submission values from the same catalogue.

- Website-specific enquiries still require a recognised website package.
- General Contact enquiries may omit `pricing_package`.
- Unknown non-empty package values are rejected.
- Existing spam, consent, and contact validation remain in force.

This keeps the visible form and backend acceptance rules synchronized.

## 4. FAQ Content System

### 4.1 Page coverage

FAQ sections will exist on:

1. Home
2. About
3. Contact
4. Services index
5. Website Development
6. SMM + SEO
7. Business Website service detail
8. Google Business Help service detail
9. Lead Form Setup service detail

The three service-detail pages share one route template, but each receives its own questions from its service data.

### 4.2 Content principles

Every FAQ must:

- answer an actual buying concern or delivery problem;
- use simple English;
- identify the relevant service and location naturally where useful;
- give a direct answer before additional context;
- avoid repeating an identical question on multiple pages;
- avoid absolute claims, invented results, and unrealistic guarantees;
- explain ownership, costs, deliverables, or next steps where relevant;
- stay consistent with visible packages and the shared pricing catalogue.

The FAQ set will use problem themes found in public low-rated agency reviews and common service complaints, without naming or quoting competitors. These themes include:

- projects taking months longer than expected;
- work being left incomplete;
- agreed scope or deadlines not being followed;
- hidden extras and renewal charges;
- unclear website, domain, content, or account ownership;
- generic packages that do not fit the business;
- unrealistic SEO ranking promises;
- fake-review practices;
- reports that show activity but not useful business outcomes;
- unclear maintenance responsibilities;
- spam-filled forms;
- uncertainty about where enquiries and customer data are delivered.

These themes are question prompts, not allegations about any named business.

### 4.3 Page-specific question map

#### Home

- Where should a small business start if its website, Google profile and social pages are not working together?
- Can DSE Consultancy improve an existing digital presence without rebuilding everything?
- How will we know whether the work is generating real enquiries rather than only views?
- Will website, local SEO and social work create overlapping or hidden charges?

Focus: diagnosing the starting point, connecting services, measuring calls/WhatsApp/form enquiries, and explaining scope before payment.

#### About

- How does DSE Consultancy avoid giving every business the same generic package?
- How are scope, timelines and extra costs explained before work begins?
- Who owns the website, content and business accounts after delivery?
- What happens if the recommended service is not the right fit for the business?

Focus: working method, transparency, ownership, and honest recommendations.

#### Contact

- Can DSE Consultancy manage local SEO and website development in West Bengal?
- What information should I share to receive an accurate recommendation or quote?
- Can I contact DSE Consultancy if I am unsure which service or package I need?
- What happens after I submit the Contact form?

Focus: West Bengal service coverage, low-friction enquiry, no forced package choice, and clear next steps. The first answer must use the exact approved wording in section 2.7.

#### Services index

- Which digital service should a business fix first?
- Will I be charged twice if two services need some of the same work?
- Can I start with one service and add another later?
- What should I confirm before choosing any website or digital marketing agency?

Focus: prioritisation, non-overlapping scope, staged growth, ownership, reporting, timelines, and written deliverables.

#### Website Development landing page

- How does DSE Consultancy prevent a website project from dragging on or being left unfinished?
- What will I receive, and what could cost extra, before development begins?
- Will I own the domain, website access and content after launch?
- Who handles maintenance, updates and technical problems after launch?
- Is the starting price the final price for every website?

Focus: milestones, content dependencies, approval stages, ownership, maintenance boundaries, transparent additions, and the dynamic starting price.

#### SMM + SEO landing page

- Can any agency genuinely guarantee a first-page Google ranking?
- Does DSE Consultancy use fake reviews or risky shortcuts to improve local visibility?
- What will the monthly report show besides followers, reach and impressions?
- Who approves social content before it is published?
- Will DSE Consultancy need ownership of my social and Google Business accounts?
- Are paid-ad costs included in the monthly package?

Focus: no ranking guarantees, no fake reviews, safe account access, approval workflow, enquiry-focused reporting, organic scope, and separate ad spend.

#### Business Website service page

- How do I avoid receiving a generic template that does not fit my business?
- Will the website work properly on mobile and guide visitors towards an enquiry?
- Who owns the domain, website files, content and administrator access?
- Are hosting, renewal, maintenance or extra-page costs explained before payment?

Focus: business fit, mobile conversion, ownership, and cost clarity.

#### Google Business Help service page

- Can anyone guarantee that my Google Business Profile will rank first?
- Will DSE Consultancy ask me to buy or create fake Google reviews?
- Who keeps ownership of the Google Business Profile?
- How are risky edits, verification issues or profile suspensions handled?
- Which results matter beyond map views?

Focus: compliant optimisation, no guarantees or fake reviews, owner-controlled access, careful edits, and calls/directions/enquiries.

#### Lead Form Setup service page

- How will the lead form reduce spam and low-quality submissions?
- Where will new enquiries be delivered?
- What happens if an email notification is missed?
- What customer information will the form collect and how is consent handled?
- Can the form connect with WhatsApp, email or another system later?

Focus: validation and anti-spam, delivery destination, backup visibility, data minimisation, consent, and expandable integrations.

### 4.4 Visible FAQ and structured data

Create a shared FAQ content type and a reusable FAQ JSON-LD helper.

- Visible accordions continue to use `FaqList`.
- JSON-LD uses the exact same question and answer objects as the visible list.
- The markup must never describe hidden or different FAQ content.
- Service-detail FAQs stay in `data/services.ts` with the rest of each service’s route data.
- Primary-page FAQ collections may live in `data/faqs.ts`.

This improves machine readability for search and answer systems, but it does not promise a Google rich result. Google currently limits FAQ rich results and states that ordinary helpful, people-first SEO still applies to AI search features. Structured data is an accuracy and consistency measure, not a ranking guarantee.

Reference guidance:

- [Google Search: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google Search: changes to FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Bing Webmaster: AI Performance guidance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [Bing Webmaster: duplicate content and AI search visibility](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility)

## 5. Component and Data Changes

Expected implementation points:

| Area | Primary change |
| --- | --- |
| `data/service-pricing.ts` | New shared package catalogue and formatters |
| `data/faqs.ts` | New page-level FAQ collections |
| `data/services.ts` | Unique FAQ data for each service detail |
| `components/faq/FaqJsonLd.tsx` | Shared FAQ structured-data output |
| `components/forms/LeadForm.tsx` | General vs website form mode; shared package options |
| `components/forms/CustomBundlePlanner.tsx` | Shared prices, null defaults, incomplete-state handling, placeholder removal |
| `lib/leads.ts` | Catalogue-derived validation; optional package for general enquiries |
| Home page | New closing copy and Home FAQ |
| About page/story | Two-line chapter title and About FAQ |
| Contact page | General form mode, West Bengal copy, Contact FAQ rewrite |
| Services index/detail | New route-specific FAQs |
| Website Development page | Shared prices and revised problem-led FAQs |
| SMM + SEO page | New prices, unique FAQs, three hover-colour identifiers |
| `app/globals.css` | Three colour overlays and any FAQ/planner state styling |

Existing dirty or untracked work in these files belongs to the current site work and must be preserved. Implementation will make narrow edits rather than resetting files.

## 6. Interaction and Accessibility Requirements

- All FAQ questions remain keyboard-operable.
- FAQ controls retain accurate expanded/collapsed state.
- The three SMM card overlays remain visible on keyboard focus as well as pointer hover.
- White hover text must retain readable contrast over all three new colours.
- The Custom Pricing disabled state must be explained in visible text, not colour alone.
- Select labels and required state remain associated for assistive technology.
- Removing the Contact hero package field must not leave a broken label, empty layout gap, or invalid submission path.
- Desktop line breaks are controlled only where specifically approved. Responsive wrapping must remain natural.

## 7. Test-First Verification

Implementation will begin by adding failing tests for:

1. the shared pricing catalogue values and consumers;
2. no duplicated hardcoded package prices in the affected forms/planner;
3. the three new SMM prices;
4. three distinct hover colours with unchanged `0.56` alpha;
5. the Contact hero using general form mode with no visible package selector;
6. website-specific forms still showing catalogue-derived packages;
7. Custom Pricing defaults being empty and its action being blocked until complete;
8. removal of the “Designed To Grow” visible block;
9. exact Home, About, and West Bengal copy changes;
10. FAQ coverage on all nine page groups;
11. visible FAQ content matching FAQ JSON-LD;
12. unique service-detail FAQ collections;
13. backend acceptance of a general enquiry without a package and rejection of unknown package values.

After implementation:

- run the focused Node test suite;
- run the complete UI test suite;
- run TypeScript checking;
- run the production Next.js build;
- inspect Home, About, Contact, Services, all three service details, Website Development, and SMM + SEO in a real browser;
- verify desktop hover states and the Custom Pricing incomplete/complete flow;
- spot-check tablet and mobile for regressions, without introducing the later mobile-specific redesign.

## 8. Non-Goals

This change will not:

- alter footer wording;
- redesign the header, footer, pricing cards, or growth-card animation;
- change SMM package inclusions;
- replace every occurrence of Kalna across the site;
- promise search rankings, AI citations, FAQ rich results, or review growth;
- build a CMS or no-code pricing administration panel;
- complete the separate mobile typography/alignment review;
- publish or deploy automatically as part of the design-specification step.

## 9. Acceptance Criteria

The work is complete when:

- the pre-footer Home section no longer repeats the footer heading;
- the approved About heading fits the established two-line structure at the target desktop width;
- each SMM growth card has a different bright hover colour with alpha `0.56`;
- SMM prices show ₹6,999, ₹9,999, and ₹15,999 everywhere;
- every price-bearing affected surface reads from `data/service-pricing.ts`;
- a future source price edit propagates to page cards, relevant forms, estimates, and validation after one redeployment;
- the Contact hero has no package selector and submits a valid general enquiry;
- Custom Pricing starts with no package selected, cannot proceed incomplete, and shows no “Designed To Grow” block;
- only the approved Contact location heading and first Contact FAQ use the new West Bengal wording;
- the West Bengal FAQ answer matches the approved answer;
- all nine page groups have visible, useful, non-repetitive FAQs;
- visible FAQs and FAQ JSON-LD come from the same data;
- tests, type checking, and production build pass;
- browser QA finds no desktop or responsive regression in the affected routes.
