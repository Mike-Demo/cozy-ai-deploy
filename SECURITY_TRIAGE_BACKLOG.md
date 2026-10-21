# Security audit remediation backlog

Issue creation is not available from this session. The following issue drafts are ready to file in `Mike-Demo/cozy-ai-deploy`; each links back to parent issue [#3](https://github.com/Mike-Demo/cozy-ai-deploy/issues/3).

## Priority

1. **[medium] First-run n8n and Open WebUI dashboard exposure** — the highest-priority confirmed finding and only confirmed finding. Both setup flows expose unauthenticated dashboards on all interfaces over HTTP before an owner account exists, making account takeover reachable by any internet actor who can reach the VPS during setup. Treat both stacks as one remediation because they share the same root cause and smallest fix: unsafe first-run exposure instructions.

## Issue draft: confirmed finding

**Title:** `[security][medium] Secure first-run n8n and Open WebUI dashboards`

**Body:**

### Evidence

The authored guide data for n8n and Open WebUI instructs users to publish ports with `docker run -p 5678:5678` and `docker run -p 3000:8080`, then open each dashboard over plain HTTP at the public server IP to create the first account. The guides do not require a localhost bind, SSH tunnel, TLS reverse proxy, or dashboard authentication before this step. Until the owner account exists, an unauthenticated internet actor who can reach the VPS can create it.

### Root cause

Both stack guides make unauthenticated first-account creation reachable on all network interfaces before any owner account has been established. The shared root cause is unsafe first-run dashboard exposure in the guide data and setup instructions.

### Smallest fix

- Bind both dashboard ports to localhost in the stack data.
- Rewrite the first dashboard step to create the account through an SSH tunnel.
- Update troubleshooting to check the tunnel/local port rather than advise opening the firewall.
- Describe public exposure only as a later option protected by TLS and authentication.

### Parent

Tracks remediation for [#3](https://github.com/Mike-Demo/cozy-ai-deploy/issues/3).

## Issue draft: needs-validation leads

**Title:** `[security][needs-validation] Audit leads to validate`

**Body:**

Validate the following three audit leads. For each, the listed missing fact is the evidence needed to determine whether the claimed impact is reachable. Do not treat these as confirmed findings or assign severity until validated.

- [ ] **Unvalidated server IP/username in generated root shell commands and scripts** (`installer-template-injection-via-server-fields`): establish whether there is a concrete delivery path, observable by the owner or in product distribution, through which a lower-trust party supplies `server.ip` or `server.username` values that a distinct victim then generates and executes. In-repo permalinks are proven to exclude server details; without such a path the impact is self-only.
- [ ] **One-line installer heredoc breakout** (`one-line-installer-heredoc-breakout`): establish the same decisive delivery fact as the preceding lead—whether a lower-trust party can supply crafted server-field values that a distinct victim pastes as the one-line command. In-repo sharing is proven to exclude server details.
- [ ] **Unauthenticated `saveThemeDefaults` CSS file write** (`unauthenticated-theme-css-file-write`): establish whether any built/deployed bundle registers the `saveThemeDefaults` server-function endpoint (no source import of `theme-editor.functions.ts` was found) and, if so, the deployment's `NODE_ENV`. A non-production SSR/dev host would be exploitable; the documented production static SpaceFast deployment has no server function at request time.

### Parent

Tracks validation of audit leads for [#3](https://github.com/Mike-Demo/cozy-ai-deploy/issues/3).

## Excluded candidate

`preview-postmessage-no-origin-validation` was rejected during independent verification; do not re-raise without new evidence.
