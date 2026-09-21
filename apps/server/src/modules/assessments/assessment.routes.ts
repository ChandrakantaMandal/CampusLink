import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createAssessmentController,
  getAssessmentsController,
  getAssessmentController,
  updateAssessmentController,
  deleteAssessmentController,
  createAssessmentResultController,
  getMyAssessmentResultsController,
  getAssessmentResultsController,
  getAssessmentResultController,
  updateAssessmentResultController,
  deleteAssessmentResultController,
} from "./assessment.controller";

const router = Router();

// Get current student's assessment results
router.get(
  "/results/my",
  requireAuth,
  requireRole("STUDENT"),
  getMyAssessmentResultsController,
);

// Get a single assessment result
router.get(
  "/results/:resultId",
  requireAuth,
  requireRole("ADMIN"),
  getAssessmentResultController,
);

// Update an assessment result
router.patch(
  "/results/:resultId",
  requireAuth,
  requireRole("ADMIN"),
  updateAssessmentResultController,
);

// Delete an assessment result
router.delete(
  "/results/:resultId",
  requireAuth,
  requireRole("ADMIN"),
  deleteAssessmentResultController,
);

// Get all assessments
router.get("/", requireAuth, getAssessmentsController);

// Create an assessment
router.post("/", requireAuth, requireRole("ADMIN"), createAssessmentController);

// Get one assessment
router.get("/:id", requireAuth, getAssessmentController);

// Update an assessment
router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  updateAssessmentController,
);

// Delete an assessment
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  deleteAssessmentController,
);

// Get all results for an assessment
router.get(
  "/:id/results",
  requireAuth,
  requireRole("ADMIN"),
  getAssessmentResultsController,
);

// Add a result to an assessment
router.post(
  "/:id/results",
  requireAuth,
  requireRole("ADMIN"),
  createAssessmentResultController,
);

export default router;
