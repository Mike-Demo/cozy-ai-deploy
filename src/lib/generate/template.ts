import { getOsFamily } from "@/lib/os";
import type { Model, OsFamily, ServerDetails } from "@/lib/types";

export interface TemplateContext {
  server: ServerDetails;
  models: Model[];
  family: OsFamily;
}

export function buildTemplateContext(
  server: ServerDetails,
  models: Model[],
): TemplateContext {
  return { server, models, family: getOsFamily(server.operatingSystem) };
}

export function renderTemplate(
  template: string,
  context: TemplateContext,
): string {
  const model = context.models[0];
  const modelNames = context.models.map((m) => m.ollamaName);

  return template
    .replace(/\{\{server_ip\}\}/g, context.server.ip || "YOUR_SERVER_IP")
    .replace(
      /\{\{server_username\}\}/g,
      context.server.username || "root",
    )
    .replace(
      /\{\{model_ollama_name\}\}/g,
      model?.ollamaName || "MODEL_NAME",
    )
    .replace(
      /\{\{model_ollama_names\}\}/g,
      modelNames.join(", ") || "MODEL_NAME",
    );
}

/**
 * Stack data is authored in Debian/Ubuntu form. These rules re-express the same
 * intent for the other families so a guide never shows commands that cannot run
 * on the chosen server.
 */
const WINGET_PACKAGES: Record<string, string> = {
  curl: "cURL.cURL",
  git: "Git.Git",
  wget: "JernejSimoncic.Wget",
  python3: "Python.Python.3.12",
  "python3-pip": "Python.Python.3.12",
  "python3-venv": "Python.Python.3.12",
  nodejs: "OpenJS.NodeJS.LTS",
  npm: "OpenJS.NodeJS.LTS",
  docker: "Docker.DockerDesktop",
  "docker.io": "Docker.DockerDesktop",
  htop: "",
  "build-essential": "",
  "ca-certificates": "",
  gnupg: "",
  "software-properties-common": "",
};

function packagesFromApt(command: string): string[] {
  const match = command.match(/apt(?:-get)?\s+install\s+(.*)$/);
  if (!match) return [];
  return (match[1] ?? "")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !token.startsWith("-"));
}

function toRhel(command: string): string {
  const trimmed = command.trim();

  if (/^sudo\s+apt(?:-get)?\s+update$/.test(trimmed)) {
    return "sudo dnf -y check-update || true";
  }
  if (/^apt(?:-get)?\s+update$/.test(trimmed)) {
    return "dnf -y check-update || true";
  }
  if (/apt(?:-get)?\s+(?:full-)?upgrade/.test(trimmed)) {
    return trimmed.startsWith("sudo ") ? "sudo dnf -y upgrade" : "dnf -y upgrade";
  }
  if (/apt(?:-get)?\s+install/.test(trimmed)) {
    const packages = packagesFromApt(trimmed).map((pkg) =>
      pkg === "build-essential" ? '"Development Tools"' : pkg,
    );
    const prefix = trimmed.startsWith("sudo ") ? "sudo " : "";
    return `${prefix}dnf install -y ${packages.join(" ")}`.trim();
  }
  if (/^(sudo\s+)?ufw\s+allow\s+(\S+)/.test(trimmed)) {
    const port = trimmed.match(/ufw\s+allow\s+(\S+)/)?.[1] ?? "";
    const normalized = port.includes("/") ? port : `${port}/tcp`;
    const prefix = trimmed.startsWith("sudo ") ? "sudo " : "";
    return `${prefix}firewall-cmd --permanent --add-port=${normalized} && ${prefix}firewall-cmd --reload`;
  }
  if (/^(sudo\s+)?ufw\s+(enable|reload|status)/.test(trimmed)) {
    const prefix = trimmed.startsWith("sudo ") ? "sudo " : "";
    return `${prefix}firewall-cmd --reload`;
  }
  return command;
}

function toWindows(command: string): string {
  const trimmed = command.trim().replace(/^sudo\s+/, "");

  if (/^ssh\s+/.test(trimmed)) return trimmed;

  if (/^apt(?:-get)?\s+update$/.test(trimmed)) {
    return "winget source update";
  }
  if (/apt(?:-get)?\s+(?:full-)?upgrade/.test(trimmed)) {
    return "winget upgrade --all --accept-source-agreements --accept-package-agreements";
  }
  if (/apt(?:-get)?\s+install/.test(trimmed)) {
    const ids = packagesFromApt(trimmed)
      .map((pkg) => WINGET_PACKAGES[pkg] ?? pkg)
      .filter((id) => id.length > 0);
    if (ids.length === 0) {
      return "# Not needed on Windows Server — these packages are Linux-only";
    }
    return ids
      .map(
        (id) =>
          `winget install --id ${id} -e --accept-source-agreements --accept-package-agreements`,
      )
      .join("\n");
  }
  if (/ollama\.com\/install\.sh/.test(trimmed)) {
    return "winget install --id Ollama.Ollama -e --accept-source-agreements --accept-package-agreements";
  }
  if (/^curl\s+-fsSL\s+(\S+)\s*\|\s*(sh|bash)/.test(trimmed)) {
    const url = trimmed.match(/^curl\s+-fsSL\s+(\S+)/)?.[1] ?? "";
    return `Invoke-WebRequest -Uri ${url} -OutFile "$env:TEMP\\installer.ps1"  # review, then run it`;
  }
  if (/^systemctl\s+enable\s+(\S+)/.test(trimmed)) {
    const service = trimmed.match(/enable\s+(\S+)/)?.[1] ?? "";
    return `Set-Service -Name ${service} -StartupType Automatic`;
  }
  if (/^systemctl\s+start\s+(\S+)/.test(trimmed)) {
    return `Start-Service ${trimmed.match(/start\s+(\S+)/)?.[1] ?? ""}`;
  }
  if (/^systemctl\s+restart\s+(\S+)/.test(trimmed)) {
    return `Restart-Service ${trimmed.match(/restart\s+(\S+)/)?.[1] ?? ""}`;
  }
  if (/^systemctl\s+status\s+(\S+)/.test(trimmed)) {
    return `Get-Service ${trimmed.match(/status\s+(\S+)/)?.[1] ?? ""}`;
  }
  if (/^curl\s+(http\S+)/.test(trimmed)) {
    return `Invoke-RestMethod ${trimmed.match(/^curl\s+(http\S+)/)?.[1] ?? ""}`;
  }
  if (/^ufw\s+allow\s+(\S+)/.test(trimmed)) {
    const port = (trimmed.match(/ufw\s+allow\s+(\S+)/)?.[1] ?? "").split("/")[0];
    return `New-NetFirewallRule -DisplayName "Agent Deploy ${port}" -Direction Inbound -LocalPort ${port} -Protocol TCP -Action Allow`;
  }
  if (/^ufw\s+/.test(trimmed)) {
    return "Get-NetFirewallRule | Where-Object DisplayName -like 'Agent Deploy*'";
  }
  if (/^free\s+-h$/.test(trimmed)) {
    return "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory";
  }
  if (/^df\s+-h$/.test(trimmed)) {
    return "Get-PSDrive -PSProvider FileSystem";
  }
  if (/^which\s+(\S+)/.test(trimmed)) {
    return `Get-Command ${trimmed.match(/^which\s+(\S+)/)?.[1] ?? ""}`;
  }
  if (/^journalctl/.test(trimmed)) {
    return "Get-EventLog -LogName Application -Newest 50";
  }
  return trimmed;
}

/** Rewrite a Debian-style command for the target family. */
export function translateCommand(command: string, family: OsFamily): string {
  if (family === "debian") return command;
  if (family === "rhel") return toRhel(command);
  return toWindows(command);
}

export function renderArray(
  templates: string[],
  context: TemplateContext,
): string[] {
  return templates.flatMap((t) =>
    translateCommand(renderTemplate(t, context), context.family).split("\n"),
  );
}
