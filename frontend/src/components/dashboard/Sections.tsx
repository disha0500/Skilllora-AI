import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowRight, CheckCircle2, Circle, FileUp, Compass, BadgeCheck, TrendingUp, BookOpen, Briefcase, UserRound, MapPin,
} from "lucide-react";
import type { DashboardData, SkillCategory } from "@/lib/dashboard-data";

export function Section({ eyebrow, title, action, children, className = "" }: { eyebrow: string; title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel animate-rise p-6 md:p-7 ${className}`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold md:text-3xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function GoldLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-champagne transition-colors hover:bg-primary hover:text-primary-foreground">
      {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "gold" | "miss" }) {
  const t = { neutral: "border-border text-muted-foreground", gold: "border-primary/40 text-champagne bg-accent", miss: "border-destructive/40 text-destructive" }[tone];
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs ${t}`}>{children}</span>;
}

export function SourceBadge({ source }: { source: "live" | "demo" }) {
  return source === "live" ? (
    <span className="rounded-full border border-success/40 px-3 py-1 text-xs text-success">● Live AI agents connected</span>
  ) : (
    <span className="rounded-full border border-primary/40 bg-accent px-3 py-1 text-xs text-champagne" title="No backend is connected yet — values are illustrative.">
      Demo data · backend not connected
    </span>
  );
}

export function WelcomeSection({ d }: { d: DashboardData }) {
  const { user } = d;
  const r = 34, c = 2 * Math.PI * r;
  return (
    <section className="panel shadow-gold animate-rise relative overflow-hidden p-6 md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <SourceBadge source={d.source} />
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">Welcome back, <span className="text-gold">{user.name}</span></h1>
          <p className="mt-3 text-muted-foreground">{user.headline ?? "Your strongest evidence is in SQL and stakeholder work. Closing your data-modeling gap is the single biggest step toward your next role."}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">Current pathway</span>
            <Chip tone="gold">{user.pathway}</Chip>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
            <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="6" />
            <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - user.profileCompletion / 100)} />
          </svg>
          <div>
            <p className="font-display text-4xl text-champagne">{user.profileCompletion}%</p>
            <p className="text-sm text-muted-foreground">Profile complete</p>
            <Link to="/profile" className="mt-1 inline-block text-sm text-primary hover:underline">Finish profile</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareerMetrics({ d }: { d: DashboardData }) {
  const items = [
    { label: "Skills Discovered", value: d.skills.length, hint: "from resume & portfolio" },
    { label: "Demonstrated Skills", value: d.skills.filter((s) => s.demonstrated).length, hint: "backed by evidence" },
    { label: "Skills to Improve", value: d.gap.filter((g) => g.current < g.required).length, hint: "for your target role" },
    { label: "Career Opportunities", value: d.opportunities.length, hint: "relevant matches" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((m, i) => (
        <div key={m.label} className="panel animate-rise p-5" style={{ animationDelay: `${i * 70}ms` }}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{m.label}</p>
          <p className="mt-3 font-display text-5xl font-semibold text-gold">{m.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{m.hint}</p>
        </div>
      ))}
    </div>
  );
}

const CATS: SkillCategory[] = ["Technical", "Soft", "Professional", "Transferable"];

export function SkillsOverview({ d }: { d: DashboardData }) {
  return (
    <Section eyebrow="Skills Discovery Agent" title="My Skills" action={<GoldLink to="/skills">Discover more</GoldLink>}>
      <div className="grid gap-5 md:grid-cols-2">
        {CATS.map((cat) => {
          const list = d.skills.filter((s) => s.category === cat);
          return (
            <div key={cat} className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="mb-3 text-sm font-semibold text-champagne">{cat} Skills <span className="text-muted-foreground">· {list.length}</span></p>
              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground">No skills found yet.</p>
              ) : (
                <ul className="space-y-3">
                  {list.map((s) => (
                    <li key={s.name} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.demonstrated ? "bg-primary" : "border border-muted-foreground"}`} />
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.evidence}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Chip tone={s.demonstrated ? "gold" : "neutral"}>{s.demonstrated ? "Demonstrated" : "Mentioned"}</Chip>
                        {s.validation && <span className="text-[11px] text-muted-foreground">{s.validation}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function SkillGapAnalysis({ d }: { d: DashboardData }) {
  const missing = d.gap.filter((g) => g.current === 0);
  const improve = d.gap.filter((g) => g.current > 0 && g.current < g.required);
  return (
    <Section eyebrow="Most important" title="Skill Gap Analysis" action={<GoldLink to="/learning">View My Learning Pathway</GoldLink>}>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="h-72 lg:col-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.gap} barGap={4} margin={{ left: -20 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="skill" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "var(--color-accent)" }} contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, color: "var(--color-foreground)" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }} />
              <Bar dataKey="current" name="My level" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="required" name="Role requires" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-5 lg:col-span-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Missing</p>
            <div className="flex flex-wrap gap-2">{missing.map((g) => <Chip key={g.skill} tone="miss">{g.skill}</Chip>)}</div>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Needs improvement</p>
            <div className="flex flex-wrap gap-2">{improve.map((g) => <Chip key={g.skill}>{g.skill}</Chip>)}</div>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Prioritise next</p>
            <ol className="space-y-2.5">
              {d.priorities.map((p, i) => (
                <li key={p.skill} className="flex gap-3 text-sm">
                  <span className="font-display text-xl leading-none text-primary">{i + 1}</span>
                  <span><span className="font-medium">{p.skill}</span> <span className="text-muted-foreground">— {p.reason}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CareerIntelligence({ d }: { d: DashboardData }) {
  const i = d.intelligence;
  return (
    <Section eyebrow="Market signals" title="Career Intelligence" action={<GoldLink to="/market">Explore market</GoldLink>}>
      <div className="space-y-4">
        {i.roles.map((r) => (
          <div key={r.title} className="border-l-2 border-primary/50 pl-4">
            <p className="font-medium">{r.title}</p>
            <p className="text-sm text-muted-foreground">{r.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><TrendingUp className="h-3.5 w-3.5 text-primary" />Industry trends</p>
          <ul className="space-y-1.5 text-sm">{i.trends.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Emerging</p>
          <ul className="space-y-1.5 text-sm">{i.emerging.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
      <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-muted-foreground">In-demand skills</p>
      <div className="flex flex-wrap gap-2">{i.inDemand.map((s) => <Chip key={s} tone="gold">{s}</Chip>)}</div>
    </Section>
  );
}

export function LearningRoadmap({ d }: { d: DashboardData }) {
  const r = d.roadmap;
  return (
    <Section eyebrow="Personalised" title="Learning Roadmap" action={<GoldLink to="/learning">View Full Roadmap</GoldLink>}>
      <div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="text-champagne">{r.progress}%</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold" style={{ width: `${r.progress}%` }} /></div>
      <div className="mt-5 rounded-lg border border-primary/30 bg-accent p-4">
        <p className="eyebrow">Next recommended action</p>
        <p className="mt-1 text-sm">{r.nextAction}</p>
      </div>
      <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-muted-foreground">Milestones</p>
      <ul className="space-y-2.5">
        {r.milestones.map((m) => (
          <li key={m.title} className="flex items-center gap-3 text-sm">
            {m.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
            <span className={m.done ? "text-muted-foreground line-through" : ""}>{m.title}</span>
            <span className="ml-auto text-xs text-muted-foreground">{m.due}</span>
          </li>
        ))}
      </ul>
      <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-muted-foreground">Suggested resources</p>
      <ul className="space-y-2">
        {r.resources.map((res) => (
          <li key={res.title} className="flex items-center gap-3 text-sm"><BookOpen className="h-4 w-4 text-primary" />{res.title}<span className="ml-auto text-xs text-muted-foreground">{res.provider}</span></li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">{r.toLearn.map((s) => <Chip key={s}>{s}</Chip>)}</div>
    </Section>
  );
}

export function OpportunityPreview({ d }: { d: DashboardData }) {
  return (
    <Section eyebrow="Matched for you" title="Recommended Opportunities" action={<GoldLink to="/jobs">All opportunities</GoldLink>}>
      {d.opportunities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No opportunities yet — add more skills to get matches.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {d.opportunities.map((o) => (
            <article key={o.title} className="flex flex-col rounded-xl border border-border bg-surface/60 p-5 transition-colors hover:border-primary/40">
              <h3 className="text-xl font-semibold">{o.title}</h3>
              <p className="text-sm text-muted-foreground">{o.company}</p>
              {o.workMode && <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{o.workMode}</p>}
              <p className="mt-4 text-sm italic text-champagne">“{o.why}”</p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex flex-wrap gap-1.5"><span className="w-16 text-muted-foreground">Matching</span>{o.matching.map((s) => <Chip key={s} tone="gold">{s}</Chip>)}</div>
                <div className="flex flex-wrap gap-1.5"><span className="w-16 text-muted-foreground">Missing</span>{o.missing.length ? o.missing.map((s) => <Chip key={s} tone="miss">{s}</Chip>) : <span className="text-success">None</span>}</div>
                <div className="flex flex-wrap gap-1.5"><span className="w-16 text-muted-foreground">Required</span>{o.required.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              </div>
              <Link to="/jobs" className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline">View Details <ArrowRight className="h-3.5 w-3.5" /></Link>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

const STEPS = [
  { label: "Complete my profile", to: "/profile", icon: UserRound },
  { label: "Upload or update my resume", to: "/skills", icon: FileUp },
  { label: "Validate my skills", to: "/review", icon: BadgeCheck },
  { label: "Explore market demand", to: "/market", icon: TrendingUp },
  { label: "Start learning a missing skill", to: "/learning", icon: Compass },
  { label: "Explore job opportunities", to: "/jobs", icon: Briefcase },
] as const;

export function NextSteps() {
  return (
    <Section eyebrow="Take action" title="Next Steps">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map(({ label, to, icon: Icon }) => (
          <Link key={label} to={to} className="group flex items-center gap-4 rounded-xl border border-border bg-surface/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-5 w-5" /></span>
            <span className="text-sm font-medium">{label}</span>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </Section>
  );
}
