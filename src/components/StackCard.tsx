import { Link } from "@tanstack/react-router";
import type { AgentStack } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StackCardProps {
  stack: AgentStack;
  selected?: boolean;
  onClick?: () => void;
  href?: string;
}

export function StackCard({ stack, selected, onClick, href }: StackCardProps) {
  const className = cn(
    "w-full text-left rounded-2xl border-2 bg-surface p-5 transition-all duration-200",
    "hover:shadow-md hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg",
    selected
      ? "border-accent shadow-md ring-1 ring-accent"
      : "border-border",
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{stack.icon}</span>
          <h3 className="font-heading text-lg font-semibold text-text">
            {stack.name}
          </h3>
        </div>
        {selected && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-text-inverse text-xs">
            <i className="fa-solid fa-check" />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">
        {stack.tagline}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-text-muted">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1">
          <i className="fa-solid fa-memory" />
          {stack.requirements.minRamGb} GB RAM min
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1">
          <i className="fa-solid fa-hard-drive" />
          {stack.requirements.minDiskGb} GB disk min
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1">
          <i className="fa-regular fa-clock" />
          {stack.estimatedSetupTime}
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

