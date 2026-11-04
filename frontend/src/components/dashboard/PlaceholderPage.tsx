import { Link } from "@tanstack/react-router";
import { DashboardShell } from "./DashboardShell";

export function PlaceholderPage({ title, blurb }: { title: string; blurb: string }) {
  return (
    <DashboardShell title={title}>
      <section className="panel animate-rise p-8 md:p-12">
        <p className="eyebrow">Skillora AI</p>
        <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{blurb}</p>
        <p className="mt-6 text-sm text-muted-foreground">This page isn't built yet.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-primary hover:underline">← Back to dashboard</Link>
      </section>
    </DashboardShell>
  );
}
