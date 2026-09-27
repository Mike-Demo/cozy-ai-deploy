export const SITE_URL = "https://local.mikedemo.dev";
export const SITE_NAME = "Agent Deploy";

export type JsonLd = Record<string, unknown>;

export interface BreadcrumbEntry {
  readonly name: string;
  readonly path: string;
}

export interface ListEntry {
  readonly name: string;
  readonly path: string;
  readonly description?: string;
}

const absolute = (path: string): string =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      "Build a step-by-step install guide for running AI agents and local models on your own server.",
  };
}

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/favicon.png`,
  };
}

export function webApplicationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (browser)",
    description:
      "Generate personalized copy-and-paste install guides for self-hosted AI agents like OpenClaw, Ollama, and n8n. Everything is generated in your browser.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function webPageSchema(page: {
  readonly name: string;
  readonly description: string;
  readonly path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: absolute(page.path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
  };
}

export function breadcrumbSchema(entries: readonly BreadcrumbEntry[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absolute(entry.path),
    })),
  };
}

export function itemListSchema(list: {
  readonly name: string;
  readonly items: readonly ListEntry[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.name,
    itemListElement: list.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: absolute(item.path),
    })),
  };
}

export function jsonLdScript(schema: JsonLd): {
  type: "application/ld+json";
  children: string;
} {
  return { type: "application/ld+json", children: JSON.stringify(schema) };
}
