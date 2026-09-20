import type { Database } from "@HireBridge/db";
import { redis } from "@HireBridge/redis";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";

import { resendSignupOTP, verifyEmailOTP } from "../services/auth.service";

//   RATE LIMIT CONFIG
const VERIFY_OTP_MAX_REQUESTS = 5;
const VERIFY_OTP_WINDOW_SECONDS = 10 * 60; // 10 minutes

const RESEND_OTP_MAX_REQUESTS = 3;
const RESEND_OTP_WINDOW_SECONDS = 10 * 60; // 10 minutes

//   GET CLIENT IP
function getClientIP(request: Request | undefined): string {
  if (!request) {
    return "unknown";
  }

  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIP = request.headers.get("x-real-ip");

  if (realIP) {
    return realIP.trim();
  }

  return "unknown";
}

//   REDIS RATE LIMITER
async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
) {
  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (requests > maxRequests) {
    const ttl = await redis.ttl(key);

    throw new APIError("TOO_MANY_REQUESTS", {
      message:
        `Too many requests. ` +
        `Please try again in ${Math.max(ttl, 1)} seconds.`,
    });
  }
}

//   PLUGIN
export function signupOTPPlugin(
  database: Database,
  env: {
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    EMAIL_FROM: string;
  },
) {
  return {
    id: "signup-otp",

    endpoints: {
      // VERIFY SIGNUP OTP
      // POST /api/auth/verify-signup-otp
      verifySignupOTP: createAuthEndpoint(
        "/verify-signup-otp",
        {
          method: "POST",

          body: z.object({
            email: z.string().email(),
            otp: z.string(),
          }),
        },

        async (ctx) => {
          const ip = getClientIP(ctx.request);

          const rateLimitKey = `hirebridge:ratelimit:otp:verify:${ip}`;

          try {
            await checkRateLimit(
              rateLimitKey,
              VERIFY_OTP_MAX_REQUESTS,
              VERIFY_OTP_WINDOW_SECONDS,
            );
          } catch (error) {
            if (error instanceof APIError) {
              throw error;
            }

            console.error("OTP verification rate limiter error:", error);
          }

          const { email, otp } = ctx.body;

          const normalizedEmail = email.trim().toLowerCase();
             
          try {
            await verifyEmailOTP(database, normalizedEmail, otp);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Verification failed";

            if (message === "INVALID_OTP" || message === "OTP_EXPIRED") {
              throw new APIError("BAD_REQUEST", {
                message,
              });
            }

            if (message === "USER_NOT_FOUND") {
              throw new APIError("NOT_FOUND", {
                message: "User not found",
              });
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Verification failed",
            });
          }

          const user =
            await ctx.context.internalAdapter.findUserByEmail(normalizedEmail);

          if (!user) {
            throw new APIError("NOT_FOUND", {
              message: "User not found",
            });
          }

          const session = await ctx.context.internalAdapter.createSession(
            user.user.id,
          );

          if (!session) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to create session",
            });
          }

          await setSessionCookie(ctx, {
            session,
            user: {
              ...user.user,
              emailVerified: true,
            },
          });

          return ctx.json({
            success: true,
            message: "Email verified successfully",
          });
        },
      ),

      // RESEND SIGNUP OTP
      // POST /api/auth/resend-signup-otp
      resendSignupOTP: createAuthEndpoint(
        "/resend-signup-otp",
        {
          method: "POST",

          body: z.object({
            email: z.string().email(),
          }),
        },

        async (ctx) => {
          const ip = getClientIP(ctx.request);

          const rateLimitKey = `hirebridge:ratelimit:otp:resend:${ip}`;

          try {
            await checkRateLimit(
              rateLimitKey,
              RESEND_OTP_MAX_REQUESTS,
              RESEND_OTP_WINDOW_SECONDS,
            );
          } catch (error) {
            if (error instanceof APIError) {
              throw error;
            }

            console.error("OTP resend rate limiter error:", error);
          }

          const { email } = ctx.body;

          const normalizedEmail = email.trim().toLowerCase();

          try {
            await resendSignupOTP(database, normalizedEmail, env);

            return ctx.json({
              success: true,
              message: "A new OTP has been sent to your email",
            });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to resend OTP";

            if (message === "USER_NOT_FOUND") {
              throw new APIError("NOT_FOUND", {
                message: "User not found",
              });
            }

            if (message === "EMAIL_ALREADY_VERIFIED") {
              throw new APIError("BAD_REQUEST", {
                message: "Email is already verified",
              });
            }

            if (message.startsWith("OTP_RESEND_BLOCKED:")) {
              const minutes = message.split(":")[1] ?? "60";

              throw new APIError("TOO_MANY_REQUESTS", {
                message:
                  `Resend OTP is blocked. ` +
                  `Try again in ${minutes} minutes.`,
              });
            }

            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to resend OTP",
            });
          }
        },
      ),
    },
  };
}
