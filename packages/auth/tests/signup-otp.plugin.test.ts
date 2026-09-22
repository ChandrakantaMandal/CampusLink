import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redisIncr: vi.fn(),
  redisExpire: vi.fn(),
  redisTtl: vi.fn(),

  verifyEmailOTP: vi.fn(),
  resendSignupOTP: vi.fn(),

  setSessionCookie: vi.fn(),

  createAuthEndpoint: vi.fn(),
}));

// Mocks
vi.mock("@HireBridge/redis", () => ({
  redis: {
    incr: mocks.redisIncr,
    expire: mocks.redisExpire,
    ttl: mocks.redisTtl,
  },
}));

vi.mock("../src/services/auth.service", () => ({
  verifyEmailOTP: mocks.verifyEmailOTP,
  resendSignupOTP: mocks.resendSignupOTP,
}));

vi.mock("better-auth/cookies", () => ({
  setSessionCookie: mocks.setSessionCookie,
}));

vi.mock("better-auth/api", async () => {
  const actual =
    await vi.importActual<typeof import("better-auth/api")>("better-auth/api");

  return {
    ...actual,
    createAuthEndpoint: mocks.createAuthEndpoint,
  };
});

import { signupOTPPlugin } from "../src/plugins/signup-otp.plugin";

// Test types
type TestContext = {
  body: Record<string, unknown>;
  request: Request;

  context: {
    internalAdapter: {
      findUserByEmail: ReturnType<typeof vi.fn>;
      createSession: ReturnType<typeof vi.fn>;
    };
  };

  json: ReturnType<typeof vi.fn>;
};

type TestEndpoint = {
  path: string;
  options: unknown;
  handler: (ctx: TestContext) => unknown;
};

type TestPlugin = {
  id: string;

  endpoints: {
    verifySignupOTP: TestEndpoint;
    resendSignupOTP: TestEndpoint;
  };
};

// Test helpers
const env = {
  SMTP_USER: "test@gmail.com",
  SMTP_PASSWORD: "test-password",
  EMAIL_FROM: "HireBridge <test@gmail.com>",
};

const database = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

function getTestPlugin(): TestPlugin {
  return signupOTPPlugin(database as never, env) as unknown as TestPlugin;
}

function createContext(
  body: Record<string, unknown>,
  request?: Request,
): TestContext {
  return {
    body,

    request:
      request ??
      new Request("http://localhost/api/auth/test", {
        method: "POST",
        headers: {
          "x-forwarded-for": "127.0.0.1",
        },
      }),

    context: {
      internalAdapter: {
        findUserByEmail: vi.fn(),
        createSession: vi.fn(),
      },
    },

    json: vi.fn((data) => data),
  };
}

// Setup
beforeEach(() => {
  vi.clearAllMocks();

  // Redis defaults
  mocks.redisIncr.mockResolvedValue(1);
  mocks.redisExpire.mockResolvedValue(1);
  mocks.redisTtl.mockResolvedValue(600);

  // Auth service defaults
  mocks.verifyEmailOTP.mockResolvedValue({
    success: true,
  });

  mocks.resendSignupOTP.mockResolvedValue({
    success: true,
  });

  // Cookie
  mocks.setSessionCookie.mockResolvedValue(undefined);

  mocks.createAuthEndpoint.mockImplementation(
    (
      path: string,
      options: unknown,
      handler: (ctx: TestContext) => unknown,
    ): TestEndpoint => ({
      path,
      options,
      handler,
    }),
  );
});

// Plugin configuration
describe("signupOTPPlugin", () => {
  describe("plugin configuration", () => {
    it("should create the signup OTP plugin", () => {
      const plugin = getTestPlugin();

      expect(plugin).toBeDefined();
      expect(plugin.id).toBe("signup-otp");
    });

    it("should register verify and resend endpoints", () => {
      const plugin = getTestPlugin();

      expect(plugin.endpoints).toHaveProperty("verifySignupOTP");

      expect(plugin.endpoints).toHaveProperty("resendSignupOTP");
    });

    it("should register both endpoints with POST method", () => {
      const plugin = getTestPlugin();

      expect(plugin.endpoints.verifySignupOTP.options).toEqual(
        expect.objectContaining({
          method: "POST",
        }),
      );

      expect(plugin.endpoints.resendSignupOTP.options).toEqual(
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    it("should register the correct endpoint paths", () => {
      const plugin = getTestPlugin();

      expect(plugin.endpoints.verifySignupOTP.path).toBe("/verify-signup-otp");

      expect(plugin.endpoints.resendSignupOTP.path).toBe("/resend-signup-otp");
    });
  });

  // Verify Signup OTP
  describe("verifySignupOTP", () => {
    it("should verify a valid OTP successfully", async () => {
      const plugin = getTestPlugin();

      const user = {
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      };

      const findUserByEmail = vi.fn().mockResolvedValue(user);

      const createSession = vi.fn().mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      ctx.context.internalAdapter.findUserByEmail = findUserByEmail;

      ctx.context.internalAdapter.createSession = createSession;

      const result = await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(mocks.verifyEmailOTP).toHaveBeenCalledWith(
        database,
        "user@example.com",
        "123456",
        env,
      );

      expect(findUserByEmail).toHaveBeenCalledWith("user@example.com");

      expect(createSession).toHaveBeenCalledWith("user-1");

      expect(mocks.setSessionCookie).toHaveBeenCalledWith(ctx, {
        session: {
          id: "session-1",
          userId: "user-1",
        },

        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: true,
        },
      });

      expect(ctx.json).toHaveBeenCalledWith({
        success: true,
        message: "Email verified successfully",
      });

      expect(result).toEqual({
        success: true,
        message: "Email verified successfully",
      });
    });

    it("should normalize the email before verification", async () => {
      const plugin = getTestPlugin();

      const user = {
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      };

      const findUserByEmail = vi.fn().mockResolvedValue(user);

      const createSession = vi.fn().mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });

      const ctx = createContext({
        email: "  USER@EXAMPLE.COM  ",
        otp: "123456",
      });

      ctx.context.internalAdapter.findUserByEmail = findUserByEmail;

      ctx.context.internalAdapter.createSession = createSession;

      await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(mocks.verifyEmailOTP).toHaveBeenCalledWith(
        database,
        "user@example.com",
        "123456",
        env,
      );

      expect(findUserByEmail).toHaveBeenCalledWith("user@example.com");
    });

    it("should convert INVALID_OTP to BAD_REQUEST", async () => {
      const plugin = getTestPlugin();

      mocks.verifyEmailOTP.mockRejectedValue(new Error("INVALID_OTP"));

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "BAD_REQUEST",
        body: {
          message: "INVALID_OTP",
        },
      });
    });

    it("should convert OTP_EXPIRED to BAD_REQUEST", async () => {
      const plugin = getTestPlugin();

      mocks.verifyEmailOTP.mockRejectedValue(new Error("OTP_EXPIRED"));

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "BAD_REQUEST",
        body: {
          message: "OTP_EXPIRED",
        },
      });
    });

    it("should convert USER_NOT_FOUND to NOT_FOUND", async () => {
      const plugin = getTestPlugin();

      mocks.verifyEmailOTP.mockRejectedValue(new Error("USER_NOT_FOUND"));

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "NOT_FOUND",
        body: {
          message: "User not found",
        },
      });
    });

    it("should convert EMAIL_ALREADY_VERIFIED to BAD_REQUEST", async () => {
      const plugin = getTestPlugin();

      mocks.verifyEmailOTP.mockRejectedValue(
        new Error("EMAIL_ALREADY_VERIFIED"),
      );

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "BAD_REQUEST",
        body: {
          message: "Email is already verified",
        },
      });
    });

    it("should convert unexpected verification errors to INTERNAL_SERVER_ERROR", async () => {
      const plugin = getTestPlugin();

      mocks.verifyEmailOTP.mockRejectedValue(
        new Error("DATABASE_CONNECTION_FAILED"),
      );

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "INTERNAL_SERVER_ERROR",
        body: {
          message: "Verification failed",
        },
      });
    });

    it("should return NOT_FOUND if Better Auth cannot find the verified user", async () => {
      const plugin = getTestPlugin();

      const findUserByEmail = vi.fn().mockResolvedValue(null);

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      ctx.context.internalAdapter.findUserByEmail = findUserByEmail;

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "NOT_FOUND",
        body: {
          message: "User not found",
        },
      });

      expect(ctx.context.internalAdapter.createSession).not.toHaveBeenCalled();

      expect(mocks.setSessionCookie).not.toHaveBeenCalled();
    });

    it("should return INTERNAL_SERVER_ERROR if session creation fails", async () => {
      const plugin = getTestPlugin();

      const findUserByEmail = vi.fn().mockResolvedValue({
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      });

      const createSession = vi.fn().mockResolvedValue(null);

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      ctx.context.internalAdapter.findUserByEmail = findUserByEmail;

      ctx.context.internalAdapter.createSession = createSession;

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "INTERNAL_SERVER_ERROR",
        body: {
          message: "Failed to create session",
        },
      });

      expect(mocks.setSessionCookie).not.toHaveBeenCalled();
    });

    it("should set the session cookie after successful verification", async () => {
      const plugin = getTestPlugin();

      const user = {
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      };

      const session = {
        id: "session-1",
        userId: "user-1",
      };

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      ctx.context.internalAdapter.findUserByEmail = vi
        .fn()
        .mockResolvedValue(user);

      ctx.context.internalAdapter.createSession = vi
        .fn()
        .mockResolvedValue(session);

      await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(mocks.setSessionCookie).toHaveBeenCalledTimes(1);
    });
  });

  // Resend Signup OTP
  describe("resendSignupOTP", () => {
    it("should resend OTP successfully", async () => {
      const plugin = getTestPlugin();

      const ctx = createContext({
        email: "user@example.com",
      });

      const result = await plugin.endpoints.resendSignupOTP.handler(ctx);

      expect(mocks.resendSignupOTP).toHaveBeenCalledWith(
        database,
        "user@example.com",
        env,
      );

      expect(ctx.json).toHaveBeenCalledWith({
        success: true,
        message: "A new OTP has been sent to your email",
      });

      expect(result).toEqual({
        success: true,
        message: "A new OTP has been sent to your email",
      });
    });

    it("should normalize the email before resending", async () => {
      const plugin = getTestPlugin();

      const ctx = createContext({
        email: "  USER@EXAMPLE.COM  ",
      });

      await plugin.endpoints.resendSignupOTP.handler(ctx);

      expect(mocks.resendSignupOTP).toHaveBeenCalledWith(
        database,
        "user@example.com",
        env,
      );
    });

    it("should convert USER_NOT_FOUND to NOT_FOUND", async () => {
      const plugin = getTestPlugin();

      mocks.resendSignupOTP.mockRejectedValue(new Error("USER_NOT_FOUND"));

      const ctx = createContext({
        email: "user@example.com",
      });

      await expect(
        plugin.endpoints.resendSignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "NOT_FOUND",
        body: {
          message: "User not found",
        },
      });
    });

    it("should convert EMAIL_ALREADY_VERIFIED to BAD_REQUEST", async () => {
      const plugin = getTestPlugin();

      mocks.resendSignupOTP.mockRejectedValue(
        new Error("EMAIL_ALREADY_VERIFIED"),
      );

      const ctx = createContext({
        email: "user@example.com",
      });

      await expect(
        plugin.endpoints.resendSignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "BAD_REQUEST",
        body: {
          message: "Email is already verified",
        },
      });
    });

    it("should convert OTP_RESEND_BLOCKED to TOO_MANY_REQUESTS", async () => {
      const plugin = getTestPlugin();

      mocks.resendSignupOTP.mockRejectedValue(
        new Error("OTP_RESEND_BLOCKED:5"),
      );

      const ctx = createContext({
        email: "user@example.com",
      });

      await expect(
        plugin.endpoints.resendSignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "TOO_MANY_REQUESTS",
        body: {
          message: "Resend OTP is blocked. Try again in 5 minutes.",
        },
      });
    });

    it("should convert unexpected resend errors to INTERNAL_SERVER_ERROR", async () => {
      const plugin = getTestPlugin();

      mocks.resendSignupOTP.mockRejectedValue(new Error("SMTP_ERROR"));

      const ctx = createContext({
        email: "user@example.com",
      });

      await expect(
        plugin.endpoints.resendSignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "INTERNAL_SERVER_ERROR",
        body: {
          message: "Failed to resend OTP",
        },
      });
    });
  });

  // Rate limiting
  describe("rate limiting", () => {
    it("should increment the verification rate limit counter", async () => {
      const plugin = getTestPlugin();

      const ctx = createContext(
        {
          email: "user@example.com",
          otp: "123456",
        },
        new Request("http://localhost/api/auth/verify-signup-otp", {
          method: "POST",
          headers: {
            "x-forwarded-for": "192.168.1.100",
          },
        }),
      );

      ctx.context.internalAdapter.findUserByEmail = vi.fn().mockResolvedValue({
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      });

      ctx.context.internalAdapter.createSession = vi.fn().mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });

      await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(mocks.redisIncr).toHaveBeenCalledWith(
        "hirebridge:ratelimit:otp:verify:192.168.1.100",
      );

      expect(mocks.redisExpire).toHaveBeenCalledWith(
        "hirebridge:ratelimit:otp:verify:192.168.1.100",
        600,
      );
    });

    it("should use the first IP from x-forwarded-for", async () => {
      const plugin = getTestPlugin();

      const ctx = createContext(
        {
          email: "user@example.com",
          otp: "123456",
        },
        new Request("http://localhost/api/auth/verify-signup-otp", {
          method: "POST",
          headers: {
            "x-forwarded-for": "10.0.0.1, 10.0.0.2, 10.0.0.3",
          },
        }),
      );

      ctx.context.internalAdapter.findUserByEmail = vi.fn().mockResolvedValue({
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      });

      ctx.context.internalAdapter.createSession = vi.fn().mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });

      await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(mocks.redisIncr).toHaveBeenCalledWith(
        "hirebridge:ratelimit:otp:verify:10.0.0.1",
      );
    });

    it("should use x-real-ip when x-forwarded-for is missing", async () => {
      const plugin = getTestPlugin();

      const ctx = createContext(
        {
          email: "user@example.com",
          otp: "123456",
        },
        new Request("http://localhost/api/auth/verify-signup-otp", {
          method: "POST",
          headers: {
            "x-real-ip": "172.16.0.10",
          },
        }),
      );

      ctx.context.internalAdapter.findUserByEmail = vi.fn().mockResolvedValue({
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      });

      ctx.context.internalAdapter.createSession = vi.fn().mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });

      await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(mocks.redisIncr).toHaveBeenCalledWith(
        "hirebridge:ratelimit:otp:verify:172.16.0.10",
      );
    });

    it("should reject verification after the rate limit is exceeded", async () => {
      const plugin = getTestPlugin();

      mocks.redisIncr.mockResolvedValue(6);
      mocks.redisTtl.mockResolvedValue(420);

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      await expect(
        plugin.endpoints.verifySignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "TOO_MANY_REQUESTS",
      });

      expect(mocks.verifyEmailOTP).not.toHaveBeenCalled();
    });

    it("should reject resend after the rate limit is exceeded", async () => {
      const plugin = getTestPlugin();

      mocks.redisIncr.mockResolvedValue(4);
      mocks.redisTtl.mockResolvedValue(300);

      const ctx = createContext({
        email: "user@example.com",
      });

      await expect(
        plugin.endpoints.resendSignupOTP.handler(ctx),
      ).rejects.toMatchObject({
        status: "TOO_MANY_REQUESTS",
      });

      expect(mocks.resendSignupOTP).not.toHaveBeenCalled();
    });

    it("should set the resend rate limit expiry on the first request", async () => {
      const plugin = getTestPlugin();

      const ctx = createContext({
        email: "user@example.com",
      });

      await plugin.endpoints.resendSignupOTP.handler(ctx);

      expect(mocks.redisExpire).toHaveBeenCalledWith(
        "hirebridge:ratelimit:otp:resend:127.0.0.1",
        600,
      );
    });
  });

  // Rate limiter failure handling
  describe("rate limiter failure handling", () => {
    it("should continue verification when Redis rate limiting fails", async () => {
      const plugin = getTestPlugin();

      mocks.redisIncr.mockRejectedValue(new Error("Redis unavailable"));

      const ctx = createContext({
        email: "user@example.com",
        otp: "123456",
      });

      ctx.context.internalAdapter.findUserByEmail = vi.fn().mockResolvedValue({
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: false,
        },
      });

      ctx.context.internalAdapter.createSession = vi.fn().mockResolvedValue({
        id: "session-1",
        userId: "user-1",
      });

      const result = await plugin.endpoints.verifySignupOTP.handler(ctx);

      expect(result).toEqual({
        success: true,
        message: "Email verified successfully",
      });

      expect(mocks.verifyEmailOTP).toHaveBeenCalled();
    });

    it("should continue resend when Redis rate limiting fails", async () => {
      const plugin = getTestPlugin();

      mocks.redisIncr.mockRejectedValue(new Error("Redis unavailable"));

      const ctx = createContext({
        email: "user@example.com",
      });

      const result = await plugin.endpoints.resendSignupOTP.handler(ctx);

      expect(result).toEqual({
        success: true,
        message: "A new OTP has been sent to your email",
      });

      expect(mocks.resendSignupOTP).toHaveBeenCalled();
    });
  });
});
