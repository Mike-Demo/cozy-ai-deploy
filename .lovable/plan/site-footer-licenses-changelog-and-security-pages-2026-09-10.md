# Site footer, licenses, changelog, and security pages

Add the standard MikeDemo footer to every page, plus three new pages: Open source & credits, Changelog, and Security — styled to match Agent Deploy's existing light, clean look.

## Footer

Replace the current one-line footer in the shared layout with the standard footer used across the other projects:

- "Made by MikeDemo" and the current copyright year.
- An "Open Source" link to the licenses page.
- Social links (LinkedIn, X, tweet.app, Threads), each opening in a new tab with an icon.
- Links to Changelog and Security next to Open Source.
- Keeps the existing reassurance line: guides are generated in your browser, nothing is sent to a server.

The footer is built with the project's own styling and the Font Awesome icons already loaded, not the Web Awesome component library (it was removed earlier because it broke the card layout).

## Open source & credits page (`/licenses`)

Grouped credit lists, each entry showing name, author, license, an optional note, and a link to the license text.

- Open source libraries: React, TanStack Start & Router, Tailwind CSS, Zod, Font Awesome Free.
- Fonts: DM Sans, Space Grotesk, DM Mono (Google Fonts, SIL OFL).
- Services: GitHub Gist API, CodePen prefill.
- Third-party software the guides install (Ollama, OpenClaw, Open WebUI, n8n, NVIDIA NemoClaw, Hermes, Razer AIKIT) with a note that Agent Deploy only generates commands and is not affiliated with them.

## Changelog page (`/changelog`)

A dated list of entries, newest first, each with a kind badge (New / Improved / Fixed / Status), a title, and plain-language notes. Seeded from what this app has actually shipped:

- Save to GitHub Gist and CodePen from the guide screen.
- The seven-stack catalog including NVIDIA NemoClaw, Hermes, and Razer AIKIT.
- The setup wizard, printable guide, downloadable script, and troubleshooting page.
- A note that some NemoClaw and Razer AIKIT commands are unverified placeholders.

Entries live in a typed array in the route file so adding one is a single edit.

## Security page (`/security`)

Plain-language sections mirroring the Crosspost security guide, but accurate for this app:

- What Agent Deploy stores — nothing; the wizard runs in your browser and keeps no accounts.
- Server details you type (host, username, port) stay in the page and are only used to write out the commands.
- No SSH connection is ever made and no password or key is ever asked for or transmitted.
- What leaves your browser: only the script text you choose to send to a Gist or CodePen, and a warning that an unlisted Gist is readable by anyone with the link.
- Safety advice for running generated commands: read before pasting, use a non-root user where possible, firewall the model API port.
- What Agent Deploy never does.
- Reporting a problem.

## Technical notes

- New files: `src/components/SiteFooter.tsx`, `src/routes/licenses.tsx`, `src/routes/changelog.tsx`, `src/routes/security.tsx`, plus typed data modules under `src/data/` for credits and changelog entries.
- `src/components/Layout.tsx` renders `SiteFooter`; footer links added to header nav where useful.
- Each new route gets its own `head()` with a unique title, description, and Open Graph/Twitter tags; the copyright year resolves after hydration to avoid a server/client mismatch.
- No backend, no new dependencies.
