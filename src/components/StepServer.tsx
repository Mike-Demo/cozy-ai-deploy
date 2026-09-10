import { getStackById } from "@/data/stacks";
import { getOsFamily, getOsLabel, groupedOperatingSystems } from "@/lib/os";
import type { ServerDetails } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepServerProps {
  server: ServerDetails;
  onChange: (server: ServerDetails) => void;
  stackId?: string | null;
}

const osGroups = groupedOperatingSystems();

export function StepServer({ server, onChange, stackId }: StepServerProps) {
  const stack = stackId ? getStackById(stackId) : undefined;
  const supported = stack ? stack.requirements.os.includes(server.operatingSystem) : true;
  const family = getOsFamily(server.operatingSystem);
  const update = <K extends keyof ServerDetails>(key: K, value: ServerDetails[K]) => {
    onChange({ ...server, [key]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-text">
          Your server
        </h2>
        <p className="mt-2 text-text-muted">
          We only use these details to fill in commands in your guide. Nothing is
          sent anywhere.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="server-ip" className="text-sm font-medium text-text">
            Server IP or hostname
          </label>
          <input
            id="server-ip"
            type="text"
            value={server.ip}
            onChange={(e) => update("ip", e.target.value)}
            placeholder="203.0.113.10"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="server-username" className="text-sm font-medium text-text">
            SSH username
          </label>
          <input
            id="server-username"
            type="text"
            value={server.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="root"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="server-os" className="text-sm font-medium text-text">
            Operating system
          </label>
          <select
            id="server-os"
            value={server.operatingSystem}
            onChange={(e) => update("operatingSystem", e.target.value as ServerDetails["operatingSystem"])}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {osGroups.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.items.map((os) => (
                  <option key={os.id} value={os.id}>
                    {os.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-text-muted">
            {family === "windows"
              ? "Commands will be shown in PowerShell and the script downloads as .ps1."
              : family === "rhel"
                ? "Commands will use dnf and firewalld."
                : "Commands will use apt and ufw."}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="server-ram" className="text-sm font-medium text-text">
            RAM (GB) — optional
          </label>
          <input
            id="server-ram"
            type="number"
            min={1}
            value={server.ramGb ?? ""}
            onChange={(e) => update("ramGb", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="16"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="server-disk" className="text-sm font-medium text-text">
            Disk (GB) — optional
          </label>
          <input
            id="server-disk"
            type="number"
            min={1}
            value={server.diskGb ?? ""}
            onChange={(e) => update("diskGb", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="60"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {stack && !supported && (
        <div className="rounded-xl border border-warning/30 bg-warning-subtle/30 p-4 text-sm text-warning">
          <p className="font-medium">
            {stack.shortName} is not tested on {getOsLabel(server.operatingSystem)}
          </p>
          <p className="mt-1 opacity-90">
            We will still translate the commands for you, but this stack is tested
            on: {stack.requirements.os.map((os) => getOsLabel(os)).join(", ")}.
          </p>
        </div>
      )}

      <div className={cn(
        "rounded-xl border p-4 text-sm",
        "border-info/30 bg-info-subtle/30 text-info",
      )}>
        <p className="font-medium">Privacy note</p>
        <p className="mt-1 opacity-90">
          These values are only used to personalize the commands shown on this
          page. They are not stored or transmitted.
        </p>
      </div>
    </div>
  );
}
