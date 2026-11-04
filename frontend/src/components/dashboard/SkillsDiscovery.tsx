import { useRef, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FileUp, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Chip, GoldLink, Section, SourceBadge } from "@/components/dashboard/Sections";
import {
  analyzeResumeLive, dashboardQuery, discoverSkillsLive,
  type DiscoveredSkill, type ResumeAnalysis,
} from "@/lib/dashboard-data";
import { extractResumeText } from "@/lib/resume-extract";

const DEFAULT_RESP = [
  "Interview scheduling",
  "Communicating with candidates",
  "Coordinating with hiring managers",
  "Maintaining employee records",
  "Managing scheduling conflicts",
  "Following up on pending activities",
].join("\n");

const TIER_TONE: Record<string, "gold" | "neutral"> = {
  "Human-Validated": "gold", "AI-Assessed": "gold", "Evidence Submitted": "neutral", "Self-Declared": "neutral",
};
const inputCls = "w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60";
const btnCls = "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50";
const errMsg = (e: unknown) => `Could not reach the AI agents. Is the backend running on port 8000? (${e instanceof Error ? e.message : "error"})`;

function SkillCards({ skills, dist }: { skills: DiscoveredSkill[]; dist: Record<string, number> }) {
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {Object.entries(dist).map(([k, v]) => <Chip key={k} tone={TIER_TONE[k] ?? "neutral"}>{k}: {v}</Chip>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((s) => (
          <article key={s.name} className="rounded-xl border border-border bg-surface/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.category} · {s.proficiency}</p>
              </div>
              <span className="font-display text-2xl text-gold">{s.confidence}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold" style={{ width: `${s.confidence}%` }} /></div>
            {s.transferredFrom && <p className="mt-3 text-xs text-muted-foreground">Transferred from: <span className="text-champagne">{s.transferredFrom}</span></p>}
            {s.relevance && <p className="mt-1 text-xs text-muted-foreground">{s.relevance}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip tone={TIER_TONE[s.status] ?? "neutral"}>{s.status}</Chip>
              {s.transferable && <Chip tone="gold">Transferable</Chip>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function SkillsDiscoveryPage() {
  const { data: d } = useSuspenseQuery(dashboardQuery);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  // Resume upload state
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeTarget, setResumeTarget] = useState("Project Coordinator");
  const [reading, setReading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  // Manual form state
  const [prev, setPrev] = useState("HR Operations Associate");
  const [target, setTarget] = useState("Project Coordinator");
  const [resp, setResp] = useState(DEFAULT_RESP);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<DiscoveredSkill[] | null>(null);
  const [dist, setDist] = useState<Record<string, number>>({});

  async function onFile(f: File | undefined) {
    if (!f) return;
    setResumeError(null);
    setAnalysis(null);
    setFileName(f.name);
    setReading(true);
    try {
      const text = await extractResumeText(f);
      if (text.length < 20) throw new Error("No readable text found (scanned PDF?). Paste your resume text below.");
      setResumeText(text);
    } catch (e) {
      setResumeError(e instanceof Error ? e.message : "Could not read this file.");
    } finally {
      setReading(false);
    }
  }

  async function analyze() {
    setAnalyzing(true);
    setResumeError(null);
    try {
      setAnalysis(await analyzeResumeLive(resumeText, resumeTarget.trim()));
      qc.invalidateQueries({ queryKey: ["dashboard"] }); // Market / Learning / Jobs now use this analysis
    } catch (e) {
      setResumeError(errMsg(e));
    } finally {
      setAnalyzing(false);
    }
  }

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const r = await discoverSkillsLive({
        previousRole: prev.trim(),
        targetRole: target.trim(),
        responsibilities: resp.split("\n").map((x) => x.trim()).filter(Boolean),
      });
      setFound(r.skills);
      setDist(r.distribution);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell title="Skills Discovery">
      <div className="space-y-6">
        <SourceBadge source={d.source} />

        <Section eyebrow="Step 1 · Upload" title="Upload Your Resume">
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Upload a PDF, Word (.docx) or text resume. All AI agents run on it: skills, job matches, learning path and a fairness audit. Career breaks are never penalised. The resume is read in your browser.
          </p>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-accent/40 px-6 py-8 text-center transition-colors hover:border-primary hover:bg-accent">
            {reading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <FileUp className="h-6 w-6 text-primary" />}
            <span className="text-sm font-medium">{reading ? "Reading file…" : fileName ? fileName : "Click to choose your resume"}</span>
            <span className="text-xs text-muted-foreground">PDF, DOCX, TXT</span>
          </button>
          <label className="mt-5 block text-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Resume text (edit or paste if needed)</span>
            <textarea className={inputCls} rows={7} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Your resume text appears here after upload — or paste it directly." /></label>
          <label className="mt-4 block text-sm md:max-w-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Target role</span>
            <input className={inputCls} value={resumeTarget} onChange={(e) => setResumeTarget(e.target.value)} /></label>
          <button onClick={analyze} disabled={analyzing || resumeText.trim().length < 20} className={`${btnCls} mt-5`}>
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {analyzing ? "Agents are working…" : "Analyze my resume"}
          </button>
          {resumeError && <p className="mt-4 text-sm text-destructive">{resumeError}</p>}
        </Section>

        {analysis && (
          <>
            <Section eyebrow="Orchestrator summary" title={`${analysis.candidate.name} → ${analysis.candidate.targetRole}`}>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {analysis.candidate.previousRole && <Chip>{analysis.candidate.previousRole}</Chip>}
                {analysis.candidate.hasBreak && <Chip tone="gold">{analysis.candidate.breakYears}-year career break · 0% penalty</Chip>}
                <Chip tone="gold"><ShieldCheck className="mr-1 inline h-3 w-3" />Fairness {analysis.fairness.score}%</Chip>
              </div>
              {analysis.fairness.summary && <p className="mt-3 text-xs text-muted-foreground">{analysis.fairness.summary}</p>}
            </Section>
            <Section eyebrow="Skills Discovery Agent" title={`${analysis.skills.length} Skills Found In Your Resume`}>
              <SkillCards skills={analysis.skills} dist={analysis.distribution} />
            </Section>
            <div className="grid gap-6 lg:grid-cols-2">
              <Section eyebrow="Inclusive Matching Agent" title="Best-Matched Jobs">
                <ul className="space-y-3">
                  {analysis.matches.map((m) => (
                    <li key={m.title + m.company} className="flex items-center justify-between gap-3 text-sm">
                      <span><span className="font-medium">{m.title}</span><span className="block text-xs text-muted-foreground">{m.company} · {m.location}</span></span>
                      <span className="font-display text-2xl text-gold">{m.score}%</span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section eyebrow="Learning Pathway Agent" title="Recommended Courses">
                <ul className="space-y-3 text-sm">
                  {analysis.courses.map((c) => (
                    <li key={c.title} className="flex items-center justify-between gap-3">
                      <span>{c.title}</span>
                      {c.url ? <a className="shrink-0 text-xs text-primary hover:underline" href={c.url} target="_blank" rel="noreferrer">{c.provider} ↗</a> : <span className="text-xs text-muted-foreground">{c.provider}</span>}
                    </li>
                  ))}
                </ul>
                {analysis.marketGaps.length > 0 && (<>
                  <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-muted-foreground">Market skill gaps</p>
                  <div className="flex flex-wrap gap-2">{analysis.marketGaps.map((g) => <Chip key={g} tone="miss">{g}</Chip>)}</div>
                </>)}
              </Section>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-accent p-5">
              <p className="text-sm">Your analysis is saved. Market, Learning and Jobs now use it.</p>
              <GoldLink to="/market">Continue to Market Intelligence</GoldLink>
            </div>
          </>
        )}

        <Section eyebrow="Or describe it" title="Map Your Experience To Skills">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Previous role</span>
              <input className={inputCls} value={prev} onChange={(e) => setPrev(e.target.value)} /></label>
            <label className="text-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Target role</span>
              <input className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)} /></label>
          </div>
          <label className="mt-4 block text-sm"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">What did you do? (one responsibility per line)</span>
            <textarea className={inputCls} rows={6} value={resp} onChange={(e) => setResp(e.target.value)} /></label>
          <button onClick={run} disabled={loading || !resp.trim()} className={`${btnCls} mt-5`}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Discovering…" : "Discover my skills"}
          </button>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          {found && <div className="mt-6"><SkillCards skills={found} dist={dist} /></div>}
        </Section>

        <Section eyebrow="Saved to your profile" title="Your Current Skills">
          <div className="flex flex-wrap gap-2">{d.skills.map((s) => <Chip key={s.name} tone={s.demonstrated ? "gold" : "neutral"}>{s.name}</Chip>)}</div>
        </Section>
      </div>
    </DashboardShell>
  );
}
