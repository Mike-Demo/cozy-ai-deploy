export interface CreditEntry {
  readonly name: string;
  readonly author: string;
  readonly license: string;
  readonly url: string;
  readonly note?: string;
}

export interface CreditGroup {
  readonly title: string;
  readonly entries: readonly CreditEntry[];
}

export const creditGroups: readonly CreditGroup[] = [
  {
    title: "Open source libraries",
    entries: [
      {
        name: "React",
        author: "Meta and contributors",
        license: "MIT",
        url: "https://github.com/facebook/react/blob/main/LICENSE",
      },
      {
        name: "TanStack Start & Router",
        author: "Tanner Linsley and contributors",
        license: "MIT",
        url: "https://github.com/TanStack/router/blob/main/LICENSE",
      },
      {
        name: "Tailwind CSS",
        author: "Tailwind Labs, Inc.",
        license: "MIT",
        url: "https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE",
      },
      {
        name: "Zod",
        author: "Colin McDonnell and contributors",
        license: "MIT",
        url: "https://github.com/colinhacks/zod/blob/main/LICENSE",
        note: "Validates the details sent to GitHub when you save a script as a Gist.",
      },
      {
        name: "Font Awesome Free",
        author: "Fonticons, Inc.",
        license: "CC BY 4.0 (icons), SIL OFL 1.1 (fonts), MIT (code)",
        url: "https://fontawesome.com/license/free",
        note: "All iconography in this interface.",
      },
    ],
  },
  {
    title: "Fonts",
    entries: [
      {
        name: "Space Grotesk",
        author: "Florian Karsten",
        license: "SIL Open Font License 1.1",
        url: "https://fonts.google.com/specimen/Space+Grotesk",
        note: "Headings.",
      },
      {
        name: "DM Sans",
        author: "Colophon Foundry, Jonny Pinhorn",
        license: "SIL Open Font License 1.1",
        url: "https://fonts.google.com/specimen/DM+Sans",
        note: "Body text.",
      },
      {
        name: "DM Mono",
        author: "Colophon Foundry, Jonny Pinhorn",
        license: "SIL Open Font License 1.1",
        url: "https://fonts.google.com/specimen/DM+Mono",
        note: "Commands and scripts.",
      },
    ],
  },
  {
    title: "Services",
    entries: [
      {
        name: "GitHub Gist API",
        author: "GitHub, Inc.",
        license: "GitHub Terms of Service",
        url: "https://docs.github.com/rest/gists",
        note: "Used only when you press Save to Gist. Scripts are saved as unlisted Gists on a shared account.",
      },
      {
        name: "CodePen prefill",
        author: "CodePen",
        license: "CodePen Terms of Service",
        url: "https://blog.codepen.io/documentation/prefill/",
        note: "Used only when you press Save to CodePen. The script is sent straight from your browser to CodePen.",
      },
    ],
  },
  {
    title: "Software the guides install",
    entries: [
      {
        name: "Ollama",
        author: "Ollama, Inc.",
        license: "MIT",
        url: "https://github.com/ollama/ollama/blob/main/LICENSE",
      },
      {
        name: "OpenClaw",
        author: "The OpenClaw project",
        license: "See project repository",
        url: "https://github.com/openclaw",
      },
      {
        name: "Open WebUI",
        author: "Open WebUI contributors",
        license: "BSD-3-Clause",
        url: "https://github.com/open-webui/open-webui/blob/main/LICENSE",
      },
      {
        name: "n8n",
        author: "n8n GmbH",
        license: "Sustainable Use License",
        url: "https://github.com/n8n-io/n8n/blob/master/LICENSE.md",
      },
      {
        name: "NVIDIA NemoClaw",
        author: "NVIDIA Corporation",
        license: "NVIDIA software license terms",
        url: "https://www.nvidia.com/en-us/agreements/",
      },
      {
        name: "Hermes",
        author: "Nous Research",
        license: "See model card",
        url: "https://huggingface.co/NousResearch",
      },
      {
        name: "Razer AIKIT",
        author: "Razer Inc.",
        license: "Razer software license terms",
        url: "https://www.razer.com/legal",
      },
    ],
  },
];

export const affiliationNote =
  "Agent Deploy only writes out the commands you would type yourself. It is not affiliated with, endorsed by, or supported by any of the projects or companies listed above, and every piece of software you install stays under its own license.";
