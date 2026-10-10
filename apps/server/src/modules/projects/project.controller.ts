import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import { createProject, deleteProject, getMyProjects, updateProject } from "./project.service";

import { createProjectSchema, updateProjectSchema } from "./project.schema";

export async function createProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = createProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
        errors: parsed.error.flatten(),
      });
    }

    const project = await createProject(authenticatedReq.user.id, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyProjectsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const projects = await getMyProjects(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectController(
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
        message: "Invalid project ID",
      });
    }

    const parsed = updateProjectSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
        errors: parsed.error.flatten(),
      });
    }

    const project = await updateProject(
      authenticatedReq.user.id,
      id,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectController(
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
        message: "Invalid project ID",
      });
    }

    await deleteProject(authenticatedReq.user.id, id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
