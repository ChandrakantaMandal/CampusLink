# CampusLink — AI-Powered Campus Placement Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-5E6AD2?style=for-the-badge)](https://www.better-auth.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

> **CampusLink** is a comprehensive, production-grade placement management platform engineered to connect **Students**, **Recruiters**, and **Training & Placement Officers (TPO / Admins)**. Powered by a hybrid AI architecture that combines deterministic placement logic with Google Gemini generative intelligence, CampusLink automates campus drives, provides explainable job matching and skill-gap analysis, verifies candidate credentials, and tracks application pipelines from registration to final offer rollout.

---

## 📑 Table of Contents

- [Key Highlights](#-key-highlights)
- [System Architecture](#-system-architecture)
- [Monorepo Structure](#-monorepo-structure)
- [Role-Based Portals & Features](#-role-based-portals--features)
  - [1. Student Portal](#1-student-portal)
  - [2. Recruiter Portal](#2-recruiter-portal)
  - [3. Admin / TPO Portal](#3-admin--tpo-tpo-portal)
- [AI & Placement Intelligence Engine](#-ai--placement-intelligence-engine)
- [Database Schema & Models](#-database-schema--models)
- [REST API Reference](#-rest-api-reference)
- [Prerequisites & Requirements](#-prerequisites--requirements)
- [Environment Configuration](#-environment-configuration)
- [Local Setup & Installation](#-local-setup--installation)
  - [Method 1: Manual Monorepo Setup (Recommended for Dev)](#method-1-manual-monorepo-setup-recommended-for-dev)
  - [Method 2: Docker Compose Setup](#method-2-docker-compose-setup)
- [Database Management & Seeding](#-database-management--seeding)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Security & Architecture Principles](#-security--architecture-principles)
- [Contributing & Commit Conventions](#-contributing--commit-conventions)
- [License](#-license)

---

## 🌟 Key Highlights

- **🎯 Deterministic + Generative Hybrid Intelligence**: Hard placement rules (CGPA, backlogs, branch, graduation year) are strictly enforced deterministically by code so LLMs never hallucinate eligibility; generative AI (Gemini) handles resume extraction, personalized recommendations, and conversational assistance.
- **💼 End-to-End Recruitment Lifecycle**: Complete tracking from student profile creation, resume parsing, job listing, multi-round drives, assessment invitations via secure tokens, interview scheduling with conflict detection, to offer letter release and acceptance.
- **⚡ Modern High-Performance Monorepo**: Built with **pnpm workspaces**, featuring a Next.js 16 (React 19) frontend, Express 5 REST server, Python FastAPI AI microservice, Prisma 7 multi-file schema, Better Auth with custom OTP plugin, and Redis sliding-window rate limiting.
- **📱 Progressive Web App (PWA)**: Complete offline readiness and installable mobile app experience for students and recruiters on any device.
- **🔒 Enterprise Security & Resiliency**: Email verification via OTP, password reset flows, Google OAuth 2.0, role-based route guards, ImageKit media storage, and fail-open Redis rate limiters for disruption-free local development.

---

## 🏗️ System Architecture

CampusLink separates presentation, business logic, persistent data, and AI workloads across isolated microservices and shared packages:

```mermaid
flowchart TB
    subgraph CLIENTS["🖥️ Client Applications"]
        STUDENT["Student Web / PWA<br/>:3001/student/*"]
        RECRUITER["Recruiter Web / PWA<br/>:3001/recruiter/*"]
        ADMIN["Admin / TPO Portal<br/>:3001/admin/*"]
        CHAT["AI Career Chatbot<br/>Floating Widget"]
    end

    subgraph API_LAYER["⚙️ Backend API & Auth (Express 5.2 :3000)"]
        EXPRESS["Express Server"]
        AUTH["Better Auth 1.7<br/>+ Custom Signup OTP Plugin"]
        RATE["Redis Sliding-Window<br/>Rate Limiter"]
        IMAGEKIT["ImageKit Storage Service<br/>Resumes, Photos, Logos"]
        ROUTERS["Role Routers<br/>/students | /recruiters | /admin<br/>/jobs | /applications | /drives"]
    end

    subgraph DATA_LAYER["🗄️ Persistence Layer"]
        PG[("PostgreSQL 18<br/>Prisma ORM Multi-Schema")]
        REDIS[("Redis 8-Alpine<br/>Rate Limits & Cache")]
    end

    subgraph AI_LAYER["🤖 AI & ML Intelligence Layer (:8000)"]
        FASTAPI["FastAPI Python Microservice"]
        PYMUPDF["PyMuPDF<br/>Resume Text Parser"]
        SKILL_NORM["Skill Normalization &<br/>Alias Mapping"]
        GAP_ENGINE["Deterministic Skill-Gap<br/>& Match Engine"]
        GEMINI["Google Gemini Generative AI<br/>Readiness & Career Advisor"]
    end

    CLIENTS -->|"HTTPS / REST"| EXPRESS
    EXPRESS --> RATE
    RATE --> REDIS
    EXPRESS --> AUTH
    AUTH --> PG
    EXPRESS --> ROUTERS
    ROUTERS --> PG
    ROUTERS --> IMAGEKIT
    ROUTERS -->|"Internal HTTP (:8000)"| FASTAPI

    FASTAPI --> PYMUPDF
    FASTAPI --> SKILL_NORM
    FASTAPI --> GAP_ENGINE
    FASTAPI --> GEMINI

    EXPRESS -->|"Fallback Direct SDK"| GEMINI
```

---

## 📁 Monorepo Structure

The project is structured as a **pnpm monorepo** with separated concerns under `apps/` and shared packages under `packages/`:

```text
CampusLink/
│
├── apps/
│   ├── web/                          # Next.js 16 + React 19 Frontend (PWA)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (routes)/
│   │   │   │   │   ├── admin/        # Admin / TPO dashboard views
│   │   │   │   │   ├── recruiter/    # Recruiter hiring views
│   │   │   │   │   ├── student/      # Student career & drive views
│   │   │   │   │   ├── assessment/   # Candidate test & invitation views
│   │   │   │   │   └── (auth)/       # Login, Signup, OTP, Password Reset
│   │   │   │   └── page.tsx          # Marketing landing page with persona tabs
│   │   │   ├── components/
│   │   │   │   ├── ai/               # Floating AI chat, message items, prompts
│   │   │   │   ├── dashboard/        # Role-specific dashboard layouts & views
│   │   │   │   ├── landing/          # Hero, Bento, Persona tabs, Calculator
│   │   │   │   └── brand/            # Logos and typography
│   │   │   └── lib/api/              # Axios API clients with auto-error parsing
│   │   └── pwa.config.ts             # PWA manifest and caching service worker
│   │
│   ├── server/                       # Express 5 REST API Server
│   │   ├── src/
│   │   │   ├── middleware/           # auth, role, rateLimiters, upload, error
│   │   │   ├── modules/
│   │   │   │   ├── admin/            # TPO operations, statistics, user governance
│   │   │   │   ├── ai/               # AI streaming chat proxy (Vercel AI SDK)
│   │   │   │   ├── applications/     # Candidate application pipelines
│   │   │   │   ├── assessments/      # Tests, invited tokens, evaluation
│   │   │   │   ├── companies/        # Company registration & tiers
│   │   │   │   ├── jobs/             # Job postings, AI match, skill-gap
│   │   │   │   ├── recruiter/        # Recruiter workflow, shortlists, offers
│   │   │   │   ├── students/         # Student profile, drives, readiness
│   │   │   │   └── uploads/          # ImageKit upload controllers
│   │   │   ├── lib/imagekit.ts       # ImageKit CDN integration
│   │   │   └── services.ts           # Prisma, Redis, and Better Auth bindings
│   │   └── Dockerfile
│   │
│   └── ai/                           # Python FastAPI AI Microservice (:8000)
│       ├── app/
│       │   ├── api/                  # matching, readiness, recommendation, resume, skill_gap
│       │   ├── ml/                   # preprocessing, resume_sections, scoring, similarity
│       │   ├── schemas/              # Pydantic request and response models
│       │   └── services/
│       │       ├── gemini.py         # Google Gemini LLM SDK client
│       │       ├── job_matching.py   # Deterministic skill matching algorithm
│       │       ├── readiness.py      # Composite career readiness scoring
│       │       ├── resume_analyzer.py# PyMuPDF extraction + structured analysis
│       │       └── skill_gap.py      # Missing skills & alias mapping
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── auth/                         # Better Auth config, custom OTP plugin, Nodemailer
│   ├── db/                           # Prisma ORM with multi-file schemas & seeders
│   │   └── prisma/
│   │       ├── schema/               # Multi-file schemas (user, job, drive, auth, etc.)
│   │       ├── seed.ts               # Complete demo seeder (companies, skills, jobs)
│   │       └── setup-student.ts      # Automated student demo profile setup
│   ├── redis/                        # Resilient ioredis client with auto-reconnect
│   ├── ui/                           # Shared UI components (shadcn/ui + Radix UI)
│   └── config/                       # Shared TypeScript tsconfig base
│
├── docker-compose.yml                # Multi-service production/dev orchestration
├── pnpm-workspace.yaml               # Monorepo packages & dependency catalog
├── package.json                      # Workspace scripts (dev, test, db, docker)
└── README.md
```

---

## 👥 Role-Based Portals & Features

CampusLink provides tailored experiences across three dedicated portals:

### 1. 🎓 Student Portal (`/student/*`)

| Feature                    | Description                                                                                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Comprehensive Profile**  | 13 structured sections: Personal details, 10th/12th/College education, Projects, Skills with proficiency level & experience years, Certifications, and Portfolio links (LeetCode, HackerRank, GitHub, LinkedIn). |
| **Resume AI Analyzer**     | Upload PDF resumes to ImageKit; PyMuPDF extracts text, and Gemini extracts validated skills, projects, strengths, weaknesses, and improvement steps with zero hallucination.                                     |
| **Placement Drives**       | Browse active campus drives, view tier requirements (Tier 1, Tier 2, Tier 3), check real-time branch/CGPA eligibility, and register with 1 click.                                                                |
| **Smart Job Matching**     | Browse available positions with instant match percentages, matched skills tags, and detailed missing skill gap reports.                                                                                          |
| **Application Pipeline**   | Track application lifecycle across 10 distinct states: `APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `ASSESSMENT`, `INTERVIEW`, `SELECTED`, `OFFER_EXTENDED`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.                   |
| **Interview Manager**      | View scheduled technical and HR rounds, Google Meet / Zoom links, venue details, and track time conflicts across drives.                                                                                         |
| **Offers & CTC Breakdown** | Review received offers with base salary, bonuses, role details, joining dates, and one-click offer acceptance.                                                                                                   |
| **Career Readiness Score** | Holistic readiness score (0-100) evaluating academics, technical skills, projects, and target role alignment.                                                                                                    |
| **AI Career Assistant**    | Floating conversational chatbot answering placement queries, policy questions, and interview preparation tips.                                                                                                   |

### 2. 🏢 Recruiter Portal (`/recruiter/*`)

| Feature                     | Description                                                                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company Profile**         | Manage company profile, industry classification, recruitment contact details, and upload branding logos to ImageKit.                                                                                                 |
| **Job Posting Management**  | Create and publish job openings with multi-round interview pipelines, salary brackets, open openings, and strict eligibility thresholds (minimum CGPA, allowed backlogs, eligible degree/branches, graduation year). |
| **Candidate Discovery**     | Filter and search student directory by skills, CGPA, department, and view verified academic profiles.                                                                                                                |
| **Shortlisting & Pipeline** | Move applicants through recruitment stages, add interviewer notes, and manage candidate shortlists.                                                                                                                  |
| **Assessment Invitations**  | Send batch assessment invitations with cryptographically signed, time-limited token links delivered straight to student emails.                                                                                      |
| **Interview Scheduling**    | Schedule rounds (virtual, in-person, or hybrid), assign interview panels, record candidate feedback and ratings, and automatically detect scheduling conflicts.                                                      |
| **Offer Letter Release**    | Draft and dispatch formal job offers with CTC breakdowns, response deadlines, and track acceptance status in real time.                                                                                              |
| **Analytics & Badges**      | Real-time recruiter dashboard displaying active jobs, pending applications, scheduled interviews, and candidate acceptances.                                                                                         |

### 3. 🏛️ Admin / TPO (Training & Placement Officer) Portal (`/admin/*`)

| Feature                                 | Description                                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Placement Command Center**            | Macro metrics: Total students registered, placement percentage, average & highest CTC, active recruiters, and company visit schedules.           |
| **Student Directory & Verification**    | Inspect student academic records, verify CGPA and backlog counts, approve or revoke verification badges.                                         |
| **Recruiter & Company Governance**      | Review incoming company registrations, assign company tiers (Tier 1 / Tier 2 / Tier 3), and verify recruiter accounts.                           |
| **Campus Drive Operations**             | Schedule on-campus, virtual, or hybrid placement drives, configure date/time/venue, set eligible batches, and link jobs.                         |
| **Interviews & Conflict Resolution**    | Global schedule across all companies; detect overlapping interview slots for students and reallocate coordinators.                               |
| **Offer Approvals & Policy Compliance** | Audit released offers, verify compensation details, and enforce institutional placement policies (e.g., dual-offer rules, dream job exceptions). |
| **Broadcast Notification System**       | Send broadcast notifications and urgent announcements to all students or recruiters via the notification engine.                                 |
| **System Settings**                     | Configure institutional placement rules, registration deadlines, and system security parameters.                                                 |

---

## 🤖 AI & Placement Intelligence Engine

CampusLink deliberately avoids delegating hard placement logic to black-box LLMs. It employs **Deterministic Intelligence for Rules** and **Generative Intelligence for Content & Advice**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DETERMINISTIC PLACEMENT LOGIC                        │
│                     (No LLM hallucination risk)                        │
├────────────────────────────────────────────────────────────────────────┤
│  • Eligibility Rules : CGPA >= minCGPA && backlogs <= maxBacklogs     │
│  • Branch & Degree   : student.branch IN job.allowedBranches           │
│  • Skill Extraction  : Canonical alias mapping                         │
│                        (e.g., "fast-api" -> "fastapi")                 │
│  • Skill-Gap Score   : (missing_skills.length / required.length) * 100 │
│  • Match Calculation : Set-intersection between candidate and job     │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   GENERATIVE INTELLIGENCE (GEMINI)                     │
│                     (Context-aware qualitative AI)                     │
├────────────────────────────────────────────────────────────────────────┤
│  • Resume Text Parse : Safe extraction via PyMuPDF with text clipping  │
│  • Qualitative Advice: Contextual suggestions for missing skills       │
│  • Readiness Report  : Holistic strengths, weaknesses, recommendations │
│  • Streaming Chatbot : Natural language assistance for students/TPOs   │
└────────────────────────────────────────────────────────────────────────┘
```

### Python FastAPI Endpoints (`apps/ai`)

- `POST /match/` — Fast local skill matching comparing candidate skills against job requirements.
- `POST /skill-gap/` — Deterministic skill-gap analysis with canonical skill alias normalization.
- `POST /readiness/` — Calculates 0-100 career readiness score with qualitative strengths and recommendations via Gemini.
- `POST /resume/analyze-text/` — Analyzes raw resume text and extracts structured JSON (skills, projects, education, certifications, feedback).
- `POST /resume/analyze-pdf/` — Parses uploaded PDF using PyMuPDF and outputs structured analysis.
- `POST /recommendation/` — Generates personalized learning paths and project ideas for missing competencies.
- `GET /health` — Service health probe.

---

## 🗄️ Database Schema & Models

CampusLink utilizes a **Prisma 7 multi-file schema** organized cleanly under `packages/db/prisma/schema/`:

| Schema File           | Core Models                                                                                                            | Purpose                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `auth.prisma`         | `User`, `Session`, `Account`, `Verification`                                                                           | Better Auth identity management with role support (`STUDENT`, `RECRUITER`, `ADMIN`).                                      |
| `user.prisma`         | `StudentProfile`, `Skill`, `StudentSkill`, `Education`, `Project`, `Certification`, `StudentResume`, `ReadinessResult` | Complete student portfolio, academic records, and normalized skill associations.                                          |
| `company.prisma`      | `Company`, `RecruiterProfile`                                                                                          | Company directories, tier categorization (`TIER_1`, `TIER_2`, `TIER_3`), and recruiter profiles.                          |
| `job.prisma`          | `Job`, `JobSkill`, `JobRound`                                                                                          | Job openings, requirements, CTC packages, status (`DRAFT`, `APPLICATIONS_OPEN`, `INTERVIEWING`, etc.), and hiring rounds. |
| `drive.prisma`        | `PlacementDrive`, `DriveRegistration`                                                                                  | Campus drives (In-person, Virtual, Hybrid), schedules, venues, and student registrations.                                 |
| `application.prisma`  | `Application`, `MatchResult`, `Assessment`, `AssessmentResult`                                                         | Application workflow across 10 stages, AI match metrics, and assessment evaluations.                                      |
| `interview.prisma`    | `Interview`                                                                                                            | Technical and HR interview rounds, schedule timings, meeting URLs, ratings, feedback, and conflict flags.                 |
| `offer.prisma`        | `Offer`                                                                                                                | Compensation packages (base salary, bonus, CTC), document verification, and joining status.                               |
| `admin.prisma`        | `AdminProfile`, `SystemSetting`, `AuditLog`                                                                            | TPO credentials, global platform settings, and security audit logs.                                                       |
| `notification.prisma` | `UserNotification`, `AdminNotification`, `RecruiterNotification`                                                       | Multi-priority notifications (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) with read tracking.                                      |

---

## 🔌 REST API Reference

The Express server (`apps/server`) exposes an extensive, role-guarded REST API on port `3000`:

### 🔐 Authentication (`/api/auth/*`)

Handled natively via **Better Auth**:

- `POST /api/auth/sign-up/email` — Email & password registration (triggers verification OTP email).
- `POST /api/auth/verify-email-otp` — Verify 6-digit signup OTP.
- `POST /api/auth/resend-verification-otp` — Resend verification OTP code.
- `POST /api/auth/sign-in/email` — Email and password login.
- `POST /api/auth/sign-in/social` — Google OAuth 2.0 authentication.
- `POST /api/auth/forget-password` — Request password reset email.
- `POST /api/auth/reset-password` — Reset password using verified token.
- `GET /api/auth/get-session` — Retrieve active session and user role.
- `POST /api/auth/sign-out` — Invalidate session and clear auth cookies.

### 🎓 Students (`/api/students`)

- `GET /api/students/me` — Retrieve current student profile.
- `PATCH /api/students/me` — Update student profile details.
- `POST /api/students/me/resume` — Upload resume PDF (stored on ImageKit).
- `POST /api/students/me/photo` — Upload profile photo.
- `GET /api/students/me/dashboard` — Aggregated dashboard statistics.
- `GET /api/students/me/readiness` — Career readiness score and analysis.
- `GET /api/students/me/drives` — List campus drives (registered and upcoming).
- `POST /api/students/me/drives/:id/register` — Register for a placement drive.
- `GET /api/students/me/interviews` — Student interview schedule.
- `GET /api/students/me/offers` — Student job offers.
- `PATCH /api/students/me/offers/:id/accept` — Accept a job offer.
- `GET /api/students/me/notifications` — Student notifications.
- `PATCH /api/students/me/notifications/read-all` — Mark all notifications read.
- `GET /api/students/:id` — View specific student (Recruiter & Admin only).

### 💼 Jobs (`/api/jobs`)

- `GET /api/jobs` — Retrieve open job listings (with search and filters).
- `GET /api/jobs/:id` — Retrieve specific job details.
- `POST /api/jobs` — Create a new job posting (Recruiter & Admin).
- `PATCH /api/jobs/:id` — Update job details (Recruiter & Admin).
- `DELETE /api/jobs/:id` — Delete job posting (Recruiter & Admin).
- `POST /api/jobs/match-all` — Run AI match for current student across all jobs.
- `POST /api/jobs/:id/match` — Run AI match for a specific job.
- `POST /api/jobs/:id/skill-gap` — Compute skill gap for a specific job.

### 📝 Applications (`/api/applications`)

- `POST /api/applications` — Submit application for a job (Student).
- `GET /api/applications/my` — View student's applied jobs (Student).
- `GET /api/applications` — View applications for company jobs (Recruiter).
- `GET /api/applications/:id` — View application details.
- `PATCH /api/applications/:id/status` — Update application hiring stage (Recruiter).

### 🏢 Recruiters (`/api/recruiter`)

- `GET /api/recruiter/profile` — Get recruiter profile & company details.
- `PATCH /api/recruiter/profile` — Update recruiter profile.
- `POST /api/recruiter/company/logo` — Upload company logo to ImageKit.
- `GET /api/recruiter/jobs` — Get company's posted jobs.
- `POST /api/recruiter/jobs` — Create job posting.
- `GET /api/recruiter/shortlisted` — View shortlisted candidate pool.
- `POST /api/recruiter/shortlisted/assessment-links` — Send batch assessment invitations.
- `GET /api/recruiter/interviews` — Company's interview schedule.
- `POST /api/recruiter/interviews` — Schedule a candidate interview.
- `PATCH /api/recruiter/interviews/:id` — Reschedule interview.
- `GET /api/recruiter/offers` — List issued offers.
- `POST /api/recruiter/offers` — Create a job offer.
- `POST /api/recruiter/offers/:id/send` — Dispatch offer letter to student.
- `GET /api/recruiter/stats` — Dashboard counters and badge stats.

### 🏛️ Admin / TPO (`/api/admin`)

- `GET /api/admin/dashboard` — Global placement metrics and KPIs.
- `GET /api/admin/students` — List all students with academic details.
- `PATCH /api/admin/students/:id/verify` — Verify/unverify student profile.
- `GET /api/admin/recruiters` — List all recruiters.
- `PATCH /api/admin/recruiters/:id/verify` — Approve recruiter company verification.
- `GET /api/admin/drives` — List all placement drives.
- `POST /api/admin/drives` — Create placement drive.
- `PATCH /api/admin/drives/:id` — Update placement drive.
- `DELETE /api/admin/drives/:id` — Delete placement drive.
- `GET /api/admin/interviews` — College-wide interview schedule.
- `PATCH /api/admin/interviews/:id/schedule` — Reschedule interview (conflict override).
- `GET /api/admin/offers` — All student offers across companies.
- `POST /api/admin/notifications/broadcast` — Broadcast announcements to users.
- `GET /api/admin/settings` — Get campus placement settings.
- `PUT /api/admin/settings` — Update campus placement settings.

### 🤖 AI Streaming & Chat (`/api/ai`)

- `POST /api/ai/chat` — Streaming conversational AI chat via Vercel AI SDK & Gemini.

---

## 💻 Prerequisites & Requirements

Ensure the following tools are installed on your machine:

- **Node.js**: `v20.x` or later (LTS recommended)
- **pnpm**: `v9.x` or `v10.x` (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Python**: `3.10+` or `3.11+` (for the AI microservice)
- **PostgreSQL**: `v15+` or running via Docker
- **Redis**: `v7+` or running via Docker
- **Docker Desktop**: Optional, for running containerized services

Verify your environment:

```bash
node -v
pnpm -v
python --version
docker --version
```

---

## ⚙️ Environment Configuration

CampusLink uses **Varlock** for type-safe environment variable validation. Each service has a `.env.schema` file.

### 1. Backend Server (`apps/server/.env`)

Create `apps/server/.env`:

```env
# Runtime
NODE_ENV=development

# Web Frontend URL
CORS_ORIGIN=http://localhost:3001

# Better Auth Configuration
BETTER_AUTH_SECRET=your_super_secret_better_auth_key_min_32_chars
BETTER_AUTH_URL=http://localhost:3000

# PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/CampusLink?schema=public

# Redis Cache & Rate Limiting
REDIS_URL=redis://localhost:6379

# AI Microservice URL
AI_SERVICE_URL=http://localhost:8000

# Google Gemini API Key (Server fallback & streaming)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Email (SMTP / Nodemailer for OTP & Password Reset)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
EMAIL_FROM="CampusLink <noreply@campuslink.edu>"

# Google OAuth 2.0 (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit Storage (Resumes, Photos & Company Logos)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
IMAGEKIT_FOLDER=campuslink
```

### 2. Frontend Web (`apps/web/.env`)

Create `apps/web/.env`:

```env
NODE_ENV=development
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. AI Service (`apps/ai/.env`)

Create `apps/ai/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> [!TIP]
> After modifying any `.env.schema` files, regenerate environment types across the monorepo by running:
>
> ```bash
> pnpm run env:generate
> ```

---

## 🚀 Local Setup & Installation

### Method 1: Manual Monorepo Setup (Recommended for Dev)

#### Step 1: Clone the Repository & Install Dependencies

```bash
git clone https://github.com/HimanshuKumarRout/CampusLink.git
cd CampusLink
pnpm install
```

#### Step 2: Start PostgreSQL and Redis

Using Docker Compose to start only PostgreSQL and Redis:

```bash
# Start PostgreSQL & Redis in background
pnpm run db:start
pnpm run redis:start
```

_(Alternatively, you can connect your existing local PostgreSQL and Redis instances by pointing the `DATABASE_URL` and `REDIS_URL` in `apps/server/.env`.)_

#### Step 3: Setup the Database

Generate Prisma client, apply schema, and populate demo data:

```bash
# Generate the Prisma Client
pnpm run db:generate

# Push schemas to PostgreSQL
pnpm run db:push

# Seed skills, companies, jobs, and drives
pnpm --filter @CampusLink/db exec tsx prisma/seed.ts
```

#### Step 4: Setup the Python AI Microservice

In a new terminal:

**Windows (PowerShell):**

```powershell
cd apps/ai
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**Linux / macOS:**

```bash
cd apps/ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Step 5: Start the Web and Express Servers

From the root project directory:

```bash
# Run both Frontend (Next.js :3001) and Backend (Express :3000)
pnpm run dev
```

Or run them individually:

```bash
pnpm run dev:web     # Next.js on http://localhost:3001
pnpm run dev:server  # Express API on http://localhost:3000
```

---

### Method 2: Docker Compose Setup

To spin up the entire orchestrated container stack (Frontend, Backend, AI Microservice, PostgreSQL, and Redis):

```bash
# Build all Docker containers
pnpm run docker:build

# Start all containers in the background
pnpm run docker:up

# Check container logs
pnpm run docker:logs

# Stop containers
pnpm run docker:down
```

The services will be available at:

- **Frontend Web / PWA**: `http://localhost:3001`
- **Express Backend API**: `http://localhost:3000`
- **Python AI Microservice**: `http://localhost:8000`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

---

## 🗄️ Database Management & Seeding

The `@CampusLink/db` package provides multiple scripts for maintaining the PostgreSQL database:

| Command                                                         | Action                                                                                           |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `pnpm run db:generate`                                          | Generates the `@prisma/client` from the multi-file schema.                                       |
| `pnpm run db:push`                                              | Pushes schema changes directly to the database without generating migration files.               |
| `pnpm run db:migrate`                                           | Runs database migrations in development mode (`prisma migrate dev`).                             |
| `pnpm run db:studio`                                            | Opens **Prisma Studio** at `http://localhost:5555` to inspect and edit database records.         |
| `pnpm --filter @CampusLink/db exec tsx prisma/seed.ts`          | Populates database with standard skills, Tier 1/2 companies, job postings, and placement drives. |
| `pnpm --filter @CampusLink/db exec tsx prisma/setup-student.ts` | Populates complete academic profile, skills, and portfolio for a test student.                   |

---

## 🧪 Testing & Quality Assurance

CampusLink is equipped with an automated testing suite configured with **Vitest**:

```bash
# Run all test suites across the monorepo
pnpm run test

# Run individual test suites
pnpm run test:server   # Express server unit & integration tests
pnpm run test:web      # Next.js web application tests
pnpm run test:auth     # Better Auth configuration, plugins & OTP tests
pnpm run test:db       # Prisma database client tests

# Run tests in watch mode
pnpm run test:watch

# Generate test coverage reports
pnpm run test:coverage
```

### Git Hooks & Code Quality

Husky and lint-staged are configured to maintain code quality prior to commits:

```bash
# Initialize Husky git hooks
pnpm run prepare

# TypeScript type checks across all workspaces
pnpm run check-types
```

---

## 🛡️ Security & Architecture Principles

1. **Deterministic Rule Enforcement**: Academic eligibility (CGPA, active backlogs, allowable departments) is strictly evaluated in deterministic TypeScript and SQL logic. LLMs are never allowed to override admission/eligibility criteria.
2. **Private AI Microservice**: In production, the FastAPI microservice runs on a private internal network (`http://ai:8000`) and is never exposed directly to the public internet; all traffic flows through the authenticated Express API.
3. **Multi-Tier Rate Limiting**: Redis sliding-window rate limiters defend sensitive endpoints (login, OTP generation, AI chat, resume parsing) against brute force and DDoS attacks.
4. **Secrets Isolation**: Google OAuth keys, SMTP passwords, Better Auth secrets, ImageKit private keys, and Gemini API keys reside exclusively in backend environment variables and are never bundled into client-side code.
5. **Safe File Handling**: Resumes and images are strictly validated for MIME type and file size before being securely uploaded to ImageKit CDN; filenames are sanitized to prevent path traversal.

---

## 🤝 Contributing & Commit Conventions

Contributions are welcome! Please adhere to the following workflow:

1. **Fork and create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your modifications and test**:
   ```bash
   pnpm run check-types
   pnpm run test
   ```
3. **Commit using [Conventional Commits](https://www.conventionalcommits.org/)**:
   ```bash
   git commit -m "feat(student): add resume preview modal and download action"
   ```

### Commit Types:

- `feat`: A new user-facing feature.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `refactor`: Code reorganization with no behavior change.
- `test`: Adding or updating test suites.
- `chore`: Dependency updates, tooling, and build configuration.

4. **Push and open a Pull Request**:
   ```bash
   git push origin feat/your-feature-name
   ```

---

<p align="center">
  Built with ❤️ for college placement cells, ambitious students, and modern recruiters.
</p>
