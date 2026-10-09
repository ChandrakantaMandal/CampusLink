import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import { addStudentSkill, getMySkills, removeStudentSkill } from "./skill.service";

import { addStudentSkillSchema } from "./skill.schema";

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
