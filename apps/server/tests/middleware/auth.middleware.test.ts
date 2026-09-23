import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => ({
  api: {
    getSession: vi.fn(),
  },
}));

vi.mock("../../src/services", () => ({
  auth: authMock,
}));

import { requireAuth } from "../../src/middleware/auth.middleware";

function createMockRequest(headers: Record<string, string> = {}): Request {
  return {
    headers,
  } as Request;
}

function createMockResponse(): Response {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(res.status).mockReturnValue(res);
  vi.mocked(res.json).mockReturnValue(res);

  return res;
}

describe("requireAuth", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = createMockRequest({
      authorization: "Bearer test-token",
    });

    res = createMockResponse();
    next = vi.fn();
  });

  it("calls next and attaches user and session for an authenticated request", async () => {
    const expiresAt = new Date("2026-12-31T23:59:59.000Z");

    authMock.api.getSession.mockResolvedValue({
      user: {
        id: "user-123",
        email: "student@example.com",
        name: "Test Student",
        role: "STUDENT",
      },
      session: {
        id: "session-123",
        userId: "user-123",
        expiresAt,
      },
    });

    await requireAuth(req, res, next);

    expect(authMock.api.getSession).toHaveBeenCalledOnce();

    expect(next).toHaveBeenCalledOnce();

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    const authenticatedReq = req as Request & {
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      session: {
        id: string;
        userId: string;
        expiresAt: Date;
      };
    };

    expect(authenticatedReq.user).toEqual({
      id: "user-123",
      email: "student@example.com",
      name: "Test Student",
      role: "STUDENT",
    });

    expect(authenticatedReq.session).toEqual({
      id: "session-123",
      userId: "user-123",
      expiresAt,
    });
  });

  it("returns 401 when there is no session", async () => {
    authMock.api.getSession.mockResolvedValue(null);

    await requireAuth(req, res, next);

    expect(authMock.api.getSession).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication required",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when the session is invalid or expired", async () => {
    authMock.api.getSession.mockRejectedValue(new Error("Session expired"));

    await requireAuth(req, res, next);

    expect(authMock.api.getSession).toHaveBeenCalledOnce();

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired session",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("passes request headers to Better Auth", async () => {
    authMock.api.getSession.mockResolvedValue(null);

    req = createMockRequest({
      authorization: "Bearer abc123",
      cookie: "session=test-session",
    });

    await requireAuth(req, res, next);

    expect(authMock.api.getSession).toHaveBeenCalledOnce();

    const calls = authMock.api.getSession.mock.calls;

    expect(calls.length).toBeGreaterThan(0);

    const options = calls[0]?.[0];

    expect(options).toBeDefined();

    if (!options) {
      throw new Error("getSession was not called with options");
    }

    expect(options.headers).toBeInstanceOf(Headers);
    expect(options.headers.get("authorization")).toBe("Bearer abc123");
    expect(options.headers.get("cookie")).toBe("session=test-session");
  });

  it("preserves the authenticated user's role", async () => {
    authMock.api.getSession.mockResolvedValue({
      user: {
        id: "admin-123",
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN",
      },
      session: {
        id: "session-admin",
        userId: "admin-123",
        expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      },
    });

    await requireAuth(req, res, next);

    const authenticatedReq = req as Request & {
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    };

    expect(authenticatedReq.user.role).toBe("ADMIN");
    expect(next).toHaveBeenCalledOnce();
  });

  it("handles recruiter sessions", async () => {
    authMock.api.getSession.mockResolvedValue({
      user: {
        id: "recruiter-123",
        email: "recruiter@example.com",
        name: "Recruiter User",
        role: "RECRUITER",
      },
      session: {
        id: "session-recruiter",
        userId: "recruiter-123",
        expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      },
    });

    await requireAuth(req, res, next);

    const authenticatedReq = req as Request & {
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    };

    expect(authenticatedReq.user.role).toBe("RECRUITER");
    expect(next).toHaveBeenCalledOnce();
  });
});
