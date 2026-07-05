# Google reCAPTCHA Setup

The enquiry form supports Google reCAPTCHA v2 using the “I’m not a robot”
checkbox. Verification happens in the server-side `/api/leads` route, so the
secret key is never exposed in the browser.

## 1. Create the keys

1. Open the Google reCAPTCHA admin console.
2. Choose **Challenge (v2)** and **“I’m not a robot” Checkbox**.
3. Add each production hostname without `https://` or a path:
   - `dse-consultancy-website.vercel.app`
   - The final Hostinger domain
4. Copy the generated site key and secret key.

## 2. Add environment variables

Add these values to Vercel and, later, to the Hostinger Node.js application:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<public site key>
RECAPTCHA_SECRET_KEY=<private secret key>
```

The secret key must never be committed or pasted into public chat. After adding
or changing either value, redeploy the application.

## 3. Hostinger requirement

Deploy this repository as a **Next.js Node.js web application**, not as a static
HTML export. The enquiry form, Google Sheets connection, and reCAPTCHA
verification all use the server-side `/api/leads` route.
