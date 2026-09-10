import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/faq")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "FAQ — Agent Deploy" },
      {
        name: "description",
        content:
          "Answers to common questions about installing Ollama, choosing an operating system, hardware requirements, and using Agent Deploy.",
      },
      { property: "og:title", content: "FAQ — Agent Deploy" },
      {
        property: "og:description",
        content:
          "Answers to common questions about installing Ollama, choosing an operating system, hardware requirements, and using Agent Deploy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://local.mikedemo.dev/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://local.mikedemo.dev/faq" }],
  }),
  component: FaqPage,
});

interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

const FAQS: readonly FaqItem[] = [
  {
    question: "How do I install Ollama?",
    answer:
      "Pick the 'Ollama only' or 'OpenClaw + Ollama' stack in Agent Deploy, enter your server details, and copy the generated command block into your terminal. The guide downloads the official Ollama installer, starts the service, and pulls the models you selected.",
  },
  {
    question: "What OS should I use?",
    answer:
      "Ubuntu 22.04 LTS or Debian 12 are the safest choices for most self-hosted AI stacks. Agent Deploy guides are written for systems that use apt and systemd. Other Linux distributions often work, but you may need to adapt package names.",
  },
  {
    question: "Do I need a GPU?",
    answer:
      "No. Most small models run well on a modern CPU with enough RAM. A GPU speeds up inference and is recommended for larger models or NVIDIA NemoClaw. Each guide shows whether the selected stack is CPU-friendly or GPU-recommended.",
  },
  {
    question: "How much RAM and disk do I need?",
    answer:
      "A 7B-parameter model needs roughly 4–6 GB of RAM and a few gigabytes of disk. Larger models scale roughly with parameter count. Every guide includes a server-fit check based on the numbers you enter.",
  },
  {
    question: "Is Agent Deploy free?",
    answer:
      "Yes. Agent Deploy is a browser tool that generates installation guides. You pay only for your own server and any software you choose to run on it.",
  },
  {
    question: "Where are my credentials stored?",
    answer:
      "Nowhere on our side. Your server IP, SSH user, and any options you enter are only used to build the guide in your browser. The generated script can be downloaded or saved to your own GitHub Gist.",
  },
  {
    question: "Can I install multiple models at once?",
    answer:
      "Yes. In the model-selection step you can choose several models. The generated script pulls each one and the verification section confirms they are all present.",
  },
  {
    question: "How do I update or uninstall?",
    answer:
      "Each stack's guide includes a troubleshooting section with recovery commands. For Ollama-based stacks you can pull updated model tags with 'ollama pull' and remove models with 'ollama rm'. The generated script is plain bash, so you can edit it before you run it.",
  },
];

function FaqPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-text">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-text-muted">
          Quick answers to the most common setup questions. For stack-specific
          commands, run through the setup wizard and open the generated guide.
        </p>

        <dl className="mt-10 space-y-6">
          {FAQS.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-border bg-surface p-5 sm:p-6"
            >
              <dt className="font-heading text-lg font-medium text-text">
                {item.question}
              </dt>
              <dd className="mt-2 text-text-muted leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Layout>
  );
}
