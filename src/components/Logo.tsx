interface LogoProps {
  className?: string;
  /** Accent color for the robot's eyes. Defaults to the app accent. */
  accentClassName?: string;
  title?: string;
}

/**
 * Agent Deploy mark: a rounded cloud outline with a small robot face inside.
 * Uses currentColor so it inherits text color from its container.
 */
export function Logo({ className, accentClassName = "text-accent", title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      {title ? <title>{title}</title> : null}
      {/* Cloud outline */}
      <path
        d="M36 108a26 26 0 0 1-4-51.7A30 30 0 0 1 86 39.4 24 24 0 1 1 92 108Z"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      {/* Antenna */}
      <path d="M64 46v10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      {/* Ears */}
      <rect x="34" y="70" width="8" height="16" rx="4" fill="currentColor" />
      <rect x="86" y="70" width="8" height="16" rx="4" fill="currentColor" />
      {/* Head */}
      <rect x="46" y="56" width="36" height="34" rx="9" fill="currentColor" />
      {/* Eyes */}
      <circle cx="57" cy="70" r="4.5" className={accentClassName} fill="currentColor" />
      <circle cx="71" cy="70" r="4.5" className={accentClassName} fill="currentColor" />
      {/* Mouth bars */}
      <rect x="53" y="80" width="7" height="5" rx="2.5" fill="var(--color-surface)" />
      <rect x="61" y="80" width="6" height="5" rx="2.5" fill="var(--color-surface)" />
      <rect x="68" y="80" width="7" height="5" rx="2.5" fill="var(--color-surface)" />
    </svg>
  );
}
