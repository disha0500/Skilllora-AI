import React, { useState } from 'react';
import { careerService } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [role, setRole] = useState('candidate'); // 'candidate', 'recruiter', 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [previousRole, setPreviousRole] = useState('HR Operations Associate');
  const [targetRole, setTargetRole] = useState('Project Coordinator');
  const [hasCareerBreak, setHasCareerBreak] = useState(true);
  const [breakYears, setBreakYears] = useState(3.0);
  const [location, setLocation] = useState('Lucknow, India');

  if (!isOpen) return null;

  const handleQuickDemoLogin = async (demoEmail, demoRole) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await careerService.login({
        email: demoEmail,
        password: 'password123',
      });
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      console.warn('Backend login fallback', err);
      // Fallback demo state if backend temporarily unreachable
      const mockUser = {
        email: demoEmail,
        full_name: demoEmail.includes('ayesha') ? 'Ayesha Khan' : demoEmail.includes('recruiter') ? 'Rajesh Sharma' : 'Dr. Neha Verma',
        role: demoRole,
        organization: demoRole === 'recruiter' ? 'SAP Labs India' : 'SkillBridge AI',
        candidate_id: demoRole === 'candidate' ? 'cand_ayesha_khan' : null,
        token: 'demo_token_123',
      };
      onAuthSuccess(mockUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (authMode === 'login') {
        const res = await careerService.login({ email, password });
        onAuthSuccess(res.data.user);
        onClose();
      } else {
        const payload = {
          email,
          password,
          full_name: fullName,
          role,
          organization: organization || (role === 'candidate' ? 'Job Seeker' : 'Enterprise Tech'),
          previous_role: previousRole,
          target_role: targetRole,
          has_career_break: hasCareerBreak,
          career_break_years: parseFloat(breakYears) || 0,
          location,
        };
        const res = await careerService.signup(payload);
        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Authentication failed. Please check your inputs.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            color: '#64748b',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
          }}
        >
          ✕
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#001e4d', margin: 0 }}>
            SkillBridge<span style={{ color: '#0070f2' }}>AI</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {authMode === 'login' ? 'Sign in to access your inclusive career workspace' : 'Create an inclusive skills-first account'}
          </p>
        </div>

        {/* Quick Demo Sign-ins Box */}
        <div
          style={{
            backgroundColor: '#f0f7ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            ⚡ 1-Click Hackfest Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ayesha.khan@example.com', 'candidate')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                padding: '0.45rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1e3a8a',
                cursor: 'pointer',
              }}
            >
              👤 Candidate<br /><span style={{ fontWeight: 500, fontSize: '0.7rem' }}>Ayesha Khan</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('recruiter@sap.com', 'recruiter')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                padding: '0.45rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1e3a8a',
                cursor: 'pointer',
              }}
            >
              💼 Recruiter<br /><span style={{ fontWeight: 500, fontSize: '0.7rem' }}>Rajesh (SAP)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@skillbridge.ai', 'admin')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                padding: '0.45rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1e3a8a',
                cursor: 'pointer',
              }}
            >
              🛡️ Admin<br /><span style={{ fontWeight: 500, fontSize: '0.7rem' }}>Dr. Verma</span>
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              background: 'none',
              fontWeight: authMode === 'login' ? 700 : 500,
              color: authMode === 'login' ? '#0070f2' : '#64748b',
              borderBottom: authMode === 'login' ? '3px solid #0070f2' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              background: 'none',
              fontWeight: authMode === 'signup' ? 700 : 500,
              color: authMode === 'signup' ? '#0070f2' : '#64748b',
              borderBottom: authMode === 'signup' ? '3px solid #0070f2' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.85rem' }}>
          {/* Sign Up Specific Fields */}
          {authMode === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Select Role:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'candidate', label: 'Candidate' },
                    { id: 'recruiter', label: 'Recruiter' },
                    { id: 'admin', label: 'Auditor/Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      style={{
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: role === r.id ? '2px solid #0070f2' : '1px solid #cbd5e1',
                        backgroundColor: role === r.id ? '#eff6ff' : '#ffffff',
                        color: role === r.id ? '#0070f2' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {role === 'candidate' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>Previous Role:</label>
                      <input
                        type="text"
                        value={previousRole}
                        onChange={(e) => setPreviousRole(e.target.value)}
                        placeholder="e.g. HR Operations"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>Target Role:</label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Project Coordinator"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <input
                      type="checkbox"
                      id="careerBreak"
                      checked={hasCareerBreak}
                      onChange={(e) => setHasCareerBreak(e.target.checked)}
                      style={{ width: '1rem', height: '1rem' }}
                    />
                    <label htmlFor="careerBreak" style={{ fontSize: '0.8rem', color: '#334155' }}>
                      Returning from a career break (Family, Maternity, or Transition)
                    </label>
                  </div>

                  {hasCareerBreak && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>Career Break Duration (Years):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={breakYears}
                        onChange={(e) => setBreakYears(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}
                </>
              )}

              {role !== 'candidate' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Organization / Company:</label>
                  <input
                    type="text"
                    placeholder="e.g. SAP Labs India"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              )}
            </>
          )}

          {/* Standard Fields (Login & Sign Up) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Email Address:</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Password:</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#0070f2',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to SkillBridge AI' : 'Create My Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
