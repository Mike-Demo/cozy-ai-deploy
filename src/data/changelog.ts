export type ChangeKind = "New" | "Improved" | "Fixed" | "Status";

export interface ChangelogEntry {
  readonly date: string;
  readonly title: string;
  readonly kind: ChangeKind;
  readonly notes: readonly string[];
}

export const changelogEntries: readonly ChangelogEntry[] = [
  {
    date: "2026-09-10",
    title: "New logo, model maintainers, and consistent icons",
    kind: "New",
    notes: [
      "Agent Deploy now has its own mark: a robot inside a cloud, used in the header, on the home page, and as the browser tab icon.",
      "Each model now shows who maintains it, a link to the official project page, and a plain-English line on what it is best for.",
      "The emoji next to each stack have been replaced with matching Font Awesome icons.",
    ],
  },
  {
    date: "2026-09-10",
    title: "Footer, credits, changelog and security pages",
    kind: "New",
    notes: [
      "Every page now ends with the same footer, with links to the credits, this changelog, and the security page.",
      "A new Open Source page credits the libraries, fonts, and services behind the app.",
      "A new Security page explains what stays in your browser and what never leaves it.",
    ],
  },
  {
    date: "2026-09-09",
    title: "Save your script to a Gist or CodePen",
    kind: "New",
    notes: [
      "Beside Download script you can now save the generated install script as an unlisted GitHub Gist and get a link back to copy.",
      "Save to CodePen opens a new tab with the script already filled in.",
      "If your browser blocks the new tab, the page now says so instead of doing nothing.",
      "Anyone with an unlisted Gist link can read it, so the page warns you before you share.",
    ],
  },
  {
    date: "2026-09-09",
    title: "Three more stacks in the catalog",
    kind: "New",
    notes: [
      "Added NVIDIA NemoClaw, Hermes, and Razer AIKIT alongside OpenClaw, Ollama, Open WebUI, and n8n.",
      "Some NemoClaw and Razer AIKIT commands are still marked unverified — check them against the vendor's own documentation before running them.",
    ],
  },
  {
    date: "2026-09-09",
    title: "Layout fixes on the setup screens",
    kind: "Fixed",
    notes: [
      "Stack cards no longer overlap or collapse on top of each other.",
      "The generated script now shows the real stack name in its first line instead of a placeholder.",
    ],
  },
  {
    date: "2026-09-08",
    title: "Agent Deploy launch",
    kind: "New",
    notes: [
      "A four-step wizard: pick a stack, choose options, describe your server, and get a personalized guide.",
      "Copy-ready commands, a step-by-step checklist, and a downloadable install script.",
      "A troubleshooting page covering every stack in the catalog.",
      "Everything runs in your browser — no accounts, no connection to your server.",
    ],
  },
];
