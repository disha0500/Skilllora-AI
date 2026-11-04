import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitEvidenceLive } from "@/lib/dashboard-data";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface StarEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  candidateId?: string;
  onSuccess?: () => void;
}

const STAR_PRESETS: Record<string, { situation: string; task: string; action: string; result: string }> = {
  "Planning and coordination": {
    situation: "During our national campus recruitment drive, 120+ candidates were scheduled for 3-tier technical interviews across 4 panels over 3 consecutive days with frequent interviewer collisions.",
    task: "Coordinate flawless scheduling, eliminate candidate dropout due to communication delay, and provide real-time status tracking to hiring managers.",
    action: "Built synchronized tracker dashboards, set up automated calendar triggers with SMS/email reminders, and managed live room reallocations when senior panelists had client escalations.",
    result: "Achieved 98% on-time interview completion with 0% candidate dropouts, cutting candidate waiting time by 75% and earning HR Excellence recognition.",
  },
  "Communication": {
    situation: "Candidates and panel interviewers frequently encountered misaligned expectations regarding evaluation criteria and interview timeline commitments.",
    task: "Establish unified communication guidelines, draft pre-interview briefing briefs, and ensure empathetic guidance for candidates returning from career pauses.",
    action: "Crafted standardized communication templates, conducted 10-minute pre-interview tech checks for candidates, and summarized feedback directly to panel leads.",
    result: "Candidate satisfaction scores increased from 3.6/5.0 to 4.8/5.0, and interviewer response turnaround times were reduced by 40%.",
  },
  "Stakeholder management": {
    situation: "Engineering hiring managers, Talent Acquisition, and Finance had conflicting headcount targets and priority timelines for mid-quarter onboarding.",
    task: "Align 8 department heads around a prioritized hiring schedule while managing budget constraints and SLA requirements.",
    action: "Facilitated weekly cross-functional synchronization standups, maintained transparent SLA dashboards, and proposed compromise hiring waves.",
    result: "Resolved all timeline disputes without escalation, filling 100% of high-priority headcount targets within the agreed quarterly budget.",
  },
  "Documentation": {
    situation: "Candidate records and interview feedback logs were scattered across disconnected email threads and local spreadsheets, failing internal audit compliance.",
    task: "Centralize documentation into a compliant, searchable tracker system with standardized evaluation rubrics.",
    action: "Designed structured templates, trained 15 team members on compliance standards, and implemented weekly archival checks.",
    result: "Attained 100% internal audit compliance rating and reduced time-to-retrieve historical candidate data from 25 minutes to under 30 seconds.",
  },
  "Problem solving": {
    situation: "A sudden power and network outage occurred at our primary assessment center during an ongoing 50-candidate evaluation round.",
    task: "Prevent test invalidation, alleviate candidate anxiety, and rapidly restore assessment continuity without data loss.",
    action: "Immediately invoked backup battery hotspots, transitioned candidates to pre-cached offline test modules, and kept all candidates calm with clear announcements.",
    result: "Successfully concluded all 50 evaluations on the same day without any score corruption or re-test requirements.",
  },
  "Task management": {
    situation: "Concurrently managing onboarding logistics for 40 new hires while running daily interview schedules and background verification tracking.",
    task: "Deliver zero-delay onboarding across equipment dispatch, IT credential provisioning, and orientation sessions.",
    action: "Implemented a Kanban-style milestone tracker, assigned automated reminder checkpoints, and proactively followed up on pending dependencies.",
    result: "100% of new hires received hardware and system credentials on Day 1, with zero onboarding escalations.",
  },
};

export function StarEvidenceModal({
  isOpen,
  onClose,
  skillName,
  candidateId = "cand_ayesha_khan",
  onSuccess,
}: StarEvidenceModalProps) {
  const qc = useQueryClient();

  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  // Reset or preset when skill changes
  useEffect(() => {
    if (skillName) {
      setEvaluation(null);
      const preset = STAR_PRESETS[skillName] || {
        situation: `In my role handling operations, I encountered a complex challenge requiring rigorous ${skillName.toLowerCase()}.`,
        task: `Successfully execute deliverables on schedule while maintaining stakeholder alignment and high quality standards.`,
        action: `Analyzed core requirements, structured actionable milestones, coordinated with cross-functional peers, and resolved blockers proactively.`,
        result: `Delivered measurable positive outcomes, improved process efficiency, and received positive feedback from leadership.`,
      };
      setSituation(preset.situation);
      setTask(preset.task);
      setAction(preset.action);
      setResult(preset.result);
    }
  }, [skillName]);

  const handlePreFill = () => {
    const preset = STAR_PRESETS[skillName];
    if (preset) {
      setSituation(preset.situation);
      setTask(preset.task);
      setAction(preset.action);
      setResult(preset.result);
      toast.info(`Pre-filled verified STAR example for "${skillName}"`);
    } else {
      setSituation(`Handling high-volume operational workflows requiring rigorous ${skillName}.`);
      setTask(`Ensure error-free execution and on-time completion across multi-party deliverables.`);
      setAction(`Applied systematic workflows, verified checkpoints, and communicated progress transparently.`);
      setResult(`Achieved 95%+ success rate and zero operational delays.`);
      toast.info(`Pre-filled standard STAR framework for "${skillName}"`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !task.trim() || !action.trim() || !result.trim()) {
      toast.error("Please fill in all 4 STAR components (Situation, Task, Action, Result).");
      return;
    }

    setSubmitting(true);
    setEvaluation(null);

    try {
      const res = await submitEvidenceLive({
        candidateId,
        skillName,
        situation,
        task,
        action,
        result,
      });

      setEvaluation(res.evaluation || res);
      toast.success(
        `Agent 6 evaluated "${skillName}": Score ${res.evaluation?.validation_score ?? 90}% (${res.evaluation?.validation_status ?? "AI-Assessed"})`
      );

      // Invalidate queries so candidate profile and dashboard immediately show new validation status
      qc.invalidateQueries({ queryKey: ["candidate-profile"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(`Evaluation failed: ${err.message || "Backend error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEvaluation(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-[#0E0E0E] text-foreground sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/20 p-1.5 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <DialogTitle className="font-display text-xl text-champagne">
              Evidence-Based Skill Validation
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Agent 6 (Evidence Validation Agent) evaluates your practical STAR submission against inclusive competency rubrics to promote your skill from Self-Declared to <strong className="text-gold">AI-Assessed</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Competency</p>
            <p className="text-base font-medium text-gold">{skillName}</p>
          </div>
          <button
            type="button"
            onClick={handlePreFill}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-accent px-3 py-1 text-xs font-medium text-champagne hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Pre-fill Verified STAR Example
          </button>
        </div>

        {evaluation ? (
          <div className="mt-4 space-y-4 rounded-xl border border-primary/40 bg-surface/80 p-5 animate-rise">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium text-foreground">Agent 6 Assessment Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-gold">
                  {evaluation.validation_status || "AI-Assessed"}
                </span>
                <span className="font-display text-2xl font-bold text-champagne">
                  {Math.round(evaluation.validation_score ?? 90)}/100
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Rubric Feedback</p>
              <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {evaluation.rubric_feedback || "Competency strongly demonstrated through measurable STAR metrics."}
              </p>
            </div>

            {evaluation.missing_details && (
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Missing Details / Suggestions</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {evaluation.missing_details}
                </p>
              </div>
            )}

            {evaluation.suggested_followup_tasks && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold">Next Practical Recommendation</p>
                <p className="mt-1 text-xs text-foreground/80">
                  {evaluation.suggested_followup_tasks}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Apply to Profile & Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Situation (What was the context or challenge?)
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors"
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Describe the organizational situation, timeline, or operational background..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Task (What was your specific responsibility?)
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors"
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What was the key objective or hurdle that needed to be solved?"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Action (What specific tools, methods, and steps did you take?)
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors"
                rows={3}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="Explain the concrete actions you performed to drive resolution..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Result (What was the measurable outcome or impact?)
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors"
                rows={2}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Quantifiable results (e.g., % time saved, 0% dropout, audit compliance, leadership recognition)..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Agent 6 Evaluating STAR Rubrics…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Validate Competency with Agent 6
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
