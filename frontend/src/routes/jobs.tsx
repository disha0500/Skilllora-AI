import { createFileRoute } from "@tanstack/react-router";
import { JobsPage, PagePending, PageError } from "@/components/dashboard/Pages";
import { dashboardQuery } from "@/lib/dashboard-data";

export const Route = createFileRoute("/jobs")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Job Opportunities — Skillora AI" },
      { name: "description", content: "Roles matched to your skills, with clear reasons why." },
      { property: "og:title", content: "Job Opportunities — Skillora AI" },
      { property: "og:description", content: "Roles matched to your skills, with clear reasons why." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  pendingComponent: () => <PagePending title="Job Opportunities" />,
  errorComponent: ({ error }) => <PageError title="Job Opportunities" error={error} />,
  component: JobsPage,
});
