import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createProjectController,
  deleteProjectController,
  getMyProjectsController,
  updateProjectController,
} from "./project.controller";

const router = Router();

// Get current student's projects
router.get("/my", requireAuth, requireRole("STUDENT"), getMyProjectsController);

// Create a project
router.post("/", requireAuth, requireRole("STUDENT"), createProjectController);

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
