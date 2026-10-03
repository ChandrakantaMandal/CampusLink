import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getMyStudentDashboard,
  getMyStudentDrives,
  getMyStudentInterviews,
  getMyStudentNotifications,
  getMyStudentOffers,
  getMyStudentReadiness,
  getMyStudentProfile,
  getStudent,
  updateMyStudentProfile,
} from "./student.controller";

const router = Router();



// Get currently logged-in student's profile
router.get("/me", requireAuth, requireRole("STUDENT"), getMyStudentProfile);

// Update currently logged-in student's profile
router.patch("/me",requireAuth,requireRole("STUDENT"),updateMyStudentProfile);

// Student dashboard aggregates
router.get("/me/dashboard",requireAuth, requireRole("STUDENT"), getMyStudentDashboard);

// Student readiness aggregates
router.get("/me/readiness", requireAuth, requireRole("STUDENT"), getMyStudentReadiness);

// Student placement drives (registered + available)
router.get("/me/drives",requireAuth, requireRole("STUDENT"), getMyStudentDrives);

// Student interviews (upcoming + past)
router.get("/me/interviews", requireAuth, requireRole("STUDENT"), getMyStudentInterviews);

// Student offers + stats
router.get("/me/offers", requireAuth, requireRole("STUDENT"), getMyStudentOffers);

// Student notifications + unread count
router.get("/me/notifications", requireAuth, requireRole("STUDENT"), getMyStudentNotifications);

// Get a student by ID
router.get("/:id", requireAuth,requireRole("RECRUITER", "ADMIN"), getStudent);

export default router;
