# Estimate: add Atomic Agents to the catalogue

Atomic Agents is a Python framework for building agent pipelines on top of a
local or remote model. It fits the existing pattern exactly: it becomes an
eighth catalogue item with its own guide page, alongside OpenClaw, Ollama,
Open WebUI, n8n, NemoClaw, Hermes and Razer AIKIT.

## What gets built

1. **New catalogue entry** — name, tagline, description, who it's for, setup
   time, hardware and operating-system requirements, optional extras
   (monitoring, sample pipeline), and the model list it runs against (reuses the
   same Qwen / Phi / Llama entries as Ollama).
2. **Install walkthrough** — connect, update the server, install Python and a
   virtual environment, install Ollama, pull a model, install Atomic Agents,
   run a first example, keep it running as a service. Commands written for the
   Debian/Ubuntu family and the RHEL/CloudLinux family so the guide adapts to
   the visitor's chosen system, as the other entries do.
3. **Checks, troubleshooting, recovery** — a verification checklist (Python
   present, model reachable, agent responds), the common failure cases (missing
   Python, virtual-environment mistakes, model not reachable, out of memory),
   recovery commands, and the support-info commands.
4. **Wire-up** — register it so it appears in the wizard, gets its own
   `/guide/atomic-agents` page in the static build, is listed in the sitemap and
   the build spec, and shows up on the troubleshooting page.
5. **Verify** — typecheck, full static build, then open the new guide in a
   browser on both a Debian-family and a RHEL-family selection to confirm the
   commands change correctly and the progress tracker and downloads work.

## Effort

| Piece | Effort |
| --- | --- |
| Catalogue entry, requirements, models | 30–45 min |
| Install steps for both command families | 45–60 min |
| Checks, troubleshooting, recovery | 30 min |
| Wire-up (wizard, route, sitemap, build spec) | 15 min |
| Build + browser verification | 20–30 min |
| **Total** | **~2.5–3 hours of build time, roughly 4–8 credits** |

No new dependencies, no backend work, no design changes — it reuses the
existing guide machinery end to end.

## Risks

- **Command accuracy.** The install commands come from the project's public
  documentation. I'll write them from the official install instructions, but
  they're unverified against a real server — same caveat as the other entries,
  and the footer disclaimer already covers it. Confidence in the shape of the
  guide: high. Confidence that every package name is current: medium.
- **Windows Server.** Atomic Agents is Python, so it can run there, but the
  service and firewall steps differ enough that I'd mark Windows as untested
  unless you want the extra PowerShell path written too (+30 min).
- **Rollback.** Everything lands in one new catalogue file plus five small
  registrations; removing the file and those lines reverts it completely.

## Technical notes

- New `src/data/stacks/atomic-agents.ts` exporting an `AgentStack`, added to
  `src/data/stacks/index.ts`.
- `installSteps` use the existing `{{server_ip}}` / `{{model_ollama_name}}`
  placeholders; family rewriting is handled by `translateCommand`, so apt-form
  commands are authored once.
- `requirements.os` drives the "not tested on…" warning already rendered by
  `guide.$stackId.tsx`.
- Add `/guide/atomic-agents` to `STATIC_ROUTES` in `vite.config.ts`, to
  `public/sitemap.xml`, and to the route list in `SPACEFAST.md`.
