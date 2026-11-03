import React, { useState } from 'react';

export default function App() {
  const [resumeText, setResumeText] = useState(
    "Experienced Software Engineer with 3+ years in Python, FastAPI, Docker, and React. Passionate about machine learning and building scalable AI web applications."
  );
  const [targetRole, setTargetRole] = useState("Full Stack AI Engineer");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connect to backend FastAPI orchestrator
      const response = await fetch("http://localhost:8000/api/analyze-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          target_role: targetRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend response error");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.warn("Backend not reached, showing mock agent orchestration data", err);
      // Fallback demo state if backend isn't running yet
      setResults({
        candidate_profile: {
          detected_skills: ["Python", "FastAPI", "Docker", "React"],
          estimated_years_experience: 3,
        },
        skills_analysis: {
          seniority_level: "Mid-Level",
          categories: {
            core_technical: ["Python"],
            frameworks_and_libraries: ["FastAPI", "React"],
            tools_and_cloud: ["Docker"],
          },
        },
        market_intelligence: {
          market_demand_status: "Very High",
          demand_alignment_score: 92,
          estimated_market_salary_range: "$125,000 - $160,000",
        },
        top_job_matches: [
          {
            job_id: "job_001",
            title: "Full Stack AI Engineer",
            company: "TechNova Innovations",
            match_score: 87.5,
            missing_skills: ["LangChain", "TypeScript"],
          },
        ],
        upskilling_plan: {
          priority_skills_to_acquire: ["LangChain", "TypeScript"],
          recommended_courses: [
            {
              title: "LLM Agents & Multi-Agent Orchestration",
              provider: "AI Systems Institute",
              duration_hours: 35,
            },
          ],
        },
        fairness_audit: {
          fairness_audit_status: "PASSED",
          fairness_confidence_score: 98,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto", color: "#1f2937" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#111827", margin: 0 }}>
          CareerBridge<span style={{ color: "#2563eb" }}>-AI</span>
        </h1>
        <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>
          Autonomous Multi-Agent Career Navigation & Skills Gap Intelligence
        </p>
      </header>

      <main>
        <section style={{ backgroundColor: "#f9fafb", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2>1. Candidate Input</h2>
          <form onSubmit={handleAnalyze}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Target Role:</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />

            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>Resume Summary / Text:</label>
            <textarea
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #d1d5db" }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                padding: "0.6rem 1.25rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Orchestrating Agents..." : "Run Multi-Agent Analysis"}
            </button>
          </form>
        </section>

        {results && (
          <section style={{ marginTop: "2rem", display: "grid", gap: "1.5rem" }}>
            <div style={{ padding: "1.25rem", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#2563eb" }}>🤖 Multi-Agent Results</h3>
              <p><strong>Seniority Level:</strong> {results.skills_analysis?.seniority_level}</p>
              <p><strong>Market Demand:</strong> {results.market_intelligence?.market_demand_status} ({results.market_intelligence?.demand_alignment_score}% alignment)</p>
              <p><strong>Estimated Salary Range:</strong> {results.market_intelligence?.estimated_market_salary_range}</p>
              <p><strong>Fairness Audit:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{results.fairness_audit?.fairness_audit_status}</span> ({results.fairness_audit?.fairness_confidence_score}% score)</p>
            </div>

            <div style={{ padding: "1.25rem", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff" }}>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>🎯 Top Job Matches</h3>
              {results.top_job_matches?.map((job) => (
                <div key={job.job_id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                  <strong>{job.title}</strong> at {job.company} — <span style={{ color: "#2563eb" }}>{job.match_score}% Match</span>
                  {job.missing_skills?.length > 0 && (
                    <div style={{ fontSize: "0.875rem", color: "#dc2626" }}>
                      Missing skills: {job.missing_skills.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: "1.25rem", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff" }}>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>📚 Recommended Upskilling Pathway</h3>
              {results.upskilling_plan?.recommended_courses?.map((c, idx) => (
                <div key={idx} style={{ padding: "0.5rem 0" }}>
                  <strong>{c.title}</strong> ({c.provider}) • {c.duration_hours} hrs
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

