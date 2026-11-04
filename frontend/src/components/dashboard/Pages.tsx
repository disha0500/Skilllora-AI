import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle2, Circle, ExternalLink, MapPin } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Chip, GoldLink, Section, SourceBadge } from "@/components/dashboard/Sections";
import { dashboardQuery, type DashboardData } from "@/lib/dashboard-data";
import { toggleCourse } from "@/lib/career-session";

export function PagePending({ title }: { title: string }) {
  return <DashboardShell title={title}><p className="text-muted-foreground">Loading…</p></DashboardShell>;
}
export function PageError({ title, error }: { title: string; error: unknown }) {
  return (
    <DashboardShell title={title}>
      <div className="panel p-8"><h2 className="text-2xl">We couldn't load this page</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p></div>
    </DashboardShell>
  );
}

const FLOW = [
  { to: "/skills", label: "1 · Discover skills" },
  { to: "/market", label: "2 · Market intelligence" },
  { to: "/learning", label: "3 · Learning pathway" },
  { to: "/jobs", label: "4 · Job opportunities" },
] as const;

/** Shows where the person is in Discover → Market → Learn → Jobs, and what comes next. */
function FlowNav({ d, step }: { d: DashboardData; step: 1 | 2 | 3 }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {FLOW.map((f, i) => (
          <Link key={f.to} to={f.to} className={`rounded-full border px-3 py-1 transition-colors ${i === step ? "border-primary bg-accent text-champagne" : "border-border text-muted-foreground hover:text-foreground"}`}>{f.label}</Link>
        ))}
      </div>
      {!d.hasSession && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-accent p-4 text-sm">
          <span>You're viewing sample data. Upload your resume to personalise this page.</span>
          <GoldLink to="/skills">Upload resume</GoldLink>
        </div>
      )}
    </div>
  );
}

function NextStep({ to, children }: { to: string; children: string }) {
  return <div className="flex justify-end"><GoldLink to={to}>{children}</GoldLink></div>;
}

const eq = (a: string, b: string) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x.includes(y) || y.includes(x); };

export function JobsPage() {
  const { data: d } = useSuspenseQuery(dashboardQuery);
  const [filter, setFilter] = useState<"all" | "ready" | "close" | "stretch">("all");
  const planned = d.roadmap.courses.flatMap((c) => c.skills);
  const shown = d.opportunities.filter((o) =>
    filter === "ready" ? o.missing.length === 0 : filter === "close" ? o.missing.length > 0 && o.missing.length <= 2 : filter === "stretch" ? o.missing.length > 2 : true);
  const tabs = [["all", "All"], ["ready", "Ready now"], ["close", "1–2 skills away"], ["stretch", "Stretch"]] as const;
  return (
    <DashboardShell title="Job Opportunities">
      <div className="space-y-6">
        <FlowNav d={d} step={3} />
        <div className="flex flex-wrap items-center gap-3">
          <SourceBadge source={d.source} />
          <span className="text-sm text-muted-foreground">Ranked by the Inclusive Matching Agent. Career breaks carry 0% penalty.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full border px-4 py-1.5 text-sm ${filter === k ? "border-primary bg-accent text-champagne" : "border-border text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
        {shown.length === 0 && <p className="text-sm text-muted-foreground">No roles in this group yet.</p>}
        <div className="grid gap-5 lg:grid-cols-2">
          {shown.map((o) => {
            const covered = o.missing.filter((m) => planned.some((p) => eq(p, m))).length;
            return (
              <article key={o.title + o.company} className="panel animate-rise flex flex-col p-6 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{o.title}</h3>
                    <p className="text-sm text-muted-foreground">{o.company}</p>
                    {o.workMode && <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{o.workMode}</p>}
                    {o.salary && <p className="mt-1 text-xs text-champagne">{o.salary}</p>}
                  </div>
                  {o.score !== undefined && (
                    <div className="text-right"><p className="font-display text-4xl text-gold">{o.score}%</p><p className="text-xs text-muted-foreground">match</p></div>
                  )}
                </div>
                <p className="mt-4 text-sm italic text-champagne">“{o.why}”</p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex flex-wrap gap-1.5"><span className="w-16 text-muted-foreground">Matching</span>{o.matching.map((s) => <Chip key={s} tone="gold">{s}</Chip>)}</div>
                  <div className="flex flex-wrap gap-1.5"><span className="w-16 text-muted-foreground">Missing</span>{o.missing.length ? o.missing.map((s) => <Chip key={s} tone="miss">{s}</Chip>) : <span className="text-success">None — you meet every requirement</span>}</div>
                </div>
                {o.missing.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <GoldLink to="/learning">Close the gap</GoldLink>
                    <span className="text-xs text-muted-foreground">{covered} of {o.missing.length} missing skills covered by your learning path</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}

export function LearningPage() {
  const { data: d } = useSuspenseQuery(dashboardQuery);
  const qc = useQueryClient();
  const r = d.roadmap;
  const learned = r.courses.filter((c) => c.done).flatMap((c) => c.skills);
  const planned = r.courses.flatMap((c) => c.skills);
  const covers = (list: string[], o: { missing: string[] }) => o.missing.every((m) => list.some((s) => eq(s, m)));
  const unlocks = d.opportunities.filter((o) => o.missing.length > 0).map((o) => ({ o, now: covers(learned, o), after: covers(planned, o) }));
  // Group courses under the skill gap they close (highest-priority gap first).
  const groups = d.gap.map((g) => ({ skill: g.skill, courses: r.courses.filter((c) => c.skills.some((s) => eq(s, g.skill))) })).filter((g) => g.courses.length);
  const grouped = new Set(groups.flatMap((g) => g.courses.map((c) => c.id)));
  const other = r.courses.filter((c) => !grouped.has(c.id));
  if (other.length) groups.push({ skill: "Other recommended learning", courses: other });
  const toggle = (id: string) => { toggleCourse(id); qc.invalidateQueries({ queryKey: ["dashboard"] }); };

  return (
    <DashboardShell title="Learning Pathway">
      <div className="space-y-6">
        <FlowNav d={d} step={2} />
        <SourceBadge source={d.source} />
        <Section eyebrow="Learning Pathway Agent" title="Your Personalised Roadmap">
          <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Progress{r.courses.length ? ` · ${r.courses.filter((c) => c.done).length} of ${r.courses.length} courses` : ""}</span><span className="text-champagne">{r.progress}%</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold" style={{ width: `${r.progress}%` }} /></div>
          <div className="mt-5 rounded-lg border border-primary/30 bg-accent p-4"><p className="eyebrow">Next recommended action</p><p className="mt-1 text-sm">{r.nextAction}</p></div>
          <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-muted-foreground">Skills you will build</p>
          <div className="flex flex-wrap gap-2">{r.toLearn.map((s) => <Chip key={s} tone="gold">{s}</Chip>)}</div>
        </Section>
        <div className="grid gap-6 lg:grid-cols-5">
          <Section className="lg:col-span-3" eyebrow="Ordered by skill gap" title="Courses">
            {r.courses.length === 0 ? (
              <ul className="space-y-3">{r.resources.map((res) => <li key={res.title} className="flex items-center gap-3 text-sm"><BookOpen className="h-4 w-4 text-primary" />{res.title}<span className="ml-auto text-xs text-muted-foreground">{res.provider}</span></li>)}</ul>
            ) : groups.map((g) => (
              <div key={g.skill} className="mb-6 last:mb-0">
                <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{g.skill}</p>
                <ul className="space-y-3">
                  {g.courses.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 text-sm">
                      <button onClick={() => toggle(c.id)} aria-label={c.done ? "Mark incomplete" : "Mark complete"}>
                        {c.done ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                      </button>
                      <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.title}</span>
                      <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                        {c.provider}{c.hours ? ` · ${c.hours} hrs` : ""}
                        {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="text-primary hover:underline" aria-label="Open course"><ExternalLink className="h-3.5 w-3.5" /></a>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
          <Section className="lg:col-span-2" eyebrow="Learning → Jobs" title="What This Unlocks">
            {unlocks.length === 0 ? <p className="text-sm text-muted-foreground">You already meet every requirement in your matched roles.</p> : (
              <ul className="space-y-4">
                {unlocks.map(({ o, now, after }) => (
                  <li key={o.title + o.company} className="text-sm">
                    <p className="font-medium">{o.title} <span className="text-muted-foreground">· {o.company}</span></p>
                    <p className="text-xs text-muted-foreground">Needs: {o.missing.join(", ")}</p>
                    <div className="mt-1"><Chip tone={now ? "gold" : "neutral"}>{now ? "Unlocked" : after ? "Unlocked when path is complete" : "Needs skills outside this path"}</Chip></div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
        <NextStep to="/jobs">See the jobs this unlocks</NextStep>
      </div>
    </DashboardShell>
  );
}

export function MarketPage() {
  const { data: d } = useSuspenseQuery(dashboardQuery);
  const i = d.intelligence;
  const have = new Set(d.skills.map((s) => s.name.toLowerCase()));
  const counts = new Map<string, number>();
  d.opportunities.forEach((o) => o.required.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
  const topNeeded = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxN = Math.max(1, ...topNeeded.map(([, n]) => n));
  const modes = new Map<string, number>();
  d.opportunities.forEach((o) => o.workMode && modes.set(o.workMode, (modes.get(o.workMode) ?? 0) + 1));
  const live = d.hasSession;
  return (
    <DashboardShell title="Market Intelligence">
      <div className="space-y-6">
        <FlowNav d={d} step={1} />
        <SourceBadge source={d.source} />
        <Section eyebrow="From your matched jobs" title="Skills Employers Ask For Most">
          <ul className="space-y-3">
            {topNeeded.map(([s, n]) => {
              const owned = have.has(s.toLowerCase());
              return (
                <li key={s} className="text-sm">
                  <div className="mb-1 flex items-center justify-between"><span>{s}</span><span className="flex items-center gap-2 text-xs text-muted-foreground">{n} of {d.opportunities.length} roles<Chip tone={owned ? "gold" : "miss"}>{owned ? "You have it" : "Gap"}</Chip></span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold" style={{ width: `${(100 * n) / maxN}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Section eyebrow="Best fit" title="Suggested Roles">
            <div className="space-y-4">{i.roles.map((r) => <div key={r.title} className="border-l-2 border-primary/50 pl-4"><p className="font-medium">{r.title}</p><p className="text-sm text-muted-foreground">{r.note}</p></div>)}</div>
            {modes.size > 0 && (<>
              <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-muted-foreground">Where the roles are</p>
              <div className="flex flex-wrap gap-2">{[...modes.entries()].map(([m, n]) => <Chip key={m}>{m} · {n}</Chip>)}</div>
            </>)}
            {d.opportunities.some((o) => o.salary) && (<>
              <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-muted-foreground">Salary ranges</p>
              <ul className="space-y-1.5 text-sm">{d.opportunities.filter((o) => o.salary).map((o) => <li key={o.title + o.company} className="flex justify-between gap-3"><span>{o.title}</span><span className="text-champagne">{o.salary}</span></li>)}</ul>
            </>)}
          </Section>
          <Section eyebrow={live ? "Market Intelligence Agent" : "Illustrative signals"} title="Trends & Emerging Skills">
            {live && !i.trends.length && !i.emerging.length ? <p className="text-sm text-muted-foreground">The agent returned no trend signals for this resume.</p> : (<>
              {i.trends.length > 0 && <ul className="space-y-1.5 text-sm">{i.trends.map((t) => <li key={t}>{t}</li>)}</ul>}
              {i.emerging.length > 0 && (<><p className="mb-2 mt-5 text-xs uppercase tracking-widest text-muted-foreground">Emerging / gaps</p><ul className="space-y-1.5 text-sm">{i.emerging.map((t) => <li key={t}>{t}</li>)}</ul></>)}
            </>)}
            <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-muted-foreground">In-demand</p>
            <div className="flex flex-wrap gap-2">{i.inDemand.map((s) => <Chip key={s}>{s}</Chip>)}</div>
          </Section>
        </div>
        <NextStep to="/learning">Build my learning pathway</NextStep>
      </div>
    </DashboardShell>
  );
}
