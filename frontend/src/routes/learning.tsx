import { createFileRoute } from "@tanstack/react-router";
import { LearningPage, PagePending, PageError } from "@/components/dashboard/Pages";
import { dashboardQuery } from "@/lib/dashboard-data";

export const Route = createFileRoute("/learning")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Learning Pathway — Skillora AI" },
      { name: "description", content: "Your personalised roadmap to close skill gaps." },
      { property: "og:title", content: "Learning Pathway — Skillora AI" },
      { property: "og:description", content: "Your personalised roadmap to close skill gaps." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  pendingComponent: () => <PagePending title="Learning Pathway" />,
  errorComponent: ({ error }) => <PageError title="Learning Pathway" error={error} />,
  component: LearningPage,
});
