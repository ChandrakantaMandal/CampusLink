import type { Database } from "@CampusLink/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";

import {
  sendPasswordReset,
  sendSignupOTP,
  sendWelcomeEmail,
} from "./services/auth.service";

import { signupOTPPlugin } from "./plugins/signup-otp.plugin";

export type AuthConfig = {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  CORS_ORIGIN: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

export function createAuth(
  env: AuthConfig,
  database: Database,
  desktopOrigins: readonly string[] = [],
) {
  const mailerConfig = {
    SMTP_USER: env.SMTP_USER,
    SMTP_PASSWORD: env.SMTP_PASSWORD,
    EMAIL_FROM: env.EMAIL_FROM,
  };

  return betterAuth({
    database: prismaAdapter(database, {
      provider: "postgresql",
    }),

    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "STUDENT",
          input: false,
        },
      },
    },

    trustedOrigins: [env.CORS_ORIGIN, ...desktopOrigins],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    plugins: [bearer(), signupOTPPlugin(database, mailerConfig)],

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendPasswordReset(user.email, url, mailerConfig);
      },

      resetPasswordTokenExpiresIn: 60 * 60,
    },

    emailVerification: {
      autoSignInAfterVerification: true,
    },

    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            if (process.env.NODE_ENV === "test") {
              return;
            }

            if (!user.emailVerified) {
              await sendSignupOTP(database, user.email, mailerConfig);
            }
          },
        },
      },

      account: {
        create: {
          after: async (account) => {
            if (process.env.NODE_ENV === "test") {
              return;
            }

            if (account.providerId !== "google") {
              return;
            }

            const user = await database.user.findUnique({
              where: {
                id: account.userId,
              },
            });

            if (!user) {
              return;
            }
            await sendWelcomeEmail(user.email, user.name, mailerConfig);
          },
        },
      },
    },

    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
  });
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
