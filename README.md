# DSE Consultancy Website

Fast Next.js website for DSE Consultancy, built from the Stitch design named **Landing Page with Interactive FAQ Fix**.

## What Is Included

- Server-rendered landing page for Google crawling
- Simple lead form with owner name, mobile number, shop type, town/city, and consent
- Supabase-ready lead table schema
- Optional email alert through Resend
- Optional SMS/WhatsApp alert through a provider webhook
- Programmatic local pages such as `/website-design-for-shops-in-kolkata`
- Dynamic `sitemap.xml`, `robots.txt`, and LocalBusiness JSON-LD

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Folder Structure

```text
dse-consultancy-website/
  app/
    (landing-pages)/       Home landing page
    (local-seo-pages)/     Programmatic city/business SEO pages
    (website-pages)/       About, contact, services, cases, and sub pages
    api/                   Backend API routes
  components/
    faq/                   FAQ components
    forms/                 Lead form components
    layout/                Header, footer, floating WhatsApp button
  data/                    Business lists, services, case studies, city lists
  lib/                     Lead validation, alerts, page text, JSON-LD
  database/                Supabase SQL table setup
  docs/                    Editing notes for VS Code
  public/                  Static files for future images and icons
  .vscode/                 VS Code settings, extensions, and debug config
```

## No `index.html`

This project uses Next.js, not plain HTML. Edit these files instead:

- Home page: `app/(landing-pages)/page.tsx`
- About page: `app/(website-pages)/about-us/page.tsx`
- Contact page: `app/(website-pages)/contact-us/page.tsx`
- Services list: `app/(website-pages)/services/page.tsx`
- Service content: `data/services.ts`
- Case study content: `data/case-studies.ts`

More detail is in `docs/WHERE_TO_EDIT.md`.

## Environment

Copy `.env.example` to `.env.local` and fill the values when business details are ready.

For production lead storage in an easy-to-manage table, connect a Google Sheet using
[`docs/GOOGLE_SHEETS_SETUP.md`](docs/GOOGLE_SHEETS_SETUP.md), then set:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_WEBHOOK_SECRET=
```

Alternatively, run `database/schema.sql` in Supabase, then set:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Google Sheets is used first when both Google Sheets values are configured. Otherwise, the site
uses Supabase when both Supabase values are configured. If neither is configured, the site still
runs, but leads are not permanently stored in production.

Protect the public form with Cloudflare Turnstile by following
[`docs/TURNSTILE_SETUP.md`](docs/TURNSTILE_SETUP.md), then set:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
TURNSTILE_ALLOWED_HOSTNAMES=dse-consultancy-website.vercel.app
```

## Before Production

1. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` domain.
2. Confirm the real phone and WhatsApp numbers.
3. Connect Google Sheets or Supabase for enquiry storage.
4. Add the Turnstile site key, secret key, and allowed hostnames.
5. Add the Resend values if email alerts are required.
6. Replace the temporary business address text and add any real social profile URLs.

The `/sub-pages` starter templates are intentionally excluded from search engines until they are
replaced with real content.
