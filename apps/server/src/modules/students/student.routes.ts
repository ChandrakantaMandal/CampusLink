import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getMyStudentApplications,
  getMyStudentDashboard,
  getMyStudentDrives,
  getMyStudentInterviews,
  getMyStudentJobs,
  getMyStudentNotifications,
  getMyStudentOffers,
  getMyStudentReadiness,
  getMyStudentSkills,
  getMyStudentProfile,
  getStudent,
  updateMyStudentProfile,
} from "./student.controller";

const router = Router();

const studentGuard = [requireAuth, requireRole("STUDENT")];

// Get currently logged-in student's profile
router.get("/me", requireAuth, requireRole("STUDENT"), getMyStudentProfile);

// Update currently logged-in student's profile
router.patch("/me",requireAuth,requireRole("STUDENT"),updateMyStudentProfile);

// Student dashboard aggregates
router.get("/me/dashboard", ...studentGuard, getMyStudentDashboard);

// Student readiness aggregates
router.get("/me/readiness", ...studentGuard, getMyStudentReadiness);

// Student placement drives (registered + available)
router.get("/me/drives", ...studentGuard, getMyStudentDrives);

// Student skills
router.get("/me/skills", ...studentGuard, getMyStudentSkills);

// Student job recommendations
router.get("/me/jobs", ...studentGuard, getMyStudentJobs);

// Student applications + status stats
router.get("/me/applications", ...studentGuard, getMyStudentApplications);

// Student interviews (upcoming + past)
router.get("/me/interviews", ...studentGuard, getMyStudentInterviews);

// Student offers + stats
router.get("/me/offers", ...studentGuard, getMyStudentOffers);

// Student notifications + unread count
router.get("/me/notifications", ...studentGuard, getMyStudentNotifications);

// Get a student by ID
router.get("/:id", requireAuth,requireRole("RECRUITER", "ADMIN"), getStudent);

export default router;
