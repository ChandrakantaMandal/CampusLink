import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({
  get: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
  set: vi.fn(),
}));

vi.mock("../src/services", () => ({
  redis: redisMock,
}));

import { createRateLimiter } from "../src/middleware/rateLimiters";

function createMockRequest(ip: string = "127.0.0.1"): Request {
  return {
    ip,
    headers: {},
    socket: {
      remoteAddress: "127.0.0.1",
    },
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

describe("createRateLimiter", () => {
  const limiter = createRateLimiter({
    name: "test",
    windowSeconds: 60,
    maxRequests: 3,
    blockAfterViolations: 2,
    blockSeconds: 300,
  });

  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = createMockRequest();
    res = createMockResponse();
    next = vi.fn();

    redisMock.get.mockResolvedValue(null);
    redisMock.incr.mockResolvedValue(1);
    redisMock.expire.mockResolvedValue(1);
    redisMock.set.mockResolvedValue("OK");
  });

  it("allows requests under the rate limit", async () => {
    redisMock.incr.mockResolvedValue(1);

    await limiter(req, res, next);

    expect(redisMock.get).toHaveBeenCalledWith("blocked:test:ip:127.0.0.1");

    expect(redisMock.incr).toHaveBeenCalledWith("ratelimit:test:ip:127.0.0.1");

    expect(redisMock.expire).toHaveBeenCalledWith(
      "ratelimit:test:ip:127.0.0.1",
      60,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 429 when the IP is already blocked", async () => {
    redisMock.get.mockResolvedValue("1");

    await limiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Too many requests. Please try again later.",
    });

    expect(redisMock.incr).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("does not expire the request key after the first request", async () => {
    redisMock.incr.mockResolvedValue(2);

    await limiter(req, res, next);

    expect(redisMock.incr).toHaveBeenCalledWith("ratelimit:test:ip:127.0.0.1");

    expect(redisMock.expire).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledOnce();
  });

  it("returns 429 after exceeding the request limit", async () => {
    redisMock.incr.mockResolvedValueOnce(4).mockResolvedValueOnce(1);

    await limiter(req, res, next);

    expect(redisMock.incr).toHaveBeenNthCalledWith(
      1,
      "ratelimit:test:ip:127.0.0.1",
    );

    expect(redisMock.incr).toHaveBeenNthCalledWith(
      2,
      "violations:test:ip:127.0.0.1",
    );

    expect(redisMock.expire).toHaveBeenCalledWith(
      "violations:test:ip:127.0.0.1",
      60 * 60,
    );

    expect(res.status).toHaveBeenCalledWith(429);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Too many requests. Please try again later.",
      retryAfter: 60,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("blocks an IP after repeated violations", async () => {
    redisMock.incr.mockResolvedValueOnce(4).mockResolvedValueOnce(2);

    await limiter(req, res, next);

    expect(redisMock.set).toHaveBeenCalledWith(
      "blocked:test:ip:127.0.0.1",
      "1",
      "EX",
      300,
    );

    expect(res.status).toHaveBeenCalledWith(429);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Too many requests. Your IP has been temporarily blocked.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("fails open when Redis throws an error", async () => {
    redisMock.get.mockRejectedValue(new Error("Redis unavailable"));

    await limiter(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("uses x-forwarded-for when req.ip is unavailable", async () => {
    req = createMockRequest("");

    req.headers["x-forwarded-for"] = "192.168.1.100, 10.0.0.1";

    redisMock.incr.mockResolvedValue(1);

    await limiter(req, res, next);

    expect(redisMock.get).toHaveBeenCalledWith("blocked:test:ip:192.168.1.100");

    expect(redisMock.incr).toHaveBeenCalledWith(
      "ratelimit:test:ip:192.168.1.100",
    );

    expect(next).toHaveBeenCalledOnce();
  });
});
