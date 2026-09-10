import type { GeneratedGuide } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function stepTaskId(index: number, title: string): string {
  return `step-${index + 1}-${slugify(title)}`;
}

export function checkTaskId(checkId: string): string {
  return `check-${checkId}`;
}

/** Ordered list of every trackable task: install steps then verification. */
export function guideTaskIds(guide: GeneratedGuide): string[] {
  return [
    ...guide.steps.map((step, index) => stepTaskId(index, step.title)),
    ...guide.verificationChecks.map((check) => checkTaskId(check.id)),
  ];
}
