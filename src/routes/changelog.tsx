import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { changelogEntries } from "@/data/changelog";
import type { ChangeKind } from "@/data/changelog";

const TITLE = "Changelog — Agent Deploy";
const DESCRIPTION =
  "What changed in Agent Deploy: new stacks, new sharing options, and fixes, in plain language.";

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://local.mikedemo.dev/changelog" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://local.mikedemo.dev/changelog" }],
  }),
});

const kindClass: Record<ChangeKind, string> = {
  New: "bg-accent-subtle text-accent-hover",
  Improved: "bg-info-subtle text-info",
  Fixed: "bg-success-subtle text-success",
  Status: "bg-warning-subtle text-warning",
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );
}

function ChangelogPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back home
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-semibold text-text">
          Changelog
        </h1>
        <p className="mt-2 text-text-muted">
          Everything that has changed in Agent Deploy, newest first.
        </p>

        <ol className="mt-10 space-y-6">
          {changelogEntries.map((entry) => (
            <li
              key={`${entry.date}-${entry.title}`}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${kindClass[entry.kind]}`}
                >
                  {entry.kind}
                </span>
                <time dateTime={entry.date} className="text-sm text-text-muted">
                  {formatDate(entry.date)}
                </time>
              </div>
              <h2 className="mt-3 font-heading text-lg font-semibold text-text">
                {entry.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {entry.notes.map((note) => (
                  <li key={note} className="flex gap-2 text-sm text-text-muted">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Layout>
  );
}
