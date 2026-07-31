# Website Development Hero Form Compact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Website Development hero price fully visible and moderately compact its desktop lead form while preserving every field, dynamic behaviour, and responsive layout.

**Architecture:** Apply only page-scoped CSS beneath `.website-development-page`; no component markup or shared form logic changes are required. Extend the existing source-level regression test to lock the unclipped headline, absent decorative stripe, desktop-only compaction, and unchanged mobile-safe structure.

**Tech Stack:** Next.js App Router, React, CSS, Node.js test runner, TypeScript, Vercel.

## Global Constraints

- Keep the H1 wording, font family, font size, dynamic price source, and natural wrapping.
- Keep every form field in its current order and arrangement.
- Do not change shared pricing, validation, submission, consent, Turnstile, responsive stacking, artwork, or animation.
- Scope all new visual rules to `.website-development-page` and desktop-only compaction to `@media (min-width: 981px)`.
- Preserve comfortable mobile control sizing and spacing.
- Do not modify Hostinger.

---

### Task 1: Lock and implement the compact hero treatment

**Files:**
- Modify: `tests/website-development-hostinger-visual-merge.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the existing `.website-development-page`, `.wd-hero`, `.lead-card`, `.lead-form`, and `.field-grid` markup hooks.
- Produces: page-scoped visual rules only; no JavaScript, React, form-data, or pricing interface changes.

- [ ] **Step 1: Write the failing regression test**

Append this test to `tests/website-development-hostinger-visual-merge.test.mjs`:

```js
test("hero price has breathing room and the desktop form is moderately compact", () => {
  assert.match(
    css,
    /\.website-development-page \.wd-hero \.hero-content h1\s*\{[^}]*line-height:\s*\.98/
  );
  assert.doesNotMatch(
    css,
    /\.website-development-page \.lead-card::before\s*\{/
  );
  assert.match(
    css,
    /@media \(min-width: 981px\)[\s\S]*?\.website-development-page \.wd-hero \.lead-card\s*\{[^}]*padding:\s*24px 28px/
  );
  assert.match(
    css,
    /@media \(min-width: 981px\)[\s\S]*?\.website-development-page \.wd-hero \.lead-form textarea\s*\{[^}]*min-height:\s*88px/
  );
});
```

- [ ] **Step 2: Run the focused test and verify the new assertion fails**

Run:

```bash
node --test tests/website-development-hostinger-visual-merge.test.mjs
```

Expected: FAIL because the H1 still uses `.92`, the decorative `::before` stripe still exists, and the desktop compaction rules have not been added.

- [ ] **Step 3: Implement the minimum page-scoped CSS change**

In `app/globals.css`, change the Website Development H1 rule to:

```css
.website-development-page .wd-hero .hero-content h1 {
  max-width: 780px;
  color: #fff9f5;
  font-size: clamp(3.7rem, 5.7vw, 6.5rem);
  letter-spacing: -.045em;
  line-height: .98;
  text-wrap: initial;
}
```

Delete the complete `.website-development-page .lead-card::before` rule.

Add these rules inside the existing `@media (min-width: 981px)` block:

```css
.website-development-page .wd-hero .lead-card {
  padding: 24px 28px;
}

.website-development-page .wd-hero .lead-card h2 {
  margin-bottom: 12px;
}

.website-development-page .wd-hero .lead-form {
  gap: 10px;
}

.website-development-page .wd-hero .field-grid {
  column-gap: 14px;
  row-gap: 10px;
}

.website-development-page .wd-hero .lead-form label {
  gap: 4px;
}

.website-development-page .wd-hero .lead-form :is(input, select, textarea) {
  min-height: 44px;
  padding: 10px 12px;
}

.website-development-page .wd-hero .lead-form textarea {
  min-height: 88px;
}
```

Do not modify `components/forms/LeadForm.tsx` or the shared `.lead-card`, `.lead-form`, `.field-grid`, input, select, or textarea rules.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
node --test tests/website-development-hostinger-visual-merge.test.mjs
```

Expected: all focused Website Development visual-merge tests PASS.

- [ ] **Step 5: Run static verification**

Run:

```bash
npm run test:ui
npm run typecheck
npm run build
```

Expected: the complete UI test suite, TypeScript check, and production build PASS.

- [ ] **Step 6: Commit the implementation**

```bash
git add app/globals.css tests/website-development-hostinger-visual-merge.test.mjs
git commit -m "fix: compact website development hero form"
```

### Task 2: Release and verify the Vercel page

**Files:**
- No source files should change.

**Interfaces:**
- Consumes: the verified `main` commit from Task 1 and the existing linked Vercel project.
- Produces: an updated Vercel production deployment with the Hostinger site untouched.

- [ ] **Step 1: Push the verified main branch**

Run:

```bash
git push origin main
```

Expected: GitHub accepts the new implementation commit.

- [ ] **Step 2: Deploy the linked project to Vercel production**

Run:

```bash
npx --yes vercel@50.28.0 deploy --prod
```

Expected: Vercel reports a READY production deployment for the linked DSE Consultancy project.

- [ ] **Step 3: Verify desktop geometry and behaviour**

Open `/website-development` at 1440 × 900 and 1280 × 800. Confirm:

- the complete dynamic price is visible;
- the top gradient stripe is absent;
- the card is shorter and visually balanced;
- all fields retain the approved order;
- consent, Turnstile, and submit action are reachable;
- the page has no horizontal overflow.

- [ ] **Step 4: Verify tablet and mobile safeguards**

Open `/website-development` at 768 × 1024 and 390 × 844. Confirm:

- the H1 and price wrap without clipping;
- form fields stack exactly as before;
- mobile controls retain their existing comfortable sizing;
- no content or floating contact control causes horizontal overflow.

- [ ] **Step 5: Confirm deployment boundaries**

Confirm the Vercel URL contains the new styling and that no Hostinger files, shared form logic, dynamic pricing data, header, footer, or other routes were modified.
