import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "./company.service";

import {
  createCompanySchema,
  updateCompanySchema,
} from "./company.schema";

export async function createCompanyController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const parsed = createCompanySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid company data",
        errors: parsed.error.flatten(),
      });
    }

    const company = await createCompany(
      parsed.data,
      authenticatedReq.user.id,
    );

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompaniesController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const companies = await getCompanies();

    return res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompanyController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await getCompanyById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCompanyController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const parsed = updateCompanySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid company data",
        errors: parsed.error.flatten(),
      });
    }

    const company = await updateCompany(
      id,
      authenticatedReq.user.id,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
}