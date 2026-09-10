import { useState } from "react";
import type { TroubleshootingItem as TroubleshootingItemType } from "@/lib/types";
import { CommandBlock } from "./CommandBlock";
import { cn } from "@/lib/utils";

interface TroubleshootingProps {
  items: TroubleshootingItemType[];
}

export function Troubleshooting({ items }: TroubleshootingProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-surface overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-surface-muted transition-colors"
          >
            <span className="font-medium text-sm text-text">{item.problem}</span>
            <i
              className={cn(
                "fa-solid fa-chevron-down text-text-muted transition-transform",
                open[item.id] && "rotate-180",
              )}
            />
          </button>
          {open[item.id] && (
            <div className="px-4 pb-4 pt-0">
              <p className="text-sm text-text-muted leading-relaxed">
                {item.solution}
              </p>
              {item.commands && item.commands.length > 0 && (
                <div className="mt-3 space-y-2">
                  {item.commands.map((command, index) => (
                    <CommandBlock key={index} command={command} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
