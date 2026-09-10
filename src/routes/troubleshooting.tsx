import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/troubleshooting")({
  component: Troubleshooting,
  head: () => ({
    meta: [
      { title: "Troubleshooting — Agent Deploy" },
      { name: "description", content: "Common problems and fixes for self-hosted AI agent installs." },
      { property: "og:title", content: "Troubleshooting — Agent Deploy" },
      { property: "og:description", content: "Common problems and fixes for self-hosted AI agent installs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Troubleshooting() {
  return <div>Troubleshooting</div>;
}
