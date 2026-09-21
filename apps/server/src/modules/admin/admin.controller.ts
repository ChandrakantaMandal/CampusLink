import type { Request, Response } from "express";

import { updateUserRoleSchema } from "./admin.schema";

import {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getStudents,
  getRecruiters,
  getCompanies,
  getJobs,
  getApplications,
  getAssessmentStats,
} from "./admin.service";

export async function getDashboardStatsController(
  _req: Request,
  res: Response,
) {
  try {
    const stats = await getDashboardStats();

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get dashboard statistics",
    });
  }
}

export async function getUsersController(_req: Request, res: Response) {
  try {
    const users = await getUsers();

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get users",
    });
  }
}

export async function getUserController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get user",
    });
  }
}

export async function updateUserRoleController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const data = updateUserRoleSchema.parse(req.body);

    const user = await updateUserRole(id, data);

    return res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update user role",
    });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    await deleteUser(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    });
  }
}

export async function getStudentsController(_req: Request, res: Response) {
  try {
    const students = await getStudents();

    return res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get students",
    });
  }
}

export async function getRecruitersController(_req: Request, res: Response) {
  try {
    const recruiters = await getRecruiters();

    return res.json({
      success: true,
      data: recruiters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get recruiters",
    });
  }
}

export async function getCompaniesController(_req: Request, res: Response) {
  try {
    const companies = await getCompanies();

    return res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get companies",
    });
  }
}

export async function getJobsController(_req: Request, res: Response) {
  try {
    const jobs = await getJobs();

    return res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get jobs",
    });
  }
}

export async function getApplicationsController(_req: Request, res: Response) {
  try {
    const applications = await getApplications();

    return res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get applications",
    });
  }
}

export async function getAssessmentStatsController(
  _req: Request,
  res: Response,
) {
  try {
    const stats = await getAssessmentStats();

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get assessment statistics",
    });
  }
}
