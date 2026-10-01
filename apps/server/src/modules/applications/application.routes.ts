import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createApplicationController,
  getApplicationController,
  getMyApplicationsController,
  getRecruiterApplicationsController,
  updateApplicationStatusController,
} from "./application.controller";

const router = Router();

// Student submits an application
router.post(
  "/",
  requireAuth,
  requireRole("STUDENT"),
  createApplicationController,
);

// Student views their applications
router.get(
  "/my",
  requireAuth,
  requireRole("STUDENT"),
  getMyApplicationsController,
);

// Recruiter views applications for their company's jobs
router.get(
  "/",
  requireAuth,
  requireRole("RECRUITER"),
  getRecruiterApplicationsController,
);

// Authenticated user views an application
router.get("/:id", requireAuth, getApplicationController);

// Recruiter updates application status
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("RECRUITER"),
  updateApplicationStatusController,
);

export default router;
