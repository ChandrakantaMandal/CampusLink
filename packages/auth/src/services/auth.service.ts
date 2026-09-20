import type { Database } from "@HireBridge/db";

import {
  canResendSignupOTP,
  generateSignupOTP,
  verifySignupOTP,
} from "../utils/otp";

import { createMailer } from "../sendMail/mailer";

type SMTPConfig = {
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
};

export async function sendSignupOTP(
  database: Database,
  email: string,
  env: SMTPConfig,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await database.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.emailVerified) {
    throw new Error("EMAIL_ALREADY_VERIFIED");
  }

  const otp = await generateSignupOTP(normalizedEmail);

  const mailer = createMailer(env);

  await mailer.sendVerificationOTP(normalizedEmail, otp);

  return {
    success: true,
  };
}

export async function verifyEmailOTP(
  database: Database,
  email: string,
  otp: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedOTP = otp.trim();

  if (!/^\d{6}$/.test(normalizedOTP)) {
    throw new Error("INVALID_OTP");
  }

  const result = await verifySignupOTP(normalizedEmail, normalizedOTP);

  if (!result.success) {
    throw new Error(result.error);
  }

  const user = await database.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.emailVerified) {
    return {
      success: true,
      user,
    };
  }

  const updatedUser = await database.user.update({
    where: {
      email: normalizedEmail,
    },
    data: {
      emailVerified: true,
    },
  });

  return {
    success: true,
    user: updatedUser,
  };
}

export async function resendSignupOTP(
  database: Database,
  email: string,
  env: SMTPConfig,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await database.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.emailVerified) {
    throw new Error("EMAIL_ALREADY_VERIFIED");
  }

  const resendStatus = await canResendSignupOTP(normalizedEmail);

  if (!resendStatus.allowed) {
    const minutes = Math.ceil(resendStatus.remainingSeconds / 60);

    throw new Error(`OTP_RESEND_BLOCKED:${minutes}`);
  }

  const otp = await generateSignupOTP(normalizedEmail);

  const mailer = createMailer(env);

  await mailer.sendVerificationOTP(normalizedEmail, otp);

  return {
    success: true,
  };
}
