import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createJobController,
  deleteJobController,
  getJobController,
  getJobsController,
  updateJobController,
  matchJobController,
  matchJobsController,
  skillGapController,
} from "./job.controller";

const router = Router();

/* =========================
   Create job
========================= */

router.post(
  "/",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  createJobController,
);

/* =========================
   Get all jobs
========================= */

router.get(
  "/",
  requireAuth,
  getJobsController,
);

/* =========================
   AI Match All Jobs
========================= */

router.post(
  "/match-all",
  requireAuth,
  requireRole("STUDENT"),
  matchJobsController,
);

/* =========================
   AI Job Match
========================= */

router.post(
  "/:id/match",
  requireAuth,
  requireRole("STUDENT"),
  matchJobController,
);

/* =========================
   AI Skill Gap
========================= */

router.post(
  "/:id/skill-gap",
  requireAuth,
  requireRole("STUDENT"),
  skillGapController,
);

/* =========================
   Get single job
========================= */

router.get(
  "/:id",
  requireAuth,
  getJobController,
);

/* =========================
   Update job
========================= */

router.patch(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  updateJobController,
);

/* =========================
   Delete job
========================= */

router.delete(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  deleteJobController,
);

export default router;