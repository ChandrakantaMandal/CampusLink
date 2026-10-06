import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createPlacementDriveSchema,
  updatePlacementDriveSchema,
  createRecruiterSchema,
  updateInterviewScheduleSchema,
  broadcastNotificationSchema,
  updateAdminSettingsSchema,
} from "./admin.schema";

import {
  getDashboardStats,
  getUsers,
  getUserById,
  deleteUser,
  getStudents,
  getRecruiters,
  getCompanies,
  getJobs,
  getApplications,
  getAssessmentStats,
  getDrives,
  getDriveById,
  createPlacementDrive,
  updatePlacementDrive,
  deletePlacementDrive,
  createRecruiter,
  getOffers,
  getInterviews,
  updateInterviewSchedule,
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  broadcastAdminNotification,
  getAdminSettings,
  updateAdminSettings,
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

export async function createRecruiterController(req: Request, res: Response) {
  try {
    const data = createRecruiterSchema.parse(req.body);

    const recruiter = await createRecruiter(data);

    return res.status(201).json({
      success: true,
      message: "Recruiter created successfully",
      data: recruiter,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create recruiter",
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

export async function getDrivesController(_req: Request, res: Response) {
  try {
    const drives = await getDrives();

    return res.json({
      success: true,
      data: drives,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get placement drives",
    });
  }
}

export async function getDriveController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid drive ID",
      });
    }

    const drive = await getDriveById(id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Placement drive not found",
      });
    }

    return res.json({
      success: true,
      data: drive,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get placement drive",
    });
  }
}

export async function createPlacementDriveController(
  req: Request,
  res: Response,
) {
  try {
    const data = createPlacementDriveSchema.parse(req.body);

    const drive = await createPlacementDrive(data);

    return res.status(201).json({
      success: true,
      message: "Placement drive created successfully",
      data: drive,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create placement drive",
    });
  }
}

export async function updatePlacementDriveController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid drive ID",
      });
    }

    const data = updatePlacementDriveSchema.parse(req.body);

    const drive = await updatePlacementDrive(id, data);

    return res.json({
      success: true,
      message: "Placement drive updated successfully",
      data: drive,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update placement drive",
    });
  }
}

export async function getOffersController(_req: Request, res: Response) {
  try {
    const offers = await getOffers();

    return res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get offers",
    });
  }
}

export async function deletePlacementDriveController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid drive ID",
      });
    }

    await deletePlacementDrive(id);

    return res.json({
      success: true,
      message: "Placement drive deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete placement drive",
    });
  }
}

export async function getInterviewsController(_req: Request, res: Response) {
  try {
    const interviews = await getInterviews();

    return res.json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get interviews",
    });
  }
}

export async function updateInterviewScheduleController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
    }

    const data = updateInterviewScheduleSchema.parse(req.body);

    const interview = await updateInterviewSchedule(id, data);

    return res.json({
      success: true,
      message: "Interview rescheduled successfully",
      data: interview,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update interview schedule",
    });
  }
}

export async function getNotificationsController(req: Request, res: Response) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const result = await getAdminNotifications(authenticatedReq.user.id);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get notifications",
    });
  }
}

export async function markNotificationReadController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const authenticatedReq = req as AuthenticatedRequest;
    const notification = await markAdminNotificationRead(
      authenticatedReq.user.id,
      id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read",
    });
  }
}

export async function markAllNotificationsReadController(
  req: Request,
  res: Response,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const count = await markAllAdminNotificationsRead(authenticatedReq.user.id);

    return res.json({
      success: true,
      message: "All notifications marked as read",
      data: { updated: count },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read",
    });
  }
}

export async function broadcastNotificationController(
  req: Request,
  res: Response,
) {
  try {
    const data = broadcastNotificationSchema.parse(req.body);

    const authenticatedReq = req as AuthenticatedRequest;
    const result = await broadcastAdminNotification(
      authenticatedReq.user.id,
      data,
    );

    return res.status(201).json({
      success: true,
      message: "Notification broadcast sent successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to broadcast notification",
    });
  }
}

export async function getSettingsController(req: Request, res: Response) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const settings = await getAdminSettings(authenticatedReq.user.id);

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get settings",
    });
  }
}

export async function updateSettingsController(req: Request, res: Response) {
  try {
    const data = updateAdminSettingsSchema.parse(req.body);

    const authenticatedReq = req as AuthenticatedRequest;
    const settings = await updateAdminSettings(authenticatedReq.user.id, data);

    return res.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update settings",
    });
  }
}
