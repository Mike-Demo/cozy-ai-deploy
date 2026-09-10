import { stacks } from "@/data/stacks";
import { StackCard } from "./StackCard";

interface StepSelectStackProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StepSelectStack({ selectedId, onSelect }: StepSelectStackProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-text">
          Choose your agent stack
        </h2>
        <p className="mt-2 text-text-muted">
          Pick the AI agent platform you want to run on your VPS.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {stacks.map((stack) => (
          <StackCard
            key={stack.id}
            stack={stack}
            selected={selectedId === stack.id}
            onClick={() => onSelect(stack.id)}
          />
        ))}
      </div>
    </div>
  );
}
