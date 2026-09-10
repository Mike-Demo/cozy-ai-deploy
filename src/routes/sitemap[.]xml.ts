import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { sitemapStaticPaths, sitemapPathForLocation, sitemapXML, type SitemapEntry } from "@/lib/sitemap";
import { stacks } from "@/data/stacks";

const BASE_URL = "https://local.mikedemo.dev";

const GUIDE_ROUTE_ID = "/guide/$stackId";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        // One guide page per catalog stack; the catalog is static local data.
        if (
          Object.prototype.hasOwnProperty.call(router.routesById, GUIDE_ROUTE_ID) &&
          isIncluded(router, GUIDE_ROUTE_ID)
        ) {
          for (const stack of stacks) {
            const location = router.buildLocation({
              to: GUIDE_ROUTE_ID,
              params: { stackId: stack.id },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, GUIDE_ROUTE_ID);
            if (path) entries.push({ path });
          }
        }

        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }

        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});

function isIncluded(router: Awaited<ReturnType<typeof getRouterInstance>>, routeId: string): boolean {
  // Local import kept lazy-free: reuse the helper's inclusion rules.
  return import.meta.env.SSR
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (router.routesById as any)[routeId]?.options?.staticData?.sitemap === true
    : false;
}
