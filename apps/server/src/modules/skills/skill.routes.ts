import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  addStudentSkillController,
  createSkillController,
  deleteSkillController,
  getMySkillsController,
  getSkillController,
  getSkillsController,
  removeStudentSkillController,
  updateSkillController,
  updateStudentSkillController,
} from "./skill.controller";

const router = Router();

// Get all skills
router.get("/", requireAuth, getSkillsController);

// Get a single skill
router.get("/:id", requireAuth, getSkillController);

// Create a new skill
router.post("/", requireAuth, requireRole("ADMIN"), createSkillController);

// Update a skill
router.patch("/:id", requireAuth, requireRole("ADMIN"), updateSkillController);

// Delete a skill
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteSkillController);

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

// Update current student's skill
router.patch(
  "/student/me/:skillId",
  requireAuth,
  requireRole("STUDENT"),
  updateStudentSkillController,
);

// Remove current student's skill
router.delete(
  "/student/me/:skillId",
  requireAuth,
  requireRole("STUDENT"),
  removeStudentSkillController,
);

export default router;
