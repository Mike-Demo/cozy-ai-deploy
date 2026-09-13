import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DEFAULT_OPERATING_SYSTEM, getOsLabel } from "@/lib/os";
import type { AgentStack, OperatingSystem } from "@/lib/types";
import { getStackById } from "@/data/stacks";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { GuideWalkthrough } from "@/components/GuideWalkthrough";
import { Troubleshooting } from "@/components/Troubleshooting";
import { generateGuide } from "@/lib/generate";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { parsePermalinkSearch, resolveSelection } from "@/lib/permalink";
import { breadcrumbSchema, jsonLdScript } from "@/lib/seo/structuredData";

const SITE_URL = "https://local.mikedemo.dev";

/**
 * A public guide has no chosen server, so it must default to a system the stack
 * is actually tested on — otherwise commands get translated to a package
 * manager the stack's packages don't exist in.
 */
function defaultOsForStack(stack: AgentStack): OperatingSystem {
  const supported = stack.requirements.os;
  if (supported.includes(DEFAULT_OPERATING_SYSTEM)) return DEFAULT_OPERATING_SYSTEM;
  return supported[0] ?? DEFAULT_OPERATING_SYSTEM;
}

export const Route = createFileRoute("/guide/$stackId")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>) => parsePermalinkSearch(search),
  component: GuidePage,
  head: ({ params }) => {
    const stack = getStackById(params.stackId);
    const title = stack
      ? `${stack.name} install guide — Agent Deploy`
      : "Install guide — Agent Deploy";
    const fallbackDescription = "Reference install guide for a self-hosted AI agent stack.";
    const description = stack?.description ?? fallbackDescription;
    const url = `${SITE_URL}/guide/${params.stackId}`;

    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
    ];
    const links = [{ rel: "canonical", href: url }];

    if (!stack) {
      return { meta, links };
    }

    const guide = generateGuide({
      stack,
      selectedModels: stack.models ?? [],
      selectedOptions: stack.options ?? [],
      server: { ip: "YOUR_SERVER_IP", username: "root", operatingSystem: defaultOsForStack(stack) },
    });

    return {
      meta,
      links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `${stack.name} install guide`,
            description,
            totalTime: stack.estimatedSetupTime,
            step: guide.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.description,
              url: `${url}#step-${index + 1}`,
            })),
          }),
        },
        jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Build your install guide", path: "/setup" },
            { name: `${stack.name} install guide`, path: `/guide/${params.stackId}` },
          ]),
        ),
      ],
    };
  },
});

function GuidePage() {
  const { stackId } = Route.useParams();
  const search = Route.useSearch();
  const stack = getStackById(stackId);

  if (!stack) {
    throw notFound();
  }

  // A shared link can narrow the guide to the models and options the sender
  // picked; with no params we show everything.
  const selection = resolveSelection({ ...search, stack: stackId });
  const selectedModels =
    selection.modelIds.length > 0
      ? (stack.models ?? []).filter((m) => selection.modelIds.includes(m.id))
      : (stack.models ?? []);
  const selectedOptions =
    selection.optionIds.length > 0
      ? (stack.options ?? []).filter((o) => selection.optionIds.includes(o.id))
      : (stack.options ?? []);

  const guide = generateGuide({
    stack,
    selectedModels,
    selectedOptions,
    server: {
      ip: "YOUR_SERVER_IP",
      username: "root",
      operatingSystem: guideOs,
    },
  });

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
          <div className="mt-4 flex items-center gap-3 text-text">
            <Logo className="h-9 w-9 shrink-0" />
            <i className={`${stack.icon} text-2xl text-accent`} aria-hidden="true" />
            <h1 className="font-heading text-3xl font-semibold text-text">
              {stack.name} install guide
            </h1>
          </div>
          <p className="mt-2 text-text-muted">{stack.description}</p>
          <div className="mt-4">
            <CopyLinkButton label="Copy link to this guide" />
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-heading text-xl font-semibold text-text mb-4">
              Requirements
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text">
                <span className="text-text-muted">OS:</span>{" "}
                {stack.requirements.os.join(", ")}
              </li>
              <li className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text">
                <span className="text-text-muted">RAM:</span>{" "}
                {stack.requirements.minRamGb} GB minimum
              </li>
              <li className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text">
                <span className="text-text-muted">Disk:</span>{" "}
                {stack.requirements.minDiskGb} GB minimum
              </li>
              {stack.requirements.gpuRecommended && (
                <li className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text">
                  <span className="text-text-muted">GPU:</span> Recommended
                </li>
              )}
            </ul>
          </section>

          <GuideWalkthrough
            stackId={stack.id}
            stackName={stack.name}
            guide={guide}
            estimatedTime={stack.estimatedSetupTime}
          />

          <section>
            <h2 className="font-heading text-xl font-semibold text-text mb-4">
              Troubleshooting
            </h2>
            <Troubleshooting items={guide.troubleshooting} />
          </section>
        </div>
      </div>
    </Layout>
  );
}
