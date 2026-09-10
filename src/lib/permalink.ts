import { z } from "zod";
import { getStackById } from "@/data/stacks";
import type { OperatingSystem } from "@/lib/types";

/**
 * Search-param schema for shareable permalinks.
 *
 * Deliberately excludes any server details (IP address, username): those stay
 * in component state so a shared link never carries someone's server address.
 */
const csv = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (value === undefined) return [] as string[];
    const parts = Array.isArray(value) ? value : value.split(",");
    return parts.map((part) => part.trim()).filter((part) => part.length > 0);
  });

export const permalinkSearchSchema = z.object({
  step: z.coerce.number().optional().catch(undefined),
  stack: z.string().optional().catch(undefined),
  models: csv.catch([]),
  options: csv.catch([]),
  os: z.string().optional().catch(undefined),
});

export interface PermalinkSearch {
  step?: number;
  stack?: string;
  models: string[];
  options: string[];
  os?: string;
}

export function parsePermalinkSearch(input: Record<string, unknown>): PermalinkSearch {
  const result = permalinkSearchSchema.safeParse(input);
  if (!result.success) {
    return { models: [], options: [] };
  }
  return result.data;
}

const OPERATING_SYSTEMS: OperatingSystem[] = [
  "ubuntu-22.04",
  "ubuntu-24.04",
  "debian-12",
];

export interface ResolvedSelection {
  stackId: string | null;
  modelIds: string[];
  optionIds: string[];
  operatingSystem?: OperatingSystem;
  step: number;
}

/**
 * Drop ids that no longer exist in the catalog so an old or hand-edited link
 * still opens instead of erroring.
 */
export function resolveSelection(search: PermalinkSearch): ResolvedSelection {
  const stack = search.stack ? getStackById(search.stack) : undefined;

  if (!stack) {
    return { stackId: null, modelIds: [], optionIds: [], step: 0 };
  }

  const modelIds = search.models.filter((id) =>
    (stack.models ?? []).some((model) => model.id === id),
  );
  const optionIds = search.options.filter((id) =>
    (stack.options ?? []).some((option) => option.id === id),
  );
  const operatingSystem = OPERATING_SYSTEMS.find((os) => os === search.os);

  const rawStep = search.step ?? 0;
  const step = Number.isFinite(rawStep) ? Math.max(0, Math.min(3, Math.trunc(rawStep))) : 0;

  return { stackId: stack.id, modelIds, optionIds, operatingSystem, step };
}

/** Build the search object for the current wizard state, omitting empty values. */
export function buildPermalinkSearch(input: {
  step: number;
  stackId: string | null;
  modelIds: string[];
  optionIds: string[];
  operatingSystem?: OperatingSystem;
}): PermalinkSearch {
  const search: PermalinkSearch = { models: [], options: [] };

  if (!input.stackId) return search;

  search.stack = input.stackId;
  if (input.step > 0) search.step = input.step;
  if (input.modelIds.length > 0) search.models = input.modelIds;
  if (input.optionIds.length > 0) search.options = input.optionIds;
  if (input.operatingSystem) search.os = input.operatingSystem;

  return search;
}

/** Serialize arrays as comma-separated values for readable URLs. */
export function stringifyPermalinkSearch(search: PermalinkSearch): Record<string, string> {
  const out: Record<string, string> = {};
  if (search.stack) out.stack = search.stack;
  if (search.step !== undefined && search.step > 0) out.step = String(search.step);
  if (search.models.length > 0) out.models = search.models.join(",");
  if (search.options.length > 0) out.options = search.options.join(",");
  if (search.os) out.os = search.os;
  return out;
}
