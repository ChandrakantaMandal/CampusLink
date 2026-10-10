# CampusLink Server — Backend API & Authentication Service

[![Express.js](https://img.shields.io/badge/Express.js-5.2-404D59?style=for-the-badge)](https://expressjs.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-5E6AD2?style=for-the-badge)](https://www.better-auth.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![ImageKit](https://img.shields.io/badge/ImageKit-Media_CDN-007AFF?style=for-the-badge)](https://imagekit.io/)

> **CampusLink Server** is the core RESTful API and authentication backend powering the CampusLink platform. Built on Express 5 and Node.js, it manages role-based access control (Students, Recruiters, and Admins/TPOs), coordinates the placement lifecycle, integrates with PostgreSQL via Prisma ORM, interfaces with the Python AI microservice, enforces sliding-window Redis rate limits, and securely handles media uploads with ImageKit.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Directory Structure](#-directory-structure)
- [Authentication & Role-Based Access Control](#-authentication--role-based-access-control)
- [Redis Rate Limiting & Offline Resiliency](#-redis-rate-limiting--offline-resiliency)
- [File Uploads & Media CDN (ImageKit)](#-file-uploads--media-cdn-imagekit)
- [Complete REST API Reference](#-complete-rest-api-reference)
  - [1. Authentication (`/api/auth/*`)](#1-authentication-apiauth)
  - [2. Students (`/api/students`)](#2-students-apistudents)
  - [3. Recruiters (`/api/recruiter`)](#3-recruiters-apirecruiter)
  - [4. Admin / TPO (`/api/admin`)](#4-admin--tpo-apiadmin)
  - [5. Jobs & Matchmaking (`/api/jobs`)](#5-jobs--matchmaking-apijobs)
  - [6. Applications (`/api/applications`)](#6-applications-apiapplications)
  - [7. Assessments & Invites (`/api/assessments`)](#7-assessments--invites-apiassessments)
  - [8. AI Streaming Chat (`/api/ai` & `/ai`)](#8-ai-streaming-chat-apiai--ai)
  - [9. System Health (`/health`)](#9-system-health-health)
- [Environment Configuration](#-environment-configuration)
- [Local Development & Setup](#-local-development--setup)
- [Testing](#-testing)

---

## 🏗️ Architectural Overview

The server operates as a centralized gateway handling business logic, transaction persistence, and communication across the ecosystem:

```text
               ┌─────────────────────────────────────┐
               │         Client Applications         │
               │      (Next.js Web / PWA :3001)      │
               └──────────────────┬──────────────────┘
                                  │ HTTP / JSON / Cookies
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                    Express 5.2 Server (:3000)                     │
│                                                                   │
│  ┌──────────────────────┐  ┌───────────────────────────────────┐  │
│  │   Global Limiter     │  │          Better Auth              │  │
│  │  (Redis / Fail-Open) │  │ (Email OTP, Google OAuth, Cookie) │  │
│  └──────────────────────┘  └───────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                  Role Guards & Middlewares                  │  │
│  │         requireAuth  |  requireRole("STUDENT"|...)          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                        Modules                              │  │
│  │  students  |  recruiter  |  admin  |  jobs  |  applications │  │
│  │  assessments  |  companies  |  uploads  |  ai (streaming)   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────┬─────────────────┬───────────────┘
                │                 │                 │
                ▼                 ▼                 ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │  PostgreSQL  │  │    Redis     │  │ Python AI    │
        │ (Prisma ORM) │  │ (ioredis)    │  │ Microservice │
        │              │  │              │  │ (:8000)      │
        └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 📁 Directory Structure

```text
apps/server/
├── src/
│   ├── index.ts                     # Express app setup, CORS, route mounting, port listening
│   ├── services.ts                  # Shared db (Prisma), redis, and auth instances
│   ├── env.server.ts                # Varlock-validated environment accessor
│   ├── env.ts                       # Codegen types for environment variables
│   │
│   ├── lib/
│   │   └── imagekit.ts              # ImageKit client & folder path helper
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Validates Better Auth session token
│   │   ├── role.middleware.ts       # Guards routes by role (STUDENT, RECRUITER, ADMIN)
│   │   ├── rateLimiters.ts          # Redis sliding-window rate limiters with offline fallback
│   │   ├── upload.middleware.ts     # Multer memory storage filters for resumes & images
│   │   └── error.middleware.ts      # Global centralized error handler
│   │
│   └── modules/
│       ├── admin/                   # TPO dashboard stats, user verification, drive CRUD
│       ├── ai/                      # AI chat streaming via Vercel AI SDK & Gemini
│       ├── applications/            # Candidate job applications lifecycle
│       ├── assessments/             # Timed tests, assessment invite token generator
│       ├── companies/               # Company profiles, verification, tiers
│       ├── education/               # Student academic history
│       ├── jobs/                    # Job postings, AI match, skill-gap calculations
│       ├── projects/                # Student portfolio projects
│       ├── recruiter/               # Recruiter company jobs, interviews, offers, shortlists
│       ├── skills/                  # Global and student skill definitions
│       ├── students/                # Student profile, drives, interviews, offers, readiness
│       └── uploads/                 # Resume, avatar, and logo ImageKit upload handlers
│
├── tests/                           # Vitest server test suites
│   ├── health.test.ts
│   ├── integration/
│   ├── middleware/
│   └── unit/
│
├── .env.schema                      # Varlock environment schema specification
├── Dockerfile                       # Multi-stage production container build
├── tsdown.config.ts                 # Bundle build configuration
└── package.json
```

---

## 🔐 Authentication & Role-Based Access Control

Authentication is powered by **Better Auth** (`packages/auth`), integrating seamlessly with PostgreSQL via Prisma:

1. **Email & Password**: Supports registration with automatic **6-Digit Verification OTP** emails sent through Nodemailer/SMTP.
2. **Google OAuth 2.0**: Social login support.
3. **Session Management**: Secure, HTTP-only cookies and Bearer tokens.
4. **Role Middleware**:
   - `requireAuth`: Ensures an active, valid session exists.
   - `requireRole(...roles)`: Verifies that `user.role` matches one of `STUDENT`, `RECRUITER`, or `ADMIN`.

---

## 🚦 Redis Rate Limiting & Offline Resiliency

The server includes a custom sliding-window rate limiter in `src/middleware/rateLimiters.ts`:

- **IP-Based Tracking**: Requests are tracked in Redis with auto-expiring keys (`ratelimit:<name>:ip:<ip>`).
- **Progressive Punishment**: Repeated violations trigger temporary blocking (`blocked:<name>:ip:<ip>`) with a `429 Too Many Requests` status and `Retry-After` response headers.
- **Fail-Open Offline Strategy**: If Redis is not running or disconnected during local development, the rate limiter **fails open** (`next()`) rather than blocking developers with connection errors.

---

## ☁️ File Uploads & Media CDN (ImageKit)

Media uploads are handled in memory via **Multer** and pushed directly to **ImageKit CDN**:

- **Resume Uploads**: Strictly accepts PDF files (`application/pdf`) up to 5MB. Path: `campuslink/resume/`.
- **Photo & Logo Uploads**: Accepts JPEG, PNG, and WebP images up to 3MB. Paths: `campuslink/photos/` and `campuslink/logos/`.
- **Filename Sanitization**: Uploaded filenames are stripped of non-alphanumeric characters to prevent path traversal vulnerabilities.

---

## 🔌 Complete REST API Reference

All protected endpoints require an authenticated session (`Cookie` or `Authorization: Bearer <token>`).

### 1. Authentication (`/api/auth/*`)

Handled natively by Better Auth:

- `POST /api/auth/sign-up/email` — Register with email & password.
- `POST /api/auth/verify-email-otp` — Verify email signup with 6-digit OTP code.
- `POST /api/auth/resend-verification-otp` — Resend verification OTP code.
- `POST /api/auth/sign-in/email` — Login with email & password.
- `POST /api/auth/sign-in/social` — Google OAuth authentication.
- `POST /api/auth/forget-password` — Request password reset email.
- `POST /api/auth/reset-password` — Reset password using token.
- `GET /api/auth/get-session` — Retrieve current session and user profile.
- `POST /api/auth/sign-out` — Terminate session.

---

### 2. Students (`/api/students`)

| Method  | Endpoint                     | Role                 | Description                                                          |
| ------- | ---------------------------- | -------------------- | -------------------------------------------------------------------- |
| `GET`   | `/me`                        | `STUDENT`            | Fetch full authenticated student profile.                            |
| `PATCH` | `/me`                        | `STUDENT`            | Update student profile information.                                  |
| `POST`  | `/me/resume`                 | `STUDENT`            | Upload resume PDF to ImageKit and persist URL.                       |
| `POST`  | `/me/photo`                  | `STUDENT`            | Upload student profile photo to ImageKit.                            |
| `GET`   | `/me/dashboard`              | `STUDENT`            | Get aggregated dashboard metrics (applications, drives, interviews). |
| `GET`   | `/me/readiness`              | `STUDENT`            | Get placement readiness metrics & score.                             |
| `GET`   | `/me/drives`                 | `STUDENT`            | List available and registered placement drives.                      |
| `POST`  | `/me/drives/:id/register`    | `STUDENT`            | Register for an eligible placement drive.                            |
| `GET`   | `/me/interviews`             | `STUDENT`            | List student's scheduled and past interviews.                        |
| `GET`   | `/me/offers`                 | `STUDENT`            | List offers extended to the student.                                 |
| `PATCH` | `/me/offers/:id/accept`      | `STUDENT`            | Formally accept a received job offer.                                |
| `GET`   | `/me/notifications`          | `STUDENT`            | Get notifications & unread count.                                    |
| `PATCH` | `/me/notifications/read-all` | `STUDENT`            | Mark all notifications as read.                                      |
| `PATCH` | `/me/notifications/:id/read` | `STUDENT`            | Mark a specific notification as read.                                |
| `GET`   | `/:id`                       | `RECRUITER`, `ADMIN` | View student profile by ID.                                          |

---

### 3. Recruiters (`/api/recruiter`)

| Method   | Endpoint                        | Role        | Description                                      |
| -------- | ------------------------------- | ----------- | ------------------------------------------------ |
| `GET`    | `/profile`                      | `RECRUITER` | Get recruiter profile and company details.       |
| `POST`   | `/profile`                      | `RECRUITER` | Create initial recruiter profile.                |
| `PATCH`  | `/profile`                      | `RECRUITER` | Update recruiter profile or company info.        |
| `POST`   | `/company/logo`                 | `RECRUITER` | Upload company logo to ImageKit.                 |
| `GET`    | `/jobs`                         | `RECRUITER` | List all jobs posted by recruiter's company.     |
| `POST`   | `/jobs`                         | `RECRUITER` | Create new job posting.                          |
| `DELETE` | `/jobs/:id`                     | `RECRUITER` | Delete job posting.                              |
| `GET`    | `/shortlisted`                  | `RECRUITER` | List candidates shortlisted for company jobs.    |
| `POST`   | `/shortlisted/assessment-links` | `RECRUITER` | Generate & email batch assessment invite tokens. |
| `GET`    | `/interviews`                   | `RECRUITER` | List company interview schedule.                 |
| `POST`   | `/interviews`                   | `RECRUITER` | Schedule interview with a candidate.             |
| `PATCH`  | `/interviews/:id`               | `RECRUITER` | Reschedule interview or update feedback/rating.  |
| `GET`    | `/offers`                       | `RECRUITER` | List offers released by company.                 |
| `POST`   | `/offers`                       | `RECRUITER` | Create job offer for a candidate.                |
| `POST`   | `/offers/:id/send`              | `RECRUITER` | Dispatch formal offer letter to student.         |
| `GET`    | `/offers/:id/pdf`               | `RECRUITER` | Download offer letter document.                  |
| `GET`    | `/stats`                        | `RECRUITER` | Get recruiter dashboard stats & counters.        |
| `GET`    | `/notifications`                | `RECRUITER` | List recruiter notifications.                    |
| `PATCH`  | `/notifications/read-all`       | `RECRUITER` | Mark all notifications as read.                  |
| `PATCH`  | `/notifications/:id/read`       | `RECRUITER` | Mark notification as read.                       |

---

### 4. Admin / TPO (`/api/admin`)

| Method   | Endpoint                   | Role    | Description                                         |
| -------- | -------------------------- | ------- | --------------------------------------------------- |
| `GET`    | `/dashboard`               | `ADMIN` | Get campus-wide placement stats & KPI summaries.    |
| `GET`    | `/settings`                | `ADMIN` | Get global campus & policy settings.                |
| `PUT`    | `/settings`                | `ADMIN` | Update campus policy & dual-offer rules.            |
| `GET`    | `/users`                   | `ADMIN` | List all platform users with roles.                 |
| `GET`    | `/users/:id`               | `ADMIN` | View specific user details.                         |
| `DELETE` | `/users/:id`               | `ADMIN` | Delete a user account.                              |
| `GET`    | `/students`                | `ADMIN` | List all students with academic metrics.            |
| `PATCH`  | `/students/:id/verify`     | `ADMIN` | Verify or revoke student verification.              |
| `GET`    | `/recruiters`              | `ADMIN` | List all recruiters.                                |
| `POST`   | `/recruiters`              | `ADMIN` | Onboard a new recruiter directly.                   |
| `PATCH`  | `/recruiters/:id/verify`   | `ADMIN` | Verify/approve company recruiter account.           |
| `GET`    | `/companies`               | `ADMIN` | List all companies and assigned tiers.              |
| `GET`    | `/jobs`                    | `ADMIN` | List all job openings across the campus.            |
| `GET`    | `/applications`            | `ADMIN` | Overview of all candidate applications.             |
| `GET`    | `/assessments/stats`       | `ADMIN` | Overall assessment completion and pass rates.       |
| `GET`    | `/drives`                  | `ADMIN` | List all placement drives.                          |
| `POST`   | `/drives`                  | `ADMIN` | Create a new campus placement drive.                |
| `PATCH`  | `/drives/:id`              | `ADMIN` | Update placement drive details.                     |
| `DELETE` | `/drives/:id`              | `ADMIN` | Delete a placement drive.                           |
| `GET`    | `/interviews`              | `ADMIN` | College-wide interview schedule with conflict view. |
| `PATCH`  | `/interviews/:id/schedule` | `ADMIN` | Override interview schedule slot.                   |
| `GET`    | `/offers`                  | `ADMIN` | View all released student offers.                   |
| `POST`   | `/notifications/broadcast` | `ADMIN` | Broadcast announcement to students or recruiters.   |
| `GET`    | `/notifications`           | `ADMIN` | Get admin alerts and drive notifications.           |
| `PATCH`  | `/notifications/read-all`  | `ADMIN` | Mark all notifications as read.                     |
| `PATCH`  | `/notifications/:id/read`  | `ADMIN` | Mark notification as read.                          |

---

### 5. Jobs & Matchmaking (`/api/jobs`)

| Method   | Endpoint         | Role                 | Description                                         |
| -------- | ---------------- | -------------------- | --------------------------------------------------- |
| `GET`    | `/`              | Authenticated        | Browse jobs with search and branch/salary filters.  |
| `GET`    | `/:id`           | Authenticated        | Get full details of a specific job.                 |
| `POST`   | `/`              | `RECRUITER`, `ADMIN` | Create a job posting.                               |
| `PATCH`  | `/:id`           | `RECRUITER`, `ADMIN` | Edit job posting.                                   |
| `DELETE` | `/:id`           | `RECRUITER`, `ADMIN` | Remove job posting.                                 |
| `POST`   | `/match-all`     | `STUDENT`            | Run AI match across all jobs for the student.       |
| `POST`   | `/:id/match`     | `STUDENT`            | Compute candidate match score for a job.            |
| `POST`   | `/:id/skill-gap` | `STUDENT`            | Compute missing skills & skill-gap score for a job. |

---

### 6. Applications (`/api/applications`)

| Method  | Endpoint      | Role          | Description                                                                  |
| ------- | ------------- | ------------- | ---------------------------------------------------------------------------- |
| `POST`  | `/`           | `STUDENT`     | Submit an application for a job.                                             |
| `GET`   | `/my`         | `STUDENT`     | List current student's applications.                                         |
| `GET`   | `/`           | `RECRUITER`   | List applications received by recruiter's company.                           |
| `GET`   | `/:id`        | Authenticated | View details of a specific application.                                      |
| `PATCH` | `/:id/status` | `RECRUITER`   | Transition application state (`SHORTLISTED`, `INTERVIEW`, `ACCEPTED`, etc.). |

---

### 7. Assessments & Invites (`/api/assessments`)

| Method   | Endpoint                | Role          | Description                                          |
| -------- | ----------------------- | ------------- | ---------------------------------------------------- |
| `GET`    | `/invite/:token`        | Public        | Access candidate assessment using signed token.      |
| `POST`   | `/invite/:token/submit` | Public        | Submit candidate answers for token-based assessment. |
| `GET`    | `/results/my`           | `STUDENT`     | View authenticated student's test results.           |
| `GET`    | `/`                     | Authenticated | List available assessments.                          |
| `POST`   | `/`                     | `ADMIN`       | Create a new assessment test.                        |
| `GET`    | `/:id`                  | Authenticated | Get specific assessment metadata.                    |
| `PATCH`  | `/:id`                  | `ADMIN`       | Update assessment questions or duration.             |
| `DELETE` | `/:id`                  | `ADMIN`       | Delete assessment.                                   |
| `GET`    | `/:id/results`          | `ADMIN`       | View all candidate scores for an assessment.         |
| `POST`   | `/:id/results`          | `ADMIN`       | Record manual score for a candidate.                 |

---

### 8. AI Streaming Chat (`/api/ai` & `/ai`)

| Method | Endpoint | Role            | Description                                                                                                                               |
| ------ | -------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/chat`  | Public / Authed | Real-time streaming conversational assistant using Vercel AI SDK and Google Gemini. Accepts custom `x-gemini-api-key` header if provided. |

---

### 9. System Health (`/health`)

| Method | Endpoint  | Role   | Description                                                   |
| ------ | --------- | ------ | ------------------------------------------------------------- |
| `GET`  | `/health` | Public | Returns `{ "status": "ok", "message": "Server is healthy" }`. |

---

## ⚙️ Environment Configuration

Ensure `apps/server/.env` is configured properly:

```env
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001

# Better Auth
BETTER_AUTH_SECRET=your_32_character_long_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# Database & Cache
DATABASE_URL=postgresql://postgres:password@localhost:5432/CampusLink?schema=public
REDIS_URL=redis://localhost:6379

# AI Microservice URL
AI_SERVICE_URL=http://localhost:8000

# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Nodemailer / SMTP
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM="CampusLink <noreply@campuslink.edu>"

# Google OAuth 2.0 (Optional)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# ImageKit Storage
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
IMAGEKIT_FOLDER=campuslink
```

---

## 🚀 Local Development & Setup

Run the server independently from the root:

```bash
# Start server in watch mode using tsx
pnpm --filter server dev
```

Or from within `apps/server`:

```bash
cd apps/server
pnpm run dev
```

The server will initialize on:

```text
http://localhost:3000
```

### Production Build:

```bash
pnpm --filter server build
pnpm --filter server start
```

---

## 🧪 Testing

Run server-specific Vitest unit and integration test suites:

```bash
# Run server tests once
pnpm run test:server

# Run with test coverage report
pnpm run test:coverage:server
```
