import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  addStudentSkillController,
  getMySkillsController,
  removeStudentSkillController,
} from "./skill.controller";

const router = Router();

// Get current student's skills
router.get(
  "/student/me",
  requireAuth,
  requireRole("STUDENT"),
  getMySkillsController,
);

// Add a skill to current student
router.post(
  "/student/me",
  requireAuth,
  requireRole("STUDENT"),
  addStudentSkillController,
);

// Remove current student's skill
router.delete(
  "/student/me/:skillId",
  requireAuth,
  requireRole("STUDENT"),
  removeStudentSkillController,
);

export default router;
