import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireRole } from "../../src/middleware/role.middleware";
import type { AuthenticatedRequest } from "../../src/middleware/auth.middleware";

function createMockResponse(): Response {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(res.status).mockReturnValue(res);
  vi.mocked(res.json).mockReturnValue(res);

  return res;
}

function createAuthenticatedRequest(
  role: AuthenticatedRequest["user"]["role"],
): Request {
  return {
    user: {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role,
    },
  } as AuthenticatedRequest;
}

describe("requireRole", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    res = createMockResponse();
    next = vi.fn();
  });

  it("returns 401 when the user is not authenticated", () => {
    const req = {} as Request;

    const middleware = requireRole("ADMIN");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication required",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("allows access when the user has an allowed role", () => {
    const req = createAuthenticatedRequest("ADMIN");

    const middleware = requireRole("ADMIN");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 403 when the user does not have an allowed role", () => {
    const req = createAuthenticatedRequest("STUDENT");

    const middleware = requireRole("ADMIN");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "You do not have permission to access this resource",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("allows multiple roles", () => {
    const req = createAuthenticatedRequest("RECRUITER");

    const middleware = requireRole("STUDENT", "RECRUITER");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("rejects a role when it is not included in the allowed roles", () => {
    const req = createAuthenticatedRequest("RECRUITER");

    const middleware = requireRole("STUDENT", "ADMIN");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "You do not have permission to access this resource",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("supports each defined user role", () => {
    const roles = ["STUDENT", "RECRUITER", "ADMIN"] as const;

    for (const role of roles) {
      const req = createAuthenticatedRequest(role);
      const response = createMockResponse();
      const nextHandler = vi.fn();

      const middleware = requireRole(role);

      middleware(req, response, nextHandler);

      expect(nextHandler).toHaveBeenCalledOnce();
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
    }
  });
});
