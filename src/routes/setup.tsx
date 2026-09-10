import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Wizard } from "@/components/Wizard";

export const Route = createFileRoute("/setup")({
  component: SetupPage,
  head: () => ({
    meta: [
      { title: "Build your install guide — Agent Deploy" },
      { name: "description", content: "Choose your AI agent stack, models, and server details to generate a personalized VPS install guide." },
      { property: "og:title", content: "Build your install guide — Agent Deploy" },
      { property: "og:description", content: "Generate a personalized VPS install guide for self-hosted AI agents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SetupPage() {
  return (
    <Layout>
      <Wizard />
    </Layout>
  );
}
