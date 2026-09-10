# Agent Deploy logo: robot in a cloud

Build a logo from the reference: a rounded cloud outline with a small antenna-topped robot face sitting inside it. Drawn by hand as a vector so it stays sharp at any size, rather than pasting the screenshot in.

## The mark

- Thick, rounded cloud outline with generous corner radii, exactly as in the reference.
- Inside: a robot head with an antenna, two round eyes, three mouth bars, and a small ear block on each side.
- Colors from the app's own palette: deep slate for the outline and face, with the teal accent used for the eyes so the mark reads as Agent Deploy rather than a generic Font Awesome sample. A single-color version is included for small sizes.
- Comes in two shapes: the plain mark, and a square app-icon version with a soft off-white background and padding.

## Where it appears

- Header, replacing the plain "Agent Deploy" text with the mark plus the name.
- Browser tab icon.
- The home page hero, above the headline.
- Print/guide header, so a downloaded guide carries the mark.

## Technical notes

- New `src/components/Logo.tsx` renders inline SVG with `currentColor` plus an accent prop, so it inherits size and color from context; no image file needed for in-app use.
- Square icon exported to `public/favicon.png` (padded, 64x64) and referenced from `head().links` in `src/routes/__root.tsx`, replacing the default `favicon.ico`, which is then deleted.
- Mark is decorative next to the wordmark (`aria-hidden`), and labeled where it stands alone.
- No new dependencies.
