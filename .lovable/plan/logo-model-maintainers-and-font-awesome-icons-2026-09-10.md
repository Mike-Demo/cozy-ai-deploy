# Logo, model maintainers, and Font Awesome icons

Three related pieces of polish: a proper brand mark, richer model information, and consistent icons instead of emoji.

## 1. Logo

Rebuild the reference mark as a vector: a thick rounded cloud outline with a small antenna-topped robot face inside (round eyes, three mouth bars, an ear block each side).

- Colors from the app's palette: deep slate outline and face, teal accent for the eyes; a single-color version for small sizes.
- Two shapes: the plain mark, and a padded square app-icon version.
- Appears in the header next to "Agent Deploy", as the browser tab icon, in the home hero, and on the printable guide header.

## 2. Model maintainers and best-for guidance

Each model in the catalog gains:

- **Maintainer** — the organisation behind it (Alibaba for Qwen, Microsoft for Phi, Meta for Llama, NVIDIA, Nous Research for Hermes, and so on), with a link to the official project or model page opening in a new tab.
- **Best for** — a one-line plain-English statement of the tasks it suits best (for example "everyday chat on a small server" versus "coding help and technical troubleshooting"), alongside the existing use-case list.
- A short comparison line on the model-picking step so someone choosing between two models sees the difference at a glance.

Every maintainer name and link is taken from the model's official project page; anything not confirmed is left off rather than guessed, and the licences page keeps its "not affiliated" note.

## 3. Font Awesome icons instead of emoji

Replace the emoji currently used for stacks and the small emoji-style flourishes elsewhere with Font Awesome icons already loaded by the app — a llama-free but fitting icon per stack (server, robot, browser window, workflow diagram, microchip, and so on), plus consistent icons for the verification checklist, warnings, and troubleshooting steps. Icons are decorative and hidden from screen readers where text already says the same thing.

## Technical notes

- New `src/components/Logo.tsx` renders inline SVG using `currentColor` plus an accent prop; square icon exported to `public/favicon.png` and referenced from `head().links` in `src/routes/__root.tsx`, replacing and deleting `favicon.ico`.
- `Model` in `src/lib/types.ts` gains `maintainer: string`, `maintainerUrl?: string`, and `bestFor: string`; all seven stack data modules in `src/data/stacks/` are updated to supply them.
- `AgentStack.icon` changes from an emoji string to a Font Awesome class name; `StackCard.tsx` and any other consumer render `<i className={...} aria-hidden />`.
- No new dependencies.
