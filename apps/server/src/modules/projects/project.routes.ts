import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  addProjectSkillController,
  createProjectController,
  deleteProjectController,
  getMyProjectsController,
  getProjectController,
  removeProjectSkillController,
  updateProjectController,
} from "./project.controller";

const router = Router();

// Get current student's projects
router.get("/my", requireAuth, requireRole("STUDENT"), getMyProjectsController);

// Create a project
router.post("/", requireAuth, requireRole("STUDENT"), createProjectController);

// Add skill to a project
router.post(
  "/:id/skills",
  requireAuth,
  requireRole("STUDENT"),
  addProjectSkillController,
);

// Remove skill from a project
router.delete(
  "/:id/skills/:skillId",
  requireAuth,
  requireRole("STUDENT"),
  removeProjectSkillController,
);

// Get a project
router.get(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  getProjectController,
);

// Update a project
router.patch(
  "/:id",
  requireAuth,
  requireRole("STUDENT"),
  updateProjectController,
);

// Delete a project
router.delete(
  "/:id",
  requireAuth,
  requireRole("STUDENT"),
  deleteProjectController,
);

export default router;
