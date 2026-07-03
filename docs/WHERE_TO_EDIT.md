# Where To Edit

This is a Next.js project, so there is no `index.html` file.

Use these files instead:

| What you want to edit | File or folder |
| --- | --- |
| Home landing page | `app/(landing-pages)/page.tsx` |
| Local SEO pages like `/website-design-for-shops-in-kolkata` | `app/(local-seo-pages)/[slug]/page.tsx` |
| About page | `app/(website-pages)/about-us/page.tsx` |
| Contact page | `app/(website-pages)/contact-us/page.tsx` |
| Services list | `app/(website-pages)/services/page.tsx` |
| Service page content | `data/services.ts` |
| Case studies list | `app/(website-pages)/case-studies/page.tsx` |
| Case study content | `data/case-studies.ts` |
| Header and footer | `components/layout/LayoutParts.tsx` |
| Lead form | `components/forms/LeadForm.tsx` |
| FAQ behavior | `components/faq/FaqList.tsx` |
| Colors and layout styles | `app/globals.css` |

## Page Folders

Next.js uses `page.tsx` files for website pages.

Examples:

- `app/(website-pages)/about-us/page.tsx` becomes `/about-us`
- `app/(website-pages)/contact-us/page.tsx` becomes `/contact-us`
- `app/(website-pages)/services/page.tsx` becomes `/services`
- `app/(website-pages)/services/[serviceSlug]/page.tsx` becomes `/services/business-website`

Folders in parentheses, such as `(landing-pages)`, are only for organizing code in VS Code. They do not appear in the website URL.
