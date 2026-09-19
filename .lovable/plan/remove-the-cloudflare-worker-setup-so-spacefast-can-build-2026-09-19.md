# Remove the Cloudflare Worker setup so Spacefast can build

Spacefast stops the build because the project still looks like a Cloudflare
Workers site: `wrangler.jsonc` in the project root declares a Worker
entrypoint. Spacefast can't convert Worker entrypoints, so it refuses rather
than shipping a half-working site.

The site no longer needs any of this — the build now prerenders every page to
plain HTML in `dist/client`, and nothing runs on a server at request time.

## What changes

1. Delete `wrangler.jsonc` (the Worker entrypoint declaration Spacefast flags).
2. Remove the leftover Cloudflare plugin import and the now-permanently-false
   `useCloudflare` switch from the build config, so the config plainly describes
   a static build.
3. Drop the `@cloudflare/vite-plugin` dependency and refresh the lockfile.
4. Rebuild and confirm all 14 pages, plus `sitemap.xml`, `robots.txt` and
   `_redirects`, are still written to `dist/client`, and that the typecheck
   passes.
5. Note the change in `SPACEFAST.md` so the build spec matches reality.

## One trade-off to know about

After this, Lovable's own Publish button can no longer produce a Cloudflare
Worker version of the site, because that target is being removed. Editing and
previewing in Lovable is unaffected — the preview runs a dev server and doesn't
use it. Since Spacefast serves the public site, this is the intended direction,
but it is a one-way door for Lovable publishing unless the Worker setup is
added back later.

## Not touched

GitHub, DNS, Spacefast settings, publishing and login steps stay as they are.
No page content, styling or wizard behaviour changes.

## Technical notes

- `wrangler.jsonc` currently sets `main: "@tanstack/react-start/server-entry"`
  with `nodejs_compat`; that file alone is enough for Spacefast's
  `cloudflare-pages` detector to fire.
- `vite.config.ts` already hard-codes `useCloudflare = false` (needed so the
  prerender pass can boot `dist/server/server.js`); the import and branch get
  deleted outright.
- `dist/` is git-ignored, so no built output is reaching Spacefast's detector —
  the config file is the only signal.
