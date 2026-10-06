import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  matchStudentWithJob,
  matchStudentWithJobs,
  analyzeStudentSkillGap,
} from "./job-ai.service";

import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "./job.service";

import {
  createJobSchema,
  updateJobSchema,
} from "./job.schema";

/* =========================
   MATCH SINGLE JOB
========================= */

export async function matchJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const result = await matchStudentWithJob(
      authenticatedReq.user.id,
      id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   MATCH ALL JOBS
========================= */

export async function matchJobsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const jobs = await getJobs();

    const aiJobs = (jobs as any[]).map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description ?? "",
      company: job.company
        ? {
            name: job.company.name,
          }
        : null,
      skills: Array.isArray(job.skills)
        ? job.skills.map((item: any) => ({
            required: item.required,
            skill: {
              name: item.skill.name,
            },
          }))
        : [],
    }));

    const results =
      await matchStudentWithJobs(
        authenticatedReq.user.id,
        aiJobs,
      );

    return res.status(200).json({
      success: true,
      data: results,
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
    const authenticatedReq =
      req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const result =
      await analyzeStudentSkillGap(
        authenticatedReq.user.id,
        id,
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   CREATE JOB
========================= */

export async function createJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const parsed =
      createJobSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid job data",
        errors: parsed.error.flatten(),
      });
    }

    const job = await createJob(
      authenticatedReq.user.id,
      parsed.data,
    );

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
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

/* =========================
   GET SINGLE JOB
========================= */

export async function getJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   UPDATE JOB
========================= */

export async function updateJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const parsed =
      updateJobSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid job data",
        errors: parsed.error.flatten(),
      });
    }

    const job = await updateJob(
      authenticatedReq.user.id,
      id,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================
   DELETE JOB
========================= */

export async function deleteJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    await deleteJob(
      authenticatedReq.user.id,
      id,
    );

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}