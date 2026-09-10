import { useState } from "react";
import type { VerificationCheck } from "@/lib/types";
import { CommandBlock } from "./CommandBlock";
import { cn } from "@/lib/utils";

interface ChecklistProps {
  checks: VerificationCheck[];
}

export function Checklist({ checks }: ChecklistProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          {completedCount} of {checks.length} checks marked complete
        </p>
      </div>
      <div className="space-y-4">
        {checks.map((check) => (
          <div
            key={check.id}
            className={cn(
              "rounded-xl border bg-surface p-4 transition-colors",
              completed[check.id] ? "border-success/50 bg-success-subtle/30" : "border-border",
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!completed[check.id]}
                onChange={() => toggle(check.id)}
                className="mt-1 h-5 w-5 rounded border-border text-accent focus:ring-accent"
              />
              <div className="flex-1">
                <span className={cn(
                  "font-medium text-sm",
                  completed[check.id] ? "text-success line-through" : "text-text",
                )}>
                  {check.label}
                </span>
                <div className="mt-3">
                  <CommandBlock command={check.command} />
                </div>
                {check.expectedOutput && (
                  <p className="mt-3 text-xs text-text-muted">
                    Expected: {check.expectedOutput}
                  </p>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
