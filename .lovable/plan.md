# Shareable permalinks for every page

Give every page a link you can copy, bookmark, and come back to later — including a half-finished setup. Your server's address is never part of the link.

## What you get

- A small "Copy link" button on the setup wizard and on each guide page. One click copies the current link; the button confirms with "Copied".
- On the setup wizard, the address bar updates as you go: which stack you picked, which models and options you ticked, which operating system you chose, and which step you're on.
- Reopening that link later drops you back on the same step with the same choices already made.
- Your server IP address and login name are never written into the link. After reopening, the server step is blank and you fill it in again — the rest is restored.
- Guide pages already have their own address (`/guide/openclaw`); the copy button there includes your model and option choices so the shared guide matches what you were reading.
- Plain pages (home, FAQ, changelog, licenses, security, troubleshooting) keep their existing simple addresses; nothing changes there.

Example link: `/setup?step=1&stack=openclaw&models=qwen3-4b,phi4-mini&options=firewall&os=ubuntu-22.04`

## Technical notes

- New `src/lib/permalink.ts`: a Zod-validated search-params schema (`step`, `stack`, `models`, `options`, `os`) plus encode/decode helpers. Unknown stack, model, or option ids are dropped against the catalog rather than throwing, so an old or hand-edited link still opens.
- `src/routes/setup.tsx` gains `validateSearch` using that schema; `Wizard` reads the parsed search via `Route.useSearch()` to build its initial state and calls `navigate({ search, replace: true })` on every state change so back/forward work and no history spam accumulates.
- `ServerDetails` (`ip`, `username`) is deliberately excluded from the schema — it stays component state only. `os` is a catalog enum, not personal data, so it is included.
- New `src/components/CopyLinkButton.tsx`: reads `window.location.href` inside the click handler (never during render, to avoid hydration mismatch), uses `navigator.clipboard.writeText` with a text-selection fallback, and shows a 2-second confirmation. Placed next to the existing share actions in `StepGuide.tsx` and in the guide page header.
- `src/routes/guide.$stackId.tsx` gains the same `models`/`options` search params so a copied guide link restores the same selection; existing canonical and `og:url` tags keep pointing at the clean path without query strings, so search indexing is unaffected.
- No backend, no storage, no new dependencies. Existing localStorage progress tracking is untouched.
