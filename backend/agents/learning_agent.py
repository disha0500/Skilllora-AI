"""Agent 3: Learning Pathway Agent for SkillBridge AI.

Identifies skill gaps and generates milestone-based learning roadmaps,
featuring official SAP Learning resources (https://learning.sap.com/) alongside practical projects.
"""

from typing import Any, Dict, List
from services.llm_client import llm_client
from database.db import db_helper


class LearningPathwayAgent:
    """Specialist Agent constructing actionable upskilling roadmaps with SAP ecosystem integration."""

    def __init__(self):
        self.role_name = "Learning Pathway Agent"
        self.version = "2.0"

    def generate_pathway(
        self,
        candidate_skills: List[str],
        target_role: str,
        missing_skills: List[str]
    ) -> Dict[str, Any]:
        """Creates personalized curriculum and course recommendations."""
        all_courses = db_helper.get_all_courses()
        missing_set = {s.lower() for s in missing_skills}

        # Step 1: LLM plan generation if available
        prompt = f"""
You are the Learning Pathway Agent in SkillBridge AI (SAP Hackfest 2026).
Candidate Target Role: {target_role}
Candidate Current Skills: {candidate_skills}
Identified Skill Gaps: {missing_skills}
Available courses: {all_courses}

Design:
1. A structured 4-6 week learning roadmap with weekly milestones.
2. Select the top matching courses from the catalog (prioritize SAP Learning resources).
3. Recommend hands-on project exercises to validate learning with evidence.
"""
        llm_response = llm_client.generate_json(
            prompt,
            system_instruction="Output JSON with keys: 'roadmap_weeks', 'recommended_courses', 'hands_on_projects', 'estimated_total_hours', 'sap_learning_highlight'."
        )
        if llm_response and "recommended_courses" in llm_response:
            return llm_response

        # Step 2: Intelligent course matching from database catalog
        recommended_courses = []
        sap_courses = []

        for course in all_courses:
            course_skills = {s.lower() for s in course.get("skills_covered", [])}
            overlap = missing_set & course_skills
            # If there is skill overlap or if it's a foundational SAP/Project course
            if overlap or ("sap" in course.get("provider", "").lower() and any(m in ["agile/scrum", "jira", "sap project systems", "task management"] for m in missing_set)):
                course_item = {
                    "id": course["id"],
                    "title": course["title"],
                    "provider": course["provider"],
                    "is_sap_official": course.get("is_sap_official", False),
                    "skills_addressed": [s.title() for s in overlap] if overlap else course.get("skills_covered", []),
                    "duration_hours": course["duration_hours"],
                    "rating": course["rating"],
                    "level": course["level"],
                    "url": course["url"],
                    "description": course.get("description", "")
                }
                recommended_courses.append(course_item)
                if course.get("is_sap_official"):
                    sap_courses.append(course_item)

        # Fallback if no specific overlap
        if not recommended_courses:
            recommended_courses = all_courses[:3]

        # Milestone Roadmap construction
        roadmap = [
            {
                "phase": "Phase 1: Foundations & Tooling (Weeks 1 - 2)",
                "focus_area": "Agile Sprints & Project Coordination Frameworks",
                "recommended_resource": "JIRA & Confluence for Agile Project Coordinators",
                "practical_task": "Create a sample JIRA sprint board, define 5 user stories, and map task dependencies."
            },
            {
                "phase": "Phase 2: Enterprise Methodology (Weeks 3 - 4)",
                "focus_area": "SAP Activate Methodology & Cross-Team Governance",
                "recommended_resource": "Project Management in the SAP Ecosystem & Agile Delivery (SAP Learning)",
                "practical_task": "Draft a cross-functional communication plan and stakeholder RACI matrix for a digital transformation sprint."
            },
            {
                "phase": "Phase 3: Applied Capstone & Evidence (Weeks 5 - 6)",
                "focus_area": "End-to-End Delivery Simulation & STAR Portfolio Validation",
                "recommended_resource": "Executive Communication & Cross-Functional Alignment",
                "practical_task": "Submit completed sprint artifacts to the Evidence Validation Agent for AI assessment."
            }
        ]

        total_hours = sum(c.get("duration_hours", 10) for c in recommended_courses)

        return {
            "agent": self.role_name,
            "version": self.version,
            "target_role": target_role,
            "priority_skill_gaps": missing_skills[:4],
            "total_curated_courses": len(recommended_courses),
            "estimated_completion_time": f"{max(total_hours, 20)} hours across 6 weeks",
            "sap_learning_spotlight": {
                "source": "SAP Learning Hub (https://learning.sap.com/)",
                "certified_modules": len(sap_courses),
                "featured_course": sap_courses[0]["title"] if sap_courses else "Project Management in the SAP Ecosystem & Agile Delivery"
            },
            "recommended_courses": recommended_courses,
            "structured_roadmap": roadmap,
            "hands_on_projects": [
                "Agile Sprint Board Simulation in JIRA",
                "Stakeholder Escalation & RACI Communication Matrix",
                "SAP Activate Project Milestone Checklist"
            ]
        }


learning_agent = LearningPathwayAgent()
