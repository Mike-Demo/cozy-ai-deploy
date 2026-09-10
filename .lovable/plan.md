# Add the two Linux administration skills

Turn the two uploaded documents into active skills so they are available automatically whenever the work involves Linux server commands, service management, or troubleshooting.

## What gets added

1. **system-admin** — the short reference: system info, hardware, resource monitoring, systemd service commands, health-check and high-load scenarios, and a troubleshooting table.
2. **administering-linux** — the longer guide: systemd, process management, filesystems, users and security, networking, performance tuning, and log analysis.

Both are stored with their content kept as written. The only edit is to the description line at the top of each, so the right one surfaces at the right moment:

- system-admin: quick command lookups for system information, resource monitoring, and systemd service control.
- administering-linux: deeper server work — deploying apps, diagnosing production issues, tuning performance, managing users and security.

## How they get used

Once active, these are applied automatically when relevant. In this project that mainly means:

- Writing or reviewing the install and verification commands in the stack guides.
- Expanding the troubleshooting entries with correct diagnostic commands.
- Keeping service, monitoring, and disk commands accurate per operating-system family.

Nothing on the site changes as part of this step — no new pages, no content rewrites. The skills become available for the work that follows.

## Technical notes

- Draft each skill at `.agents/skills/system-admin/SKILL.md` and `.agents/skills/administering-linux/SKILL.md`, copied from the uploads with corrected YAML frontmatter (`name`, `description`).
- Activate each with the apply-draft step; active skills then live under the workspace skills directory.
- No project source files, dependencies, or backend changes.
