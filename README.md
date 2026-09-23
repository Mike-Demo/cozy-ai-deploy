# Agent Deploy

Guided installer for self-hosted AI agents: pick a stack and models, answer a
few questions, and get a personalised walkthrough with commands that adapt to
your server's operating system.

## Stacks

OpenClaw, Ollama, Open WebUI, n8n, NVIDIA NemoClaw, Hermes, Razer AIKIT and
Atomic Agents — each with its own guide at `/guide/<stack>`.

## Stack

- TanStack Start + TanStack Router (file-based routing under `src/routes/`)
- React 19 + TypeScript, Tailwind CSS, Web Awesome
- TanStack Query, Zod, Recharts, date-fns

## Develop

```sh
bun install
bun run dev
```

## Static hosting (Spacefast)

The whole site is fully static — no accounts or backend. Build command:

```sh
vite build && node scripts/copy-static-output.mjs
```

Output lands in `dist/client`. See `SPACEFAST.md` for details.
