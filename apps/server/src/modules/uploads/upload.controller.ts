import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  uploadCompanyLogo,
  uploadStudentPhoto,
  uploadStudentResume,
} from "./upload.service";

function fileFromReq(req: Request) {
  return req.file;
}

export async function uploadMyResumeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = fileFromReq(req);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const data = await uploadStudentResume(authenticatedReq.user.id, file);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

export async function uploadMyPhotoController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = fileFromReq(req);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No photo file uploaded",
      });
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const data = await uploadStudentPhoto(authenticatedReq.user.id, file);

    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

export async function uploadCompanyLogoController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = fileFromReq(req);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No logo file uploaded",
      });
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const data = await uploadCompanyLogo(authenticatedReq.user.id, file);

    return res.status(200).json({
      success: true,
      message: "Company logo uploaded successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}
