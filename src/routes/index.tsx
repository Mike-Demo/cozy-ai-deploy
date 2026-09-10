import { createFileRoute, Link } from "@tanstack/react-router";
import { stacks } from "@/data/stacks";
import { Layout } from "@/components/Layout";
import { StackCard } from "@/components/StackCard";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Agent Deploy — Self-hosted AI agent installer" },
      { name: "description", content: "Generate personalized copy-and-paste install guides for self-hosted AI agents like OpenClaw, Ollama, n8n, and more. No live SSH, no accounts." },
      { property: "og:title", content: "Agent Deploy — Self-hosted AI agent installer" },
      { property: "og:description", content: "Generate personalized copy-and-paste install guides for self-hosted AI agents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function HomePage() {
  return (
    <Layout>
      <section className="bg-surface-muted py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Logo className="mx-auto h-20 w-20 text-text" title="Agent Deploy" />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-subtle/50 px-3 py-1 text-xs font-semibold text-accent">
            <i className="fa-solid fa-robot" aria-hidden="true" />
            Self-hosted AI agents
          </span>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-bold text-text tracking-tight">
            Deploy AI agents to your VPS without the guesswork
          </h1>
          <p className="mt-5 text-lg text-text-muted max-w-2xl mx-auto">
            Answer a few questions and get a personalized, copy-and-paste
            installation guide for your server. No accounts, no live SSH,
            nothing stored.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-medium text-text-inverse hover:bg-accent-hover transition-colors"
            >
              <i className="fa-solid fa-rocket" />
              Build your install guide
            </Link>
            <Link
              to="/troubleshooting"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-base font-medium text-text hover:bg-surface-muted transition-colors"
            >
              <i className="fa-solid fa-life-ring" />
              Browse troubleshooting
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-text">
                Agent catalog
              </h2>
              <p className="mt-1 text-text-muted">
                Choose a stack to generate your install guide.
              </p>
            </div>
            <Link
              to="/setup"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              View all <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <StackCard
                key={stack.id}
                stack={stack}
                href={`/setup?stack=${stack.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-text text-center">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "fa-layer-group",
                title: "Pick a stack",
                description:
                  "Choose from OpenClaw, Ollama, n8n, NVIDIA NemoClaw, Hermes, Razer AIKIT, and more.",
              },
              {
                icon: "fa-sliders",
                title: "Choose options",
                description:
                  "Select models, extras, and enter your server details. Everything stays in your browser.",
              },
              {
                icon: "fa-terminal",
                title: "Copy and run",
                description:
                  "Get a personalized install script, verification checklist, and troubleshooting guide.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle/50 text-accent">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-medium text-text">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
