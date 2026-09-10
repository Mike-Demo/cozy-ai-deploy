import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CommandBlockProps {
  command: string;
  label?: string;
  className?: string;
}

export function CommandBlock({ command, label, className }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  }, [command]);

  return (
    <div className={cn("rounded-xl overflow-hidden bg-code-bg", className)}>
      {label && (
        <div className="px-4 py-2 border-b border-white/10 bg-white/5 text-xs font-medium text-code-text/70">
          {label}
        </div>
      )}
      <div className="relative group">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-code-text font-mono whitespace-pre-wrap break-all">
          <code>{command}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-code-text transition-colors"
          aria-label="Copy command"
        >
          <i className={cn("fa-solid", copied ? "fa-check" : "fa-copy")} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
