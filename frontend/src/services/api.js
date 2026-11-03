import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const careerService = {
  getJobs: () => apiClient.get('/jobs'),
  getCourses: () => apiClient.get('/courses'),
  parseResume: (resumeText) => apiClient.post('/parse-resume', { resume_text: resumeText }),
  analyzeCareer: (resumeText, targetRole) =>
    apiClient.post('/analyze-career', { resume_text: resumeText, target_role: targetRole }),
};

