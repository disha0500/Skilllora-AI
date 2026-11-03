# CareerBridge-AI 🚀

An autonomous multi-agent AI system designed to bridge the gap between job seekers, market demands, and personalized career upskilling.

---

## 📁 Project Architecture

```
CareerBridge-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── agents/
│   │   ├── skills_agent.py      # Extracts and analyzes technical and soft skills
│   │   ├── market_agent.py      # Analyzes market trends, salary ranges & demand
│   │   ├── learning_agent.py    # Curates personalized upskilling roadmaps
│   │   ├── matching_agent.py    # Scores job-candidate alignment and fit
│   │   └── bias_agent.py        # Audits recommendations for fairness and equity
│   │
│   ├── services/
│   │   ├── resume_parser.py     # Parses resume files and raw profile text
│   │   └── orchestrator.py      # Multi-agent coordination and pipeline orchestration
│   │
│   ├── database/
│   │   └── db.py                # Database connection & dataset loader
│   │
│   ├── main.py                  # FastAPI application entrypoint
│   └── requirements.txt         # Backend Python dependencies
│
├── data/
│   ├── jobs.json                # Job market dataset
│   └── courses.json             # Educational courses & certifications dataset
│
├── README.md
└── .env                         # Environment configuration
```

---

## 🤖 The Multi-Agent System

| Agent | Responsibility |
| :--- | :--- |
| **Skills Agent** | Extracts core competencies, evaluates proficiency levels, and structures candidate skill graphs. |
| **Market Agent** | Cross-references target roles with real-time labor market trends, demand velocity, and compensation benchmarks. |
| **Matching Agent** | Computes semantic and skill-based compatibility scores between candidate profiles and job descriptions. |
| **Learning Agent** | Identifies skill gaps and maps out targeted course recommendations and actionable learning pathways. |
| **Bias Agent** | Audits matching algorithms and recommendations to eliminate systemic bias and ensure equitable evaluation. |

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client application will run at: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Environment Variables
Copy `.env` and fill in required API keys:
- `GEMINI_API_KEY` or `OPENAI_API_KEY` for LLM agent reasoning.
- `PORT` and `HOST` for server configuration.

