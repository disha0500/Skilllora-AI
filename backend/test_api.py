"""Automated direct unit verification suite for SkillBridge AI backend."""

import sys
from pathlib import Path

# Add backend folder to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from database.db import init_db, SessionLocal
from database.models import Candidate, CandidateSkill, SkillEvidence
from services.orchestrator import orchestrator
from agents.skills_agent import skills_agent
from agents.market_agent import market_agent
from agents.learning_agent import learning_agent
from agents.matching_agent import inclusive_matching_agent
from agents.bias_agent import bias_agent
from agents.evidence_agent import evidence_agent


def run_all_tests():
    print("Initializing Database and Seeding Ayesha Khan Demo Persona...")
    init_db()

    # Test 1: Candidate retrieval
    session = SessionLocal()
    ayesha = session.query(Candidate).filter(Candidate.id == "cand_ayesha_khan").first()
    assert ayesha is not None, "Ayesha Khan demo candidate must exist"
    assert ayesha.has_career_break is True, "Must register career break"
    assert ayesha.career_break_years == 3.0, "Career break must be 3 years"
    print(f"[PASS] Test 1: Candidate {ayesha.name} loaded (Break: {ayesha.career_break_years} yrs)")

    # Test 2: Skills Discovery Agent
    cand_data = {
        "previous_role": "HR Operations Associate",
        "target_role": "Project Coordinator",
        "detected_responsibilities": [
            "Interview scheduling",
            "Communicating with candidates",
            "Coordinating with hiring managers",
            "Maintaining employee records"
        ]
    }
    disc = skills_agent.discover_skills(cand_data)
    assert disc["total_skills_discovered"] >= 4
    assert disc["transferable_skills_count"] >= 4
    print(f"[PASS] Test 2: Skills Discovery extracted {disc['total_skills_discovered']} competencies ({disc['transferable_skills_count']} transferable)")

    # Test 3: Market Intelligence Agent
    market = market_agent.analyze_market("Project Coordinator", ["Planning and coordination", "Communication"])
    assert market["market_alignment_score"] > 0
    assert "in_demand_skills" in market
    print(f"[PASS] Test 3: Market Intelligence indexed {market['target_role']} (Score: {market['market_alignment_score']}%)")

    # Test 4: Evidence Validation Agent (STAR Method)
    ev = evidence_agent.evaluate_evidence(
        skill_name="Planning and coordination",
        situation="Technical hiring drive with overlapping interviewer calendars across 5 departments.",
        task="Coordinate 120+ interviews in 3 days with zero candidate dropouts.",
        action="Created dynamic calendar routing, real-time Slack channels, and automated slot swap mechanisms.",
        result="98% on-time interview completion rate, recognized with Operational Excellence award."
    )
    assert ev["validation_status"] == "AI-Assessed"
    assert ev["validation_score"] >= 70
    print(f"[PASS] Test 4: Evidence Validation evaluated STAR proof (Score: {ev['validation_score']}, Status: {ev['validation_status']})")

    # Test 5: Inclusive Matching Agent (Zero Break Penalty Guarantee)
    matches = inclusive_matching_agent.match_jobs(
        candidate_data={"has_career_break": True, "career_break_years": 3.0},
        candidate_skills=[
            {"name": "Planning and coordination", "validation_status": "AI-Assessed", "is_transferable": True},
            {"name": "Communication", "validation_status": "AI-Assessed", "is_transferable": True},
            {"name": "Stakeholder management", "validation_status": "AI-Assessed", "is_transferable": True},
            {"name": "Documentation", "validation_status": "AI-Assessed", "is_transferable": True},
            {"name": "Task management", "validation_status": "Self-Declared", "is_transferable": True},
        ]
    )
    assert len(matches) > 0
    top = matches[0]
    assert top["score_breakdown"]["career_break_penalty_deduction"] == 0.0
    assert top["break_mitigation_applied"] is True
    print(f"[PASS] Test 5: Inclusive Matching ranked '{top['title']}' at {top['overall_match_score']}% (Career Break Penalty: {top['score_breakdown']['career_break_penalty_deduction']}%)")

    # Test 6: Learning Pathway Agent (SAP Learning Integration)
    learning = learning_agent.generate_pathway(
        candidate_skills=["Planning and coordination", "Communication"],
        target_role="Project Coordinator",
        missing_skills=["Agile/Scrum", "JIRA", "SAP Project Systems"]
    )
    assert len(learning["recommended_courses"]) > 0
    assert "sap_learning_spotlight" in learning
    print(f"[PASS] Test 6: Learning Pathway generated with {len(learning['recommended_courses'])} courses (Spotlight: {learning['sap_learning_spotlight']['source']})")

    # Test 7: Bias Audit Agent
    bias = bias_agent.audit_recommendations(
        candidate_data={"has_career_break": True, "career_break_years": 3.0},
        ranked_matches=matches
    )
    assert bias["audit_status"].startswith("PASSED")
    assert bias["fairness_confidence_score"] >= 90
    print(f"[PASS] Test 7: Bias Audit certified equity (Status: {bias['audit_status']}, Score: {bias['fairness_confidence_score']}%)")

    # Test 8: Central AI Career Orchestrator (Full Pipeline)
    orchestrated = orchestrator.run_full_pipeline(candidate_id="cand_ayesha_khan")
    assert orchestrated["candidate"]["name"] == "Ayesha Khan"
    assert "executive_summary" in orchestrated
    assert len(orchestrated["inclusive_job_matches"]) > 0
    print(f"[PASS] Test 8: End-to-End Orchestrator Pipeline completed for {orchestrated['candidate']['name']}")

    session.close()
    print("\n=======================================================")
    print("ALL 8 SPECIALIST AGENT & PIPELINE TESTS PASSED 100%!")
    print("=======================================================")


if __name__ == "__main__":
    run_all_tests()
