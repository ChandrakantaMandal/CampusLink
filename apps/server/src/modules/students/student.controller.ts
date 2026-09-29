import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  getStudentApplications,
  getStudentById,
  getStudentByUserId,
  getStudentDashboard,
  getStudentDrives,
  getStudentInterviews,
  getStudentJobs,
  getStudentNotifications,
  getStudentOffers,
  getStudentReadiness,
  getStudentSkills,
  updateStudent,
} from "./student.service";

import { updateStudentSchema } from "./student.schema";

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

    const student = await updateStudent(authenticatedReq.user.id, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: student,
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

export const getMyStudentSkills = makeAggregateHandler(getStudentSkills);

export const getMyStudentJobs = makeAggregateHandler(getStudentJobs);

export const getMyStudentApplications = makeAggregateHandler(
  getStudentApplications,
);

export const getMyStudentInterviews = makeAggregateHandler(
  getStudentInterviews,
);

export const getMyStudentOffers = makeAggregateHandler(getStudentOffers);

export const getMyStudentNotifications = makeAggregateHandler(
  getStudentNotifications,
);
