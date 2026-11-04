import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  WelcomeSection, CareerMetrics, SkillsOverview, SkillGapAnalysis, CareerIntelligence, OpportunityPreview, LearningRoadmap, NextSteps,
} from "@/components/dashboard/Sections";
import { dashboardQuery } from "@/lib/dashboard-data";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Skillora AI" },
      { name: "description", content: "Your skills, gaps, career intelligence and learning roadmap in one place." },
      { property: "og:title", content: "Dashboard — Skillora AI" },
      { property: "og:description", content: "Your skills, gaps, career intelligence and learning roadmap in one place." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  pendingComponent: () => (
    <DashboardShell title="Dashboard"><p className="text-muted-foreground">Loading your dashboard…</p></DashboardShell>
  ),
  errorComponent: ({ error }) => (
    <DashboardShell title="Dashboard">
      <div className="panel p-8"><h2 className="text-2xl">We couldn't load your dashboard</h2><p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p></div>
    </DashboardShell>
  ),
  component: Dashboard,
});

function Dashboard() {
  const { data: d } = useSuspenseQuery(dashboardQuery);
  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6">
        <WelcomeSection d={d} />
        <CareerMetrics d={d} />
        <SkillGapAnalysis d={d} />
        <SkillsOverview d={d} />
        <div className="grid gap-6 lg:grid-cols-2">
          <CareerIntelligence d={d} />
          <LearningRoadmap d={d} />
        </div>
        <OpportunityPreview d={d} />
        <NextSteps />
      </div>
    </DashboardShell>
  );
}
