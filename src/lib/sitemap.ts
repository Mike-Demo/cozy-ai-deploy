// The public sitemap is a static file at public/sitemap.xml because the site is
// prerendered for static hosting. This module only keeps the route-level
// `staticData.sitemap` flag typed, so every route still makes the decision
// explicitly and the static sitemap has an in-code source of truth.

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    sitemap?: boolean | "exclude-subtree";
  }
}

export {};
