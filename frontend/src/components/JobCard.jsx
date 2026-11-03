import React from 'react';

export default function JobCard({ job }) {
  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#001e4d' }}>{job.title}</h4>
          <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.875rem' }}>
            {job.company} • {job.department || 'Operations'} • {job.location} • {job.salary_range}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0070f2' }}>
            {job.overall_match_score || job.match_score}%
          </span>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Inclusive Match</div>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0.5rem 0' }}>
        <strong>Match Rationale:</strong> {job.match_rationale}
      </p>

      {job.matched_transferable_skills?.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Transferable Skills:</span>
          {job.matched_transferable_skills.map((s, idx) => (
            <span key={idx} className="badge badge-ai-assessed">✓ {s}</span>
          ))}
        </div>
      )}

      {job.missing_skills?.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>Upskilling Gap:</span>
          {job.missing_skills.map((s, idx) => (
            <span key={idx} className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
              + {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
