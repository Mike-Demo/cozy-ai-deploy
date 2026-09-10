# Save the install script to CodePen or GitHub Gist

Add two share buttons next to "Download script" so people can keep a link to their generated install script instead of only a local file.

## What the user sees

On the guide step of the wizard (and on the reference guide pages), the button row becomes:

- **Download script** (unchanged)
- **Save to CodePen** — opens CodePen in a new tab with the script already filled in
- **Save to Gist** — creates a secret GitHub Gist and shows the link, with a one-click copy

While a Gist is being created the button shows a spinner; on success a small panel appears with the Gist link (opens in a new tab) and a copy button. On failure it shows the plain reason returned by GitHub.

Only the generated `.sh` script is saved — one file named `<stack-id>-install.sh`.

Note: all Gists are created in one shared GitHub account that you connect, not the visitor's account. Anyone with the link can see it, so the guide keeps its existing warning that the script contains only the server address the visitor typed.

## Technical notes

**CodePen** — client-side only. A hidden form POSTs to `https://codepen.io/pen/define` with a `data` field containing `{ title, description, html: "<pre>…script…</pre>", editors: "1000" }`. No account or key needed. Lives in a small helper `src/lib/share/codepen.ts` plus a `ShareActions` component; no backend.

**Gist** — needs GitHub credentials, so it runs server-side:

- Link the GitHub connector (`standard_connectors--connect`) so the app gets `GITHUB_API_KEY`; calls go through the Lovable connector gateway with `LOVABLE_API_KEY`.
- New server function `src/lib/share/gist.functions.ts` (`createGist`), validated with Zod: `{ filename: string (<=100, `[\w.-]+\.sh`), content: string (<=100_000), description: string (<=200) }`.
- Handler POSTs to `${GATEWAY_URL}/gists` with `Accept: application/vnd.github+json`, body `{ description, public: false, files: { [filename]: { content } } }`. Non-OK responses log status + body and surface both to the caller. Returns `{ url }` only.
- Called from the component with `useServerFn` inside a `useMutation` — never from a route loader.
- No auth on the function (the app has no accounts), so input limits above are the guard against abuse of the shared account.

**Files touched**
- new: `src/lib/share/codepen.ts`, `src/lib/share/gist.functions.ts`, `src/components/ShareActions.tsx`
- edit: `src/components/StepGuide.tsx` (replace the button row), `src/routes/guide.$stackId.tsx` (add the same row under the one-command section)

Existing generation logic in `src/lib/generate` is unchanged.
