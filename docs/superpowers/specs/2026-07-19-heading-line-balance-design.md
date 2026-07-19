# Heading Line Balance Design

## Goal

Extend the approved homepage split-copy principle to the remaining DSE Consultancy pages without disturbing layouts that already use their space well. At the 1440px desktop reference width, long banner headings should normally use no more than three lines and major non-banner section titles should normally use two lines.

Line count is a desktop composition target, not content truncation. Tablet and mobile headings must wrap naturally without overflow.

## Approved Reference

The homepage “Every Customer Touchpoint. One Consistent Business.” section is approved with:

- a two-line heading;
- a three-line body paragraph;
- the CTA directly below the paragraph;
- no copy, colour, typography-family, or mobile-stack changes.

That section is locked and must not be changed during the remaining-page pass.

## Rendered Audit

The audit used the current local website at 1440×900 and covered all unique page families: homepage, About, Contact, Website Development, Social + SEO, Blog, services, service details, case studies, case-study details, one representative local SEO route, and legal pages.

Already balanced and excluded from edits:

- Homepage banner: three lines; major titles: two lines.
- Website Development banner: three lines; major titles: two lines.
- Social + SEO banner: three lines; major titles: two lines.
- Blog, services, case studies, local SEO templates, and legal templates have no excessive desktop title wrapping.
- No audited route has horizontal overflow or a framework error overlay.

Confirmed desktop outliers:

- About “Our Story” title: four lines; target two.
- About “The Team Model” title: four lines; target two.
- About closing CTA title: four lines; target two.
- Contact banner title: four lines; target three.

The boxed About hero note is not the same unboxed split-copy pattern and remains unchanged.

## Considered Approaches

### 1. Global heading-width and font changes

Change shared inner-page heading rules so every page receives wider or smaller headings.

Trade-off: simple, but it would alter many pages that already meet the approved line balance.

### 2. Target only the four confirmed outliers — selected

Adjust only the About story grid/title, About capabilities grid/title, About closing CTA title, and Contact hero grid/title. Use more of the available desktop width first, with a modest page-specific type-scale correction only where width alone cannot achieve the approved composition.

Trade-off: several focused selectors are required, but all working layouts and Antigravity adjustments stay intact.

### 3. Rewrite or shorten the headings

Reduce words until every title fits the desired line count.

Trade-off: this would change the approved message and solve a layout problem through copy editing. It is rejected.

## Selected Desktop Behaviour

At widths above 960px:

- Preserve every heading’s existing words and explicit semantic `span` grouping.
- Rebalance `.dse-about-story-grid` so the story copy receives more width while the DSE artwork remains substantial.
- Rebalance `.dse-about-capabilities-grid` so the left title block receives enough width while the role list remains readable.
- Increase the usable width of `.dse-page-cta h2` and apply only the minimum page-specific size correction necessary for its two explicit lines.
- Rebalance `.dse-contact-hero-grid` so the first Contact heading span fits on one line and the second uses two lines, producing three banner lines overall without narrowing the form below its existing 360px minimum.
- Prefer smaller grid gaps and wider copy tracks before reducing font size.
- Do not change body copy, CTA wording, colours, cards, forms, media, or section order.

At widths at or below 960px:

- Preserve the current single-column About and Contact grids.
- Allow natural heading wrapping; do not force two or three lines.
- Preserve readable padding and prevent horizontal overflow.

## Regression Protection

Extend the static layout contract with assertions that:

- the approved homepage Connected Advantage ratio remains unchanged;
- the four desktop outliers receive page-specific width rules;
- shared heading rules for already-balanced pages are not modified;
- the 960px single-column fallbacks remain present.

## Browser Verification

After the focused test passes, verify at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844.

Required desktop results:

- About story title: two lines.
- About capabilities title: two lines.
- About closing CTA title: two lines.
- Contact banner title: three lines.
- Homepage approved section remains two heading lines and three paragraph lines.

Every viewport must have no clipped text, horizontal overflow, framework overlay, or console error caused by the layout changes.

## Non-Goals

- No deployment before the user reviews the completed visual pass.
- No copy rewriting.
- No global typography redesign.
- No changes to already-balanced routes.
- No staging or modification of unrelated Antigravity work.
