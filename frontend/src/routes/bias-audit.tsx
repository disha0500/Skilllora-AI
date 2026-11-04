import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export const Route = createFileRoute("/bias-audit")({
  head: () => ({
    meta: [
      { title: "Employer Bias Audit — Skillora AI" },
      { name: "description", content: "Review job postings for biased or exclusionary language." },
      { property: "og:title", content: "Employer Bias Audit — Skillora AI" },
      { property: "og:description", content: "Review job postings for biased or exclusionary language." },
    ],
  }),
  component: () => <PlaceholderPage title="Employer Bias Audit" blurb="Review job postings for biased or exclusionary language." />,
});
