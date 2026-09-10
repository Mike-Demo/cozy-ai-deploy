import { createFileRoute, Link } from "@tanstack/react-router";
import { stacks } from "@/data/stacks";
import { Layout } from "@/components/Layout";
import { Troubleshooting } from "@/components/Troubleshooting";
import { breadcrumbSchema, jsonLdScript, webPageSchema } from "@/lib/seo/structuredData";

export const Route = createFileRoute("/troubleshooting")({
  staticData: { sitemap: true },
  component: TroubleshootingPage,
  head: () => ({
    meta: [
      { title: "Troubleshooting — Agent Deploy" },
      { name: "description", content: "Common problems and fixes for self-hosted AI agent stacks." },
      { property: "og:title", content: "Troubleshooting — Agent Deploy" },
      { property: "og:description", content: "Common problems and fixes for self-hosted AI agent stacks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://local.mikedemo.dev/troubleshooting" },
    ],
    links: [{ rel: "canonical", href: "https://local.mikedemo.dev/troubleshooting" }],
    scripts: [
      jsonLdScript(
        webPageSchema({
          name: "Troubleshooting",
          description: "Common problems and fixes for self-hosted AI agent stacks.",
          path: "/troubleshooting",
        }),
      ),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Troubleshooting", path: "/troubleshooting" },
        ]),
      ),
    ],
  }),
});

function TroubleshootingPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <i className="fa-solid fa-arrow-left" /> Back home
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-text">
            Troubleshooting
          </h1>
          <p className="mt-2 text-text-muted">
            Common issues and fixes for every stack in the catalog.
          </p>
        </div>

        <div className="space-y-10">
          {stacks.map((stack) =>
            stack.troubleshooting.length > 0 ? (
              <section key={stack.id}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{stack.icon}</span>
                  <h2 className="font-heading text-xl font-semibold text-text">
                    {stack.name}
                  </h2>
                </div>
                <Troubleshooting items={stack.troubleshooting} />
              </section>
            ) : null,
          )}
        </div>
      </div>
    </Layout>
  );
}
