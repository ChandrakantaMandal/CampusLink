import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  betterAuth: vi.fn(),
  prismaAdapter: vi.fn(),
  bearer: vi.fn(),
  signupOTPPlugin: vi.fn(),

  sendPasswordReset: vi.fn(),
  sendSignupOTP: vi.fn(),
  sendWelcomeEmail: vi.fn(),
}));

vi.mock("better-auth", () => ({
  betterAuth: mocks.betterAuth,
}));

vi.mock("better-auth/adapters/prisma", () => ({
  prismaAdapter: mocks.prismaAdapter,
}));

vi.mock("better-auth/plugins", () => ({
  bearer: mocks.bearer,
}));

vi.mock("../src/plugins/signup-otp.plugin", () => ({
  signupOTPPlugin: mocks.signupOTPPlugin,
}));

vi.mock("../src/services/auth.service", () => ({
  sendPasswordReset: mocks.sendPasswordReset,
  sendSignupOTP: mocks.sendSignupOTP,
  sendWelcomeEmail: mocks.sendWelcomeEmail,
}));

import { createAuth } from "../src/index";

describe("Auth Configuration", () => {
  const env = {
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: "test-secret",
    CORS_ORIGIN: "http://localhost:3001",
    SMTP_USER: "test@gmail.com",
    SMTP_PASSWORD: "test-password",
    EMAIL_FROM: "CampusLink <test@gmail.com>",
    GOOGLE_CLIENT_ID: "google-client-id",
    GOOGLE_CLIENT_SECRET: "google-client-secret",
  };

  const database = {
    user: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.prismaAdapter.mockReturnValue("MOCK_PRISMA_ADAPTER");

    mocks.bearer.mockReturnValue({
      id: "bearer",
    });

    mocks.signupOTPPlugin.mockReturnValue({
      id: "signup-otp",
    });
    mocks.betterAuth.mockImplementation((config) => config);
  });

  function getAuthConfig() {
    return createAuth(env, database as never) as unknown as {
      database: unknown;

      user: {
        additionalFields: {
          role: {
            type: string;
            required: boolean;
            defaultValue: string;
            input: boolean;
          };
        };
      };

      trustedOrigins: string[];

      secret: string;

      baseURL: string;

      socialProviders: {
        google: {
          clientId: string;
          clientSecret: string;
        };
      };

      plugins: Array<{
        id: string;
      }>;

      emailAndPassword: {
        enabled: boolean;
        requireEmailVerification: boolean;
        resetPasswordTokenExpiresIn: number;
        sendResetPassword: (...args: never[]) => unknown;
      };

      emailVerification: {
        autoSignInAfterVerification: boolean;
      };

      databaseHooks: {
        user: {
          create: {
            after: (...args: never[]) => unknown;
          };
        };

        account: {
          create: {
            after: (...args: never[]) => unknown;
          };
        };
      };

      advanced: {
        defaultCookieAttributes: {
          sameSite: string;
          secure: boolean;
          httpOnly: boolean;
        };
      };
    };
  }

  it("should create the auth configuration", () => {
    const auth = getAuthConfig();

    expect(mocks.betterAuth).toHaveBeenCalledTimes(1);
    expect(auth).toBeDefined();
  });

  it("should configure Prisma as the Better Auth database adapter", () => {
    getAuthConfig();

    expect(mocks.prismaAdapter).toHaveBeenCalledTimes(1);

    expect(mocks.prismaAdapter).toHaveBeenCalledWith(database, {
      provider: "postgresql",
    });

    expect(mocks.betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        database: "MOCK_PRISMA_ADAPTER",
      }),
    );
  });

  it("should configure trusted origins", () => {
    const auth = createAuth(env, database as never, [
      "app://desktop",
      "http://localhost:4000",
    ]) as unknown as {
      trustedOrigins: string[];
    };

    expect(auth.trustedOrigins).toEqual([
      env.CORS_ORIGIN,
      "app://desktop",
      "http://localhost:4000",
    ]);
  });

  it("should configure the Better Auth secret and base URL", () => {
    const auth = getAuthConfig();

    expect(auth.secret).toBe(env.BETTER_AUTH_SECRET);
    expect(auth.baseURL).toBe(env.BETTER_AUTH_URL);
  });

  it("should configure Google OAuth", () => {
    const auth = getAuthConfig();

    expect(auth.socialProviders).toEqual({
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    });
  });

  it("should register the signup OTP plugin", () => {
    const auth = getAuthConfig();

    expect(mocks.signupOTPPlugin).toHaveBeenCalledTimes(1);

    expect(mocks.signupOTPPlugin).toHaveBeenCalledWith(database, {
      SMTP_USER: env.SMTP_USER,
      SMTP_PASSWORD: env.SMTP_PASSWORD,
      EMAIL_FROM: env.EMAIL_FROM,
    });

    expect(auth.plugins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "signup-otp",
        }),
      ]),
    );
  });

  it("should register the bearer plugin", () => {
    const auth = getAuthConfig();

    expect(mocks.bearer).toHaveBeenCalledTimes(1);

    expect(auth.plugins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "bearer",
        }),
      ]),
    );
  });

  it("should enable email and password authentication", () => {
    const auth = getAuthConfig();

    expect(auth.emailAndPassword).toEqual(
      expect.objectContaining({
        enabled: true,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 60,
      }),
    );
  });

  it("should configure automatic sign-in after email verification", () => {
    const auth = getAuthConfig();

    expect(auth.emailVerification).toEqual({
      autoSignInAfterVerification: true,
    });
  });

  it("should configure secure authentication cookies", () => {
    const auth = getAuthConfig();

    expect(auth.advanced).toEqual({
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    });
  });

  it("should configure the password reset handler", () => {
    const auth = getAuthConfig();

    expect(auth.emailAndPassword.sendResetPassword).toBeTypeOf("function");

    expect(mocks.sendPasswordReset).not.toHaveBeenCalled();
  });

  it("should configure the user creation database hook", () => {
    const auth = getAuthConfig();

    expect(auth.databaseHooks.user.create.after).toBeTypeOf("function");
  });

  it("should configure the Google account creation database hook", () => {
    const auth = getAuthConfig();

    expect(auth.databaseHooks.account.create.after).toBeTypeOf("function");
  });
});
