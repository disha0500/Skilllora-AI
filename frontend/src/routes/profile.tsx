import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/dashboard/PlaceholderPage";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Skillora AI" },
      { name: "description", content: "Manage your profile, notifications and preferences." },
      { property: "og:title", content: "Profile & Settings — Skillora AI" },
      { property: "og:description", content: "Manage your profile, notifications and preferences." },
    ],
  }),
  component: () => <PlaceholderPage title="Profile & Settings" blurb="Manage your profile, notifications and preferences." />,
});
