import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guide/$stackId")({
  component: Guide,
  head: () => ({
    meta: [
      { title: "Guide — Agent Deploy" },
      { name: "description", content: "Reference installation guide." },
      { property: "og:title", content: "Guide — Agent Deploy" },
      { property: "og:description", content: "Reference installation guide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Guide() {
  return <div>Guide</div>;
}
