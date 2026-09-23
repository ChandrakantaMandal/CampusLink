import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { errorMiddleware } from "../../src/middleware/error.middleware";

describe("errorMiddleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {} as Request;

    res = {
      status: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;

    vi.mocked(res.status).mockReturnValue(res);
    vi.mocked(res.json).mockReturnValue(res);

    next = vi.fn();
  });

  it("returns 500 with the error message when error is an Error", () => {
    const error = new Error("Database connection failed");

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database connection failed",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("returns 500 with a generic message for non-Error values", () => {
    errorMiddleware("Something went wrong", req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("handles null as an unknown error", () => {
    errorMiddleware(null, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("handles an object that is not an Error", () => {
    errorMiddleware(
      {
        message: "Something failed",
      },
      req,
      res,
      next,
    );

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
