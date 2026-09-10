import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";

interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
  readonly text: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "MikeDemo on LinkedIn",
    href: "https://www.linkedin.com/in/mikedemopoulos",
    icon: "fa-linkedin",
    text: "LinkedIn",
  },
  {
    label: "MikeDemo on X",
    href: "https://x.com/mike_demo",
    icon: "fa-x-twitter",
    text: "X",
  },
  {
    label: "@demo on tweet.app",
    href: "https://app.tweet.app/post/92206629-1525-4a74-8f51-39e226fc9e75",
    icon: "fa-twitter",
    text: "tweet.app",
  },
  {
    label: "MikeDemo on Threads",
    href: "https://www.threads.com/@mdemop",
    icon: "fa-threads",
    text: "Threads",
  },
];

const linkClass =
  "inline-flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors";

export function SiteFooter(): ReactElement {
  const [year, setYear] = useState<number | undefined>(undefined);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-surface py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 text-sm">
        <p className="text-text-muted max-w-2xl">
          Agent Deploy generates guides locally in your browser. No server
          connection is made and no credentials are stored.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-text-muted">
            <span>Made by MikeDemo</span>
            {year === undefined ? null : (
              <span aria-label={`Copyright ${year}`}>© {year}</span>
            )}
          </div>

          <nav aria-label="Site information" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/licenses" className={linkClass}>
              <i className="fa-solid fa-code" aria-hidden="true" /> Open Source
            </Link>
            <Link to="/changelog" className={linkClass}>
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" /> Changelog
            </Link>
            <Link to="/security" className={linkClass}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" /> Security
            </Link>
          </nav>
        </div>

        <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opens in new tab)`}
              className={linkClass}
            >
              <i className={`fa-brands ${link.icon}`} aria-hidden="true" />
              {link.text}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
