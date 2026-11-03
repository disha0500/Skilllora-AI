import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [pipelineData, setPipelineData] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  // Evidence Form State
  const [evidenceSkill, setEvidenceSkill] = useState('Planning and coordination');
  const [evidenceSituation, setEvidenceSituation] = useState(
    'Quarterly technical campus hiring drive with interviewer scheduling collisions across 5 departments.'
  );
  const [evidenceTask, setEvidenceTask] = useState(
    'Schedule 120+ multi-stage interviews within 3 days without candidate dropouts.'
  );
  const [evidenceAction, setEvidenceAction] = useState(
    'Built synchronized calendar trackers, established automated notification channels, and handled live swaps.'
  );
  const [evidenceResult, setEvidenceResult] = useState(
    '98% on-time interview completion with zero candidate dropouts, awarded Operational Excellence badge.'
  );
  const [evidenceFeedback, setEvidenceFeedback] = useState(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  // Recruiter job candidates state
  const [recruiterJobId, setRecruiterJobId] = useState('job_001');
  const [recruiterCandidates, setRecruiterCandidates] = useState(null);

  // Check backend server health and load initial demo data
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((res) => res.json())
      .then(() => {
        setServerOnline(true);
        loadAyeshaKhanDemo();
      })
      .catch((err) => {
        console.warn('Backend server offline or unreachable', err);
        setServerOnline(false);
        loadMockFallback();
      });
  }, []);

  const loadAyeshaKhanDemo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/demo/ayesha-khan`);
      if (!res.ok) throw new Error('Failed to fetch demo');
      const data = await res.json();
      setPipelineData(data);
    } catch (err) {
      console.warn('Error loading demo from backend, using fallback data', err);
      loadMockFallback();
    } finally {
      setLoading(false);
    }
  };

  const loadMockFallback = () => {
    setPipelineData({
      orchestrator_version: '2.0',
      candidate: {
        id: 'cand_ayesha_khan',
        name: 'Ayesha Khan',
        email: 'ayesha.khan@example.com',
        location: 'Lucknow, India',
        previous_role: 'HR Operations Associate',
        target_role: 'Project Coordinator',
        total_years_experience: 2.0,
        has_career_break: true,
        career_break_years: 3.0,
        career_break_reason: 'Family caregiving responsibilities & maternity leave',
        bio: 'Former HR Operations professional with 2 years of experience coordinating cross-functional interviews. Returning after a 3-year career break into Project Coordination.',
      },
      executive_summary:
        'Candidate Ayesha Khan demonstrates high potential for transition into Project Coordinator with 6 validated competencies (4 transferable). Top job match at SAP Enterprise Cloud scored 65.8% with complete career-break penalty immunity.',
      skills_discovery: {
        total_skills_discovered: 6,
        transferable_skills_count: 4,
        taxonomy_distribution: {
          'Self-Declared': 2,
          'Evidence Submitted': 1,
          'AI-Assessed': 3,
          'Human-Validated': 0,
        },
        discovered_skills: [
          {
            name: 'Planning and coordination',
            category: 'Operational & Coordination',
            proficiency: 'Advanced',
            validation_status: 'AI-Assessed',
            is_transferable: true,
            transferred_from: 'Interview scheduling',
            confidence_score: 94.0,
          },
          {
            name: 'Communication',
            category: 'Communication & Stakeholder',
            proficiency: 'Advanced',
            validation_status: 'AI-Assessed',
            is_transferable: true,
            transferred_from: 'Communicating with candidates',
            confidence_score: 92.0,
          },
          {
            name: 'Stakeholder management',
            category: 'Communication & Stakeholder',
            proficiency: 'Intermediate',
            validation_status: 'AI-Assessed',
            is_transferable: true,
            transferred_from: 'Coordinating with hiring managers',
            confidence_score: 88.0,
          },
          {
            name: 'Documentation',
            category: 'Operational & Coordination',
            proficiency: 'Advanced',
            validation_status: 'Evidence Submitted',
            is_transferable: true,
            transferred_from: 'Maintaining employee records',
            confidence_score: 90.0,
          },
          {
            name: 'Problem solving',
            category: 'Leadership & Problem Solving',
            proficiency: 'Intermediate',
            validation_status: 'Self-Declared',
            is_transferable: true,
            transferred_from: 'Managing scheduling conflicts',
            confidence_score: 85.0,
          },
          {
            name: 'Task management',
            category: 'Operational & Coordination',
            proficiency: 'Intermediate',
            validation_status: 'Self-Declared',
            is_transferable: true,
            transferred_from: 'Following up on pending activities',
            confidence_score: 87.0,
          },
        ],
      },
      evidence_validation: {
        total_evidence_items: 2,
        assessed_records: [
          {
            skill_name: 'Planning and coordination',
            validation_status: 'AI-Assessed',
            validation_score: 94.0,
            rubric_feedback:
              'Demonstrates exceptional end-to-end operational planning, resource coordination, and agile contingency handling.',
            suggested_followup_tasks: 'Translate this workflow into an Agile Sprint coordination artifact using JIRA backlog milestones.',
          },
          {
            skill_name: 'Stakeholder management',
            validation_status: 'AI-Assessed',
            validation_score: 91.0,
            rubric_feedback:
              'Strong evidence of consensus-building, managing competing stakeholder expectations, and driving cross-functional process discipline.',
            suggested_followup_tasks: 'Present this experience within an Agile Scrum Retrospective format.',
          },
        ],
      },
      market_intelligence: {
        target_role: 'Project Coordinator',
        demand_index: 'Very High',
        market_alignment_score: 71.4,
        salary_range: '₹7,50,000 - ₹12,50,000',
        growth_velocity: '+18.4% YoY in Enterprise Tech & Cloud',
        inclusive_returnee_sentiment: 'Very High (82% of top tech employers actively seek returnees with operational aptitude)',
        in_demand_skills: ['Planning and coordination', 'Stakeholder management', 'Communication', 'Task management', 'Agile/Scrum', 'JIRA'],
        emerging_tools: ['SAP Project Systems', 'SAP Activate', 'Confluence', 'Asana'],
      },
      inclusive_job_matches: [
        {
          job_id: 'job_001',
          title: 'Project Coordinator',
          company: 'SAP Enterprise Cloud Solutions',
          department: 'Workforce Delivery',
          location: 'Bangalore / Hybrid (Remote-Friendly)',
          overall_match_score: 65.8,
          score_breakdown: {
            direct_skill_match_pct: 0.0,
            transferable_skill_match_pct: 80.0,
            evidence_validation_boost_pct: 4.5,
            career_break_penalty_deduction: 0.0,
          },
          matched_transferable_skills: [
            'Planning and coordination',
            'Communication',
            'Stakeholder management',
            'Documentation',
            'Task management',
          ],
          missing_skills: ['Agile/Scrum', 'JIRA', 'SAP Project Systems'],
          break_mitigation_applied: true,
          match_rationale:
            'Successfully validated 5 transferable skills from previous operations. Career break of 3.0 yrs protected with 0% score penalty.',
        },
      ],
      learning_pathway: {
        target_role: 'Project Coordinator',
        estimated_completion_time: '24 hours across 6 weeks',
        sap_learning_spotlight: {
          source: 'SAP Learning Hub (https://learning.sap.com/)',
          certified_modules: 3,
          featured_course: 'Project Management in the SAP Ecosystem & Agile Delivery',
        },
        recommended_courses: [
          {
            id: 'course_sap_002',
            title: 'Project Management in the SAP Ecosystem & Agile Delivery',
            provider: 'SAP Learning',
            is_sap_official: true,
            duration_hours: 18,
            rating: 4.9,
            url: 'https://learning.sap.com/learning-journeys/manage-projects-with-sap-activate',
            skills_addressed: ['Planning and coordination', 'Agile/Scrum', 'SAP Project Systems', 'Stakeholder management'],
          },
          {
            id: 'course_004',
            title: 'JIRA & Confluence for Agile Project Coordinators',
            provider: 'Atlassian University',
            is_sap_official: false,
            duration_hours: 8,
            rating: 4.8,
            url: 'https://www.atlassian.com/university',
            skills_addressed: ['JIRA', 'Task management', 'Planning and coordination', 'Agile/Scrum'],
          },
        ],
        structured_roadmap: [
          {
            phase: 'Phase 1: Foundations & Tooling (Weeks 1 - 2)',
            focus_area: 'Agile Sprints & Project Coordination Frameworks',
            recommended_resource: 'JIRA & Confluence for Agile Project Coordinators',
            practical_task: 'Create a sample JIRA sprint board, define 5 user stories, and map task dependencies.',
          },
          {
            phase: 'Phase 2: Enterprise Methodology (Weeks 3 - 4)',
            focus_area: 'SAP Activate Methodology & Cross-Team Governance',
            recommended_resource: 'Project Management in the SAP Ecosystem & Agile Delivery (SAP Learning)',
            practical_task: 'Draft a cross-functional communication plan and stakeholder RACI matrix.',
          },
          {
            phase: 'Phase 3: Applied Capstone & Evidence (Weeks 5 - 6)',
            focus_area: 'End-to-End Delivery Simulation & STAR Portfolio Validation',
            recommended_resource: 'Executive Communication & Cross-Functional Alignment',
            practical_task: 'Submit completed sprint artifacts to the Evidence Validation Agent for AI assessment.',
          },
        ],
      },
      bias_audit_report: {
        audit_status: 'PASSED - CERTIFIED INCLUSIVE',
        fairness_confidence_score: 99.0,
        career_break_neutrality_verified: true,
        checks_passed: [
          'Career Break Protection Active: Candidate 3-year career break did NOT reduce ranking or compatibility scores.',
          'Demographic Neutrality: Candidate age, gender, and institution pedigree were excluded from feature evaluation.',
          'Cross-Occupational Inclusivity: Transferable skills contributed 80.0% to candidate top match score.',
          'Audit Transparency: Candidate and Recruiter receive clear natural language matching rationales.',
          'Score Normalization: Scoring curve is calibrated within 0-98.5% realistic bounds.',
        ],
        bias_flags: [],
        auditor_summary:
          'Fairness audit PASSED - CERTIFIED INCLUSIVE. Verified that candidate evaluation is strictly competency-based and protects equal opportunity across non-traditional career paths.',
      },
    });
  };

  const handleEvidenceSubmit = async (e) => {
    e.preventDefault();
    setEvidenceLoading(true);
    setEvidenceFeedback(null);

    const payload = {
      candidate_id: pipelineData?.candidate?.id || 'cand_ayesha_khan',
      skill_name: evidenceSkill,
      situation: evidenceSituation,
      task: evidenceTask,
      action: evidenceAction,
      result: evidenceResult,
    };

    try {
      const res = await fetch(`${API_BASE}/candidate/submit-evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      setEvidenceFeedback(data.evaluation);
      // Reload demo to refresh pipeline
      loadAyeshaKhanDemo();
    } catch (err) {
      console.warn('Backend submit error, using local evaluation', err);
      setEvidenceFeedback({
        validation_score: 92.0,
        validation_status: 'AI-Assessed',
        is_evidence_sufficient: true,
        rubric_feedback:
          'Relevance: 30/30 pts for direct alignment. Demonstrated Action: 32/35 pts for agency in calendar routing. Impact & Results: 30/35 pts for 98% completion metric.',
        missing_details: 'Evidence provides comprehensive operational context.',
        suggested_followup_tasks: 'Prepare to articulate this STAR example during technical or behavioral interviews.',
      });
    } finally {
      setEvidenceLoading(false);
    }
  };

  const handleFetchRecruiterCandidates = async (jobId) => {
    setRecruiterJobId(jobId);
    try {
      const res = await fetch(`${API_BASE}/recruiter/jobs/${jobId}/candidates`);
      if (!res.ok) throw new Error('Recruiter candidates fetch failed');
      const data = await res.json();
      setRecruiterCandidates(data.candidates);
    } catch (err) {
      console.warn('Recruiter fetch fallback', err);
      setRecruiterCandidates([
        {
          candidate_name: 'Ayesha Khan',
          location: 'Lucknow, India',
          previous_role: 'HR Operations Associate',
          has_career_break: true,
          career_break_years: 3.0,
          match_score: 65.8,
          score_breakdown: {
            direct_skill_match_pct: 0.0,
            transferable_skill_match_pct: 80.0,
            evidence_validation_boost_pct: 4.5,
            career_break_penalty_deduction: 0.0,
          },
          matched_transferable_skills: [
            'Planning and coordination',
            'Communication',
            'Stakeholder management',
            'Documentation',
            'Task management',
          ],
          break_penalty_neutralized: true,
          match_rationale: 'Validated 5 transferable skills from HR Operations. 0% penalty applied for 3-yr career break.',
        },
      ]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: '#001e4d', color: '#ffffff', padding: '0.5rem 1.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ backgroundColor: '#f59e0b', color: '#001e4d', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
            SAP HACKFEST 2026
          </span>
          <span>Theme: <strong>Inclusive Workforce</strong> • Cross-Occupational Skill Transfer Platform</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serverOnline ? '#10b981' : '#f59e0b' }}></span>
          <span>Backend Server: <strong>{serverOnline ? 'Connected (Port 8000)' : 'Demo Mode (Offline Fallback)'}</strong></span>
        </div>
      </div>

      {/* Main Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#001e4d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              SkillBridge<span style={{ color: '#0070f2' }}>AI</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Your Skills. Your Potential. Your Next Opportunity.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={loadAyeshaKhanDemo}
              disabled={loading}
              style={{
                backgroundColor: '#0070f2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.6rem 1.2rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              🌟 {loading ? 'Orchestrating Agents...' : 'Run Demo Persona: Ayesha Khan'}
            </button>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              📄 Swagger API Docs
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: '📊 Candidate Overview' },
            { id: 'skills', label: '🔄 Skills & Transferability (Agent 1)' },
            { id: 'evidence', label: '📝 STAR Evidence Studio (Agent 6)' },
            { id: 'matches', label: '🎯 Inclusive Job Matching (Agent 4)' },
            { id: 'learning', label: '📚 SAP Learning Pathway (Agent 3)' },
            { id: 'recruiter', label: '💼 Recruiter Portal' },
            { id: 'governance', label: '⚖️ Bias & Fairness Audit (Agent 5)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'recruiter') handleFetchRecruiterCandidates('job_001');
              }}
              style={{
                padding: '0.9rem 0.2rem',
                border: 'none',
                background: 'none',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#0070f2' : '#64748b',
                borderBottom: activeTab === tab.id ? '3px solid #0070f2' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1rem', flex: 1, width: '100%' }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && pipelineData && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Candidate Header Banner */}
            <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pipelineData.candidate.name}</h2>
                    <span className="badge badge-ai-assessed">Demo Persona Verified</span>
                    {pipelineData.candidate.has_career_break && (
                      <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                        Career Break: {pipelineData.candidate.career_break_years} yrs (Protected)
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    <strong>Previous Role:</strong> {pipelineData.candidate.previous_role} • <strong>Target Role:</strong> {pipelineData.candidate.target_role} • <strong>Location:</strong> {pipelineData.candidate.location}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '850px' }}>
                    {pipelineData.candidate.bio}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>Fairness Confidence</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                    {pipelineData.bias_audit_report.fairness_confidence_score}%
                  </div>
                  <span className="badge badge-human-validated">{pipelineData.bias_audit_report.audit_status}</span>
                </div>
              </div>
            </div>

            {/* Orchestrator Executive Summary */}
            <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0070f2' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0070f2', marginBottom: '0.35rem' }}>
                🤖 AI Career Orchestrator Executive Synthesis
              </h3>
              <p style={{ color: '#334155', fontSize: '0.95rem' }}>{pipelineData.executive_summary}</p>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Discovered Competencies</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                  {pipelineData.skills_discovery.total_skills_discovered} Skills
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                  {pipelineData.skills_discovery.transferable_skills_count} Transferable Across Domains
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Top Inclusive Job Match</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0070f2', margin: '0.2rem 0' }}>
                  {pipelineData.inclusive_job_matches[0]?.overall_match_score}% Match
                </div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                  0% Break Penalty • Career-Break Protected
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Market Demand Velocity</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', margin: '0.2rem 0' }}>
                  {pipelineData.market_intelligence.demand_index}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Est. Salary: {pipelineData.market_intelligence.salary_range}
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SAP Learning Upskilling</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#001e4d', margin: '0.2rem 0' }}>
                  {pipelineData.learning_pathway.recommended_courses.length} Courses
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0070f2', fontWeight: 600 }}>
                  {pipelineData.learning_pathway.sap_learning_spotlight.certified_modules} Official SAP Modules
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS & TRANSFERABILITY */}
        {activeTab === 'skills' && pipelineData && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                Cross-Occupational Transferable Competency Studio
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Agent 1 inspects operational responsibilities from <strong>{pipelineData.candidate.previous_role}</strong> and validates transferable equivalents for <strong>{pipelineData.candidate.target_role}</strong> without requiring exact job-title keyword matching.
              </p>

              {/* Taxonomy Legend */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>4-Tier Verification Taxonomy:</span>
                <span className="badge badge-self-declared">Self-Declared ({pipelineData.skills_discovery.taxonomy_distribution['Self-Declared']})</span>
                <span className="badge badge-evidence-submitted">Evidence Submitted ({pipelineData.skills_discovery.taxonomy_distribution['Evidence Submitted']})</span>
                <span className="badge badge-ai-assessed">AI-Assessed ({pipelineData.skills_discovery.taxonomy_distribution['AI-Assessed']})</span>
                <span className="badge badge-human-validated">Human-Validated ({pipelineData.skills_discovery.taxonomy_distribution['Human-Validated']})</span>
              </div>

              {/* Table of Skills */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '0.75rem' }}>Target Competency</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Transferred From Responsibility</th>
                      <th style={{ padding: '0.75rem' }}>Verification Status</th>
                      <th style={{ padding: '0.75rem' }}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipelineData.skills_discovery.discovered_skills.map((skill, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{skill.name}</td>
                        <td style={{ padding: '0.75rem', color: '#475569' }}>{skill.category}</td>
                        <td style={{ padding: '0.75rem', color: '#0284c7' }}>
                          {skill.is_transferable ? `↳ ${skill.transferred_from}` : 'Direct'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${
                            skill.validation_status === 'AI-Assessed' ? 'badge-ai-assessed' :
                            skill.validation_status === 'Evidence Submitted' ? 'badge-evidence-submitted' :
                            skill.validation_status === 'Human-Validated' ? 'badge-human-validated' : 'badge-self-declared'
                          }`}>
                            {skill.validation_status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{skill.confidence_score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STAR EVIDENCE STUDIO */}
        {activeTab === 'evidence' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {/* Form Column */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                Agent 6: STAR Practical Evidence Assessment
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Demonstrate actual capability. Submit practical examples formatted in STAR (Situation, Task, Action, Result) methodology.
              </p>

              <form onSubmit={handleEvidenceSubmit} style={{ display: 'grid', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Target Skill:</label>
                  <select
                    value={evidenceSkill}
                    onChange={(e) => setEvidenceSkill(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Planning and coordination">Planning and coordination</option>
                    <option value="Stakeholder management">Stakeholder management</option>
                    <option value="Communication">Communication</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Task management">Task management</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Situation:</label>
                  <textarea
                    rows={2}
                    value={evidenceSituation}
                    onChange={(e) => setEvidenceSituation(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Task:</label>
                  <textarea
                    rows={2}
                    value={evidenceTask}
                    onChange={(e) => setEvidenceTask(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Action Taken:</label>
                  <textarea
                    rows={3}
                    value={evidenceAction}
                    onChange={(e) => setEvidenceAction(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Measurable Result / Impact:</label>
                  <textarea
                    rows={2}
                    value={evidenceResult}
                    onChange={(e) => setEvidenceResult(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={evidenceLoading}
                  style={{
                    backgroundColor: '#0070f2',
                    color: '#fff',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {evidenceLoading ? 'Evaluating with Evidence Agent...' : 'Submit Evidence for AI Validation'}
                </button>
              </form>
            </div>

            {/* Results / Feedback Column */}
            <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
              {evidenceFeedback && (
                <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', backgroundColor: '#f0fdf4' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 800, color: '#065f46' }}>Assessment Result</h4>
                    <span className="badge badge-ai-assessed">{evidenceFeedback.validation_status}</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', marginBottom: '0.5rem' }}>
                    {evidenceFeedback.validation_score}/100
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '0.75rem' }}>
                    <strong>Rubric Feedback:</strong> {evidenceFeedback.rubric_feedback}
                  </p>
                  <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.8rem' }}>
                    <strong>Next Action / Follow-up:</strong> {evidenceFeedback.suggested_followup_tasks}
                  </div>
                </div>
              )}

              {/* Pre-existing assessed evidence list */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Currently Validated Evidence Records</h4>
                {pipelineData?.evidence_validation?.assessed_records?.map((rec, i) => (
                  <div key={i} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{rec.skill_name}</strong>
                      <span className="badge badge-ai-assessed">{rec.validation_score}% Score</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>{rec.rubric_feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INCLUSIVE JOB MATCHING */}
        {activeTab === 'matches' && pipelineData && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Inclusive Matching Engine (Agent 4)</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Evaluates candidate compatibility combining direct and transferable competencies with <strong>zero career-break penalty</strong>.
                  </p>
                </div>
                <div style={{ backgroundColor: '#ecfdf5', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
                  🛡️ 0% Deduction Guarantee for Career Breaks Active
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {pipelineData.inclusive_job_matches.map((job) => (
              <div key={job.job_id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#001e4d' }}>{job.title}</h4>
                    <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                      {job.company} • {job.department} • {job.location}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0070f2' }}>{job.overall_match_score}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Composite Inclusive Match</div>
                  </div>
                </div>

                {/* Score Breakdown Bar */}
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Transferable Match:</span>{' '}
                    <strong style={{ color: '#0284c7' }}>{job.score_breakdown?.transferable_skill_match_pct}%</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Evidence Boost:</span>{' '}
                    <strong style={{ color: '#10b981' }}>+{job.score_breakdown?.evidence_validation_boost_pct}%</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Career Break Penalty:</span>{' '}
                    <strong style={{ color: '#047857' }}>{job.score_breakdown?.career_break_penalty_deduction}% (None)</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.75rem' }}>
                  <strong>Match Rationale:</strong> {job.match_rationale}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Validated Competencies:</span>
                  {job.matched_transferable_skills?.map((sk, idx) => (
                    <span key={idx} className="badge badge-ai-assessed">✓ {sk}</span>
                  ))}
                  {job.missing_skills?.length > 0 && (
                    <>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c', marginLeft: '0.5rem' }}>Targeted Skill Gaps:</span>
                      {job.missing_skills.map((sk, idx) => (
                        <span key={idx} className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
                          + {sk}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SAP LEARNING PATHWAY */}
        {activeTab === 'learning' && pipelineData && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #001e4d 0%, #003366 100%)', color: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ backgroundColor: '#f59e0b', color: '#001e4d', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    SAP LEARNING ECOSYSTEM
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
                    {pipelineData.learning_pathway.sap_learning_spotlight.featured_course}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    Curated via <strong>SAP Learning Hub</strong> (https://learning.sap.com/) to build project readiness for enterprise SAP Activate and cloud delivery.
                  </p>
                </div>
                <a
                  href="https://learning.sap.com/learning-journeys/manage-projects-with-sap-activate"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#001e4d',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Open SAP Learning Hub ↗
                </a>
              </div>
            </div>

            {/* 6-Week Structured Roadmap */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
                Structured Milestone Pathway ({pipelineData.learning_pathway.estimated_completion_time})
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pipelineData.learning_pathway.structured_roadmap.map((step, idx) => (
                  <div key={idx} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ color: '#0070f2' }}>{step.phase}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Milestone {idx + 1}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{step.focus_area}</div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.25rem' }}>
                      <strong>Resource:</strong> {step.recommended_resource}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#047857' }}>
                      <strong>Hands-on Practice:</strong> {step.practical_task}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Catalog */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Recommended Upskilling Courses</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {pipelineData.learning_pathway.recommended_courses.map((c, i) => (
                  <div key={i} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {c.is_sap_official && (
                        <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', marginBottom: '0.5rem' }}>
                          SAP Official Course
                        </span>
                      )}
                      <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{c.title}</h5>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        {c.provider} • {c.duration_hours} hrs • Rating: ⭐ {c.rating}
                      </p>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {c.skills_addressed?.map((sk, k) => (
                          <span key={k} className="badge badge-ai-assessed">{sk}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textAlign: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0070f2',
                      }}
                    >
                      View Curriculum ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RECRUITER PORTAL */}
        {activeTab === 'recruiter' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                Recruiter Portal: Inclusive Candidate Pipeline
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Review candidates ranked by demonstrated competencies and verified transferable potential rather than keyword filters.
              </p>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Select Requisition:</label>
                <select
                  value={recruiterJobId}
                  onChange={(e) => handleFetchRecruiterCandidates(e.target.value)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                >
                  <option value="job_001">Project Coordinator (SAP Enterprise Cloud)</option>
                  <option value="job_002">Operations & Delivery Associate (Cognitive Nexus)</option>
                  <option value="job_003">Associate Business Analyst (Pulse Workforce)</option>
                </select>
              </div>

              {recruiterCandidates?.map((cand, idx) => (
                <div key={idx} style={{ padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{cand.candidate_name}</h4>
                        {cand.has_career_break && (
                          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                            Returnee ({cand.career_break_years} yrs break)
                          </span>
                        )}
                        <span className="badge badge-human-validated">Career-Break Penalty: 0%</span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        Previous Role: {cand.previous_role} • {cand.location}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0070f2' }}>{cand.match_score}%</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Transferable Fit</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0.75rem 0' }}>
                    <strong>Hiring Justification:</strong> {cand.match_rationale}
                  </p>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Transferable Competencies:</span>
                    {cand.matched_transferable_skills?.map((sk, k) => (
                      <span key={k} className="badge badge-ai-assessed">{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BIAS & FAIRNESS AUDIT */}
        {activeTab === 'governance' && pipelineData && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46' }}>
                    Agent 5: Algorithmic Fairness & Bias Audit Certificate
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.875rem' }}>
                    Continuous verification of demographic neutrality, pedigree masking, and career break immunity.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
                    {pipelineData.bias_audit_report.fairness_confidence_score}%
                  </div>
                  <span className="badge badge-human-validated">{pipelineData.bias_audit_report.audit_status}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {pipelineData.bias_audit_report.checks_passed.map((check, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#166534' }}>
                    <span>✅</span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#f8fafc' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Auditor Oversight Statement</h4>
              <p style={{ color: '#475569', fontSize: '0.875rem' }}>
                {pipelineData.bias_audit_report.auditor_summary}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1.5rem 2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p>
          <strong>SkillBridge AI</strong> — SAP Hackfest 2026: Inclusive Workforce Submission
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          Aligning with <strong>SAP Learning</strong>, <strong>SAP SuccessFactors</strong>, and <strong>SAP BTP</strong>.
        </p>
      </footer>
    </div>
  );
}
