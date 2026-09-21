import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createEducation,
  deleteEducation,
  getEducationById,
  getMyEducation,
  updateEducation,
} from "./education.service";

import {
  createEducationSchema,
  updateEducationSchema,
} from "./education.schema";

export async function createEducationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = createEducationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid education data",
        errors: parsed.error.flatten(),
      });
    }

    const education = await createEducation(
      authenticatedReq.user.id,
      parsed.data,
    );

    return res.status(201).json({
      success: true,
      message: "Education added successfully",
      data: education,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyEducationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const education = await getMyEducation(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEducationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    const education = await getEducationById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEducationController(
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
        message: "Invalid education ID",
      });
    }

    const parsed = updateEducationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid education data",
        errors: parsed.error.flatten(),
      });
    }

    const education = await updateEducation(
      authenticatedReq.user.id,
      id,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEducationController(
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
        message: "Invalid education ID",
      });
    }

    await deleteEducation(authenticatedReq.user.id, id);

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
