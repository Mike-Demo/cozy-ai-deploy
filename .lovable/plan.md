# Add schema.org structured data across the site

Right now only the generated guide pages carry structured data (a HowTo block). This adds the same machine-readable description to the rest of the site so search engines understand what each page is.

## What gets added

- **Site-wide (root)** — a WebSite entry with the site name and address, plus an Organization entry for Agent Deploy with the logo. Site-wide only; no page-specific data here.
- **Home page** — a WebApplication entry describing Agent Deploy as a free browser-based install-guide generator.
- **Setup page** — an ItemList of the available stacks (OpenClaw, Ollama, Open WebUI, n8n, NemoClaw, Hermes, Razer AIKIT), each linking to its guide page.
- **Guide pages** — keep the existing HowTo, and add a BreadcrumbList (Home → Setup → the guide) since these are deep pages.
- **Troubleshooting, Licenses, Changelog, Security, FAQ** — a plain WebPage entry with the page name, description and address, plus a BreadcrumbList back to home.

The existing FAQ page keeps its normal content; no FAQ-specific markup is added, as that rich result was retired.

## Technical notes

- A new `src/lib/seo/structuredData.ts` exports small typed builders (`websiteSchema`, `organizationSchema`, `webPageSchema`, `breadcrumbSchema`, `itemListSchema`) using a single `SITE_URL` constant of `https://local.mikedemo.dev`, so no route hand-writes raw JSON objects.
- Each route emits them through the existing `head()` `scripts` array with `type: "application/ld+json"` and `children: JSON.stringify(...)`, matching the pattern already used in `guide.$stackId.tsx`.
- Stack list for the setup ItemList comes from the existing catalog data, so new stacks appear automatically.
- No new dependencies, no visual changes.

## Note

Structured data reaches the live address on the next publish.
