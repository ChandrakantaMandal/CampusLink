import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createJobController,
  deleteJobController,
  getJobController,
  getJobsController,
  updateJobController,
} from "./job.controller";

const router = Router();

// Create job
router.post(
  "/",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  createJobController,
);

// Get all jobs
router.get("/", requireAuth, getJobsController);

// Get single job
router.get("/:id", requireAuth, getJobController);

// Update job
router.patch(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  updateJobController,
);

// Delete job
router.delete(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  deleteJobController,
);

export default router;
