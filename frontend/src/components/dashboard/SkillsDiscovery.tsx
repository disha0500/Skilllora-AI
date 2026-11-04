import { useRef, useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FileUp, Loader2, ShieldCheck, Sparkles, CheckCircle2, BookmarkCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Chip, GoldLink, Section, SourceBadge } from "@/components/dashboard/Sections";
import {
  analyzeResumeLive, dashboardQuery, discoverSkillsLive,
  type DiscoveredSkill, type ResumeAnalysis,
} from "@/lib/dashboard-data";
import { extractResumeText } from "@/lib/resume-extract";
import { StarEvidenceModal } from "@/components/dashboard/StarEvidenceModal";
import { toast } from "sonner";

const AYESHA_RESUME_TEXT = `AYESHA KHAN
Email: ayesha.khan@example.com | Phone: +91 98765 43210 | Location: Lucknow, India
Target: Project Coordinator (Inclusive Career Returnee)

PROFESSIONAL SUMMARY:
Results-driven operations professional with 2 years in HR Operations at Apex Workforce Solutions, followed by a 3-year protected career break for family caregiving. Bringing demonstrated, transferable strengths in multi-panel interview scheduling, cross-functional stakeholder communications, calendar conflict resolution, and record documentation. Seeking transition to Project Coordinator role.

WORK EXPERIENCE:
HR Operations Associate — Apex Workforce Solutions, Lucknow (2020 – 2022)
• Scheduled 120+ multi-stage interviews per month across 4 technical panels, handling real-time calendar reallocations with zero candidate dropouts.
• Served as primary communication liaison between candidates and hiring managers, answering inquiries, sending briefing notes, and gathering evaluation scorecards.
• Coordinated weekly hiring syncs with 8 engineering department leads to track requisition milestones and resolve scheduling bottlenecks.
• Maintained 100% compliant employee records, background verification trackers, and interview archival logs in Microsoft Excel and HRIS portals.
• Solved urgent interview collisions by coordinating standby interviewers within 15-minute response windows.
• Followed up continuously on pending action items, vendor background verifications, and onboarding document submissions.

CAREER BREAK (2022 – 2025):
• 3-Year family caregiving & upskilling pause.
• Completed project coordination & agile methodology foundations online. Ready for immediate full-time employment.

CORE & TRANSFERABLE COMPETENCIES:
Planning and coordination, Stakeholder communication, Task management, Problem solving, Documentation, Calendar scheduling, Microsoft Excel & JIRA tracking.`;

const DEFAULT_RESP = [
  "Interview scheduling",
  "Communicating with candidates",
  "Coordinating with hiring managers",
  "Maintaining employee records",
  "Managing scheduling conflicts",
  "Following up on pending activities",
].join("\n");

const ROLE_PRESETS = [
  {
    name: "HR Ops ➔ Project Coordinator (Ayesha)",
    prev: "HR Operations Associate",
    target: "Project Coordinator",
    resp: [
      "Interview scheduling",
      "Communicating with candidates",
      "Coordinating with hiring managers",
      "Maintaining employee records",
      "Managing scheduling conflicts",
      "Following up on pending activities",
    ].join("\n"),
  },
  {
    name: "Customer Support ➔ Operations Manager",
    prev: "Customer Support Lead",
    target: "Operations Manager",
    resp: [
      "Handling tier-3 client escalations",
      "Monitoring team SLAs and turnaround metrics",
      "Coordinating with product engineers on bug fixes",
      "Maintaining internal knowledge bases and SOPs",
      "Managing daily shift allocation and coverage",
      "Conducting monthly performance reviews",
    ].join("\n"),
  },
  {
    name: "Executive Assistant ➔ Scrum Master",
    prev: "Executive Assistant",
    target: "Product Scrum Master",
    resp: [
      "Managing executive calendars and cross-functional meetings",
      "Documenting meeting minutes and tracking action items",
      "Facilitating alignment across department leads",
      "Resolving scheduling bottlenecks across projects",
      "Drafting status reports for leadership",
      "Following up on cross-team deliverables",
    ].join("\n"),
  },
];

const TIER_TONE: Record<string, "gold" | "neutral"> = {
  "Human-Validated": "gold", "AI-Assessed": "gold", "Evidence Submitted": "neutral", "Self-Declared": "neutral",
};
const inputCls = "w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors";
const btnCls = "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 shadow-gold";
const errMsg = (e: unknown) => `Could not reach the AI agents. Is the backend running on port 8000? (${e instanceof Error ? e.message : "error"})`;

function SkillCards({
  skills,
  dist,
  onValidateSkill,
}: {
  skills: DiscoveredSkill[];
  dist: Record<string, number>;
  onValidateSkill?: (skillName: string) => void;
}) {
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {Object.entries(dist).map(([k, v]) => (
          <Chip key={k} tone={TIER_TONE[k] ?? "neutral"}>
            {k}: {v}
          </Chip>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((s) => {
          const isAiAssessed = s.status === "AI-Assessed" || s.status === "Human-Validated";
          return (
            <article key={s.name} className="rounded-xl border border-border bg-surface/60 p-4 transition-colors hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{s.name}</p>
                    {isAiAssessed && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.category} · {s.proficiency}</p>
                </div>
                <span className="font-display text-2xl text-gold">{s.confidence}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${s.confidence}%` }} />
              </div>
              {s.transferredFrom && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Transferred from: <span className="text-champagne font-medium">{s.transferredFrom}</span>
                </p>
              )}
              {s.relevance && <p className="mt-1 text-xs text-muted-foreground">{s.relevance}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2.5">
                <div className="flex flex-wrap gap-1.5">
                  <Chip tone={TIER_TONE[s.status] ?? "neutral"}>{s.status}</Chip>
                  {s.transferable && <Chip tone="gold">Transferable</Chip>}
                </div>
                {onValidateSkill && (
                  <button
                    type="button"
                    onClick={() => onValidateSkill(s.name)}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-accent px-2.5 py-1 text-xs font-medium text-champagne hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-gold" />
                    {isAiAssessed ? "Re-evaluate" : "Validate (STAR)"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
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

  // STAR Evidence Modal state
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<string | null>(null);

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
      toast.success(`Loaded resume: ${f.name}`);
    } catch (e) {
      setResumeError(e instanceof Error ? e.message : "Could not read this file.");
    } finally {
      setReading(false);
    }
  }

  function handlePreFillAyeshaResume() {
    setFileName("Ayesha_Khan_Resume.txt");
    setResumeText(AYESHA_RESUME_TEXT);
    setResumeTarget("Project Coordinator");
    setResumeError(null);
    toast.info("Ayesha Khan's resume loaded! Click 'Analyze my resume' to run all AI agents.");
  }

  function handleApplyPreset(p: typeof ROLE_PRESETS[0]) {
    setPrev(p.prev);
    setTarget(p.target);
    setResp(p.resp);
    toast.info(`Applied role transition: ${p.name}`);
  }

  async function analyze() {
    setAnalyzing(true);
    setResumeError(null);
    try {
      const res = await analyzeResumeLive(resumeText, resumeTarget.trim());
      setAnalysis(res);
      toast.success(`Resume analyzed! Discovered ${res.skills.length} skills with 0% break penalty protection.`);
      qc.invalidateQueries({ queryKey: ["dashboard"] }); // Market / Learning / Jobs now use this analysis
      qc.invalidateQueries({ queryKey: ["candidate-profile"] });
    } catch (e) {
      setResumeError(errMsg(e));
      toast.error("Analysis failed. Backend might be reloading.");
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
      toast.success(`Discovered ${r.skills.length} transferable and core skills from your experience!`);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["candidate-profile"] });
    } catch (e) {
      setError(errMsg(e));
      toast.error("Discovery error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell title="Skills Discovery">
      <div className="space-y-6">
        <SourceBadge source={d.source} />

        <Section eyebrow="Step 1 · AI Resume Ingestion" title="Upload or Pre-fill Your Resume">
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Upload a PDF, Word (.docx) or text resume. All 6 AI agents run on it: skills discovery, job matches, SAP learning roadmap, and bias audit. <strong>Career breaks are never penalised.</strong>
          </p>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePreFillAyeshaResume}
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-accent px-4 py-2 text-xs font-semibold text-champagne hover:bg-primary/20 transition-colors shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              ✨ 1-Click Pre-fill Ayesha Khan Resume (Hackfest Demo)
            </button>
            <span className="text-xs text-muted-foreground">Instant test persona: 2 yrs HR Ops ➔ 3 yr break ➔ Project Coordinator</span>
          </div>

          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-accent/40 px-6 py-8 text-center transition-colors hover:border-primary hover:bg-accent"
          >
            {reading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <FileUp className="h-6 w-6 text-primary" />}
            <span className="text-sm font-medium">{reading ? "Reading file…" : fileName ? fileName : "Click to choose your resume"}</span>
            <span className="text-xs text-muted-foreground">PDF, DOCX, TXT, MD</span>
          </button>

          <label className="mt-5 block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Resume text (edit or paste if needed)</span>
            <textarea
              className={inputCls}
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Your resume text appears here after upload — or click '1-Click Pre-fill Ayesha Khan Resume' above."
            />
          </label>

          <label className="mt-4 block text-sm md:max-w-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Target role</span>
            <input className={inputCls} value={resumeTarget} onChange={(e) => setResumeTarget(e.target.value)} />
          </label>

          <button onClick={analyze} disabled={analyzing || resumeText.trim().length < 20} className={`${btnCls} mt-5`}>
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {analyzing ? "AI Agents are analyzing & auditing…" : "Analyze my resume with AI Orchestrator"}
          </button>
          {resumeError && <p className="mt-4 text-sm text-destructive">{resumeError}</p>}
        </Section>

        {analysis && (
          <>
            <Section eyebrow="Central Career Orchestrator Summary" title={`${analysis.candidate.name} → ${analysis.candidate.targetRole}`}>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {analysis.candidate.previousRole && <Chip>{analysis.candidate.previousRole}</Chip>}
                {analysis.candidate.hasBreak && (
                  <Chip tone="gold">
                    <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-gold" />
                    {analysis.candidate.breakYears}-year career break · 0% penalty
                  </Chip>
                )}
                <Chip tone="gold">
                  <ShieldCheck className="mr-1 inline h-3 w-3" />
                  Fairness Score: {analysis.fairness.score}%
                </Chip>
              </div>
              {analysis.fairness.summary && (
                <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-gold">Bias Audit Agent Seal: </span>
                  {analysis.fairness.summary}
                </div>
              )}
            </Section>

            <Section
              eyebrow="Agent 1: Skills Discovery Agent"
              title={`${analysis.skills.length} Skills Discovered & Categorized`}
            >
              <p className="mb-4 text-xs text-muted-foreground">
                Click <strong>"Validate (STAR)"</strong> on any skill to submit practical evidence to Agent 6 and upgrade it to <strong className="text-gold">AI-Assessed</strong>.
              </p>
              <SkillCards
                skills={analysis.skills}
                dist={analysis.distribution}
                onValidateSkill={(name) => setSelectedSkillForEvidence(name)}
              />
            </Section>

            <div className="grid gap-6 lg:grid-cols-2">
              <Section eyebrow="Agent 4: Inclusive Matching Agent" title="Best-Matched Opportunities">
                <ul className="space-y-3">
                  {analysis.matches.map((m) => (
                    <li key={m.title + m.company} className="flex items-center justify-between gap-3 text-sm rounded-lg border border-border/50 p-3 bg-surface/40">
                      <span>
                        <span className="font-medium text-foreground">{m.title}</span>
                        <span className="block text-xs text-muted-foreground">{m.company} · {m.location}</span>
                      </span>
                      <span className="font-display text-2xl text-gold">{m.score}%</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section eyebrow="Agent 3: Learning Pathway Agent" title="Recommended SAP Learning Pathways">
                <ul className="space-y-3 text-sm">
                  {analysis.courses.map((c) => (
                    <li key={c.title} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 p-3 bg-surface/40">
                      <span className="text-foreground">{c.title}</span>
                      {c.url ? (
                        <a className="shrink-0 text-xs text-primary hover:underline font-semibold" href={c.url} target="_blank" rel="noreferrer">
                          {c.provider} ↗
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">{c.provider}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {analysis.marketGaps.length > 0 && (
                  <>
                    <p className="mb-2 mt-5 text-xs uppercase tracking-widest text-muted-foreground">Market skill gaps</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.marketGaps.map((g) => <Chip key={g} tone="miss">{g}</Chip>)}
                    </div>
                  </>
                )}
              </Section>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-accent p-5">
              <div>
                <p className="text-sm font-medium text-champagne">Your comprehensive multi-agent analysis is active.</p>
                <p className="text-xs text-muted-foreground">Market Intelligence, Learning Pathways, and Job Matching are all synchronized.</p>
              </div>
              <GoldLink to="/market">Continue to Market Intelligence</GoldLink>
            </div>
          </>
        )}

        <Section eyebrow="Step 2 · Cross-Occupational Skill Transfer" title="Map Your Experience To Competencies">
          <p className="mb-4 text-xs text-muted-foreground">
            Enter your daily responsibilities or choose a common career transition preset below. Agent 1 will extract competencies and map their transferable relevance to your target occupation.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Presets:</span>
            {ROLE_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Previous role</span>
              <input className={inputCls} value={prev} onChange={(e) => setPrev(e.target.value)} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Target role</span>
              <input className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)} />
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">What did you do? (one responsibility per line)</span>
            <textarea className={inputCls} rows={6} value={resp} onChange={(e) => setResp(e.target.value)} />
          </label>

          <button onClick={run} disabled={loading || !resp.trim()} className={`${btnCls} mt-5`}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Agent 1 is discovering competencies…" : "Discover my skills"}
          </button>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {found && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-champagne">Discovered & Transferable Competencies</h4>
                <span className="text-xs text-muted-foreground">Persisted to candidate database</span>
              </div>
              <SkillCards
                skills={found}
                dist={dist}
                onValidateSkill={(name) => setSelectedSkillForEvidence(name)}
              />
            </div>
          )}
        </Section>

        <Section eyebrow="Profile Synchronization" title="Your Currently Saved Skills">
          <p className="mb-3 text-xs text-muted-foreground">
            Skills recorded in your candidate profile. Click any skill to submit or view practical STAR evidence evaluated by Agent 6.
          </p>
          <div className="flex flex-wrap gap-2">
            {d.skills.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setSelectedSkillForEvidence(s.name)}
                className="group inline-flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <Chip tone={s.demonstrated ? "gold" : "neutral"}>
                  {s.demonstrated && <CheckCircle2 className="mr-1 inline h-3 w-3 text-success" />}
                  {s.name}
                  <Sparkles className="ml-1 inline h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
                </Chip>
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* STAR Evidence Evaluation Modal */}
      {selectedSkillForEvidence && (
        <StarEvidenceModal
          isOpen={!!selectedSkillForEvidence}
          onClose={() => setSelectedSkillForEvidence(null)}
          skillName={selectedSkillForEvidence}
          candidateId="cand_ayesha_khan"
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["dashboard"] });
            qc.invalidateQueries({ queryKey: ["candidate-profile"] });
          }}
        />
      )}
    </DashboardShell>
  );
}
