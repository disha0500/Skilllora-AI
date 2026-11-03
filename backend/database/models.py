"""SQLAlchemy models for SkillBridge AI (SAP Hackfest 2026)."""

import enum
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class SkillValidationStatus(str, enum.Enum):
    """The 4-tier skill verification taxonomy defined by SkillBridge AI."""
    SELF_DECLARED = "Self-Declared"
    EVIDENCE_SUBMITTED = "Evidence Submitted"
    AI_ASSESSED = "AI-Assessed"
    HUMAN_VALIDATED = "Human-Validated"


class SkillCategory(str, enum.Enum):
    TECHNICAL = "Technical"
    OPERATIONAL = "Operational & Coordination"
    COMMUNICATION = "Communication & Stakeholder"
    LEADERSHIP = "Leadership & Problem Solving"
    DOMAIN = "Domain Specific"


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)
    location = Column(String(100), nullable=False, default="Remote")
    current_or_previous_role = Column(String(100), nullable=False)
    target_role = Column(String(100), nullable=False)
    total_years_experience = Column(Float, default=0.0)
    has_career_break = Column(Boolean, default=False)
    career_break_years = Column(Float, default=0.0)
    career_break_reason = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    skills = relationship("CandidateSkill", back_populates="candidate", cascade="all, delete-orphan")
    evidence_items = relationship("SkillEvidence", back_populates="candidate", cascade="all, delete-orphan")


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidates.id"), nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default=SkillCategory.OPERATIONAL.value)
    proficiency = Column(String(30), default="Intermediate")
    validation_status = Column(
        String(50),
        default=SkillValidationStatus.SELF_DECLARED.value
    )
    is_transferable = Column(Boolean, default=False)
    transferred_from_responsibility = Column(String(255), nullable=True)
    confidence_score = Column(Float, default=80.0)

    # Relationships
    candidate = relationship("Candidate", back_populates="skills")
    evidence = relationship("SkillEvidence", back_populates="skill", uselist=False)


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidates.id"), nullable=False)
    candidate_skill_id = Column(String(50), ForeignKey("candidate_skills.id"), nullable=True)
    skill_name = Column(String(100), nullable=False)
    
    # STAR Method Evidence fields
    situation = Column(Text, nullable=True)
    task = Column(Text, nullable=True)
    action = Column(Text, nullable=True)
    result = Column(Text, nullable=True)
    raw_evidence_text = Column(Text, nullable=True)

    # Evaluation results from Evidence Validation Agent
    validation_status = Column(String(50), default=SkillValidationStatus.EVIDENCE_SUBMITTED.value)
    validation_score = Column(Float, default=0.0)
    rubric_feedback = Column(Text, nullable=True)
    missing_details = Column(Text, nullable=True)
    suggested_followup_tasks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    candidate = relationship("Candidate", back_populates="evidence_items")
    skill = relationship("CandidateSkill", back_populates="evidence")


class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(String(50), primary_key=True)
    title = Column(String(100), nullable=False)
    company = Column(String(100), nullable=False)
    department = Column(String(100), default="Engineering & Operations")
    location = Column(String(100), nullable=False)
    experience_level = Column(String(50), default="Entry-to-Mid")
    min_years_exp = Column(Integer, default=1)
    career_break_friendly = Column(Boolean, default=True)
    required_skills = Column(Text, nullable=False)  # JSON-serialized list
    preferred_skills = Column(Text, nullable=False)  # JSON-serialized list
    transferable_acceptable_skills = Column(Text, default="{}")  # JSON map: previous -> target skill
    salary_range = Column(String(50), default="Market Competitive")
    description = Column(Text, nullable=False)
    posted_date = Column(String(50), default="2026-10-25")


class CourseResource(Base):
    __tablename__ = "course_resources"

    id = Column(String(50), primary_key=True)
    title = Column(String(200), nullable=False)
    provider = Column(String(100), default="SAP Learning")
    is_sap_official = Column(Boolean, default=False)
    skills_covered = Column(Text, nullable=False)  # JSON-serialized list
    level = Column(String(50), default="Beginner")
    duration_hours = Column(Integer, default=10)
    rating = Column(Float, default=4.8)
    url = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)


class BiasAuditLog(Base):
    __tablename__ = "bias_audit_logs"

    id = Column(String(50), primary_key=True)
    event_type = Column(String(100), nullable=False)
    candidate_id = Column(String(50), nullable=True)
    job_id = Column(String(50), nullable=True)
    break_penalty_detected = Column(Boolean, default=False)
    break_penalty_neutralized = Column(Boolean, default=True)
    fairness_score = Column(Float, default=98.0)
    checks_passed = Column(Text, nullable=False)  # JSON-serialized
    observations = Column(Text, nullable=False)    # JSON-serialized
    mitigation_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(String(50), primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), default="candidate")  # candidate, recruiter, admin
    organization = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


