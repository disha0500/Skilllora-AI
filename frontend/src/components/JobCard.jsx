import React from 'react';

export default function JobCard({ job }) {
  return (
    <div className="job-card" style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{job.title}</h4>
        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{job.match_score}% Match</span>
      </div>
      <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
        {job.company} • {job.location} • {job.salary_range}
      </p>
      {job.missing_skills?.length > 0 && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#b91c1c' }}>
          <strong>Skill Gap:</strong> {job.missing_skills.join(', ')}
        </div>
      )}
    </div>
  );
}

