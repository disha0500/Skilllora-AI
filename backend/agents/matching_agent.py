"""Agent 4: Inclusive Matching Agent for SkillBridge AI.

Matches candidates based on demonstrated competencies, evaluates cross-occupational
transferable skills, and guarantees ZERO penalty for career breaks or non-traditional paths.
"""

from typing import Any, Dict, List
from services.llm_client import llm_client
from database.db import db_helper


class InclusiveMatchingAgent:
    """Specialist Agent delivering fair, skills-based, and transferable-inclusive job matching."""

    def __init__(self):
        self.role_name = "Inclusive Matching Agent"
        self.version = "2.0"

    def match_jobs(
        self,
        candidate_data: Dict[str, Any],
        candidate_skills: List[Dict[str, Any]],
        jobs: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Computes multi-dimensional matching scores considering transferable skills and break protection."""
        if jobs is None:
            jobs = db_helper.get_all_jobs()

        has_break = candidate_data.get("has_career_break", False)
        break_years = candidate_data.get("career_break_years", 0.0)

        # Normalize candidate skills
        candidate_skill_map = {}
        for s in candidate_skills:
            if isinstance(s, dict):
                name = s.get("name", "").strip()
                status = s.get("validation_status", "Self-Declared")
                is_trans = s.get("is_transferable", False)
                candidate_skill_map[name.lower()] = {
                    "name": name,
                    "status": status,
                    "is_transferable": is_trans,
                    "confidence": s.get("confidence_score", 80.0)
                }
            else:
                candidate_skill_map[str(s).strip().lower()] = {
                    "name": str(s),
                    "status": "Self-Declared",
                    "is_transferable": False,
                    "confidence": 75.0
                }

        ranked_matches = []

        for job in jobs:
            required = job.get("required_skills", [])
            preferred = job.get("preferred_skills", [])
            transfer_acceptable = job.get("transferable_acceptable_skills", {})

            matched_direct = []
            matched_transferable = []
            missing = []

            for req in required:
                req_lower = req.lower()
                # Check direct match
                if req_lower in candidate_skill_map:
                    matched_direct.append(candidate_skill_map[req_lower]["name"])
                # Check if candidate has a transferable equivalent
                elif any(prev.lower() in candidate_skill_map and trans.lower() == req_lower for prev, trans in transfer_acceptable.items()):
                    matching_trans = [trans for prev, trans in transfer_acceptable.items() if prev.lower() in candidate_skill_map and trans.lower() == req_lower][0]
                    matched_transferable.append(matching_trans)
                else:
                    missing.append(req)

            # Preferred skills match
            matched_preferred = []
            for pref in preferred:
                if pref.lower() in candidate_skill_map:
                    matched_preferred.append(candidate_skill_map[pref.lower()]["name"])

            # Compute Component Scores
            total_req_count = max(len(required), 1)
            direct_score = (len(matched_direct) / total_req_count) * 100
            transferable_score = (len(matched_transferable) / total_req_count) * 100
            preferred_score = (len(matched_preferred) / max(len(preferred), 1)) * 100 if preferred else 100.0

            # Inclusive Match Formula:
            # 60% on direct competencies, 30% on recognized transferable competencies, 10% on preferred
            combined_match = (direct_score * 0.60) + (transferable_score * 0.35) + (preferred_score * 0.05)

            # Evidence Validation Boost: If candidate has AI-assessed evidence, award up to +5% confidence boost
            ai_assessed_count = sum(1 for item in candidate_skill_map.values() if item["status"] == "AI-Assessed")
            evidence_boost = min(ai_assessed_count * 1.5, 5.0)

            final_score = min(round(combined_match + evidence_boost, 1), 98.5)

            # Career Break Neutrality Guarantee:
            # Explicitly ensures zero deduction for career breaks
            career_break_penalty_applied = 0.0
            break_mitigation_applied = True if has_break else False

            # Explainable rationale for candidate and recruiter
            rationale_points = []
            if matched_direct:
                rationale_points.append(f"Direct match on {len(matched_direct)} core requirements.")
            if matched_transferable:
                rationale_points.append(f"Successfully validated {len(matched_transferable)} transferable skills from previous operations.")
            if has_break:
                rationale_points.append(f"Career break of {break_years} yrs protected with 0% score penalty.")

            ranked_matches.append({
                "job_id": job.get("id"),
                "title": job.get("title"),
                "company": job.get("company"),
                "department": job.get("department", "Operations"),
                "location": job.get("location"),
                "salary_range": job.get("salary_range"),
                "career_break_friendly": job.get("career_break_friendly", True),
                "overall_match_score": final_score,
                "score_breakdown": {
                    "direct_skill_match_pct": round(direct_score, 1),
                    "transferable_skill_match_pct": round(transferable_score, 1),
                    "evidence_validation_boost_pct": round(evidence_boost, 1),
                    "career_break_penalty_deduction": career_break_penalty_applied
                },
                "matched_direct_skills": matched_direct,
                "matched_transferable_skills": matched_transferable,
                "matched_preferred_skills": matched_preferred,
                "missing_skills": missing,
                "break_mitigation_applied": break_mitigation_applied,
                "match_rationale": " ".join(rationale_points)
            })

        # Rank descending by overall match score
        ranked_matches.sort(key=lambda x: x["overall_match_score"], reverse=True)
        return ranked_matches


inclusive_matching_agent = InclusiveMatchingAgent()
