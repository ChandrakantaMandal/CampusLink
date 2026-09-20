import type { Database } from "@HireBridge/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { sendSignupOTP } from "./services/auth.service";
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
   console.log("Google OAuth config:", {
    clientIdPresent: Boolean(env.GOOGLE_CLIENT_ID),
    clientIdLength: env.GOOGLE_CLIENT_ID?.length,
    clientSecretPresent: Boolean(env.GOOGLE_CLIENT_SECRET),
    clientSecretLength: env.GOOGLE_CLIENT_SECRET?.length,
    betterAuthUrl: env.BETTER_AUTH_URL,
  });
  return betterAuth({
    database: prismaAdapter(database, {
      provider: "postgresql",
    }),
    trustedOrigins: [env.CORS_ORIGIN, ...desktopOrigins],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    plugins: [
      signupOTPPlugin(database, {
        SMTP_USER: env.SMTP_USER,
        SMTP_PASSWORD: env.SMTP_PASSWORD,
        EMAIL_FROM: env.EMAIL_FROM,
      }),
    ],

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },

    emailVerification: {
      autoSignInAfterVerification: true,
    },

    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            if (!user.emailVerified) {
              await sendSignupOTP(database, user.email, {
                SMTP_USER: env.SMTP_USER,
                SMTP_PASSWORD: env.SMTP_PASSWORD,
                EMAIL_FROM: env.EMAIL_FROM,
              });
            }
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
