import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getMyStudentProfile,
  getStudent,
  updateMyStudentProfile,
  getMyReadiness,
} from "./student.controller";

const router = Router();

router.get(
  "/me",
  requireAuth,
  requireRole("STUDENT"),
  getMyStudentProfile,
);

router.patch(
  "/me",
  requireAuth,
  requireRole("STUDENT"),
  updateMyStudentProfile,
);

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