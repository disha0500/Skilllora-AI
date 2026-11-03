"""Database setup, session management, and seed data initialization."""

import json
import uuid
from pathlib import Path
from typing import Any, Dict, List
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from database.models import (
    Base,
    Candidate,
    CandidateSkill,
    SkillEvidence,
    JobPosting,
    CourseResource,
    BiasAuditLog,
    UserAccount,
    SkillValidationStatus,
    SkillCategory,
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
JOBS_FILE = DATA_DIR / "jobs.json"
COURSES_FILE = DATA_DIR / "courses.json"
DB_PATH = Path(__file__).resolve().parent.parent / "skillbridge.db"

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes schema and seeds baseline data including Ayesha Khan demo persona."""
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()

    try:
        # Seed Jobs if empty
        if session.query(JobPosting).count() == 0 and JOBS_FILE.exists():
            with open(JOBS_FILE, "r", encoding="utf-8") as f:
                jobs_data = json.load(f)
                for item in jobs_data:
                    job = JobPosting(
                        id=item.get("id", str(uuid.uuid4())[:8]),
                        title=item["title"],
                        company=item["company"],
                        department=item.get("department", "Operations"),
                        location=item["location"],
                        experience_level=item.get("experience_level", "Mid-Level"),
                        min_years_exp=item.get("min_years_exp", 1),
                        career_break_friendly=item.get("career_break_friendly", True),
                        required_skills=json.dumps(item.get("required_skills", [])),
                        preferred_skills=json.dumps(item.get("preferred_skills", [])),
                        transferable_acceptable_skills=json.dumps(item.get("transferable_acceptable_skills", {})),
                        salary_range=item.get("salary_range", "Competitive"),
                        description=item["description"],
                        posted_date=item.get("posted_date", "2026-10-25"),
                    )
                    session.add(job)

        # Seed Courses if empty
        if session.query(CourseResource).count() == 0 and COURSES_FILE.exists():
            with open(COURSES_FILE, "r", encoding="utf-8") as f:
                courses_data = json.load(f)
                for c in courses_data:
                    course = CourseResource(
                        id=c.get("id", str(uuid.uuid4())[:8]),
                        title=c["title"],
                        provider=c.get("provider", "SAP Learning"),
                        is_sap_official=c.get("is_sap_official", False),
                        skills_covered=json.dumps(c.get("skills_covered", [])),
                        level=c.get("level", "Beginner"),
                        duration_hours=c.get("duration_hours", 10),
                        rating=c.get("rating", 4.8),
                        url=c.get("url", "https://learning.sap.com/"),
                        description=c.get("description", ""),
                    )
                    session.add(course)

        # Seed Demo Persona: Ayesha Khan (from Hackfest Spec Section 8)
        demo_candidate = session.query(Candidate).filter(Candidate.id == "cand_ayesha_khan").first()
        if not demo_candidate:
            ayesha = Candidate(
                id="cand_ayesha_khan",
                name="Ayesha Khan",
                email="ayesha.khan@example.com",
                phone="+91 98765 43210",
                location="Lucknow, India",
                current_or_previous_role="HR Operations Associate",
                target_role="Project Coordinator",
                total_years_experience=2.0,
                has_career_break=True,
                career_break_years=3.0,
                career_break_reason="Family caregiving responsibilities & maternity leave; actively prepared for return to workforce",
                bio="Former HR Operations professional with 2 years of experience coordinating cross-functional interviews, stakeholder alignment, and documentation. Returning after a 3-year career break and pivoting into Project Coordination with demonstrated organizational leadership."
            )
            session.add(ayesha)
            session.flush()

            # Seed Ayesha's Transferable Skills
            skills_to_seed = [
                {
                    "name": "Planning and coordination",
                    "category": SkillCategory.OPERATIONAL.value,
                    "proficiency": "Advanced",
                    "validation_status": SkillValidationStatus.AI_ASSESSED.value,
                    "is_transferable": True,
                    "transferred_from": "Interview scheduling & calendar operations",
                    "confidence": 94.0,
                },
                {
                    "name": "Communication",
                    "category": SkillCategory.COMMUNICATION.value,
                    "proficiency": "Advanced",
                    "validation_status": SkillValidationStatus.AI_ASSESSED.value,
                    "is_transferable": True,
                    "transferred_from": "Communicating with candidates & onboarding debriefs",
                    "confidence": 92.0,
                },
                {
                    "name": "Stakeholder management",
                    "category": SkillCategory.COMMUNICATION.value,
                    "proficiency": "Intermediate",
                    "validation_status": SkillValidationStatus.AI_ASSESSED.value,
                    "is_transferable": True,
                    "transferred_from": "Coordinating with senior hiring managers and department heads",
                    "confidence": 88.0,
                },
                {
                    "name": "Documentation",
                    "category": SkillCategory.OPERATIONAL.value,
                    "proficiency": "Advanced",
                    "validation_status": SkillValidationStatus.EVIDENCE_SUBMITTED.value,
                    "is_transferable": True,
                    "transferred_from": "Maintaining employee records, HR policies, and compliance logs",
                    "confidence": 90.0,
                },
                {
                    "name": "Problem solving",
                    "category": SkillCategory.LEADERSHIP.value,
                    "proficiency": "Intermediate",
                    "validation_status": SkillValidationStatus.SELF_DECLARED.value,
                    "is_transferable": True,
                    "transferred_from": "Managing scheduling conflicts and urgent interviewer replacements",
                    "confidence": 85.0,
                },
                {
                    "name": "Task management",
                    "category": SkillCategory.OPERATIONAL.value,
                    "proficiency": "Intermediate",
                    "validation_status": SkillValidationStatus.SELF_DECLARED.value,
                    "is_transferable": True,
                    "transferred_from": "Following up on pending onboarding activities and compliance checklists",
                    "confidence": 87.0,
                },
            ]

            seeded_skill_records = []
            for s in skills_to_seed:
                skill_id = f"skill_{uuid.uuid4().hex[:8]}"
                c_skill = CandidateSkill(
                    id=skill_id,
                    candidate_id=ayesha.id,
                    name=s["name"],
                    category=s["category"],
                    proficiency=s["proficiency"],
                    validation_status=s["validation_status"],
                    is_transferable=s["is_transferable"],
                    transferred_from_responsibility=s["transferred_from"],
                    confidence_score=s["confidence"],
                )
                session.add(c_skill)
                seeded_skill_records.append(c_skill)
            
            session.flush()

            # Add STAR Evidence for Planning and coordination
            plan_skill = next((sk for sk in seeded_skill_records if sk.name == "Planning and coordination"), None)
            if plan_skill:
                evidence_1 = SkillEvidence(
                    id=f"ev_{uuid.uuid4().hex[:8]}",
                    candidate_id=ayesha.id,
                    candidate_skill_id=plan_skill.id,
                    skill_name="Planning and coordination",
                    situation="At previous firm, our quarterly technical campus hiring drive faced a high collision rate of interviewer schedules across 5 engineering departments.",
                    task="Responsible for scheduling, coordinating, and ensuring seamless execution of 120+ multi-stage interviews within a strict 3-day window.",
                    action="Designed a synchronized calendar slotting system, established automated briefing channels for 25 interviewers, and maintained live real-time schedule adjustments using structured trackers.",
                    result="Achieved a 98% on-time interview completion rate with 0 candidate dropouts due to scheduling confusion, recognized with an Operational Excellence badge.",
                    raw_evidence_text="Coordinated 120+ multi-stage technical interviews across 5 departments within 3 days with a 98% on-time rate.",
                    validation_status=SkillValidationStatus.AI_ASSESSED.value,
                    validation_score=94.0,
                    rubric_feedback="Demonstrates exceptional end-to-end operational planning, resource coordination, and agile contingency handling directly applicable to Project Coordination.",
                    missing_details="None. Evidence provides strong metrics, timeline constraints, and execution clarity.",
                    suggested_followup_tasks="Translate this workflow into an Agile Sprint coordination artifact using JIRA backlog milestones."
                )
                session.add(evidence_1)

            # Add STAR Evidence for Stakeholder management
            stake_skill = next((sk for sk in seeded_skill_records if sk.name == "Stakeholder management"), None)
            if stake_skill:
                evidence_2 = SkillEvidence(
                    id=f"ev_{uuid.uuid4().hex[:8]}",
                    candidate_id=ayesha.id,
                    candidate_skill_id=stake_skill.id,
                    skill_name="Stakeholder management",
                    situation="Hiring managers across Product, Engineering, and Design had conflicting criteria and delays in candidate evaluation feedback.",
                    task="Align 8 senior department heads on a unified rubric and turnaround timeline of 24 hours.",
                    action="Convened weekly alignment huddles, established standardized scorecard templates, and actively negotiated blocker resolutions directly with leadership.",
                    result="Reduced candidate feedback turnaround time from 4.5 days to 18 hours, accelerating overall hiring velocity by 40%.",
                    raw_evidence_text="Aligned 8 senior department heads on a unified scorecard, cutting feedback latency from 4.5 days to 18 hours.",
                    validation_status=SkillValidationStatus.AI_ASSESSED.value,
                    validation_score=91.0,
                    rubric_feedback="Strong evidence of consensus-building, managing competing stakeholder expectations, and driving cross-functional process discipline.",
                    missing_details="Could include formal project management tooling used for reporting.",
                    suggested_followup_tasks="Present this experience within an Agile Scrum Retrospective format."
                )
                session.add(evidence_2)

        # Seed Default User Accounts for Candidate, Recruiter, and Admin
        if session.query(UserAccount).count() == 0:
            demo_users = [
                UserAccount(
                    id="usr_ayesha_khan",
                    email="ayesha.khan@example.com",
                    password_hash="password123",  # Demo credential
                    full_name="Ayesha Khan",
                    role="candidate",
                    organization="Workforce Returnee Cohort",
                ),
                UserAccount(
                    id="usr_rajesh_sharma",
                    email="recruiter@sap.com",
                    password_hash="password123",
                    full_name="Rajesh Sharma",
                    role="recruiter",
                    organization="SAP Labs India",
                ),
                UserAccount(
                    id="usr_neha_verma",
                    email="admin@skillbridge.ai",
                    password_hash="password123",
                    full_name="Dr. Neha Verma",
                    role="admin",
                    organization="Inclusive Workforce Council",
                ),
            ]
            for u in demo_users:
                session.add(u)

        session.commit()
    except Exception as e:
        session.rollback()
        print(f"[Database Init Error] {e}")
    finally:
        session.close()


class DatabaseHelper:
    """Helper class providing easy query access across services and agents."""

    @staticmethod
    def get_all_jobs() -> List[Dict[str, Any]]:
        session = SessionLocal()
        try:
            jobs = session.query(JobPosting).all()
            result = []
            for j in jobs:
                result.append({
                    "id": j.id,
                    "title": j.title,
                    "company": j.company,
                    "department": j.department,
                    "location": j.location,
                    "experience_level": j.experience_level,
                    "min_years_exp": j.min_years_exp,
                    "career_break_friendly": j.career_break_friendly,
                    "required_skills": json.loads(j.required_skills) if j.required_skills else [],
                    "preferred_skills": json.loads(j.preferred_skills) if j.preferred_skills else [],
                    "transferable_acceptable_skills": json.loads(j.transferable_acceptable_skills) if j.transferable_acceptable_skills else {},
                    "salary_range": j.salary_range,
                    "description": j.description,
                    "posted_date": j.posted_date,
                })
            return result
        finally:
            session.close()

    @staticmethod
    def get_all_courses() -> List[Dict[str, Any]]:
        session = SessionLocal()
        try:
            courses = session.query(CourseResource).all()
            result = []
            for c in courses:
                result.append({
                    "id": c.id,
                    "title": c.title,
                    "provider": c.provider,
                    "is_sap_official": c.is_sap_official,
                    "skills_covered": json.loads(c.skills_covered) if c.skills_covered else [],
                    "level": c.level,
                    "duration_hours": c.duration_hours,
                    "rating": c.rating,
                    "url": c.url,
                    "description": c.description,
                })
            return result
        finally:
            session.close()


# Database singleton helper
db_helper = DatabaseHelper()
