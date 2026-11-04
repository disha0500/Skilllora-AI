import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  ShieldCheck,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Award,
  Layers,
  FileCheck2,
  Loader2,
  ArrowRight,
  HelpCircle,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Section, Chip, SourceBadge } from "@/components/dashboard/Sections";
import {
  getCandidateLive,
  saveProfileLive,
  resetAyeshaDemoLive,
  type CandidateProfile,
} from "@/lib/dashboard-data";
import { StarEvidenceModal } from "@/components/dashboard/StarEvidenceModal";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Candidate Profile & Inclusive Settings — Skillora AI" },
      { name: "description", content: "Manage your career profile, 0% break penalty protection, and evidence-verified skills." },
      { property: "og:title", content: "Candidate Profile & Inclusive Settings — Skillora AI" },
      { property: "og:description", content: "Manage your career profile, 0% break penalty protection, and evidence-verified skills." },
    ],
  }),
  component: ProfilePage,
});

const AYESHA_DEFAULT = {
  name: "Ayesha Khan",
  email: "ayesha.khan@example.com",
  phone: "+91 98765 43210",
  location: "Lucknow, Uttar Pradesh, India",
  previousRole: "HR Operations Associate",
  targetRole: "Project Coordinator",
  totalExperience: 2.0,
  hasBreak: true,
  breakYears: 3.0,
  breakReason: "Maternity leave & family caregiving; ready and upskilled to re-enter the workforce",
  bio: "Experienced professional with 2 years in HR Operations handling multi-panel interview scheduling, cross-departmental coordination, and candidate onboarding. Returning from a 3-year career break with fully demonstrated transferable skills in project coordination, stakeholder communications, and schedule conflict resolution.",
};

const inputCls =
  "w-full rounded-lg border border-border bg-surface/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-surface";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function ProfilePage() {
  const qc = useQueryClient();

  const { data: candidate, isLoading, refetch } = useQuery<CandidateProfile>({
    queryKey: ["candidate-profile", "cand_ayesha_khan"],
    queryFn: () => getCandidateLive("cand_ayesha_khan"),
  });

  // Controlled form state
  const [name, setName] = useState(AYESHA_DEFAULT.name);
  const [email, setEmail] = useState(AYESHA_DEFAULT.email);
  const [phone, setPhone] = useState(AYESHA_DEFAULT.phone);
  const [location, setLocation] = useState(AYESHA_DEFAULT.location);
  const [previousRole, setPreviousRole] = useState(AYESHA_DEFAULT.previousRole);
  const [targetRole, setTargetRole] = useState(AYESHA_DEFAULT.targetRole);
  const [totalExperience, setTotalExperience] = useState(AYESHA_DEFAULT.totalExperience);
  const [hasBreak, setHasBreak] = useState(AYESHA_DEFAULT.hasBreak);
  const [breakYears, setBreakYears] = useState(AYESHA_DEFAULT.breakYears);
  const [breakReason, setBreakReason] = useState(AYESHA_DEFAULT.breakReason);
  const [bio, setBio] = useState(AYESHA_DEFAULT.bio);

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string>("All");

  // STAR evidence modal state
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<string | null>(null);

  // Sync state when query resolves
  useEffect(() => {
    if (candidate) {
      if (candidate.name) setName(candidate.name);
      if (candidate.email) setEmail(candidate.email);
      if (candidate.phone) setPhone(candidate.phone);
      if (candidate.location) setLocation(candidate.location);
      if (candidate.previous_role) setPreviousRole(candidate.previous_role);
      if (candidate.target_role) setTargetRole(candidate.target_role);
      if (candidate.total_years_experience !== undefined) setTotalExperience(candidate.total_years_experience);
      if (candidate.has_career_break !== undefined) setHasBreak(candidate.has_career_break);
      if (candidate.career_break_years !== undefined) setBreakYears(candidate.career_break_years);
      if (candidate.career_break_reason) setBreakReason(candidate.career_break_reason);
      if (candidate.bio) setBio(candidate.bio);
    }
  }, [candidate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfileLive({
        name,
        email,
        phone,
        location,
        previous_role: previousRole,
        target_role: targetRole,
        total_years_experience: Number(totalExperience),
        has_career_break: hasBreak,
        career_break_years: Number(breakYears),
        career_break_reason: breakReason,
        bio,
      });

      toast.success("Profile saved successfully with 0% penalty protections active!");
      qc.invalidateQueries({ queryKey: ["candidate-profile"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      refetch();
    } catch (err: any) {
      toast.error(`Save failed: ${err.message || "Backend error"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetAyeshaDemoLive();
      setName(AYESHA_DEFAULT.name);
      setEmail(AYESHA_DEFAULT.email);
      setPhone(AYESHA_DEFAULT.phone);
      setLocation(AYESHA_DEFAULT.location);
      setPreviousRole(AYESHA_DEFAULT.previousRole);
      setTargetRole(AYESHA_DEFAULT.targetRole);
      setTotalExperience(AYESHA_DEFAULT.totalExperience);
      setHasBreak(AYESHA_DEFAULT.hasBreak);
      setBreakYears(AYESHA_DEFAULT.breakYears);
      setBreakReason(AYESHA_DEFAULT.breakReason);
      setBio(AYESHA_DEFAULT.bio);

      toast.info("Ayesha Khan demo persona reset to original Hackfest state!");
      qc.invalidateQueries({ queryKey: ["candidate-profile"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      refetch();
    } catch (err: any) {
      toast.error(`Reset error: ${err.message || "Failed to reset"}`);
    } finally {
      setResetting(false);
    }
  };

  const skillsList = candidate?.skills || [];
  const evidenceList = candidate?.evidence_submissions || [];

  const filteredSkills =
    skillFilter === "All"
      ? skillsList
      : skillFilter === "Transferable"
      ? skillsList.filter((s) => s.is_transferable)
      : skillsList.filter((s) => s.category.toLowerCase().includes(skillFilter.toLowerCase()));

  // Count distribution
  const aiAssessedCount = skillsList.filter((s) => s.validation_status === "AI-Assessed").length;
  const humanValidatedCount = skillsList.filter((s) => s.validation_status === "Human-Validated").length;
  const selfDeclaredCount = skillsList.filter((s) => s.validation_status === "Self-Declared").length;
  const evidenceSubmittedCount = skillsList.filter((s) => s.validation_status === "Evidence Submitted").length;

  return (
    <DashboardShell title="Profile & Settings">
      <div className="space-y-8 animate-rise">
        {/* Header Hero Banner */}
        <section className="panel shadow-gold relative overflow-hidden p-6 md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-primary/40 bg-gold/10 font-display text-2xl font-bold text-gold">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "AK"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-3xl font-bold text-champagne">{name}</h1>
                  <span className="rounded-full border border-primary/40 bg-accent px-2.5 py-0.5 text-xs font-semibold text-champagne">
                    Inclusive Career Returnee
                  </span>
                  <SourceBadge source="live" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {previousRole} <span className="text-gold">➔</span> {targetRole} · {location}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Chip tone="gold">
                    <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-gold" />
                    Career Break: {breakYears} yrs (0% Algorithmic Penalty)
                  </Chip>
                  <Chip tone="neutral">Prior Experience: {totalExperience} yrs</Chip>
                  <Chip tone="gold">AI-Assessed Skills: {aiAssessedCount + humanValidatedCount}/{skillsList.length}</Chip>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={resetting}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {resetting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                Reset Demo Persona
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shadow-gold"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* SAP Hackfest Core Feature: Inclusive Career Break & Zero-Penalty Protection */}
        <Section
          eyebrow="SAP Hackfest 2026 Core Innovation"
          title="Inclusive Career Break & Protection Status"
        >
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 md:p-6 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-lg font-semibold text-champagne">
                    Zero-Penalty Career Break Protection Active
                  </h3>
                </div>
                <p className="max-w-2xl text-xs text-muted-foreground leading-relaxed">
                  Unlike conventional applicant tracking systems (ATS) that automatically downrank candidates with resume gaps, 
                  <strong> SkillBridge AI's Inclusive Matching Agent (Agent 4)</strong> and <strong>Bias Audit Agent (Agent 5)</strong> enforce
                  a strict <strong>0% penalty rule</strong>. Candidates are evaluated purely on demonstrated and transferable competencies.
                </p>
              </div>
              <div className="shrink-0 rounded-lg border border-primary/40 bg-surface px-4 py-3 text-center">
                <p className="font-display text-3xl font-bold text-gold">0%</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Gap Penalty Applied</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 pt-4 border-t border-primary/20 md:grid-cols-3">
              <div>
                <label className={labelCls}>Career Break Status</label>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={hasBreak}
                      onChange={(e) => setHasBreak(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
                  </label>
                  <span className="text-sm font-medium">
                    {hasBreak ? "Protected Career Break" : "Continuous Employment"}
                  </span>
                </div>
              </div>

              <div>
                <label className={labelCls}>Break Duration (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="20"
                  className={inputCls}
                  value={breakYears}
                  onChange={(e) => setBreakYears(Number(e.target.value))}
                  disabled={!hasBreak}
                />
              </div>

              <div>
                <label className={labelCls}>Inclusion Audit Seal</label>
                <div className="rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span className="text-foreground">Audited by Bias Agent: 100% Demographic Neutrality</span>
                </div>
              </div>
            </div>

            {hasBreak && (
              <div className="mt-4">
                <label className={labelCls}>Career Break Context / Re-entry Note</label>
                <input
                  type="text"
                  className={inputCls}
                  value={breakReason}
                  onChange={(e) => setBreakReason(e.target.value)}
                  placeholder="e.g. Maternity leave, family caregiving, health recovery, or professional sabbatical..."
                />
              </div>
            )}
          </div>
        </Section>

        {/* Personal & Career Information Form */}
        <Section eyebrow="Candidate Details" title="Personal & Professional Information">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="text"
                  className={inputCls}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <input
                  type="text"
                  className={inputCls}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>Previous / Current Role</label>
                <input
                  type="text"
                  className={inputCls}
                  value={previousRole}
                  onChange={(e) => setPreviousRole(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Target Career Role</label>
                <input
                  type="text"
                  className={inputCls}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Total Years of Work Experience</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className={inputCls}
                  value={totalExperience}
                  onChange={(e) => setTotalExperience(Number(e.target.value))}
                />
              </div>

              <div className="flex items-end">
                <div className="rounded-lg border border-border bg-surface/40 p-3 text-xs text-muted-foreground w-full">
                  <span className="font-semibold text-champagne">Career Pathway:</span> {previousRole} ➔ {targetRole}
                  <span className="block mt-0.5 text-[11px]">Transferable competencies dynamically matched by Agent 1 & Agent 4.</span>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Professional Summary / Bio</label>
              <textarea
                rows={4}
                className={inputCls}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Highlight your previous responsibilities, transferable strengths, and motivation for your target role..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile Changes
              </button>
            </div>
          </form>
        </Section>

        {/* 4-Tier Demonstrated Skills Taxonomy */}
        <Section
          eyebrow="Evidence-Based Validation"
          title="Discovered Skills & 4-Tier Taxonomy"
          action={
            <div className="flex flex-wrap gap-1">
              {["All", "Transferable", "Technical", "Soft", "Operational"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSkillFilter(f)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    skillFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-primary/40 bg-accent/30 p-3.5">
              <p className="text-[11px] uppercase tracking-wider text-gold font-semibold">AI-Assessed</p>
              <p className="font-display text-2xl font-bold text-champagne">{aiAssessedCount}</p>
              <p className="text-[11px] text-muted-foreground">Validated by Agent 6</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/60 p-3.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Evidence Submitted</p>
              <p className="font-display text-2xl font-bold text-foreground">{evidenceSubmittedCount}</p>
              <p className="text-[11px] text-muted-foreground">Pending verification</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/60 p-3.5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Self-Declared</p>
              <p className="font-display text-2xl font-bold text-foreground">{selfDeclaredCount}</p>
              <p className="text-[11px] text-muted-foreground">Initial discovery</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3.5">
              <p className="text-[11px] uppercase tracking-wider text-champagne font-semibold">Human-Validated</p>
              <p className="font-display text-2xl font-bold text-champagne">{humanValidatedCount}</p>
              <p className="text-[11px] text-muted-foreground">Recruiter approved</p>
            </div>
          </div>

          {filteredSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills match the selected filter.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSkills.map((s) => {
                const isAiAssessed = s.validation_status === "AI-Assessed" || s.validation_status === "Human-Validated";
                return (
                  <article
                    key={s.id || s.name}
                    className="rounded-xl border border-border bg-surface/60 p-4 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{s.name}</p>
                          {s.is_transferable && (
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-gold">
                              Transferable
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.category} · {s.proficiency}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-xl text-gold">
                          {Math.round(s.confidence_score)}%
                        </span>
                        <p className="text-[10px] text-muted-foreground">Confidence</p>
                      </div>
                    </div>

                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gold transition-all duration-500"
                        style={{ width: `${s.confidence_score}%` }}
                      />
                    </div>

                    {s.transferred_from && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Transferred from: <span className="text-champagne font-medium">{s.transferred_from}</span>
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
                      <Chip tone={isAiAssessed ? "gold" : "neutral"}>
                        {isAiAssessed && <CheckCircle2 className="mr-1 inline h-3 w-3 text-success" />}
                        {s.validation_status}
                      </Chip>

                      <button
                        type="button"
                        onClick={() => setSelectedSkillForEvidence(s.name)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-medium text-champagne hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Sparkles className="h-3 w-3" />
                        {isAiAssessed ? "Re-evaluate STAR" : "Submit STAR Evidence"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Section>

        {/* Verified STAR Evidence History (Agent 6 Output) */}
        <Section
          eyebrow="Agent 6 Audit Trail"
          title={`Evidence Validation History (${evidenceList.length} Submissions)`}
        >
          {evidenceList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <FileCheck2 className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm">No STAR evidence submissions logged yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select any skill above and click "Submit STAR Evidence" to have Agent 6 evaluate your practical competency.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {evidenceList.map((ev) => (
                <article
                  key={ev.id}
                  className="rounded-xl border border-border bg-surface/70 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Competency</p>
                      <h4 className="text-base font-semibold text-champagne">{ev.skill_name}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip tone="gold">{ev.validation_status}</Chip>
                      <div className="text-right">
                        <span className="font-display text-2xl font-bold text-gold">
                          {Math.round(ev.validation_score)}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase tracking-wider">Agent 6 Rubric Evaluation:</span>
                      <p className="mt-1 text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm bg-background/50 p-3 rounded-lg border border-border/40">
                        {ev.rubric_feedback}
                      </p>
                    </div>

                    {ev.missing_details && (
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Detail recommendations: </span>
                        {ev.missing_details}
                      </p>
                    )}

                    {ev.suggested_followup_tasks && (
                      <p className="text-champagne">
                        <span className="font-medium text-gold">Suggested practical next step: </span>
                        {ev.suggested_followup_tasks}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* STAR Evidence Modal */}
      {selectedSkillForEvidence && (
        <StarEvidenceModal
          isOpen={!!selectedSkillForEvidence}
          onClose={() => setSelectedSkillForEvidence(null)}
          skillName={selectedSkillForEvidence}
          candidateId="cand_ayesha_khan"
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </DashboardShell>
  );
}
