# Static hosting on Spacefast

## Static check result

Every page of this site is generated in the visitor's browser — no accounts, no database reads, no per-visitor content. One exception: the **Save to Gist** button, which needs a live server (bot check + creating the Gist). Per your decision, that button is removed, so the whole site becomes fully static. Download and Save to CodePen stay.

## What gets built

Ten public pages get baked into real HTML files:

```text
/                /setup            /faq
/troubleshooting /licenses         /security
/changelog
/guide/openclaw  /guide/ollama     /guide/openwebui
/guide/n8n       /guide/nemoclaw   /guide/hermes
/guide/razeraikit
```

That is 7 fixed pages plus one page per catalogue item (7), all listed explicitly so nothing is guessed at build time.

Output lands in `dist/client`, which is the folder Spacefast serves.

## Steps

1. **Remove Save to Gist** — delete the server-side Gist code and the bot-challenge piece, and trim the share row down to Download, Copy link and Save to CodePen. The rate-limit table in the backend is left alone (harmless, unused).
2. **Prerender every page** — list all 14 paths for the build and turn on prerendering with automatic path discovery off. After building, confirm each path produced its own `index.html`.
3. **Copy the output** — add a small post-build script that copies the rendered site into `dist/client`, and make the build command run it. Re-running is safe and repeatable.
4. **Static support files** — write a fixed `public/sitemap.xml` with the 14 URLs, keep `public/robots.txt` pointing at it, add `public/_redirects` with `/*  /index.html  200` so deep links work, and delete the old server-generated sitemap page.
5. **Page titles and previews** — each page already sets its own title, description and social tags in the page itself, so they bake into the HTML. I'll re-check all 10 while I'm in there.
6. **Verify** — typecheck, full build, confirm the HTML files plus sitemap/robots/_redirects exist, then open each page in a browser to confirm it renders and that shared links with settings in the address bar still restore correctly.
7. **`SPACEFAST.md`** — records the install command, the build command, and that the site is served from `dist/client`.

## Technical notes

- `vite.config.ts`: `tanstackStart({ pages: [...], prerender: { enabled: true, autoStaticPathsDiscovery: false } })`. No `nitro: { preset: "static" }` — it breaks the SSR build. Raw prerender output stays `.output/public`.
- `@lovable.dev/vite-tanstack-config` is not a dependency here; the config uses `tanstackStart` from `@tanstack/react-start` directly, so the 2.20.0 version floor doesn't apply. If prerendering emits nothing, I'll report that rather than silently ship an empty build.
- New `scripts/copy-static-output.mjs`; `build` becomes `vite build && node scripts/copy-static-output.mjs`.
- Files removed: `src/lib/share/gist.functions.ts`, the hCaptcha pattern usage in `ShareActions.tsx`, `src/routes/sitemap[.]xml.ts` (and its `src/lib/sitemap.ts` helper if nothing else uses it).
- If the build writes all pages then hangs, I'll trace the open handle (module-scope timers, React Query `gcTime`, module-scope clients) and fix it with lazy creation, `.unref()`, or a `TSS_PRERENDERING` guard.
- Untouched: GitHub, DNS, publishing, logins.
