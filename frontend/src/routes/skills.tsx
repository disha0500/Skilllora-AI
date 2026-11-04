import { createFileRoute } from "@tanstack/react-router";
import { SkillsDiscoveryPage } from "@/components/dashboard/SkillsDiscovery";
import { PagePending, PageError } from "@/components/dashboard/Pages";
import { dashboardQuery } from "@/lib/dashboard-data";

export const Route = createFileRoute("/skills")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Skills Discovery — Skillora AI" },
      { name: "description", content: "Upload your resume and let the Skills Discovery Agent map your skills." },
      { property: "og:title", content: "Skills Discovery — Skillora AI" },
      { property: "og:description", content: "Upload your resume and let the Skills Discovery Agent map your skills." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  pendingComponent: () => <PagePending title="Skills Discovery" />,
  errorComponent: ({ error }) => <PageError title="Skills Discovery" error={error} />,
  component: SkillsDiscoveryPage,
});
