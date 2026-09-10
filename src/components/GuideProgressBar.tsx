import { cn } from "@/lib/utils";

interface GuideProgressBarProps {
  completedCount: number;
  total: number;
  percent: number;
  currentIndex: number;
  estimatedTime?: string;
  onReset: () => void;
  className?: string;
}

export function GuideProgressBar({
  completedCount,
  total,
  percent,
  currentIndex,
  estimatedTime,
  onReset,
  className,
}: GuideProgressBarProps) {
  const allDone = total > 0 && completedCount === total;
  const position = allDone ? total : currentIndex + 1;

  return (
    <div
      className={cn(
        "sticky top-0 z-20 -mx-4 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 print:hidden",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-text">
          {allDone ? (
            <span className="text-success">
              <i className="fa-solid fa-circle-check mr-1.5" aria-hidden="true" />
              All {total} tasks done
            </span>
          ) : (
            <>
              Task {position} of {total}
            </>
          )}
        </p>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {estimatedTime && !allDone && <span>Approx. {estimatedTime} total</span>}
          <button
            type="button"
            onClick={onReset}
            className="font-medium text-accent hover:underline"
          >
            Reset progress
          </button>
        </div>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Guide progress"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            allDone ? "bg-success" : "bg-accent",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
