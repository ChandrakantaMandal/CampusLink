import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  acceptStudentOffer,
  getStudentById,
  getStudentByUserId,
  getStudentDashboard,
  getStudentDrives,
  getStudentInterviews,
  getStudentNotifications,
  getStudentOffers,
  getStudentReadiness,
  markAllStudentNotificationsRead,
  markStudentNotificationRead,
  updateStudent,
} from "./student.service";

import { updateStudentSchema } from "./student.schema";

import { calculateReadiness } from "./readiness.service";

export async function getMyStudentProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const student = await getStudentByUserId(authenticatedReq.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMyStudentProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = updateStudentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid student data",
        errors: parsed.error.flatten(),
      });
    }

    const student = await updateStudent(
      authenticatedReq.user.id,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyReadiness(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const student = await getStudentByUserId(authenticatedReq.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const readiness = calculateReadiness(
  student as Parameters<typeof calculateReadiness>[0],
);

    return res.status(200).json({
      success: true,
      data: readiness,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

function makeAggregateHandler(
  fetcher: (userId: string) => Promise<unknown>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;

      const data = await fetcher(authenticatedReq.user.id);

      if (data === null) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const getMyStudentDashboard = makeAggregateHandler(getStudentDashboard);

export const getMyStudentReadiness = makeAggregateHandler(getStudentReadiness);

export const getMyStudentDrives = makeAggregateHandler(getStudentDrives);

export const getMyStudentInterviews = makeAggregateHandler(
  getStudentInterviews,
);

export const getMyStudentOffers = makeAggregateHandler(getStudentOffers);

export const getMyStudentNotifications = makeAggregateHandler(
  getStudentNotifications,
);

export async function acceptMyStudentOffer(
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
        message: "Invalid offer ID",
      });
    }

    const result = await acceptStudentOffer(authenticatedReq.user.id, id);

    if (!result.ok) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer accepted successfully",
      data: result.offer,
    });
  } catch (error) {
    next(error);
  }
}

export async function markMyStudentNotificationRead(
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

    const notification = await markStudentNotificationRead(
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
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

export async function markMyStudentNotificationsReadAll(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const count = await markAllStudentNotificationsRead(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: { updated: count },
    });
  } catch (error) {
    next(error);
  }
}
