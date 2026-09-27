import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Wizard } from "@/components/Wizard";
import { parsePermalinkSearch } from "@/lib/permalink";
import { stacks } from "@/data/stacks";
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLdScript,
  webPageSchema,
} from "@/lib/seo/structuredData";

const DESCRIPTION =
  "Choose your AI agent stack, models, and server details to generate a personalized VPS install guide.";

export const Route = createFileRoute("/setup")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>) => parsePermalinkSearch(search),
  component: SetupPage,
  head: () => ({
    meta: [
      { title: "Build your install guide — Agent Deploy" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Build your install guide — Agent Deploy" },
      { property: "og:description", content: "Generate a personalized VPS install guide for self-hosted AI agents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://local.mikedemo.dev/setup" },
    ],
    links: [{ rel: "canonical", href: "https://local.mikedemo.dev/setup" }],
    scripts: [
      jsonLdScript(
        webPageSchema({
          name: "Build your install guide",
          description: DESCRIPTION,
          path: "/setup",
        }),
      ),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Build your install guide", path: "/setup" },
        ]),
      ),
      jsonLdScript(
        itemListSchema({
          name: "Self-hosted AI agent stacks",
          items: stacks.map((stack) => ({
            name: stack.name,
            description: stack.description,
            path: `/guide/${stack.id}`,
          })),
        }),
      ),
    ],
  }),
});

function SetupPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <h1 className="font-heading text-3xl font-semibold text-text">
          Build your install guide
        </h1>
        <p className="mt-2 text-text-muted">
          Answer four short steps and get copy-and-paste commands for your own server.
        </p>
      </div>
      <Wizard />
    </Layout>
  );
}
