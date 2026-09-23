import { openclawStack } from "./openclaw";
import { ollamaStack } from "./ollama";
import { openWebUIStack } from "./openwebui";
import { n8nStack } from "./n8n";
import { nemoClawStack } from "./nemoclaw";
import { hermesStack } from "./hermes";
import { razerAIKITStack } from "./razeraikit";
import { atomicAgentsStack } from "./atomic-agents";
import type { AgentStack } from "@/lib/types";

export const stacks: AgentStack[] = [
  openclawStack,
  ollamaStack,
  openWebUIStack,
  n8nStack,
  nemoClawStack,
  hermesStack,
  razerAIKITStack,
  atomicAgentsStack,
];

export const stackById: Record<string, AgentStack> = Object.fromEntries(
  stacks.map((stack) => [stack.id, stack]),
);

export function getStackById(id: string): AgentStack | undefined {
  return stackById[id];
}
