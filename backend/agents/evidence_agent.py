"""Agent 6: Evidence Validation Agent for SkillBridge AI.

Evaluates candidate-submitted evidence (STAR methodology), assesses relevance and depth,
identifies gaps, suggests practical follow-up tasks, and transitions skills to 'AI-Assessed'.
"""

from typing import Any, Dict, Optional
from services.llm_client import llm_client
from database.models import SkillValidationStatus


class EvidenceValidationAgent:
    """Specialist Agent evaluating practical candidate competency evidence."""

    def __init__(self):
        self.role_name = "Evidence Validation Agent"
        self.version = "2.0"

    def evaluate_evidence(
        self,
        skill_name: str,
        situation: Optional[str] = None,
        task: Optional[str] = None,
        action: Optional[str] = None,
        result: Optional[str] = None,
        raw_text: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Evaluates candidate-submitted proof against practical competency rubrics."""
        combined_text = f"Skill: {skill_name}\nSituation: {situation or ''}\nTask: {task or ''}\nAction: {action or ''}\nResult: {result or ''}\nDescription: {raw_text or ''}".strip()

        # Step 1: LLM evaluation if available
        prompt = f"""
You are the Evidence Validation Agent in SkillBridge AI (SAP Hackfest 2026).
Evaluate the candidate's practical evidence for the skill '{skill_name}':
Evidence submitted:
{combined_text}

Evaluate across:
1. Relevance of evidence to the competency (0-30 pts)
2. Concrete action taken and methodology demonstrated (0-35 pts)
3. Measurable outcome, metric, or tangible impact (0-35 pts)

Provide:
- validation_score (0-100)
- rubric_feedback (explain why this score was awarded)
- missing_details (what information is absent or vague)
- suggested_followup_tasks (practical project, exercise, or STAR enhancement)
"""
        llm_response = llm_client.generate_json(
            prompt,
            system_instruction="Output JSON with keys: 'validation_score', 'validation_status', 'rubric_feedback', 'missing_details', 'suggested_followup_tasks', 'is_evidence_sufficient'."
        )
        if llm_response and "validation_score" in llm_response:
            # Enforce validation status designation (distinct from Human-Validated)
            score = float(llm_response.get("validation_score", 75.0))
            llm_response["validation_status"] = (
                SkillValidationStatus.AI_ASSESSED.value if score >= 70.0
                else SkillValidationStatus.EVIDENCE_SUBMITTED.value
            )
            llm_response["agent"] = self.role_name
            return llm_response

        # Step 2: Rule-based heuristic STAR evaluation
        text_lower = combined_text.lower()
        score = 0.0
        feedback_points = []
        missing = []
        followup = []

        # Criteria 1: Relevance (up to 30 pts)
        skill_keywords = skill_name.lower().split()
        relevance_hits = sum(1 for kw in skill_keywords if kw in text_lower)
        relevance_score = min(relevance_hits * 15.0 + 10.0, 30.0)
        score += relevance_score
        feedback_points.append(f"Relevance: {relevance_score}/30 pts based on contextual alignment with {skill_name}.")

        # Criteria 2: Specific actions taken (up to 35 pts)
        has_action_words = any(w in text_lower for w in ["designed", "built", "led", "coordinated", "scheduled", "aligned", "organized", "automated", "negotiated", "executed", "created"])
        action_score = 30.0 if has_action_words and len(combined_text) > 80 else 15.0
        score += action_score
        feedback_points.append(f"Demonstrated Action: {action_score}/35 pts for personal agency and methodology.")

        # Criteria 3: Measurable outcome or impact (up to 35 pts)
        has_metrics = any(char.isdigit() for char in combined_text) or any(w in text_lower for w in ["reduced", "increased", "achieved", "completed", "%", "hours", "days", "rate", "saved"])
        if has_metrics:
            result_score = 30.0
            feedback_points.append(f"Impact & Results: {result_score}/35 pts. Verifiable outcome or operational metrics detected.")
        else:
            result_score = 12.0
            missing.append("Include quantified results (e.g. turnaround time reduction, percentage improved, or volume handled).")
            feedback_points.append(f"Impact & Results: {result_score}/35 pts. Lacks concrete metric.")
        score += result_score

        # Check if STAR structure is well formed
        if not action or len(action.strip()) < 15:
            missing.append("Detail the specific actions you personally undertook rather than general team efforts.")

        if score >= 70:
            status = SkillValidationStatus.AI_ASSESSED.value
            followup.append(f"Prepare to articulate this STAR example during technical or behavioral interviews for {skill_name}.")
        else:
            status = SkillValidationStatus.EVIDENCE_SUBMITTED.value
            followup.append(f"Complete a practical scenario exercise or mini-case study on {skill_name} to strengthen validation.")

        total_score = min(round(score, 1), 98.0)

        return {
            "agent": self.role_name,
            "version": self.version,
            "skill_name": skill_name,
            "validation_score": total_score,
            "validation_status": status,
            "is_evidence_sufficient": total_score >= 70.0,
            "rubric_feedback": " ".join(feedback_points),
            "missing_details": " ".join(missing) if missing else "Evidence provides comprehensive operational context.",
            "suggested_followup_tasks": " ".join(followup),
            "verification_disclaimer": "AI-Assessed: Evaluated via algorithmic STAR rubric. Not independently verified by third-party human assessor."
        }


evidence_agent = EvidenceValidationAgent()
