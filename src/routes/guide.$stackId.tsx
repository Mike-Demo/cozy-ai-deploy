import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getStackById } from "@/data/stacks";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { CommandBlock } from "@/components/CommandBlock";
import { Checklist } from "@/components/Checklist";
import { Troubleshooting } from "@/components/Troubleshooting";
import { ShareActions } from "@/components/ShareActions";
import { generateGuide } from "@/lib/generate";

const SITE_URL = "https://local.mikedemo.dev";

export const Route = createFileRoute("/guide/$stackId")({
  staticData: { sitemap: true },
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
      server: { ip: "YOUR_SERVER_IP", username: "root", operatingSystem: "ubuntu-22.04" },
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
            totalTime: `PT${stack.requirements.estimatedMinutes ?? 30}M`,
            step: guide.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.description,
              url: `${url}#step-${index + 1}`,
            })),
          }),
        },
      ],
    };
  },
});

function GuidePage() {
  const { stackId } = Route.useParams();
  const stack = getStackById(stackId);

  if (!stack) {
    throw notFound();
  }

  const guide = generateGuide({
    stack,
    selectedModels: stack.models ?? [],
    selectedOptions: stack.options ?? [],
    server: { ip: "YOUR_SERVER_IP", username: "root", operatingSystem: "ubuntu-22.04" },
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

          <section>
            <h2 className="font-heading text-xl font-semibold text-text mb-4">
              One-command installer
            </h2>
            <p className="mb-3 text-sm text-text-muted">
              Replace <code className="rounded bg-surface-muted px-1 py-0.5 text-text">YOUR_SERVER_IP</code>{" "}
              with your server address, then paste the whole block into your terminal.
            </p>
            <CommandBlock command={guide.oneLineCommand} />
            <div className="mt-4">
              <ShareActions
                stackId={stack.id}
                stackName={stack.name}
                script={guide.script}
                onDownload={() => {
                  const blob = new Blob([guide.script], {
                    type: "text/x-shellscript",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${stack.id}-install.sh`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              />
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-text mb-4">
              Step-by-step
            </h2>
            <div className="space-y-6">
              {guide.steps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-surface p-5 print-break-inside-avoid"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-medium text-text">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {step.description}
                      </p>
                      {step.note && (
                        <p className="mt-2 text-sm text-info bg-info-subtle/30 border border-info/20 rounded-lg px-3 py-2">
                          {step.note}
                        </p>
                      )}
                      <div className="mt-4 space-y-2">
                        {step.commands.map((command, cmdIndex) => (
                          <CommandBlock key={cmdIndex} command={command} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-text mb-4">
              Verification
            </h2>
            <Checklist checks={guide.verificationChecks} />
          </section>

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
