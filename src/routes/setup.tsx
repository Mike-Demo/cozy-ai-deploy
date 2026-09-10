import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup")({
  component: Setup,
  head: () => ({
    meta: [
      { title: "Setup — Agent Deploy" },
      { name: "description", content: "Build a personalized AI agent install guide for your VPS." },
      { property: "og:title", content: "Setup — Agent Deploy" },
      { property: "og:description", content: "Build a personalized AI agent install guide for your VPS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Setup() {
  return <div>Setup wizard</div>;
}
