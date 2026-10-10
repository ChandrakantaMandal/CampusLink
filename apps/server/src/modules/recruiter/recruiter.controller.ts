import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { z } from "zod";
import { ENV } from "../../env.server";
import { sendBatchAssessmentInvites } from "../assessments/assessment.service";

import {
  createInterview,
  createMyJob,
  createMyOffer,
  createRecruiterProfile,
  deleteMyJob,
  getMyInterviews,
  getMyJobs,
  getMyNotifications,
  getMyOffers,
  getMyOfferPdf,
  getRecruiterProfile,
  getRecruiterStats,
  getShortlistedCandidates,
  markAllNotificationsRead,
  markNotificationRead,
  sendMyOffer,
  updateInterview,
  updateRecruiterProfile,
} from "./recruiter.service";

import {
  createInterviewSchema,
  createMyJobSchema,
  createMyOfferSchema,
  createRecruiterProfileSchema,
  updateInterviewSchema,
  updateRecruiterProfileSchema,
} from "./recruiter.schema";

export async function getRecruiterProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const profile = await getRecruiterProfile(authenticatedReq.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRecruiterProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = updateRecruiterProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter profile data",
        errors: parsed.error.flatten(),
      });
    }

    const profile = await updateRecruiterProfile(
      authenticatedReq.user.id,
      parsed.data,
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recruiter profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function createRecruiterProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const parsed = createRecruiterProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter profile data",
        errors: parsed.error.flatten(),
      });
    }
    const profile = await createRecruiterProfile(authenticatedReq.user.id, parsed.data);
    return res.status(201).json({
      success: true,
      message: "Recruiter profile created successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyJobsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const jobs = await getMyJobs(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMyJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = createMyJobSchema.safeParse(req.body);

    if (!parsed.success) {
      const details = parsed.error.issues.map(
        (issue) => `${issue.path.join(".") || "form"}: ${issue.message}`,
      );
      return res.status(400).json({
        success: false,
        message: `Invalid job data: ${details.join("; ")}`,
        errors: parsed.error.flatten(),
      });
    }

    const job = await createMyJob(authenticatedReq.user.id, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyJobController(
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

    const result = await deleteMyJob(authenticatedReq.user.id, id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!result.ok) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete: job has ${result.count} application(s). Archive the job instead.`,
        reason: result.reason,
        count: result.count,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyInterviewsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const interviews = await getMyInterviews(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
}

export async function createInterviewController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = createInterviewSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview data",
        errors: parsed.error.flatten(),
      });
    }

    const interview = await createInterview(
      authenticatedReq.user.id,
      parsed.data,
    );

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      data: interview,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInterviewController(
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
        message: "Invalid interview ID",
      });
    }

    const parsed = updateInterviewSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview data",
        errors: parsed.error.flatten(),
      });
    }

    const interview = await updateInterview(authenticatedReq.user.id, id, parsed.data);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      data: interview,
    });
  } catch (error) {
    next(error);
  }
}

export async function getShortlistedController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const candidates = await getShortlistedCandidates(
      authenticatedReq.user.id,
    );

    return res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendBatchAssessmentInvitesController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = z.object({ applicationIds: z.array(z.string().min(1)).min(1).max(100) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: "Select at least one shortlisted candidate" });
    const authenticatedReq = req as AuthenticatedRequest;
    const result = await sendBatchAssessmentInvites(authenticatedReq.user.id, parsed.data.applicationIds, ENV.CORS_ORIGIN);
    return res.status(200).json({ success: true, message: `Sent ${result.sent} of ${result.total} assessment invitations`, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMyOffersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const offers = await getMyOffers(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMyOfferController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = createMyOfferSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer data",
        errors: parsed.error.flatten(),
      });
    }

    const offer = await createMyOffer(authenticatedReq.user.id, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Offer draft generated successfully",
      data: offer,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMyOfferController(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ success: false, message: "Invalid offer ID" });
    const offer = await sendMyOffer(authenticatedReq.user.id, id);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
    return res.status(200).json({ success: true, message: "Offer letter sent to the candidate", data: offer });
  } catch (error) {
    next(error);
  }
}

export async function downloadMyOfferPdfController(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ success: false, message: "Invalid offer ID" });
    const document = await getMyOfferPdf(authenticatedReq.user.id, id);
    if (!document) return res.status(404).json({ success: false, message: "Offer not found" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${document.filename}"`);
    return res.status(200).send(document.pdf);
  } catch (error) {
    next(error);
  }
}

export async function getMyNotificationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const payload = await getMyNotifications(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationReadController(
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
        message: "Invalid notification ID",
      });
    }

    const notification = await markNotificationRead(
      authenticatedReq.user.id,
      id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsReadController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const count = await markAllNotificationsRead(authenticatedReq.user.id);

    if (count === null) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: { updated: count },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecruiterStatsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const stats = await getRecruiterStats(authenticatedReq.user.id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
