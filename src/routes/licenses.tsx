import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { affiliationNote, creditGroups } from "@/data/credits";

const TITLE = "Open source & credits — Agent Deploy";
const DESCRIPTION =
  "The libraries, fonts, and services behind Agent Deploy, and the licenses of the software its guides install.";

export const Route = createFileRoute("/licenses")({
  staticData: { sitemap: true },
  component: LicensesPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://local.mikedemo.dev/licenses" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://local.mikedemo.dev/licenses" }],
  }),
});

function LicensesPage() {
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
          Open source &amp; credits
        </h1>
        <p className="mt-2 text-text-muted">
          Agent Deploy is built on other people&apos;s work. Here is what it uses
          and under which license.
        </p>

        <div className="mt-10 space-y-10">
          {creditGroups.map((group) => (
            <section key={group.title}>
              <h2 className="font-heading text-xl font-semibold text-text">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.entries.map((entry) => (
                  <li
                    key={entry.name}
                    className="rounded-lg border border-border bg-surface p-4"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-text hover:text-accent hover:underline"
                      >
                        {entry.name}
                      </a>
                      <span className="text-sm text-text-muted">
                        by {entry.author}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">
                      {entry.license}
                    </p>
                    {entry.note ? (
                      <p className="mt-2 text-sm text-text">{entry.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-10 rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-muted">
          {affiliationNote}
        </p>
      </div>
    </Layout>
  );
}
