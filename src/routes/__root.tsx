import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import waThemeCss from "@/design-system/font-awsome-web-awesome-171158/webawesome/theme.css?url";
import { WEB_AWESOME_HTML_CLASSES } from "@/design-system/font-awsome-web-awesome-171158/webawesome/setup";
import { jsonLdScript, organizationSchema, websiteSchema } from "@/lib/seo/structuredData";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        httpEquiv: "Content-Security-Policy",
        content:
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://app.aikido.dev; font-src 'self' data:; connect-src 'self' https://cdn.jsdelivr.net; form-action 'self' https://codepen.io; frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
      },
      { title: "Agent Deploy — Self-hosted AI install guides" },
      {
        name: "description",
        content:
          "Build a step-by-step install guide for running AI agents and local models on your own server. Everything is generated in your browser.",
      },
      { name: "author", content: "MikeDemo" },
      { property: "og:title", content: "Agent Deploy — Self-hosted AI install guides" },
      {
        property: "og:description",
        content:
          "Build a step-by-step install guide for running AI agents and local models on your own server.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "google-site-verification",
        content: "RHlwBdxnagu8yjEC1UQ3cV-WcIJ17lGECi8uJYHO6P4",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.12.0/dist/styles/layers.css",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.12.0/dist/styles/themes/default.css",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.12.0/dist/styles/utilities.css",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: waThemeCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [jsonLdScript(websiteSchema()), jsonLdScript(organizationSchema())],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={WEB_AWESOME_HTML_CLASSES}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Keep this root providers-only: canvas preview routes (/__mockup,
// /__component) render inside it, so any chrome leaks into every frame.
function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
