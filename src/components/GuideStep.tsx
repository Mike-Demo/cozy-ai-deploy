import type { InstallStep } from "@/lib/types";
import { CommandBlock } from "./CommandBlock";
import { cn } from "@/lib/utils";

interface GuideStepProps {
  step: InstallStep;
  index: number;
  anchorId: string;
  done: boolean;
  isCurrent: boolean;
  isLast: boolean;
  onToggle: () => void;
  onNext: () => void;
}

export function GuideStep({
  step,
  index,
  anchorId,
  done,
  isCurrent,
  isLast,
  onToggle,
  onNext,
}: GuideStepProps) {
  return (
    <section
      id={anchorId}
      className={cn(
        "scroll-mt-24 rounded-xl border bg-surface p-5 transition-colors print-break-inside-avoid",
        done
          ? "border-success/40 bg-success-subtle/20"
          : isCurrent
            ? "border-accent/50 ring-1 ring-accent/20"
            : "border-border",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? `Mark step ${index + 1} not done` : `Mark step ${index + 1} done`}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            done
              ? "bg-success text-white"
              : "bg-accent-subtle text-accent hover:bg-accent hover:text-white",
          )}
        >
          {done ? <i className="fa-solid fa-check" aria-hidden="true" /> : index + 1}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-heading text-lg font-medium",
              done ? "text-text-muted" : "text-text",
            )}
          >
            {step.title}
          </h3>

          <div className={cn(done && "hidden print:block")}>
            <p className="mt-1 text-sm text-text-muted">{step.description}</p>
            {step.note && (
              <p className="mt-2 rounded-lg border border-info/20 bg-info-subtle/30 px-3 py-2 text-sm text-info">
                {step.note}
              </p>
            )}
            <div className="mt-4 space-y-2">
              {step.commands.map((command, cmdIndex) => (
                <CommandBlock key={cmdIndex} command={command} />
              ))}
            </div>
            <div className="mt-4 print:hidden">
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                <i className="fa-solid fa-check" aria-hidden="true" />
                {isLast ? "Mark done, go to checks" : "Mark done, next step"}
              </button>
            </div>
          </div>

          {done && (
            <p className="mt-1 text-sm text-success print:hidden">
              Done — tap the tick to reopen this step.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
