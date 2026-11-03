import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const careerService = {
  // Auth & Accounts
  login: (credentials) => apiClient.post('/auth/login', credentials),
  signup: (userData) => apiClient.post('/auth/signup', userData),
  getDemoUsers: () => apiClient.get('/auth/demo-users'),

  // Demo Persona
  getAyeshaDemo: () => apiClient.get('/demo/ayesha-khan'),
  resetAyeshaDemo: () => apiClient.post('/demo/ayesha-khan/reset'),

  // Candidate Actions
  saveProfile: (profile) => apiClient.post('/candidate/profile', profile),
  getCandidate: (id) => apiClient.get(`/candidate/${id}`),
  discoverSkills: (payload) => apiClient.post('/candidate/discover-skills', payload),
  submitEvidence: (evidence) => apiClient.post('/candidate/submit-evidence', evidence),
  getCandidateMatches: (id) => apiClient.get(`/candidate/${id}/matches`),
  getLearningPathway: (id) => apiClient.get(`/candidate/${id}/learning-pathway`),
  orchestrateCareer: (payload) => apiClient.post('/candidate/orchestrate-career', payload),

  // Recruiter
  getJobs: () => apiClient.get('/recruiter/jobs'),
  createJob: (jobData) => apiClient.post('/recruiter/jobs', jobData),
  getCandidatesForJob: (jobId) => apiClient.get(`/recruiter/jobs/${jobId}/candidates`),

  // Admin & Governance
  getBiasAudits: () => apiClient.get('/admin/bias-audits'),
  getAnalytics: () => apiClient.get('/admin/analytics'),
  getAgentStatus: () => apiClient.get('/admin/agent-status'),
};
