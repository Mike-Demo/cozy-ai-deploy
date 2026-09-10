import { cn } from "@/lib/utils";

export interface GuideContentsItem {
  anchorId: string;
  label: string;
  done: boolean;
}

interface GuideContentsProps {
  items: GuideContentsItem[];
}

export function GuideContents({ items }: GuideContentsProps) {
  return (
    <nav
      aria-label="Guide contents"
      className="rounded-xl border border-border bg-surface p-4 print:hidden"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        Jump to a step
      </p>
      <ol className="space-y-1">
        {items.map((item, index) => (
          <li key={item.anchorId}>
            <a
              href={`#${item.anchorId}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-surface-muted",
                item.done ? "text-text-muted" : "text-text",
              )}
            >
              <i
                className={cn(
                  "fa-solid w-4 text-xs",
                  item.done ? "fa-circle-check text-success" : "fa-circle text-border",
                )}
                aria-hidden="true"
              />
              <span className="truncate">
                {index + 1}. {item.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
