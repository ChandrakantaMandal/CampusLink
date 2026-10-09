import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { uploadImageFile, uploadResumeFile } from "../../middleware/upload.middleware";

import { uploadMyPhotoController, uploadMyResumeController } from "../uploads/upload.controller";

import {
  acceptMyStudentOffer,
  getMyStudentDashboard,
  getMyStudentDrives,
  getMyStudentInterviews,
  getMyStudentNotifications,
  getMyStudentOffers,
  getMyStudentReadiness,
  getMyStudentProfile,
  getStudent,
  markMyStudentNotificationRead,
  markMyStudentNotificationsReadAll,
  registerMyStudentDrive,
  updateMyStudentProfile,
  getMyReadiness,
} from "./student.controller";

const router = Router();



router.get("/me", requireAuth, requireRole("STUDENT"), getMyStudentProfile);

// Update currently logged-in student's profile
router.patch("/me",requireAuth,requireRole("STUDENT"),updateMyStudentProfile);

// Upload student resume (PDF)
router.post("/me/resume", requireAuth, requireRole("STUDENT"), uploadResumeFile, uploadMyResumeController);

// Upload student photo (jpg/png/webp)
router.post("/me/photo", requireAuth, requireRole("STUDENT"), uploadImageFile, uploadMyPhotoController);

// Student dashboard aggregates
router.get("/me/dashboard",requireAuth, requireRole("STUDENT"), getMyStudentDashboard);

// Student readiness aggregates
router.get("/me/readiness", requireAuth, requireRole("STUDENT"), getMyStudentReadiness);

// Student placement drives (registered + available)
router.get("/me/drives",requireAuth, requireRole("STUDENT"), getMyStudentDrives);

// Register for a placement drive
router.post("/me/drives/:id/register", requireAuth, requireRole("STUDENT"), registerMyStudentDrive);

// Student interviews (upcoming + past)
router.get("/me/interviews", requireAuth, requireRole("STUDENT"), getMyStudentInterviews);

// Student offers + stats
router.get("/me/offers", requireAuth, requireRole("STUDENT"), getMyStudentOffers);

// Accept an offer (student's own)
router.patch("/me/offers/:id/accept", requireAuth, requireRole("STUDENT"), acceptMyStudentOffer);

// Student notifications + unread count
router.get("/me/notifications", requireAuth, requireRole("STUDENT"), getMyStudentNotifications);
router.patch("/me/notifications/read-all", requireAuth, requireRole("STUDENT"), markMyStudentNotificationsReadAll);
router.patch("/me/notifications/:id/read", requireAuth, requireRole("STUDENT"), markMyStudentNotificationRead);

router.get(
  "/readiness",
  requireAuth,
  requireRole("STUDENT"),
  getMyReadiness,
);

router.get(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  getStudent,
);

export default router;