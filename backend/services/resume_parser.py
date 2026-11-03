"""Resume and profile parsing service for SkillBridge AI."""

import re
from typing import Any, Dict, List


class ResumeParserService:
    """Extracts candidate profile data, work history, responsibilities, and career breaks."""

    # Curated dictionary of common transferable duties and their occupational mappings
    COMMON_RESPONSIBILITIES_PATTERNS = [
        (r"schedul(?:e|ing|ed)\s+(?:interviews?|meetings?|sessions?)", "Interview scheduling", "Planning and coordination"),
        (r"communicat(?:e|ing|ion)\s+(?:with\s+)?(?:candidates?|clients?|customers?)", "Communicating with candidates", "Communication"),
        (r"coordinat(?:e|ing|ed)\s+(?:with\s+)?(?:hiring\s+managers?|stakeholders?|leads?)", "Coordinating with hiring managers", "Stakeholder management"),
        (r"maintain(?:ing|ed)?\s+(?:employee\s+)?records?|documentation|compliance", "Maintaining employee records", "Documentation"),
        (r"manag(?:e|ing|ed)\s+(?:conflicts?|disputes?|scheduling\s+conflicts?)", "Managing scheduling conflicts", "Problem solving"),
        (r"follow(?:ing)?\s+up\s+on\s+(?:pending\s+)?activities|deliverables|tasks", "Following up on pending activities", "Task management"),
        (r"sprint\s+planning|standup|agile|scrum", "Sprint and Agile participation", "Agile/Scrum"),
        (r"budget(?:ing)?|cost\s+tracking|resource\s+allocation", "Resource tracking", "Budgeting and Resource Allocation"),
        (r"python|react|javascript|fastapi|sql", "Software Development", "Technical Engineering")
    ]

    def parse_resume(self, text: str) -> Dict[str, Any]:
        """Parses raw text and extracts structured attributes."""
        cleaned_text = text.strip()
        lowered = cleaned_text.lower()

        # 1. Name extraction heuristic
        name_match = re.search(r"^(?:name[:\-]?\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})", cleaned_text)
        name = name_match.group(1) if name_match else "Candidate"

        # 2. Contact details
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", cleaned_text)
        email = email_match.group(0) if email_match else "candidate@example.com"

        phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", cleaned_text)
        phone = phone_match.group(0) if phone_match else None

        # 3. Location detection
        location = "Remote / India"
        for loc in ["Lucknow", "Bangalore", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi", "Gurgaon", "Noida", "Remote"]:
            if loc.lower() in lowered:
                location = f"{loc}, India" if "india" not in loc.lower() else loc
                break

        # 4. Career break detection (Crucial for Inclusive Workforce Hackfest)
        has_break = False
        break_years = 0.0
        break_reason = None

        break_patterns = [
            r"career\s*break[:\-]?\s*(\d+(?:\.\d+)?)\s*years?",
            r"employment\s*gap[:\-]?\s*(\d+(?:\.\d+)?)\s*years?",
            r"sabbatical[:\-]?\s*(\d+(?:\.\d+)?)\s*years?",
            r"maternity\s*(?:leave|break)[:\-]?\s*(\d+(?:\.\d+)?)\s*years?",
            r"caregiving\s*(?:break|leave)[:\-]?\s*(\d+(?:\.\d+)?)\s*years?",
        ]

        for pat in break_patterns:
            m = re.search(pat, lowered)
            if m:
                has_break = True
                break_years = float(m.group(1))
                break_reason = "Family caregiving / personal sabbatical; active preparation to rejoin the workforce"
                break

        # If keywords exist without explicit duration
        if not has_break and any(k in lowered for k in ["career break", "career gap", "maternity leave", "returning to work", "returnee"]):
            has_break = True
            break_years = 2.0
            break_reason = "Career pause / parental transition"

        # 5. Experience extraction
        exp_match = re.search(r"(\d+(?:\.\d+)?)\+?\s*years?\s*(?:of)?\s*(?:experience|in\s+)", lowered)
        total_exp = float(exp_match.group(1)) if exp_match else 2.0

        # 6. Extract Responsibilities and Transferable Competencies
        detected_responsibilities = []
        inferred_transferable_skills = []

        for pattern, resp_label, target_comp in self.COMMON_RESPONSIBILITIES_PATTERNS:
            if re.search(pattern, lowered):
                detected_responsibilities.append(resp_label)
                if target_comp not in inferred_transferable_skills:
                    inferred_transferable_skills.append(target_comp)

        # 7. Identify previous role and target role
        previous_role = "HR Operations Associate"
        if "hr operations" in lowered or "human resources" in lowered:
            previous_role = "HR Operations Associate"
        elif "software" in lowered or "developer" in lowered:
            previous_role = "Software Developer"
        elif "sales" in lowered or "business development" in lowered:
            previous_role = "Business Development Associate"

        target_role = "Project Coordinator"
        if "target:" in lowered or "target role:" in lowered or "seeking:" in lowered:
            t_match = re.search(r"(?:target\s+role|seeking|target)[:\-]?\s*([A-Za-z0-9\s\-]+)", cleaned_text, re.IGNORECASE)
            if t_match:
                target_role = t_match.group(1).strip()

        return {
            "name": name,
            "email": email,
            "phone": phone,
            "location": location,
            "previous_role": previous_role,
            "target_role": target_role,
            "total_years_experience": total_exp,
            "has_career_break": has_break,
            "career_break_years": break_years,
            "career_break_reason": break_reason,
            "detected_responsibilities": detected_responsibilities,
            "inferred_transferable_skills": inferred_transferable_skills,
            "raw_text_length": len(cleaned_text),
        }


resume_parser = ResumeParserService()
