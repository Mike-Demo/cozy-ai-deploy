# Make each guide a real walkthrough

Today a guide page is a long read: requirements, one big command, a list of steps, checks, troubleshooting. It works, but nothing tracks where you are. This turns each guide into a guided walkthrough you can work through over a coffee break and come back to.

## What changes on a guide page

**Progress tracker at the top**
A slim bar that sticks to the top as you scroll, showing "Step 3 of 8" with a filled progress bar and the time left estimate. It also holds a "Reset progress" link.

**One step at a time**
Each step becomes a card you can mark done. Completed steps collapse to a single green line so the page shortens as you work. The current step stays open with its commands, notes and a "Mark done, next step" button that scrolls to the following step.

**Progress is remembered**
Ticking steps is saved in the browser for that stack, so closing the tab and coming back keeps your place. Nothing leaves the device, no account.

**Verification counts toward progress**
The verification checks become the final stage of the same tracker instead of a separate list with its own counter. When everything is ticked, a short "Installation complete" panel appears with what to do next.

**Downloads in one place**
A downloads panel near the top with: the full install script (.sh), a printable checklist of just the commands (.txt), and the existing save to Gist / CodePen buttons. Plus the current per-command copy buttons.

**Quick jump**
A short contents list of the step titles, each linking to its card, with a tick next to the ones already done.

Requirements, the one-command installer, and troubleshooting stay where they are.

## Technical notes

- New `src/hooks/useGuideProgress.ts`: `{ done, toggle, reset, currentIndex, percent }` keyed by `agent-deploy:progress:<stackId>`, read inside `useEffect` so SSR and hydration match.
- New `src/components/GuideProgressBar.tsx` (sticky header + percent), `src/components/GuideStep.tsx` (collapsible step card with done state and next action), `src/components/GuideContents.tsx` (jump list), `src/components/GuideDownloads.tsx` (script + checklist downloads, wraps existing `ShareActions`).
- `Checklist.tsx` gains optional controlled props (`completed`, `onToggle`) so verification shares the same progress store; existing uncontrolled use keeps working.
- Plain-text checklist built from `guide.steps` commands in a small pure helper under `src/lib/generate/`.
- `src/routes/guide.$stackId.tsx` composes the above; the wizard's final screen (`StepGuide.tsx`) reuses the same components so both views behave identically.
- Steps get stable ids (index-based slug of the title) so saved progress survives copy tweaks.
- Print styles: completed steps expand again when printing; the sticky bar is hidden.
- No new dependencies, no backend, existing HowTo structured data unchanged.
