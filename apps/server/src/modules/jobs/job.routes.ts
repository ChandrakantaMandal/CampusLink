import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getJobsController,
  matchJobController,
  skillGapController,
} from "./job.controller";

const router = Router();

/* =========================
   Get all jobs
========================= */

router.get(
  "/",
  requireAuth,
  getJobsController,
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

export default router;
