import type { NextFunction, Request, Response } from "express";

import { auth } from "../services";

export type UserRole = "STUDENT" | "RECRUITER" | "ADMIN";

export type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
};

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const authenticatedReq = req as AuthenticatedRequest;

    authenticatedReq.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as UserRole,
    };

    authenticatedReq.session = {
      id: session.session.id,
      userId: session.session.userId,
      expiresAt: session.session.expiresAt,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
}