import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import { matchStudentWithJob, analyzeStudentSkillGap } from "./job-ai.service";

import { getJobs } from "./job.service";

/* =========================
   MATCH SINGLE JOB
========================= */

export async function matchJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const result = await matchStudentWithJob(authenticatedReq.user.id, id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   SKILL GAP
========================= */

export async function skillGapController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const result = await analyzeStudentSkillGap(authenticatedReq.user.id, id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   GET ALL JOBS
========================= */

export async function getJobsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobs = await getJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
}
