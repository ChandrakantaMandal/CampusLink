# CampusLink Web — Next.js & Progressive Web App (PWA)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-black?style=for-the-badge)](https://www.radix-ui.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-brown?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

> **CampusLink Web** is the modern frontend web application and installable PWA for students, recruiters, and placement officers. Built on Next.js 16 (App Router) and React 19, it features three comprehensive role-tailored dashboards, an AI-powered resume and skill-gap visualizer, interactive placement analytics, candidate test environments, and an ambient conversational career assistant.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Directory Structure](#-directory-structure)
- [Role-Based Portals & Routes](#-role-based-portals--routes)
  - [1. 🎓 Student Experience (`/student/*`)](#1--student-experience-student)
  - [2. 🏢 Recruiter Experience (`/recruiter/*`)](#2--recruiter-experience-recruiter)
  - [3. 🏛️ Admin / TPO Experience (`/admin/*`)](#3-️-admin--tpo-experience-admin)
  - [4. ✍️ Candidate Assessment Interface (`/assessment/*`)](#4-️-candidate-assessment-interface-assessment)
  - [5. 💬 Ambient AI Assistant (Floating Widget)](#5--ambient-ai-assistant-floating-widget)
- [Design System & UI Components](#-design-system--ui-components)
- [State Management & API Layer](#-state-management--api-layer)
- [Progressive Web App (PWA) Capabilities](#-progressive-web-app-pwa-capabilities)
- [Environment Configuration](#-environment-configuration)
- [Local Development & Setup](#-local-development--setup)
- [Testing & Quality](#-testing--quality)

---

## 🌟 Key Features

- **🚀 High-Performance Next.js 16 + React 19**: Powered by React Server Components, server actions, optimistic UI updates, and the React Compiler (`babel-plugin-react-compiler`).
- **🎨 Glassmorphic & Modern Aesthetics**: Beautiful dark/light themes (`next-themes`), Tailwind CSS v4 design tokens, smooth transitions, and `@CampusLink/ui` shared primitives.
- **📱 Progressive Web App (PWA)**: Full offline service worker caching and home-screen installability for mobile and desktop users.
- **📊 Rich Placement Visualizations**: Interactive salary distribution graphs, branch-wise placement percentages, and hiring funnels powered by **Recharts**.
- **⚡ Robust API Integration**: Axios client with automated error enrichment, typed query parameters, and instant field-level error forwarding.

---

## 📁 Directory Structure

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── (routes)/
│   │   │   ├── admin/                # Admin/TPO portal pages (dashboard, analytics, users, etc.)
│   │   │   ├── recruiter/            # Recruiter portal pages (dashboard, candidates, offers, etc.)
│   │   │   ├── student/              # Student portal pages (dashboard, profile, drives, readiness, etc.)
│   │   │   ├── assessment/           # Timed assessment examination environment
│   │   │   ├── login/                # Sign-in page (Email + Google OAuth)
│   │   │   ├── signup/               # Registration page (Email + OTP verification trigger)
│   │   │   ├── verify-email/         # 6-digit OTP verification view
│   │   │   └── reset-password/       # Password recovery flow
│   │   ├── layout.tsx                # Global HTML root layout with providers & theme
│   │   ├── manifest.ts               # Web App Manifest for PWA installation
│   │   └── page.tsx                  # Public landing page with persona tabs & readiness preview
│   │
│   ├── components/
│   │   ├── landing/                  # Landing page sections (Hero, Bento, PersonaTabs, Calculator)
│   │   ├── dashboard/
│   │   │   ├── student/              # Student dashboard widgets & 13 profile sections
│   │   │   ├── recruiter/            # Recruiter hiring pipeline views & job creators
│   │   │   └── admin/                # Admin analytics views, drive managers, verification lists
│   │   ├── ai/                       # FloatingChatWidget, message scroller, AI prompts
│   │   ├── assessment/               # Assessment invite test layout & question timers
│   │   ├── brand/                    # CampusLink logos, SVGs, and brand marks
│   │   └── mode-toggle.tsx           # Dark/Light theme switcher
│   │
│   ├── lib/
│   │   ├── api/                      # Strongly typed Axios API services
│   │   │   ├── client.ts             # Central Axios instance with error interceptors
│   │   │   ├── student.api.ts        # Student profile, drives, readiness, offers endpoints
│   │   │   ├── recruiter.api.ts      # Recruiter candidates, jobs, offers, interviews endpoints
│   │   │   ├── admin.api.ts          # Admin metrics, verification, drive coordination
│   │   │   └── application.api.ts    # Job application submission & status tracking
│   │   ├── auth-client.ts            # Better Auth client configuration
│   │   └── dashboard-adapters.ts     # Data transformation adapters for UI charts
│   │
│   ├── stores/                       # Zustand global state stores
│   └── index.css                     # Tailwind CSS v4 root stylesheet & theme tokens
│
├── public/                           # Static assets, icons, and PWA manifest images
├── pwa.config.ts                     # PWA workbox caching and service worker rules
├── next.config.ts                    # Next.js configuration (images, redirects, compiler)
├── .env.schema                       # Varlock environment variables schema
└── package.json
```

---

## 🖥️ Role-Based Portals & Routes

### 1. 🎓 Student Experience (`/student/*`)

| Route | Feature | Key Components |
|---|---|---|
| `/student/dashboard` | Placement Overview | `WelcomeBanner`, `KeyStatistics`, `UpcomingDrivesCard`, `AIReadinessCard`, `ApplicationsTracker`. |
| `/student/profile` | 13-Section Student Portfolio | `PersonalInformation`, `EducationSection`, `ProjectsSection`, `SkillsSection`, `CertificationsSection`, `ResumeSection`, `ResumePreviewModal`. |
| `/student/jobs` | Smart Job Explorer | Instant match percentage badges, required vs matched skill tags, quick apply. |
| `/student/drives` | Placement Drive Hub | Filter by Tier 1/2/3, real-time CGPA/branch eligibility badge, 1-click drive registration. |
| `/student/applications`| Application Pipeline | Track stages from `APPLIED` to `INTERVIEW` to `ACCEPTED`. |
| `/student/interviews` | Interview Schedule | Interview rounds, scheduled date/time, Google Meet links, conflict alerts. |
| `/student/offers` | Offers & CTC Breakdown | Salary packages (Base + Variable Bonus), offer letter download, 1-click acceptance. |
| `/student/readiness` | Career Readiness Analysis | Breakdown across Academics (20%), Technical Skills (30%), Projects (20%), and Certifications. |
| `/student/skills` | Skill Assessment Matrix | Self-rating, proficiency levels (`BEGINNER` to `EXPERT`), experience years. |
| `/student/notifications`| Notification Inbox | Drive announcements, status changes, interview alerts. |
| `/student/settings` | Profile & Account Settings | Password change, visibility toggle, notification preferences. |

#### Student Resume AI Analyzer
Within `/student/profile`, students can upload their resume (PDF). The file is stored in ImageKit, analyzed by the Python microservice (PyMuPDF + Gemini), and produces:
- Automatically extracted skills, projects, and educational credentials.
- Concrete resume strengths and weaknesses.
- Actionable recommendations for improvement.

---

### 2. 🏢 Recruiter Experience (`/recruiter/*`)

| Route | Feature | Key Components |
|---|---|---|
| `/recruiter/dashboard` | Hiring Metrics | `RecruiterDashboardHomeView`: Active jobs, applicants in review, scheduled interviews, offers extended. |
| `/recruiter/jobs` | Job Posting Creator | `RecruiterJobsView`: Multi-round hiring workflow creator, salary bounds, branch eligibility filters. |
| `/recruiter/candidates`| Candidate Discovery | `RecruiterCandidatesView`: Filter verified students by department, CGPA, and specific skill tags. |
| `/recruiter/shortlisted`| Shortlist & Test Invites | `RecruiterShortlistedView`: Move candidates into test stages; batch assessment invite email dispatch. |
| `/recruiter/interviews`| Interview Logistics | `RecruiterInterviewsView`: Schedule virtual/in-person rounds, assign panelists, submit ratings & feedback. |
| `/recruiter/offers` | Offer Release & Tracking | `RecruiterOffersView`: Draft formal offers, customize compensation, track student response deadlines. |
| `/recruiter/profile` | Company Branding | `RecruiterCompanyProfileView`: Company bio, website, tier, and logo upload via ImageKit. |
| `/recruiter/settings` | Notification Preferences | `RecruiterSettingsView`: Email alerts for new applications and interview acceptances. |

---

### 3. 🏛️ Admin / TPO Experience (`/admin/*`)

| Route | Feature | Key Components |
|---|---|---|
| `/admin/dashboard` | Central Command Center | `DashboardHomeView`: College-wide placement % KPI, highest CTC, drive calendars, active companies. |
| `/admin/analytics` | Deep Placement Analytics | `AdminAnalyticsView`: Branch-wise placement distribution, salary brackets, hiring partner benchmarks. |
| `/admin/students` | Student Academic Verification | `StudentsManagementView`: Student directory, backlog verification, verification toggle switches. |
| `/admin/recruiters` | Company & Recruiter Governance | `RecruitersManagementView`: Verify company profiles, assign company tier (Tier 1/2/3). |
| `/admin/drives` | Drive Operations Management | `PlacementDrivesView`: Schedule on-campus/virtual drives, configure rounds, venues, and deadlines. |
| `/admin/interviews` | Global Conflict Resolution | `InterviewScheduleView`: Master interview grid across all companies; detect overlapping student interviews. |
| `/admin/offers` | Offer Approvals & Policy | `OffersManagementView`: Audit release offers, ensure compliance with college placement policy. |
| `/admin/notifications`| Broadcast Announcements | `AdminNotificationsView`: Send broadcast push/email alerts to all students or recruiters. |
| `/admin/settings` | Placement Policy Config | `AdminSettingsView`: Academic thresholds, dual-offer eligibility rules, system parameters. |

---

### 4. ✍️ Candidate Assessment Interface (`/assessment/*`)

- Accessible via signed, time-limited token links (e.g. `/assessment/invite/:token`).
- Clean, distraction-free examination view (`AssessmentInvite.tsx`).
- Live countdown timer, multiple-choice / coding questions, and automated score submission.

---

### 5. 💬 Ambient AI Assistant (Floating Widget)

- Mounted globally across the landing page and student portal (`FloatingChatWidget.tsx`).
- Powered by **Vercel AI SDK** (`@ai-sdk/react`) streaming directly from `/api/ai/chat`.
- Provides instant context-aware answers to student questions regarding:
  - Placement drive eligibility rules.
  - Recommended learning tracks for missing skills.
  - Resume tips and common interview questions.

---

## 🎨 Design System & UI Components

The web application leverages `@CampusLink/ui` shared primitives along with customized shadcn/ui components:

- **Buttons & Indicators**: Multiple variants (`default`, `outline`, `destructive`, `ghost`).
- **Cards & Bento Layouts**: Elevated containers with subtle dark-mode borders and glassmorphism.
- **Interactive Inputs**: `InputGroup`, `Textarea`, `Checkbox`, `DropdownMenu`.
- **Feedback & Loaders**: `Skeleton` placeholders, `Sonner` toasts, and dynamic spinners.

---

## ⚡ State Management & API Layer

### Centralized Axios Client (`src/lib/api/client.ts`)
```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
```

All responses automatically parse error payloads (`fieldErrors`, `message`) for seamless integration with toast notifications.

---

## 📱 Progressive Web App (PWA) Capabilities

The web application is fully PWA-enabled:

- **Manifest Configuration**: Defined in `src/app/manifest.ts` with brand icons, standalone display mode, and placement app shortcuts.
- **Service Worker**: Configured via `pwa.config.ts` to cache static assets, font files, and shell routes for offline reliability.
- **Install Prompts**: Built-in PWA registration (`src/components/pwa-registration.tsx`) detects when the app can be installed natively on mobile or desktop.

---

## ⚙️ Environment Configuration

Create `apps/web/.env`:

```env
NODE_ENV=development
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

> [!NOTE]
> `NEXT_PUBLIC_SERVER_URL` specifies the Express server address. In production, update this to your deployed backend URL.

---

## 🚀 Local Development & Setup

Run the Next.js development server independently:

```bash
# From workspace root
pnpm --filter web dev
```

Or from within `apps/web`:

```bash
cd apps/web
pnpm run dev
```

The application will be live at:
```text
http://localhost:3001
```

### Production Build:
```bash
pnpm --filter web build
pnpm --filter web start
```

---

## 🧪 Testing & Quality

```bash
# Run web test suite
pnpm run test:web

# Run test coverage
pnpm run test:coverage:web

# TypeScript type checks
pnpm --filter web check-types
```
