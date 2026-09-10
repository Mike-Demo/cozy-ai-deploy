import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { breadcrumbSchema, jsonLdScript, webPageSchema } from "@/lib/seo/structuredData";

const TITLE = "Security — Agent Deploy";
const DESCRIPTION =
  "What Agent Deploy stores, what stays in your browser, what never leaves it, and how to run the generated commands safely.";

export const Route = createFileRoute("/security")({
  staticData: { sitemap: true },
  component: SecurityPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://local.mikedemo.dev/security" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://local.mikedemo.dev/security" }],
  }),
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-heading text-xl font-semibold text-text">{title}</h2>
      <div className="mt-3 space-y-3 text-text-muted">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <i
            className="fa-solid fa-check mt-1 text-sm text-accent"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SecurityPage() {
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
          Security
        </h1>
        <p className="mt-2 text-text-muted">
          Agent Deploy writes out the commands you would type yourself. It never
          touches your server.
        </p>

        <div className="mt-10 space-y-6">
          <Section title="What Agent Deploy stores">
            <p>
              Nothing. There are no accounts, no sign-in, and no database. The
              wizard runs entirely in the page you have open, and closing the
              tab clears everything you typed.
            </p>
          </Section>

          <Section title="The server details you type">
            <Bullets
              items={[
                "The address, username, and port you enter are used only to write the example commands on screen.",
                "They stay in the open page and are not sent anywhere.",
                "You are never asked for a password, an SSH key, or a passphrase — and you should never paste one into this app.",
              ]}
            />
          </Section>

          <Section title="No connection is ever made">
            <p>
              Agent Deploy does not connect to your server, does not run
              anything on it, and cannot see whether an installation succeeded.
              You stay in control: you read the commands, you paste them, you
              decide.
            </p>
          </Section>

          <Section title="What leaves your browser">
            <Bullets
              items={[
                "Only the script text you deliberately send, by pressing Save to Gist or Save to CodePen.",
                "A Gist is created unlisted on a shared account — unlisted means it is not searchable, but anyone with the link can read it.",
                "CodePen receives the script straight from your browser when the new tab opens.",
                "Do not save a script that you have edited to include a password, token, or key.",
              ]}
            />
          </Section>

          <Section title="Running the commands safely">
            <Bullets
              items={[
                "Read a command before pasting it. If a line is unclear, look it up before running it.",
                "Prefer a normal user with sudo over signing in as root.",
                "Keep the model API port closed to the internet with your firewall unless you have deliberately secured it.",
                "Install on a fresh server or a snapshot you can roll back, not on a machine already running something you care about.",
                "Some commands for newer stacks are marked unverified — check those against the vendor's own documentation first.",
              ]}
            />
          </Section>

          <Section title="What Agent Deploy never does">
            <Bullets
              items={[
                "Never asks for credentials of any kind.",
                "Never opens an SSH session or executes anything remotely.",
                "Never tracks you across sites or sells anything about you.",
                "Never uploads your setup unless you press a save button yourself.",
              ]}
            />
          </Section>

          <Section title="Reporting a problem">
            <p>
              If you spot a command that looks unsafe or a page that leaks
              something it should not, please report it through{" "}
              <a
                href="https://www.linkedin.com/in/mikedemopoulos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                LinkedIn
              </a>
              . Please include the stack, the step, and what you saw.
            </p>
          </Section>
        </div>
      </div>
    </Layout>
  );
}
