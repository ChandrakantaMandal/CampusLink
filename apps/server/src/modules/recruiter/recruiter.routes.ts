import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createInterviewController,
  createMyJobController,
  createMyOfferController,
  deleteMyJobController,
  getMyInterviewsController,
  getMyJobsController,
  getMyNotificationsController,
  getMyOffersController,
  getRecruiterProfileController,
  getRecruiterStatsController,
  getShortlistedController,
  markAllNotificationsReadController,
  markNotificationReadController,
  updateInterviewController,
  updateRecruiterProfileController,
} from "./recruiter.controller";

const router = Router();

// Recruiter views own profile
router.get(
  "/profile",
  requireAuth,
  requireRole("RECRUITER"),
  getRecruiterProfileController,
);

// Recruiter updates own profile / company
router.patch(
  "/profile",
  requireAuth,
  requireRole("RECRUITER"),
  updateRecruiterProfileController,
);

// Recruiter views jobs for their company
router.get(
  "/jobs",
  requireAuth,
  requireRole("RECRUITER"),
  getMyJobsController,
);

// Recruiter creates a job for their company
router.post(
  "/jobs",
  requireAuth,
  requireRole("RECRUITER"),
  createMyJobController,
);

// Recruiter deletes a job for their company
router.delete(
  "/jobs/:id",
  requireAuth,
  requireRole("RECRUITER"),
  deleteMyJobController,
);

// Recruiter views interviews for their company
router.get(
  "/interviews",
  requireAuth,
  requireRole("RECRUITER"),
  getMyInterviewsController,
);

// Recruiter schedules an interview
router.post(
  "/interviews",
  requireAuth,
  requireRole("RECRUITER"),
  createInterviewController,
);

// Recruiter reschedules / updates an interview
router.patch(
  "/interviews/:id",
  requireAuth,
  requireRole("RECRUITER"),
  updateInterviewController,
);

// Recruiter views shortlisted candidates for their company
router.get(
  "/shortlisted",
  requireAuth,
  requireRole("RECRUITER"),
  getShortlistedController,
);

// Recruiter views offers issued by their company
router.get(
  "/offers",
  requireAuth,
  requireRole("RECRUITER"),
  getMyOffersController,
);

// Recruiter issues an offer
router.post(
  "/offers",
  requireAuth,
  requireRole("RECRUITER"),
  createMyOfferController,
);

// Recruiter views own notifications (+ unread count)
router.get(
  "/notifications",
  requireAuth,
  requireRole("RECRUITER"),
  getMyNotificationsController,
);

// Recruiter marks all notifications as read
router.patch(
  "/notifications/read-all",
  requireAuth,
  requireRole("RECRUITER"),
  markAllNotificationsReadController,
);

// Recruiter marks a single notification as read
router.patch(
  "/notifications/:id/read",
  requireAuth,
  requireRole("RECRUITER"),
  markNotificationReadController,
);

// Recruiter dashboard stats (sidebar badges / header counts)
router.get(
  "/stats",
  requireAuth,
  requireRole("RECRUITER"),
  getRecruiterStatsController,
);

export default router;
