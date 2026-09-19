import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import tailwindcss from "@tailwindcss/vite";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";


// Every public route, prerendered to static HTML. Keep in sync with
// public/sitemap.xml and src/data/stacks.
const STATIC_ROUTES = [
  "/",
  "/setup",
  "/faq",
  "/troubleshooting",
  "/licenses",
  "/security",
  "/changelog",
  "/guide/openclaw",
  "/guide/ollama",
  "/guide/openwebui",
  "/guide/n8n",
  "/guide/nemoclaw",
  "/guide/hermes",
  "/guide/razeraikit",
];

const TANSTACK_SSR_DEPS = [
  "@tanstack/start-server-core",
  "@tanstack/react-start",
  "@tanstack/react-start-server",
];

export default defineConfig(({ mode }) => {
  // The site ships as prerendered static HTML, so the build must not target the
  // Cloudflare Workers runtime: that output renames the SSR entry and the
  // prerender pass can't boot it. Static output lands in dist/client.
  const useCloudflare = false;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: TANSTACK_SSR_DEPS,
    },
    ssr: {
      optimizeDeps: {
        exclude: TANSTACK_SSR_DEPS,
      },
    },
    environments: {
      ssr: {
        optimizeDeps: {
          exclude: TANSTACK_SSR_DEPS,
        },
      },
    },
    plugins: [
      mockupPreviewPlugin(),
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
      tanstackStart({
        // Static hosting: every public route is prerendered to HTML at build
        // time. Listed explicitly so nothing is guessed from the route tree.
        pages: STATIC_ROUTES.map((path) => ({ path, prerender: { enabled: true } })),
        prerender: { enabled: true, autoStaticPathsDiscovery: false },
      }),
      viteReact(),
      ...(mode === "development" ? [componentTagger()] : []),
    ],

  };
});
