import type { ServerDetails } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepServerProps {
  server: ServerDetails;
  onChange: (server: ServerDetails) => void;
}

const operatingSystems = [
  { value: "ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
  { value: "ubuntu-24.04", label: "Ubuntu 24.04 LTS" },
  { value: "debian-12", label: "Debian 12" },
] as const;

export function StepServer({ server, onChange }: StepServerProps) {
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
            {operatingSystems.map((os) => (
              <option key={os.value} value={os.value}>
                {os.label}
              </option>
            ))}
          </select>
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
