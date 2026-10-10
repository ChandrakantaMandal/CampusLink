# CampusLink AI — Placement Intelligence & NLP Microservice

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![PyMuPDF](https://img.shields.io/badge/PyMuPDF-PDF_Extraction-green?style=for-the-badge)](https://pymupdf.readthedocs.io/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine_Learning-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI_Server-499848?style=for-the-badge)](https://www.uvicorn.org/)

> **CampusLink AI** is the specialized Python microservice powering intelligent candidate matching, deterministic skill-gap calculations, PDF resume extraction, and Gemini-based career readiness scoring. Operating as an isolated service on port `8000`, it decouples computationally heavy NLP and AI workloads from the core Node.js server.

---

## 📑 Table of Contents

- [Architectural Philosophy: Hybrid Intelligence](#-architectural-philosophy-hybrid-intelligence)
- [Directory Structure](#-directory-structure)
- [Core Services & Algorithms](#-core-services--algorithms)
  - [1. Deterministic Skill Matching (`job_matching.py`)](#1-deterministic-skill-matching-job_matchingpy)
  - [2. Skill Gap & Normalization Engine (`skill_gap.py`)](#2-skill-gap--normalization-engine-skill_gappy)
  - [3. Safe PDF Extraction & Resume Parser (`resume_analyzer.py`)](#3-safe-pdf-extraction--resume-parser-resume_analyzerpy)
  - [4. Career Readiness Scorer (`readiness.py`)](#4-career-readiness-scorer-readinesspy)
  - [5. Personalized Skill Recommendations (`recommendation.py`)](#5-personalized-skill-recommendations-recommendationpy)
- [FastAPI Endpoints Reference](#-fastapi-endpoints-reference)
  - [`POST /match/`](#post-match)
  - [`POST /skill-gap/`](#post-skill-gap)
  - [`POST /readiness/`](#post-readiness)
  - [`POST /resume/analyze-text/`](#post-resumeanalyze-text)
  - [`POST /resume/analyze-pdf/`](#post-resumeanalyze-pdf)
  - [`POST /recommendation/`](#post-recommendation)
  - [`GET /health`](#get-health)
- [Environment Configuration](#-environment-configuration)
- [Installation & Running](#-installation--running)
  - [Windows (PowerShell)](#windows-powershell)
  - [Linux / macOS](#linux--macos)
  - [Docker Setup](#docker-setup)
- [Integration with Express Backend](#-integration-with-express-backend)

---

## 🧠 Architectural Philosophy: Hybrid Intelligence

CampusLink AI implements a **dual-layer intelligence design** that avoids the pitfalls of relying exclusively on Large Language Models for deterministic placement workflows:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     LAYER 1: DETERMINISTIC ENGINE                      │
│                  (Fast, Explainable, Zero Rate Limits)                 │
├────────────────────────────────────────────────────────────────────────┤
│ • Canonical Skill Normalization:                                       │
│     "sklearn" / "scikit learn" / "scikit_learn"  ──▶  "scikit-learn"   │
│     "fast-api" / "fast api"                      ──▶  "fastapi"        │
│     "reactjs" / "react.js"                       ──▶  "react"          │
│ • Mathematical Set Operations:                                         │
│     Matched Skills = StudentSkills ∩ RequiredSkills                    │
│     Missing Skills = RequiredSkills \ StudentSkills                    │
│     Skill Gap %    = (|MissingSkills| / |RequiredSkills|) * 100        │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    LAYER 2: GENERATIVE AI (GEMINI)                     │
│                (Contextual, Unstructured, Qualitative)                 │
├────────────────────────────────────────────────────────────────────────┤
│ • PyMuPDF text stream extraction with 12,000 char prompt safety cap.   │
│ • Structured JSON extraction: skills, projects, strengths, weaknesses. │
│ • Personalized advice generation for bridging candidate skill gaps.    │
│ • Holistic career readiness evaluation with strict schema validation.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```text
apps/ai/
├── app/
│   ├── main.py                      # FastAPI initialization, CORS, router mounting, healthcheck
│   │
│   ├── api/                         # FastAPI router modules
│   │   ├── matching.py              # Candidate-to-job matching route (/match/)
│   │   ├── skill_gap.py             # Missing skills analysis route (/skill-gap/)
│   │   ├── readiness.py             # Career readiness scoring route (/readiness/)
│   │   ├── resume.py                # Resume text & PDF analysis routes (/resume/*)
│   │   └── recommendation.py        # Tailored improvement suggestions route (/recommendation/)
│   │
│   ├── ml/                          # NLP and Machine Learning modules
│   │   ├── preprocessing.py         # Text cleaning and token normalization
│   │   ├── skill_extraction.py      # Regex & vocabulary-based skill detectors
│   │   ├── resume_sections.py       # Header boundary detectors (Skills, Projects, Education)
│   │   ├── similarity.py            # Cosine similarity and vector comparisons
│   │   └── scoring.py               # Weighted composite score calculators
│   │
│   ├── schemas/                     # Pydantic data validation schemas
│   │
│   └── services/                    # Core business logic implementations
│       ├── gemini.py                # Google GenAI SDK client (gemini-2.5-flash)
│       ├── job_matching.py          # High-speed local matching engine (zero Gemini calls)
│       ├── skill_gap.py             # Mathematical skill-gap calculator & alias normalizer
│       ├── resume_analyzer.py       # PyMuPDF extractor + structured Gemini analyzer
│       ├── readiness.py             # Career readiness evaluator with schema enforcement
│       └── recommendation.py        # Missing skills curriculum generator
│
├── requirements.txt                 # Python package dependencies
├── Dockerfile                       # Python 3.11-slim production container
├── .env                             # Local environment variables (GEMINI_API_KEY)
└── README.md
```

---

## 🔬 Core Services & Algorithms

### 1. Deterministic Skill Matching (`job_matching.py`)

Matches candidate profiles against jobs with **sub-millisecond latency** without consuming Gemini API tokens:

- Canonicalizes both student and job skill names.
- Computes matched vs. missing skills.
- Produces deterministic match percentages ($0\% - 100\%$) and human-readable explanations.

### 2. Skill Gap & Normalization Engine (`skill_gap.py`)

Computes the exact missing competencies required for a job:

- Strips punctuation and whitespace to form standardized keys (`re.sub(r"[^a-z0-9]", "", skill)`).
- Maps variations (e.g., `tf` -> `tensorflow`, `py torch` -> `pytorch`).
- Yields a bounded `skill_gap_score` where $0$ indicates full qualification and $100$ indicates zero matched requirements.

### 3. Safe PDF Extraction & Resume Parser (`resume_analyzer.py`)

Safely extracts and parses resume content:

- Uses **PyMuPDF** (`pymupdf.open`) for direct text-layer extraction without external binary dependencies.
- Rejects corrupt or empty PDFs (`document.page_count == 0` or missing text layer).
- Enforces a **12,000 character maximum window** to protect against token exhaustion and prompt injection.
- Directs Gemini to return clean, markdown-free JSON conforming to a strict schema.

### 4. Career Readiness Scorer (`readiness.py`)

Evaluates a student's readiness for their target role:

- Evaluates four distinct pillars: Technical Skills, Practical Projects, Academic Performance (CGPA), and Certifications.
- Enforces strict constraints so the model cannot invent missing data or dismiss existing projects.
- Outputs a normalized score ($0-100$), concrete strengths, weaknesses, and next-step recommendations.

### 5. Personalized Skill Recommendations (`recommendation.py`)

Turns missing job skills into concrete learning milestones:

- For every missing skill, generates:
  1. Key conceptual topics to learn.
  2. One practical project or task utilizing the skill.

---

## 🔌 FastAPI Endpoints Reference

### `POST /match/`

Computes candidate match score against a job opening.

**Request Body:**

```json
{
  "student": {
    "student_id": "std_123",
    "skills": ["Python", "SQL", "React", "Git"],
    "projects": ["CampusLink Web", "E-Commerce API"],
    "resume_text": ""
  },
  "job": {
    "job_id": "job_456",
    "title": "Full Stack Developer",
    "company": "TechNova Solutions",
    "required_skills": ["Python", "SQL", "Docker", "Git"],
    "description": "Looking for a full stack engineer."
  }
}
```

**Response (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "match_score": 75.0,
    "matched_skills": ["Python", "SQL", "Git"],
    "missing_skills": ["Docker"],
    "explanation": "The student matches 3 out of 4 required skills (75.0%), missing Docker."
  }
}
```

---

### `POST /skill-gap/`

Computes missing skills and skill-gap severity score.

**Request Body:**

```json
{
  "student": {
    "skills": ["Python", "Pandas", "Scikit-learn"]
  },
  "job": {
    "required_skills": ["Python", "Pandas", "Docker", "AWS"]
  }
}
```

**Response (`200 OK`):**

```json
{
  "skill_gap_score": 50.0,
  "matched_skills": ["Python", "Pandas"],
  "missing_skills": ["Docker", "AWS"],
  "explanation": "The student possesses 2 out of 4 required skills (Python, Pandas), missing 2 skills (Docker, AWS)."
}
```

---

### `POST /readiness/`

Calculates overall placement readiness score and qualitative profile analysis.

**Request Body:**

```json
{
  "skills": ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
  "projects": ["CampusLink Placement Platform", "Realtime Chat App"],
  "cgpa": 8.4,
  "certifications": ["AWS Certified Cloud Practitioner"],
  "target_role": "Full Stack Engineer"
}
```

**Response (`200 OK`):**

```json
{
  "readiness_score": 86.0,
  "strengths": [
    "Strong modern stack alignment with TypeScript and Next.js",
    "Hands-on full stack project experience",
    "Solid academic record (CGPA 8.4) with cloud certification"
  ],
  "weaknesses": [
    "No explicit test framework experience listed (e.g. Jest, Vitest)",
    "CI/CD pipeline implementation missing from projects"
  ],
  "recommendations": [
    "Add automated testing to existing projects",
    "Document deployment workflows with GitHub Actions"
  ]
}
```

---

### `POST /resume/analyze-text/`

Analyzes raw resume text and returns structured fields.

**Request Body:**

```json
{
  "text": "John Doe... Computer Science... Skills: Python, Docker, FastApi... Projects: AI Search..."
}
```

**Response (`200 OK`):**

```json
{
  "skills": ["Python", "Docker", "FastAPI"],
  "projects": ["AI Search"],
  "education": "B.Tech in Computer Science",
  "certifications": [],
  "strengths": ["Clear focus on backend technologies"],
  "weaknesses": ["Lacks quantitative impact metrics on projects"],
  "recommendations": ["Add measurable metrics (e.g. reduced latency by 30%)"]
}
```

---

### `POST /resume/analyze-pdf/`

Uploads and parses a PDF document directly.

- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (`.pdf` file)
- **Response**: Same structured JSON schema as `/resume/analyze-text/`.

---

### `POST /recommendation/`

Generates personalized study and project milestones for missing competencies.

**Request Body:**

```json
{
  "missing_skills": ["Docker", "Redis"],
  "target_role": "Backend Engineer",
  "student_skills": ["Python", "FastAPI", "PostgreSQL"],
  "projects": ["API Service"]
}
```

**Response (`200 OK`):**

```json
[
  "Docker: Learn containerization fundamentals, multi-stage builds, and Docker Compose.",
  "Docker Project: Containerize your API Service with separate web and database services.",
  "Redis: Learn in-memory caching strategies, TTL management, and rate limiting patterns.",
  "Redis Project: Add Redis caching to frequent read endpoints in your API Service."
]
```

---

### `GET /health`

Returns service status.

**Response (`200 OK`):**

```json
{
  "status": "healthy",
  "service": "campuslink-ai"
}
```

---

## ⚙️ Environment Configuration

Create `apps/ai/.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🚀 Installation & Running

### Windows (PowerShell)

```powershell
cd apps/ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run Uvicorn server in reload mode
python -m uvicorn app.main:app --reload --port 8000
```

### Linux / macOS

```bash
cd apps/ai

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Uvicorn server
uvicorn app.main:app --reload --port 8000
```

The service will be accessible at:

- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

### Docker Setup

```bash
# Build and run standalone container
docker build -t campuslink-ai ./apps/ai
docker run -p 8000:8000 --env-file apps/ai/.env campuslink-ai
```

---

## 🔗 Integration with Express Backend

The Node.js Express server communicates with the AI microservice via HTTP (`apps/server/src/modules/jobs/job-ai.service.ts`):

- **Development URL**: `http://localhost:8000`
- **Docker Network URL**: `http://ai:8000`
- **Graceful Fallback**: If the Python service is offline or unreachable, the Express backend returns graceful fallback values rather than crashing application requests.
