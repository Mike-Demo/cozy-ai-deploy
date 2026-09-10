# Web Awesome back in, plus a speed pass

Two pieces of work: bring the Web Awesome design system back (including its server-rendered markup), and make the app load faster.

## Part 1 — Web Awesome, done safely

Web Awesome was removed earlier because its stylesheet fought with the current layout and made cards overlap. Bringing it back needs isolation, not a straight re-add.

- Restore the design system files under `src/design-system/font-awsome-web-awesome-171158/` (theme, tokens, React wrappers, vendor bundle, patterns).
- Load its theme stylesheet after the app stylesheet, and set the theme classes on the page so components look right in light mode.
- Contain the conflict: the earlier breakage came from Web Awesome's global `.grid` and reset rules. Scope the Web Awesome theme so its global layout classes cannot override the app's existing layout, and verify each page visually before moving on.
- Mount the component loader once inside the shared layout, not above it, so nothing registers mid-hydration.
- Adopt components where they genuinely improve things rather than everywhere at once: the footer pattern, buttons, callouts for the guide notes, and the licenses page pattern.
- Server-rendered components: switch the loader to its hydration-aware build so the components' internals arrive in the initial HTML instead of popping in after load. This is the "server-side rendering" piece — it needs the matching `with-*` attributes on slotted regions and is verified page by page.

If a page still breaks after scoping, that page keeps its current markup and we note it — no half-broken layouts ship.

## Part 2 — Performance

- **Pre-build the static pages.** Home, setup, troubleshooting, changelog, security and licenses have identical output for every visitor, so render them to HTML at build time instead of on each request.
- **Self-host the icon and font CSS.** Today icons and fonts come from two outside CDNs, which costs extra connections before anything paints. Bundle them instead, and subset the icon set to the ones actually used.
- **Split page code** so a visitor reading the changelog does not download the wizard.
- **Preload the fonts** used above the fold and drop render-blocking requests.
- **Fix page titles and descriptions.** The site-wide defaults are still "Lovable App" / "Lovable Generated Project", which is what search engines and link previews currently show.
- Measure before and after with a build report so the gains are evidence, not claims.

## Risks

- Re-adding Web Awesome is the risky half; it previously broke the layout. The plan isolates it and verifies visually, and each page can fall back to its current markup.
- Server-rendered component internals are an experimental part of Web Awesome; if it produces mismatched markup, the loader falls back to normal client-side upgrade with no visual change.

## Technical notes

- `src/design-system/font-awsome-web-awesome-171158/` restored; `theme.css` imported via `?url` in `src/routes/__root.tsx` `head().links`; `WEB_AWESOME_HTML_CLASSES` on `<html>`; `<WebAwesomeLoader hydrate />` rendered once in `src/components/Layout.tsx`.
- Web Awesome global utility layer scoped with a wrapper class / `@layer` ordering so `.grid` and reset rules do not reach existing Tailwind markup.
- Prerender: add `pages` + `prerender: { enabled: true, autoStaticPathsDiscovery: false }`; requires moving `vite.config.ts` to `@lovable.dev/vite-tanstack-config` (>= 2.20.0), keeping the existing plugin list.
- Fonts via `@fontsource` packages; Font Awesome CSS served from the design system's bundled assets rather than jsDelivr.
- Route-level code splitting via lazy route components for the heavier wizard/guide routes.
- Root `head()` metadata rewritten for Agent Deploy; per-route metadata already exists and stays.
