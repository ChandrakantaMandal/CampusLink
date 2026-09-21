import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  createCompanyController,
  getCompaniesController,
  getCompanyController,
  updateCompanyController,
} from "./company.controller";

const router = Router();

// Create company
router.post(
  "/",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  createCompanyController,
);

// Get all companies
router.get("/", requireAuth, getCompaniesController);

// Get company by ID
router.get("/:id", requireAuth, getCompanyController);

// Update company
router.patch(
  "/:id",
  requireAuth,
  requireRole("RECRUITER", "ADMIN"),
  updateCompanyController,
);

export default router;
