import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  addStudentSkill,
  createSkill,
  deleteSkill,
  getMySkills,
  getSkillById,
  getSkills,
  removeStudentSkill,
  updateSkill,
  updateStudentSkill,
} from "./skill.service";

import {
  addStudentSkillSchema,
  createSkillSchema,
  updateSkillSchema,
  updateStudentSkillSchema,
} from "./skill.schema";

export async function createSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createSkillSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill data",
        errors: parsed.error.flatten(),
      });
    }

    const skill = await createSkill(parsed.data);

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSkillsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const skills = await getSkills();

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const skill = await getSkillById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const parsed = updateSkillSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill data",
        errors: parsed.error.flatten(),
      });
    }

    const skill = await updateSkill(id, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    await deleteSkill(id);

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function addStudentSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const parsed = addStudentSkillSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid student skill data",
        errors: parsed.error.flatten(),
      });
    }

    const studentSkill = await addStudentSkill(
      authenticatedReq.user.id,
      parsed.data,
    );

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: studentSkill,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMySkillsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const skills = await getMySkills(authenticatedReq.user.id);

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const { skillId } = req.params;

    if (!skillId || Array.isArray(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const parsed = updateStudentSkillSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid student skill data",
        errors: parsed.error.flatten(),
      });
    }

    const studentSkill = await updateStudentSkill(
      authenticatedReq.user.id,
      skillId,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Student skill updated successfully",
      data: studentSkill,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeStudentSkillController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const { skillId } = req.params;

    if (!skillId || Array.isArray(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    await removeStudentSkill(authenticatedReq.user.id, skillId);

    return res.status(200).json({
      success: true,
      message: "Skill removed successfully",
    });
  } catch (error) {
    next(error);
  }
}
