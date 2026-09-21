import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createAssessmentSchema,
  updateAssessmentSchema,
  createAssessmentResultSchema,
  updateAssessmentResultSchema,
} from "./assessment.schema";

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  createAssessmentResult,
  getMyAssessmentResults,
  getAssessmentResults,
  getAssessmentResultById,
  updateAssessmentResult,
  deleteAssessmentResult,
} from "./assessment.service";


export async function createAssessmentController(req: Request, res: Response) {
  try {
    const data = createAssessmentSchema.parse(req.body);

    const assessment = await createAssessment(data);

    return res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      data: assessment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create assessment",
    });
  }
}

export async function getAssessmentsController(_req: Request, res: Response) {
  try {
    const assessments = await getAssessments();

    return res.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get assessments",
    });
  }
}

export async function getAssessmentController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const assessment = await getAssessmentById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    return res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get assessment",
    });
  }
}

export async function updateAssessmentController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const data = updateAssessmentSchema.parse(req.body);

    const existing = await getAssessmentById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    const assessment = await updateAssessment(id, data);

    return res.json({
      success: true,
      message: "Assessment updated successfully",
      data: assessment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update assessment",
    });
  }
}

export async function deleteAssessmentController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const existing = await getAssessmentById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    await deleteAssessment(id);

    return res.json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete assessment",
    });
  }
}

export async function createAssessmentResultController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const data = createAssessmentResultSchema.parse(req.body);

    const result = await createAssessmentResult(id, data);

    return res.status(201).json({
      success: true,
      message: "Assessment result created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create assessment result",
    });
  }
}

export async function getMyAssessmentResultsController(
  req: Request,
  res: Response,
) {
  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const results = await getMyAssessmentResults(authenticatedReq.user.id);

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get assessment results",
    });
  }
}

export async function getAssessmentResultsController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });
    }

    const results = await getAssessmentResults(id);

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get assessment results",
    });
  }
}

export async function getAssessmentResultController(
  req: Request,
  res: Response,
) {
  try {
    const { resultId } = req.params;

    if (!resultId || Array.isArray(resultId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID",
      });
    }

    const result = await getAssessmentResultById(resultId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Assessment result not found",
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get assessment result",
    });
  }
}

export async function updateAssessmentResultController(
  req: Request,
  res: Response,
) {
  try {
    const { resultId } = req.params;

    if (!resultId || Array.isArray(resultId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID",
      });
    }

    const data = updateAssessmentResultSchema.parse(req.body);

    const existing = await getAssessmentResultById(resultId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Assessment result not found",
      });
    }

    const result = await updateAssessmentResult(resultId, data);

    return res.json({
      success: true,
      message: "Assessment result updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update assessment result",
    });
  }
}

export async function deleteAssessmentResultController(
  req: Request,
  res: Response,
) {
  try {
    const { resultId } = req.params;

    if (!resultId || Array.isArray(resultId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID",
      });
    }

    const existing = await getAssessmentResultById(resultId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Assessment result not found",
      });
    }

    await deleteAssessmentResult(resultId);

    return res.json({
      success: true,
      message: "Assessment result deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete assessment result",
    });
  }
}
