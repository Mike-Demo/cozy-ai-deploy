import type { OperatingSystem, OsFamily } from "@/lib/types";

export interface OsEntry {
  id: OperatingSystem;
  label: string;
  family: OsFamily;
  /** Grouping label used by the picker. */
  group: string;
}

/**
 * Supported operating systems, in picker order. CloudLinux is first and is the
 * default because it is the most common managed-VPS platform for our users.
 */
export const operatingSystems: OsEntry[] = [
  { id: "cloudlinux-9", label: "CloudLinux 9", family: "rhel", group: "CloudLinux" },
  { id: "cloudlinux-8", label: "CloudLinux 8", family: "rhel", group: "CloudLinux" },
  { id: "almalinux-10", label: "AlmaLinux 10", family: "rhel", group: "Enterprise Linux" },
  { id: "almalinux-9", label: "AlmaLinux 9", family: "rhel", group: "Enterprise Linux" },
  { id: "rocky-10", label: "Rocky Linux 10", family: "rhel", group: "Enterprise Linux" },
  { id: "rocky-9", label: "Rocky Linux 9", family: "rhel", group: "Enterprise Linux" },
  { id: "centos-stream-10", label: "CentOS Stream 10", family: "rhel", group: "Enterprise Linux" },
  { id: "centos-stream-9", label: "CentOS Stream 9", family: "rhel", group: "Enterprise Linux" },
  { id: "rhel-10", label: "Red Hat Enterprise Linux 10", family: "rhel", group: "Enterprise Linux" },
  { id: "rhel-9", label: "Red Hat Enterprise Linux 9", family: "rhel", group: "Enterprise Linux" },
  { id: "ubuntu-24.04", label: "Ubuntu 24.04 LTS", family: "debian", group: "Ubuntu & Debian" },
  { id: "ubuntu-22.04", label: "Ubuntu 22.04 LTS", family: "debian", group: "Ubuntu & Debian" },
  { id: "debian-13", label: "Debian 13", family: "debian", group: "Ubuntu & Debian" },
  { id: "debian-12", label: "Debian 12", family: "debian", group: "Ubuntu & Debian" },
  { id: "windows-server-2025", label: "Windows Server 2025", family: "windows", group: "Windows Server" },
  { id: "windows-server-2022", label: "Windows Server 2022", family: "windows", group: "Windows Server" },
];

export const DEFAULT_OPERATING_SYSTEM: OperatingSystem = "cloudlinux-9";

export const operatingSystemIds: OperatingSystem[] = operatingSystems.map((os) => os.id);

export function getOsEntry(id: OperatingSystem): OsEntry {
  return operatingSystems.find((os) => os.id === id) ?? (operatingSystems[0] as OsEntry);
}

export function getOsLabel(id: OperatingSystem): string {
  return getOsEntry(id).label;
}

export function getOsFamily(id: OperatingSystem): OsFamily {
  return getOsEntry(id).family;
}

export function isOperatingSystem(value: unknown): value is OperatingSystem {
  return typeof value === "string" && operatingSystemIds.includes(value as OperatingSystem);
}

/** Picker groups, in catalog order. */
export function groupedOperatingSystems(): { group: string; items: OsEntry[] }[] {
  const groups: { group: string; items: OsEntry[] }[] = [];
  for (const entry of operatingSystems) {
    const existing = groups.find((g) => g.group === entry.group);
    if (existing) existing.items.push(entry);
    else groups.push({ group: entry.group, items: [entry] });
  }
  return groups;
}

/** All Linux ids in the RHEL family — convenience for stack requirement lists. */
export const rhelOperatingSystems: OperatingSystem[] = operatingSystems
  .filter((os) => os.family === "rhel")
  .map((os) => os.id);

/** All Debian/Ubuntu ids — convenience for stack requirement lists. */
export const debianOperatingSystems: OperatingSystem[] = operatingSystems
  .filter((os) => os.family === "debian")
  .map((os) => os.id);

/** All Windows Server ids — convenience for stack requirement lists. */
export const windowsOperatingSystems: OperatingSystem[] = operatingSystems
  .filter((os) => os.family === "windows")
  .map((os) => os.id);
