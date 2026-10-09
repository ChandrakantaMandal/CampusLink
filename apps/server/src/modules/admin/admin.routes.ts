import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getDashboardStatsController,
  getStudentsController,
  getRecruitersController,
  getCompaniesController,
  getJobsController,
  getApplicationsController,
  getDrivesController,
  createPlacementDriveController,
  updatePlacementDriveController,
  deletePlacementDriveController,
  verifyStudentController,
  verifyRecruiterController,
  createRecruiterController,
  getOffersController,
  getInterviewsController,
  updateInterviewScheduleController,
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
  broadcastNotificationController,
  getSettingsController,
  updateSettingsController,
} from "./admin.controller";

const router = Router();

// Get admin dashboard statistics
router.get(
  "/dashboard",
  requireAuth,
  requireRole("ADMIN"),
  getDashboardStatsController,
);

// Get admin settings (profile, campus, system, security)
router.get(
  "/settings",
  requireAuth,
  requireRole("ADMIN"),
  getSettingsController,
);

// Update admin settings
router.put(
  "/settings",
  requireAuth,
  requireRole("ADMIN"),
  updateSettingsController,
);

// Get all students
router.get(
  "/students",
  requireAuth,
  requireRole("ADMIN"),
  getStudentsController,
);

// Verify or revoke verification for a student
router.patch(
  "/students/:id/verify",
  requireAuth,
  requireRole("ADMIN"),
  verifyStudentController,
);

// Get all recruiters
router.get(
  "/recruiters",
  requireAuth,
  requireRole("ADMIN"),
  getRecruitersController,
);

// Approve or reject a recruiter's company verification
router.patch(
  "/recruiters/:id/verify",
  requireAuth,
  requireRole("ADMIN"),
  verifyRecruiterController,
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

// Get all placement drives
router.get("/drives", requireAuth, requireRole("ADMIN"), getDrivesController);

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

// Get all offers
router.get("/offers", requireAuth, requireRole("ADMIN"), getOffersController);

// Delete a placement drive
router.delete(
  "/drives/:id",
  requireAuth,
  requireRole("ADMIN"),
  deletePlacementDriveController,
);

// Get all interviews
router.get(
  "/interviews",
  requireAuth,
  requireRole("ADMIN"),
  getInterviewsController,
);

// Reschedule an interview
router.patch(
  "/interviews/:id/schedule",
  requireAuth,
  requireRole("ADMIN"),
  updateInterviewScheduleController,
);

// Get admin notifications
router.get(
  "/notifications",
  requireAuth,
  requireRole("ADMIN"),
  getNotificationsController,
);

// Mark all admin notifications as read
router.patch(
  "/notifications/read-all",
  requireAuth,
  requireRole("ADMIN"),
  markAllNotificationsReadController,
);

// Mark a single admin notification as read
router.patch(
  "/notifications/:id/read",
  requireAuth,
  requireRole("ADMIN"),
  markNotificationReadController,
);

// Broadcast a notification to students or recruiters
router.post(
  "/notifications/broadcast",
  requireAuth,
  requireRole("ADMIN"),
  broadcastNotificationController,
);

export default router;
