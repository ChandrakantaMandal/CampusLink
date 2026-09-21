import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getDashboardStatsController,
  getUsersController,
  getUserController,
  updateUserRoleController,
  deleteUserController,
  getStudentsController,
  getRecruitersController,
  getCompaniesController,
  getJobsController,
  getApplicationsController,
  getAssessmentStatsController,
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

// Update a user's role
router.patch(
  "/users/:id/role",
  requireAuth,
  requireRole("ADMIN"),
  updateUserRoleController,
);

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

export default router;
