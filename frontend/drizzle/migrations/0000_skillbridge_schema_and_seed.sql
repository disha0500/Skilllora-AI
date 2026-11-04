CREATE TABLE public.candidates (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text NOT NULL DEFAULT 'Remote',
  current_or_previous_role text NOT NULL,
  target_role text NOT NULL,
  total_years_experience double precision DEFAULT 0,
  has_career_break boolean DEFAULT false,
  career_break_years double precision DEFAULT 0,
  career_break_reason text,
  bio text,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.candidates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidates TO authenticated;
GRANT ALL ON public.candidates TO service_role;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read candidates" ON public.candidates FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.candidate_skills (
  id text PRIMARY KEY,
  candidate_id text NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text DEFAULT 'Operational & Coordination',
  proficiency text DEFAULT 'Intermediate',
  validation_status text DEFAULT 'Self-Declared',
  is_transferable boolean DEFAULT false,
  transferred_from_responsibility text,
  confidence_score double precision DEFAULT 80
);
GRANT SELECT ON public.candidate_skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_skills TO authenticated;
GRANT ALL ON public.candidate_skills TO service_role;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read candidate_skills" ON public.candidate_skills FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.skill_evidence (
  id text PRIMARY KEY,
  candidate_id text NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  candidate_skill_id text REFERENCES public.candidate_skills(id),
  skill_name text NOT NULL,
  situation text,
  task text,
  action text,
  result text,
  raw_evidence_text text,
  validation_status text DEFAULT 'Evidence Submitted',
  validation_score double precision DEFAULT 0,
  rubric_feedback text,
  missing_details text,
  suggested_followup_tasks text,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.skill_evidence TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_evidence TO authenticated;
GRANT ALL ON public.skill_evidence TO service_role;
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read skill_evidence" ON public.skill_evidence FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.job_postings (
  id text PRIMARY KEY,
  title text NOT NULL,
  company text NOT NULL,
  department text DEFAULT 'Engineering & Operations',
  location text NOT NULL,
  experience_level text DEFAULT 'Entry-to-Mid',
  min_years_exp integer DEFAULT 1,
  career_break_friendly boolean DEFAULT true,
  required_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  preferred_skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  transferable_acceptable_skills jsonb DEFAULT '{}'::jsonb,
  salary_range text DEFAULT 'Market Competitive',
  description text NOT NULL,
  posted_date text DEFAULT '2026-10-25'
);
GRANT SELECT ON public.job_postings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_postings TO authenticated;
GRANT ALL ON public.job_postings TO service_role;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read job_postings" ON public.job_postings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.course_resources (
  id text PRIMARY KEY,
  title text NOT NULL,
  provider text DEFAULT 'SAP Learning',
  is_sap_official boolean DEFAULT false,
  skills_covered jsonb NOT NULL DEFAULT '[]'::jsonb,
  level text DEFAULT 'Beginner',
  duration_hours integer DEFAULT 10,
  rating double precision DEFAULT 4.8,
  url text NOT NULL,
  description text
);
GRANT SELECT ON public.course_resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_resources TO authenticated;
GRANT ALL ON public.course_resources TO service_role;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read course_resources" ON public.course_resources FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.bias_audit_logs (
  id text PRIMARY KEY,
  event_type text NOT NULL,
  candidate_id text,
  job_id text,
  break_penalty_detected boolean DEFAULT false,
  break_penalty_neutralized boolean DEFAULT true,
  fairness_score double precision DEFAULT 98,
  checks_passed text NOT NULL DEFAULT '[]',
  observations text NOT NULL DEFAULT '[]',
  mitigation_notes text,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.bias_audit_logs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bias_audit_logs TO authenticated;
GRANT ALL ON public.bias_audit_logs TO service_role;
ALTER TABLE public.bias_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read bias_audit_logs" ON public.bias_audit_logs FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.job_postings (id, title, company, department, location, experience_level, min_years_exp, career_break_friendly, required_skills, preferred_skills, transferable_acceptable_skills, salary_range, description, posted_date) VALUES
('job_001', 'Project Coordinator', 'SAP Enterprise Cloud Solutions', 'Workforce Delivery', 'Bangalore / Hybrid (Remote-Friendly)', 'Entry-to-Mid', 1, true, '["Planning and coordination","Communication","Stakeholder management","Documentation","Task management"]', '["Agile/Scrum","JIRA","SAP Project Systems","Problem solving"]', '{"Interview scheduling":"Planning and coordination","Communicating with candidates":"Communication","Coordinating with hiring managers":"Stakeholder management","Maintaining employee records":"Documentation","Managing scheduling conflicts":"Problem solving","Following up on pending activities":"Task management"}', '₹8,50,000 - ₹12,00,000', 'Coordinate project sprints, cross-team communication, and milestone tracking. We value demonstrated transferable potential and welcome candidates returning from career breaks or non-traditional backgrounds.', '2026-10-25'),
('job_002', 'Operations & Delivery Associate', 'Cognitive Nexus Tech', 'Global Operations', 'Lucknow / Remote', 'Mid-Level', 2, true, '["Task management","Stakeholder management","Documentation","Process optimization"]', '["Spreadsheets (Excel/Sheets)","Conflict resolution","Client reporting"]', '{"HR operations":"Process optimization","Vendor coordination":"Stakeholder management","Records maintenance":"Documentation"}', '₹7,00,000 - ₹10,50,000', 'Drive daily operational cadence, cross-functional status reporting, and workflow optimization across delivery teams.', '2026-10-28'),
('job_003', 'Associate Business Analyst', 'Pulse Workforce Systems', 'Digital Transformation', 'Gurgaon / Hybrid', 'Entry-to-Mid', 1, true, '["Requirements gathering","Communication","Documentation","Problem solving"]', '["SQL","Data visualization","SAP S/4HANA Overview"]', '{"Employee feedback analysis":"Requirements gathering","Policy documentation":"Documentation"}', '₹9,00,000 - ₹13,00,000', 'Translate business stakeholder requirements into technical specifications, assist sprint planning, and participate in user acceptance testing.', '2026-10-29'),
('job_004', 'Full Stack AI Engineer', 'TechNova Innovations', 'AI Labs', 'Remote, India', 'Mid-Senior', 3, false, '["Python","FastAPI","React","TypeScript","LangChain","PostgreSQL"]', '["Docker","Vector Databases","Prompt Engineering"]', '{}', '₹18,00,000 - ₹28,00,000', 'Architect and deploy generative AI applications, integrating multi-agent LLM systems with modern reactive web interfaces.', '2026-10-15');

INSERT INTO public.course_resources (id, title, provider, is_sap_official, skills_covered, level, duration_hours, rating, url, description) VALUES
('course_sap_001', 'Discovering SAP Business Technology Platform (SAP BTP)', 'SAP Learning', true, '["SAP BTP","Cloud Integration","Enterprise Architecture"]', 'Beginner', 12, 4.9, 'https://learning.sap.com/learning-journeys/discover-sap-business-technology-platform', 'Official SAP learning journey covering cloud development, integrations, and enterprise business services on SAP BTP.'),
('course_sap_002', 'Project Management in the SAP Ecosystem & Agile Delivery', 'SAP Learning', true, '["Planning and coordination","Agile/Scrum","SAP Project Systems","Stakeholder management"]', 'Intermediate', 18, 4.9, 'https://learning.sap.com/learning-journeys/manage-projects-with-sap-activate', 'Learn project coordination fundamentals using SAP Activate methodology, agile sprint cadences, and stakeholder sign-offs.'),
('course_sap_003', 'Exploring SAP SuccessFactors for Modern Workforce Management', 'SAP Learning', true, '["HR operations","Workforce Analytics","Task management","Documentation"]', 'Beginner', 15, 4.8, 'https://learning.sap.com/learning-journeys/explore-sap-successfactors', 'Gain practical mastery of enterprise human experience management, internal talent mobility, and employee lifecycle data.'),
('course_004', 'JIRA & Confluence for Agile Project Coordinators', 'Atlassian University', false, '["JIRA","Task management","Planning and coordination","Agile/Scrum"]', 'Beginner', 8, 4.8, 'https://www.atlassian.com/university', 'Practical hands-on training to configure sprint boards, maintain backlogs, track blockers, and automate status reports.'),
('course_005', 'Executive Communication & Cross-Functional Stakeholder Alignment', 'Project Management Institute (PMI)', false, '["Communication","Stakeholder management","Problem solving"]', 'Intermediate', 10, 4.7, 'https://www.pmi.org/learning', 'Techniques for conflict resolution, executive briefings, risk mitigation communication, and cross-team alignment.'),
('course_006', 'Full Stack AI Agents & Multi-Agent Orchestration', 'DeepDev Academy', false, '["Python","LangChain","FastAPI","Prompt Engineering"]', 'Advanced', 32, 4.9, 'https://example.com/courses/llm-agents', 'Deep dive into building multi-agent systems with tool use, memory guardrails, and audit loops.');

INSERT INTO public.candidates (id, name, email, phone, location, current_or_previous_role, target_role, total_years_experience, has_career_break, career_break_years, career_break_reason, bio) VALUES
('cand_ayesha_khan', 'Ayesha Khan', 'ayesha.khan@example.com', '+91 98765 43210', 'Lucknow, India', 'HR Operations Associate', 'Project Coordinator', 2.0, true, 3.0, 'Family caregiving responsibilities & maternity leave; actively prepared for return to workforce', 'Former HR Operations professional with 2 years of experience coordinating cross-functional interviews, stakeholder alignment, and documentation. Returning after a 3-year career break and pivoting into Project Coordination with demonstrated organizational leadership.');

INSERT INTO public.candidate_skills (id, candidate_id, name, category, proficiency, validation_status, is_transferable, transferred_from_responsibility, confidence_score) VALUES
('skill_seed_1', 'cand_ayesha_khan', 'Planning and coordination', 'Operational & Coordination', 'Advanced', 'AI-Assessed', true, 'Interview scheduling & calendar operations', 94.0),
('skill_seed_2', 'cand_ayesha_khan', 'Communication', 'Communication & Stakeholder', 'Advanced', 'AI-Assessed', true, 'Communicating with candidates & onboarding debriefs', 92.0),
('skill_seed_3', 'cand_ayesha_khan', 'Stakeholder management', 'Communication & Stakeholder', 'Intermediate', 'AI-Assessed', true, 'Coordinating with senior hiring managers and department heads', 88.0),
('skill_seed_4', 'cand_ayesha_khan', 'Documentation', 'Operational & Coordination', 'Advanced', 'Evidence Submitted', true, 'Maintaining employee records, HR policies, and compliance logs', 90.0),
('skill_seed_5', 'cand_ayesha_khan', 'Problem solving', 'Leadership & Problem Solving', 'Intermediate', 'Self-Declared', true, 'Managing scheduling conflicts and urgent interviewer replacements', 85.0),
('skill_seed_6', 'cand_ayesha_khan', 'Task management', 'Operational & Coordination', 'Intermediate', 'Self-Declared', true, 'Following up on pending onboarding activities and compliance checklists', 87.0);

INSERT INTO public.skill_evidence (id, candidate_id, candidate_skill_id, skill_name, situation, task, action, result, raw_evidence_text, validation_status, validation_score, rubric_feedback, missing_details, suggested_followup_tasks) VALUES
('ev_seed_1', 'cand_ayesha_khan', 'skill_seed_1', 'Planning and coordination', 'At previous firm, our quarterly technical campus hiring drive faced a high collision rate of interviewer schedules across 5 engineering departments.', 'Responsible for scheduling, coordinating, and ensuring seamless execution of 120+ multi-stage interviews within a strict 3-day window.', 'Designed a synchronized calendar slotting system, established automated briefing channels for 25 interviewers, and maintained live real-time schedule adjustments using structured trackers.', 'Achieved a 98% on-time interview completion rate with 0 candidate dropouts due to scheduling confusion, recognized with an Operational Excellence badge.', 'Coordinated 120+ multi-stage technical interviews across 5 departments within 3 days with a 98% on-time rate.', 'AI-Assessed', 94.0, 'Demonstrates exceptional end-to-end operational planning, resource coordination, and agile contingency handling directly applicable to Project Coordination.', 'None. Evidence provides strong metrics, timeline constraints, and execution clarity.', 'Translate this workflow into an Agile Sprint coordination artifact using JIRA backlog milestones.'),
('ev_seed_2', 'cand_ayesha_khan', 'skill_seed_3', 'Stakeholder management', 'Hiring managers across Product, Engineering, and Design had conflicting criteria and delays in candidate evaluation feedback.', 'Align 8 senior department heads on a unified rubric and turnaround timeline of 24 hours.', 'Convened weekly alignment huddles, established standardized scorecard templates, and actively negotiated blocker resolutions directly with leadership.', 'Reduced candidate feedback turnaround time from 4.5 days to 18 hours, accelerating overall hiring velocity by 40%.', 'Aligned 8 senior department heads on a unified scorecard, cutting feedback latency from 4.5 days to 18 hours.', 'AI-Assessed', 91.0, 'Strong evidence of consensus-building, managing competing stakeholder expectations, and driving cross-functional process discipline.', 'Could include formal project management tooling used for reporting.', 'Present this experience within an Agile Scrum Retrospective format.');