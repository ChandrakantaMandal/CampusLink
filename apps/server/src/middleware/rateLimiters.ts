import type { Request, Response, NextFunction } from "express";
import { redis } from "../services";

interface RateLimiterOptions {
  name: string;
  windowSeconds: number;
  maxRequests: number;
  blockAfterViolations?: number;
  blockSeconds?: number;
}

export const createRateLimiter = ({
  name,
  windowSeconds,
  maxRequests,
  blockAfterViolations = 5,
  blockSeconds = 60 * 60,
}: RateLimiterOptions) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ip =
        req.ip ||
        req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "unknown";

      const requestKey = `ratelimit:${name}:ip:${ip}`;
      const violationKey = `violations:${name}:ip:${ip}`;
      const blockedKey = `blocked:${name}:ip:${ip}`;

      // Check if IP is blocked
      const blocked = await redis.get(blockedKey);

      if (blocked) {
        res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
        return;
      }

      // Increment request count
      const requests = await redis.incr(requestKey);

      // Set expiration on first request
      if (requests === 1) {
        await redis.expire(requestKey, windowSeconds);
      }

      // Request is allowed
      if (requests <= maxRequests) {
        next();
        return;
      }

      // Rate limit exceeded
      const violations = await redis.incr(violationKey);

      if (violations === 1) {
        await redis.expire(violationKey, 60 * 60);
      }

      // Repeated violations
      if (violations >= blockAfterViolations) {
        await redis.set(blockedKey, "1", "EX", blockSeconds);

        res.status(429).json({
          success: false,
          message: "Too many requests. Your IP has been temporarily blocked.",
        });

        return;
      }

      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: windowSeconds,
      });
    } catch (error) {
      console.error("Rate limiter error:", error);

      // Fail open if Redis is unavailable
      next();
    }
  };
};

export const globalLimiter = createRateLimiter({
  name: "global",
  windowSeconds: 15 * 60,
  maxRequests: 100,
});
