import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CopyLinkButtonProps {
  /** Optional label override. */
  label?: string;
  className?: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the manual fallback below
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function CopyLinkButton({ label = "Copy link", className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleClick = async () => {
    // Read the URL at click time only, never during render (hydration safety).
    const ok = await copyText(window.location.href);
    setCopied(ok);
    setFailed(!ok);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-muted",
        className,
      )}
    >
      <i
        className={cn(
          "fa-solid",
          copied ? "fa-check text-success" : failed ? "fa-triangle-exclamation" : "fa-link",
        )}
        aria-hidden="true"
      />
      {copied ? "Copied" : failed ? "Press Ctrl+C" : label}
    </button>
  );
}
