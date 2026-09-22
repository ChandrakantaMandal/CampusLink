import { beforeEach, describe, expect, it, vi } from "vitest";

const redisMock = vi.hoisted(() => ({
  set: vi.fn(),
  get: vi.fn(),
  del: vi.fn(),
  ttl: vi.fn(),
}));

vi.mock("@HireBridge/redis", () => ({
  redis: redisMock,
}));

import {
  canResendSignupOTP,
  generateSignupOTP,
  verifySignupOTP,
} from "../src/utils/otp";

describe("Signup OTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateSignupOTP", () => {
    it("should generate a 6-digit OTP", async () => {
      redisMock.set.mockResolvedValue("OK");

      const otp = await generateSignupOTP("Student@Example.com");

      expect(otp).toMatch(/^\d{6}$/);

      expect(redisMock.set).toHaveBeenCalledTimes(1);
    });

    it("should normalize the email before storing the OTP", async () => {
      redisMock.set.mockResolvedValue("OK");

      await generateSignupOTP("  Student@Example.COM  ");

      const key = redisMock.set.mock.calls[0]?.[0];

      expect(key).toBe("hirebridge:signup:otp:student@example.com");
    });

    it("should store the OTP with a 10-minute expiration", async () => {
      redisMock.set.mockResolvedValue("OK");

      await generateSignupOTP("student@example.com");

      expect(redisMock.set).toHaveBeenCalledWith(
        "hirebridge:signup:otp:student@example.com",
        expect.any(String),
        "EX",
        600,
      );
    });
  });

  describe("verifySignupOTP", () => {
    it("should return OTP_EXPIRED when no OTP exists", async () => {
      redisMock.get.mockResolvedValue(null);

      const result = await verifySignupOTP("student@example.com", "123456");

      expect(result).toEqual({
        success: false,
        error: "OTP_EXPIRED",
      });
    });

    it("should return INVALID_OTP when the OTP is incorrect", async () => {
      const bcrypt = await import("bcrypt");

      const hash = await bcrypt.hash("123456", 10);

      redisMock.get.mockResolvedValue(hash);

      redisMock.set.mockResolvedValue("OK");

      const result = await verifySignupOTP("student@example.com", "999999");

      expect(result).toEqual({
        success: false,
        error: "INVALID_OTP",
      });

      expect(redisMock.set).toHaveBeenCalledWith(
        "hirebridge:signup:otp:block:student@example.com",
        "1",
        "EX",
        3600,
      );
    });

    it("should verify a valid OTP and delete it", async () => {
      const bcrypt = await import("bcrypt");

      const hash = await bcrypt.hash("123456", 10);

      redisMock.get.mockResolvedValue(hash);

      redisMock.del.mockResolvedValue(1);

      const result = await verifySignupOTP("student@example.com", "123456");

      expect(result).toEqual({
        success: true,
      });

      expect(redisMock.del).toHaveBeenCalledWith(
        "hirebridge:signup:otp:student@example.com",
      );

      expect(redisMock.del).toHaveBeenCalledWith(
        "hirebridge:signup:otp:block:student@example.com",
      );
    });

    it("should normalize the email before verification", async () => {
      redisMock.get.mockResolvedValue(null);

      await verifySignupOTP("  Student@Example.COM  ", "123456");

      expect(redisMock.get).toHaveBeenCalledWith(
        "hirebridge:signup:otp:student@example.com",
      );
    });
  });

  describe("canResendSignupOTP", () => {
    it("should allow resend when there is no active block", async () => {
      redisMock.ttl.mockResolvedValue(-2);

      const result = await canResendSignupOTP("student@example.com");

      expect(result).toEqual({
        allowed: true,
        remainingSeconds: 0,
      });
    });

    it("should allow resend when TTL is zero", async () => {
      redisMock.ttl.mockResolvedValue(0);

      const result = await canResendSignupOTP("student@example.com");

      expect(result).toEqual({
        allowed: true,
        remainingSeconds: 0,
      });
    });

    it("should block resend when the block is active", async () => {
      redisMock.ttl.mockResolvedValue(120);

      const result = await canResendSignupOTP("student@example.com");

      expect(result).toEqual({
        allowed: false,
        remainingSeconds: 120,
      });
    });

    it("should normalize the email before checking the block", async () => {
      redisMock.ttl.mockResolvedValue(-2);

      await canResendSignupOTP("  Student@Example.COM  ");

      expect(redisMock.ttl).toHaveBeenCalledWith(
        "hirebridge:signup:otp:block:student@example.com",
      );
    });
  });
});
