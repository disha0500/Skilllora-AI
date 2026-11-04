import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Human Review — Skillora AI" },
      { name: "description", content: "Have your skills validated by a human reviewer." },
      { property: "og:title", content: "Human Review — Skillora AI" },
      { property: "og:description", content: "Have your skills validated by a human reviewer." },
    ],
  }),
  component: () => <PlaceholderPage title="Human Review" blurb="Have your skills validated by a human reviewer." />,
});
