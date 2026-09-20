import bcrypt from "bcrypt";
import { randomInt } from "node:crypto";
import { redis } from "@HireBridge/redis";

const OTP_TTL = 10 * 60; // 10 minutes
const OTP_RESEND_BLOCK_TTL = 60 * 60; // 1 hour

function getOTPKey(email: string) {
  return `hirebridge:signup:otp:${email.toLowerCase()}`;
}

function getOTPBlockKey(email: string) {
  return `hirebridge:signup:otp:block:${email.toLowerCase()}`;
}

export async function generateSignupOTP(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const otp = randomInt(100000, 1000000).toString();

  const hashedOTP = await bcrypt.hash(otp, 10);

  await redis.set(getOTPKey(normalizedEmail), hashedOTP, "EX", OTP_TTL);

  return otp;
}

export async function verifySignupOTP(email: string, otp: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const storedHash = await redis.get(getOTPKey(normalizedEmail));

  if (!storedHash) {
    return {
      success: false,
      error: "OTP_EXPIRED",
    };
  }

  const isValid = await bcrypt.compare(otp, storedHash);

  if (!isValid) {
    await redis.set(
      getOTPBlockKey(normalizedEmail),
      "1",
      "EX",
      OTP_RESEND_BLOCK_TTL,
    );

    return {
      success: false,
      error: "INVALID_OTP",
    };
  }

  await redis.del(getOTPKey(normalizedEmail));

  await redis.del(getOTPBlockKey(normalizedEmail));

  return {
    success: true,
  };
}

export async function canResendSignupOTP(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const blockKey = getOTPBlockKey(normalizedEmail);

  const ttl = await redis.ttl(blockKey);

  if (ttl > 0) {
    return {
      allowed: false,
      remainingSeconds: ttl,
    };
  }

  return {
    allowed: true,
    remainingSeconds: 0,
  };
}
