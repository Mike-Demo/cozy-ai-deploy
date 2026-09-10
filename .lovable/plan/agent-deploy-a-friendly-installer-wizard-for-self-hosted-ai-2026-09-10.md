# Agent Deploy — a friendly installer wizard for self-hosted AI agents

A guided web tool that turns "install an AI agent on my server" into a few clicks. The person picks what they want to run, answers a handful of plain questions, and gets a single copy-paste command plus a personalized step-by-step guide, verification checklist, and troubleshooting section for exactly their choices.

No live server connection and no login. Nothing about their server is stored or sent anywhere — everything is generated in the page.

## What the person sees

1. **Home** — short pitch, "Start setup" button, and the catalog of agent stacks as cards (what it does, RAM/disk needed, setup time).
2. **Step 1 — Choose your agent stack** from the catalog. First entry is the OpenClaw + Ollama stack from your guide.
3. **Step 2 — Choose options** for that stack, e.g. which models to install (Qwen3.5-4B, Phi-4-mini, and others), whether to install monitoring tools, whether to open a dashboard port.
4. **Step 3 — Your server** — IP or hostname, SSH username, operating system pick, and a plain-language "does my server fit?" check that warns when RAM/disk are below the picked models' needs.
5. **Step 4 — Your install** — three tabs:
   - **One command**: a single copy-paste line that downloads and runs the generated setup script, plus a "copy the script instead" option for people who want to read it first.
   - **Step by step**: the full walkthrough with their real IP, username, and model names filled in, each command in its own copy button.
   - **Verify**: tickable checklist (SSH login, Ollama running, API responding, each model present, agent healthy) with the exact command and the expected output for each.
6. **Troubleshooting** — the problem/solution pairs from your guide, filtered to the stack they chose, each collapsible. Plus a "Five-minute recovery" block and a "What to send support" block that lists the diagnostic commands to paste.
7. **Print / download** — the personalized guide as a clean printable page and a downloadable `.sh` script.

## Catalog

The catalog is data, so stacks are easy to add later. Launch set:

- **OpenClaw + Ollama** (your guide) — local models, no API keys.
- **Ollama only** — just the model runtime and an API on the server.
- **Open WebUI + Ollama** — browser chat interface for the local models.
- **n8n** — automation workflows that can call the local models.
- **NVIDIA NemoClaw** — NVIDIA's agent stack, for servers with a GPU.
- **Hermes** — the Hermes assistant models served locally.
- **Razer AIKIT** — Razer's edge AI toolkit for local inference and device control.

Each stack entry carries: description, requirements, options, ordered install steps, verification checks, and troubleshooting entries. Model entries carry size and RAM guidance so the fit check is accurate.

## Safety and honesty

- Generated commands are shown in full before anyone runs them; nothing is hidden behind a mystery URL.
- The tool never asks for an SSH password or private key — it has no reason to, since it doesn't connect.
- Requirements warnings are advisory and clearly labelled as estimates.

## Look and feel

Clean, light, approachable: generous whitespace, soft neutral background, one confident accent colour, a friendly non-default typeface pairing, cards with soft borders. Commands sit in monospace blocks with a one-click copy button and a "what this does" line above each. Mobile-first — the whole wizard works on a phone, with copy buttons big enough to tap.

## Technical notes

- TanStack Start routes: `/` (home + catalog), `/setup` (wizard with step state in the URL so a step is shareable and refresh-safe), `/guide/$stackId` (static reference guide per stack), `/troubleshooting`.
- Stack catalog as typed data modules under `src/data/stacks/`, one file per stack, validated against a shared `AgentStack` type.
- Script and step generation is a pure function layer in `src/lib/generate/` (input: stack + options + server details, output: script text, step list, checklist, troubleshooting set) — no UI code, unit-testable.
- Wizard state in a single reducer; requirement fit check is a pure function over selected models.
- shadcn/ui components, Tailwind, semantic design tokens in `src/styles.css`; no hardcoded colours.
- Vitest tests for the generators: correct model pulls emitted, options honoured, fit check thresholds.
- No backend, no database, no accounts. Per-route head metadata for each page.

## Not in this build

Live SSH execution and streaming install progress. The generator layer is kept separate from the UI so that a connection service can be added later without reworking the wizard.
