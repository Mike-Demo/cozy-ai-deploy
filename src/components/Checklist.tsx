import { useState } from "react";
import type { VerificationCheck } from "@/lib/types";
import { CommandBlock } from "./CommandBlock";
import { cn } from "@/lib/utils";

interface ChecklistProps {
  checks: VerificationCheck[];
  /** Controlled completion state, keyed by check id. */
  completed?: Record<string, boolean>;
  onToggle?: (id: string) => void;
  /** Hide the internal counter when a shared progress bar already shows it. */
  showCounter?: boolean;
}

export function Checklist({
  checks,
  completed,
  onToggle,
  showCounter = true,
}: ChecklistProps) {
  const [internal, setInternal] = useState<Record<string, boolean>>({});
  const isControlled = completed !== undefined && onToggle !== undefined;
  const state = isControlled ? completed : internal;

  const toggle = (id: string) => {
    if (isControlled) {
      onToggle(id);
      return;
    }
    setInternal((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = checks.filter((check) => state[check.id]).length;

  return (
    <div className="space-y-6">
      {showCounter && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            {completedCount} of {checks.length} checks marked complete
          </p>
        </div>
      )}
      <div className="space-y-4">
        {checks.map((check) => (
          <div
            key={check.id}
            id={`check-${check.id}`}
            className={cn(
              "scroll-mt-40 rounded-xl border bg-surface p-4 transition-colors",
              state[check.id] ? "border-success/50 bg-success-subtle/30" : "border-border",
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!state[check.id]}
                onChange={() => toggle(check.id)}
                className="mt-1 h-5 w-5 rounded border-border text-accent focus:ring-accent"
              />
              <div className="flex-1">
                <span className={cn(
                  "font-medium text-sm",
                  state[check.id] ? "text-success line-through" : "text-text",
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
