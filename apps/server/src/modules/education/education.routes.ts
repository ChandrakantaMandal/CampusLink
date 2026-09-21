import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createEducationController,
  deleteEducationController,
  getEducationController,
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

// Get education record
router.get("/:id", requireAuth, requireRole("STUDENT"), getEducationController);

// Update education record
router.patch(
  "/:id",
  requireAuth,
  requireRole("STUDENT"),
  updateEducationController,
);

// Delete education record
router.delete(
  "/:id",
  requireAuth,
  requireRole("STUDENT"),
  deleteEducationController,
);

export default router;
