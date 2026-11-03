"""Agent 1: Skills Discovery Agent for SkillBridge AI.

Discovers skills from profiles, identifies cross-occupational transferable competencies,
categorizes them into domain areas, and applies the 4-tier validation status taxonomy.
"""

from typing import Any, Dict, List
from services.llm_client import llm_client
from database.models import SkillValidationStatus, SkillCategory


class SkillsDiscoveryAgent:
    """Specialist Agent discovering direct and transferable competencies."""

    def __init__(self):
        self.role_name = "Skills Discovery Agent"
        self.version = "2.0"

        # Canonical cross-occupational transferable mapping table
        self.TRANSFERABLE_ONTOLOGY = {
            "hr operations": [
                {
                    "responsibility": "Interview scheduling",
                    "transferable_skill": "Planning and coordination",
                    "category": SkillCategory.OPERATIONAL.value,
                    "target_domains": ["Project Coordination", "Operations", "Event Management"],
                    "default_status": SkillValidationStatus.AI_ASSESSED.value,
                    "confidence": 92.0
                },
                {
                    "responsibility": "Communicating with candidates",
                    "transferable_skill": "Communication",
                    "category": SkillCategory.COMMUNICATION.value,
                    "target_domains": ["Customer Success", "Project Coordination", "Account Management"],
                    "default_status": SkillValidationStatus.AI_ASSESSED.value,
                    "confidence": 94.0
                },
                {
                    "responsibility": "Coordinating with hiring managers",
                    "transferable_skill": "Stakeholder management",
                    "category": SkillCategory.COMMUNICATION.value,
                    "target_domains": ["Project Management", "Business Analysis", "Client Services"],
                    "default_status": SkillValidationStatus.AI_ASSESSED.value,
                    "confidence": 89.0
                },
                {
                    "responsibility": "Maintaining employee records",
                    "transferable_skill": "Documentation",
                    "category": SkillCategory.OPERATIONAL.value,
                    "target_domains": ["Quality Assurance", "Compliance", "Project Management"],
                    "default_status": SkillValidationStatus.EVIDENCE_SUBMITTED.value,
                    "confidence": 91.0
                },
                {
                    "responsibility": "Managing scheduling conflicts",
                    "transferable_skill": "Problem solving",
                    "category": SkillCategory.LEADERSHIP.value,
                    "target_domains": ["Operations", "Sprint Coordination", "Support Management"],
                    "default_status": SkillValidationStatus.SELF_DECLARED.value,
                    "confidence": 86.0
                },
                {
                    "responsibility": "Following up on pending activities",
                    "transferable_skill": "Task management",
                    "category": SkillCategory.OPERATIONAL.value,
                    "target_domains": ["Scrum Master", "Project Coordination", "Operations"],
                    "default_status": SkillValidationStatus.SELF_DECLARED.value,
                    "confidence": 88.0
                }
            ],
            "retail / customer service": [
                {
                    "responsibility": "Customer dispute resolution",
                    "transferable_skill": "Conflict resolution & negotiation",
                    "category": SkillCategory.LEADERSHIP.value,
                    "target_domains": ["Client Relations", "Operations", "Team Lead"],
                    "default_status": SkillValidationStatus.SELF_DECLARED.value,
                    "confidence": 85.0
                },
                {
                    "responsibility": "Inventory audit and restocking",
                    "transferable_skill": "Supply chain & logistics tracking",
                    "category": SkillCategory.OPERATIONAL.value,
                    "target_domains": ["Operations", "Procurement"],
                    "default_status": SkillValidationStatus.SELF_DECLARED.value,
                    "confidence": 84.0
                }
            ]
        }

    def discover_skills(
        self,
        candidate_data: Dict[str, Any],
        responsibilities: List[str] = None,
        existing_skills: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Discovers, maps, and structures competencies."""
        previous_role = candidate_data.get("previous_role", "HR Operations Associate")
        target_role = candidate_data.get("target_role", "Project Coordinator")
        detected_resps = responsibilities or candidate_data.get("detected_responsibilities", [])

        # Step 1: Query Gemini LLM if available
        prompt = f"""
You are the Skills Discovery Agent in SkillBridge AI (SAP Hackfest 2026).
Candidate Previous Role: {previous_role}
Target Role: {target_role}
Candidate Experience: {candidate_data.get('total_years_experience', 2)} years
Career Break: {candidate_data.get('career_break_years', 0)} years
Responsibilities provided: {detected_resps}

Extract:
1. Core skills
2. Cross-occupational transferable skills mapped from previous duties to target role
3. Classify into categories: Technical, Operational & Coordination, Communication & Stakeholder, Leadership & Problem Solving, Domain Specific.
4. Set validation_status to one of: 'Self-Declared', 'Evidence Submitted', 'AI-Assessed', 'Human-Validated'.
"""
        llm_response = llm_client.generate_json(
            prompt,
            system_instruction="Output JSON with keys: 'discovered_skills' (list of dicts with name, category, proficiency, is_transferable, transferred_from, validation_status, confidence_score), 'summary_insights'."
        )

        if llm_response and "discovered_skills" in llm_response:
            return llm_response

        # Step 2: High-accuracy rule-based and ontological discovery
        discovered = []
        known_names = set()

        # Check ontological mapping for candidate's role
        role_key = "hr operations" if "hr" in previous_role.lower() else "retail / customer service"
        mappings = self.TRANSFERABLE_ONTOLOGY.get(role_key, self.TRANSFERABLE_ONTOLOGY["hr operations"])

        for item in mappings:
            # If candidate reported responsibility or default role matches
            resp_name = item["responsibility"].lower()
            matches_user = any(resp_name in r.lower() for r in detected_resps) or not detected_resps

            if matches_user and item["transferable_skill"] not in known_names:
                discovered.append({
                    "name": item["transferable_skill"],
                    "category": item["category"],
                    "proficiency": "Advanced" if item["confidence"] > 90 else "Intermediate",
                    "is_transferable": True,
                    "transferred_from": item["responsibility"],
                    "validation_status": item["default_status"],
                    "confidence_score": item["confidence"],
                    "relevance_to_target": f"Critical prerequisite for {target_role}"
                })
                known_names.add(item["transferable_skill"])

        # Add self-declared or technical skills if any
        if existing_skills:
            for s in existing_skills:
                s_name = s.get("name") if isinstance(s, dict) else s
                if s_name and s_name not in known_names:
                    discovered.append({
                        "name": s_name,
                        "category": SkillCategory.TECHNICAL.value if "code" in s_name.lower() or "python" in s_name.lower() else SkillCategory.OPERATIONAL.value,
                        "proficiency": "Intermediate",
                        "is_transferable": False,
                        "transferred_from": None,
                        "validation_status": SkillValidationStatus.SELF_DECLARED.value,
                        "confidence_score": 75.0,
                        "relevance_to_target": "Complementary domain skill"
                    })
                    known_names.add(s_name)

        # Distinguish taxonomy statistics
        stats = {
            SkillValidationStatus.SELF_DECLARED.value: len([s for s in discovered if s["validation_status"] == SkillValidationStatus.SELF_DECLARED.value]),
            SkillValidationStatus.EVIDENCE_SUBMITTED.value: len([s for s in discovered if s["validation_status"] == SkillValidationStatus.EVIDENCE_SUBMITTED.value]),
            SkillValidationStatus.AI_ASSESSED.value: len([s for s in discovered if s["validation_status"] == SkillValidationStatus.AI_ASSESSED.value]),
            SkillValidationStatus.HUMAN_VALIDATED.value: len([s for s in discovered if s["validation_status"] == SkillValidationStatus.HUMAN_VALIDATED.value]),
        }

        return {
            "agent": self.role_name,
            "version": self.version,
            "total_skills_discovered": len(discovered),
            "transferable_skills_count": len([s for s in discovered if s["is_transferable"]]),
            "taxonomy_distribution": stats,
            "discovered_skills": discovered,
            "summary_insights": (
                f"Successfully identified {len(discovered)} competencies. "
                f"Extracted {len([s for s in discovered if s['is_transferable']])} transferable skills from "
                f"{previous_role} experience to accelerate transition into {target_role}."
            )
        }


skills_agent = SkillsDiscoveryAgent()
