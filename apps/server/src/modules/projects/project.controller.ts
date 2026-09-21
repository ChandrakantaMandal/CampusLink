import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  addProjectSkill,
  createProject,
  deleteProject,
  getMyProjects,
  getProjectById,
  removeProjectSkill,
  updateProject,
} from "./project.service";

import {
  addProjectSkillSchema,
  createProjectSchema,
  updateProjectSchema,
} from "./project.schema";

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

export async function getProjectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
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

export async function addProjectSkillController(
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

    const parsed = addProjectSkillSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid project skill data",
        errors: parsed.error.flatten(),
      });
    }

    const projectSkill = await addProjectSkill(
      authenticatedReq.user.id,
      id,
      parsed.data,
    );

    return res.status(201).json({
      success: true,
      message: "Project skill added successfully",
      data: projectSkill,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeProjectSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const { id, skillId } = req.params;

    if (!id || Array.isArray(id) || !skillId || Array.isArray(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project or skill ID",
      });
    }

    await removeProjectSkill(authenticatedReq.user.id, id, skillId);

    return res.status(200).json({
      success: true,
      message: "Project skill removed successfully",
    });
  } catch (error) {
    next(error);
  }
}
