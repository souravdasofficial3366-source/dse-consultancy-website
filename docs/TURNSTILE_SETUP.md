# Cloudflare Turnstile Setup

The enquiry form uses Cloudflare Turnstile Managed mode. Turnstile works without
Cloudflare DNS, proxying, or nameservers. Verification happens in the server-side
`/api/leads` route, so the secret key is never exposed in the browser.

## 1. Create the keys

1. Open **Turnstile** in the Cloudflare account dashboard.
2. Create a widget named **DSE Enquiry Form** using **Managed** mode.
3. Add each production hostname without `https://` or a path:
   - `dse-consultancy-website.vercel.app`
   - The final Hostinger domain
4. Copy the generated site key and secret key.

## 2. Add environment variables

Add these values to Vercel and, later, to the Hostinger Node.js application:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public site key>
TURNSTILE_SECRET_KEY=<private secret key>
TURNSTILE_ALLOWED_HOSTNAMES=dse-consultancy-website.vercel.app
```

The secret key must never be committed or pasted into public chat. After adding
or changing either value, redeploy the application.

## 3. Hostinger requirement

Deploy this repository as a **Next.js Node.js web application**, not as a static
HTML export. The enquiry form, Google Sheets connection, and Turnstile
verification all use the server-side `/api/leads` route.

Before the Hostinger launch, add the custom domain and its `www` hostname to the
Turnstile widget, then append both values to `TURNSTILE_ALLOWED_HOSTNAMES`.
Hostinger remains responsible for DNS, MX/email, and nameservers.
