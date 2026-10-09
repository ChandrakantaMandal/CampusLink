import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createEducationController,
  getMyEducationController,
  updateEducationController,
} from "./education.controller";

const router = Router();

// Get current student's education
router.get(
  "/my",
  requireAuth,
  requireRole("STUDENT"),
  getMyEducationController,
);

// Add education record
router.post(
  "/",
  requireAuth,
  requireRole("STUDENT"),
  createEducationController,
);

// Update education record
router.patch(
  "/:id",
  requireAuth,
  requireRole("STUDENT"),
  updateEducationController,
);

export default router;
