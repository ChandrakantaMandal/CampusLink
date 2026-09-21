import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createApplicationController,
  getApplicationController,
  getMyApplicationsController,
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

// Authenticated user views an application
router.get("/:id", requireAuth, getApplicationController);

// Recruiter/Admin updates application status
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  updateApplicationStatusController,
);

export default router;
