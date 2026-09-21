import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getMyStudentProfile,
  getStudent,
  updateMyStudentProfile,
} from "./student.controller";

const router = Router();

// Get currently logged-in student's profile
router.get("/me", requireAuth, requireRole("STUDENT"), getMyStudentProfile);

// Update currently logged-in student's profile
router.patch("/me",requireAuth,requireRole("STUDENT"),updateMyStudentProfile);

// Get a student by ID
router.get("/:id", requireAuth,requireRole("RECRUITER", "ADMIN"), getStudent);

export default router;
