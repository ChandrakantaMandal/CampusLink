import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getDashboardStatsController,
  getUsersController,
  getUserController,
  deleteUserController,
  getStudentsController,
  getRecruitersController,
  getCompaniesController,
  getJobsController,
  getApplicationsController,
  getAssessmentStatsController,
  getDrivesController,
  getDriveController,
  createPlacementDriveController,
  updatePlacementDriveController,
  deletePlacementDriveController,
  createRecruiterController,
} from "./admin.controller";

const router = Router();

// Get admin dashboard statistics
router.get(
  "/dashboard",
  requireAuth,
  requireRole("ADMIN"),
  getDashboardStatsController,
);

// Get all users
router.get("/users", requireAuth, requireRole("ADMIN"), getUsersController);

// Get a single user
router.get("/users/:id", requireAuth, requireRole("ADMIN"), getUserController);

// Delete a user
router.delete(
  "/users/:id",
  requireAuth,
  requireRole("ADMIN"),
  deleteUserController,
);

// Get all students
router.get(
  "/students",
  requireAuth,
  requireRole("ADMIN"),
  getStudentsController,
);

// Get all recruiters
router.get(
  "/recruiters",
  requireAuth,
  requireRole("ADMIN"),
  getRecruitersController,
);
// Create a recruiter
router.post(
  "/recruiters",
  requireAuth,
  requireRole("ADMIN"),
  createRecruiterController,
);

// Get all companies
router.get(
  "/companies",
  requireAuth,
  requireRole("ADMIN"),
  getCompaniesController,
);

// Get all jobs
router.get("/jobs", requireAuth, requireRole("ADMIN"), getJobsController);

// Get all applications
router.get(
  "/applications",
  requireAuth,
  requireRole("ADMIN"),
  getApplicationsController,
);

// Get assessment statistics
router.get(
  "/assessments/stats",
  requireAuth,
  requireRole("ADMIN"),
  getAssessmentStatsController,
);

// Get all placement drives
router.get("/drives", requireAuth, requireRole("ADMIN"), getDrivesController);

// Get a single placement drive
router.get(
  "/drives/:id",
  requireAuth,
  requireRole("ADMIN"),
  getDriveController,
);

// Create a placement drive
router.post(
  "/drives",
  requireAuth,
  requireRole("ADMIN"),
  createPlacementDriveController,
);

// Update a placement drive
router.patch(
  "/drives/:id",
  requireAuth,
  requireRole("ADMIN"),
  updatePlacementDriveController,
);

// Delete a placement drive
router.delete(
  "/drives/:id",
  requireAuth,
  requireRole("ADMIN"),
  deletePlacementDriveController,
);

export default router;
