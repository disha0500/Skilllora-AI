import { createFileRoute } from "@tanstack/react-router";
import { MarketPage, PagePending, PageError } from "@/components/dashboard/Pages";
import { dashboardQuery } from "@/lib/dashboard-data";

export const Route = createFileRoute("/market")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Market Intelligence — Skillora AI" },
      { name: "description", content: "Industry trends, in-demand skills and emerging roles." },
      { property: "og:title", content: "Market Intelligence — Skillora AI" },
      { property: "og:description", content: "Industry trends, in-demand skills and emerging roles." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  pendingComponent: () => <PagePending title="Market Intelligence" />,
  errorComponent: ({ error }) => <PageError title="Market Intelligence" error={error} />,
  component: MarketPage,
});
