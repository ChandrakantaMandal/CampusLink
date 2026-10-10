import { Router } from "express";

import {
  getAssessmentInviteController,
  submitAssessmentInviteController,
} from "./assessment.controller";

const router = Router();

// Email invitation links are signed and time-limited; the token grants access to this one assessment.
router.get("/invite/:token", getAssessmentInviteController);
router.post("/invite/:token/submit", submitAssessmentInviteController);

export default router;
