import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  canResendSignupOTP: vi.fn(),
  generateSignupOTP: vi.fn(),
  verifySignupOTP: vi.fn(),

  createMailer: vi.fn(),

  sendVerificationOTP: vi.fn(),
  sendPasswordReset: vi.fn(),
  sendWelcome: vi.fn(),

  findUnique: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../src/utils/otp", () => ({
  canResendSignupOTP: mocks.canResendSignupOTP,
  generateSignupOTP: mocks.generateSignupOTP,
  verifySignupOTP: mocks.verifySignupOTP,
}));

vi.mock("../src/sendMail/mailer", () => ({
  createMailer: mocks.createMailer,
}));

import {
  resendSignupOTP,
  sendPasswordReset,
  sendSignupOTP,
  sendWelcomeEmail,
  verifyEmailOTP,
} from "../src/services/auth.service";

describe("Auth Service", () => {
  const env = {
    SMTP_USER: "test@gmail.com",
    SMTP_PASSWORD: "test-password",
    EMAIL_FROM: "HireBridge <test@gmail.com>",
  };

  const database = {
    user: {
      findUnique: mocks.findUnique,
      update: mocks.update,
    },
  };

  const mailer = {
    sendVerificationOTP: mocks.sendVerificationOTP,
    sendPasswordReset: mocks.sendPasswordReset,
    sendWelcome: mocks.sendWelcome,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.createMailer.mockReturnValue(mailer);
  });

  // sendSignupOTP
  describe("sendSignupOTP", () => {
    it("should send signup OTP to an existing unverified user", async () => {
      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
      });

      mocks.generateSignupOTP.mockResolvedValue("123456");

      mocks.sendVerificationOTP.mockResolvedValue({
        messageId: "message-1",
      });

      const result = await sendSignupOTP(
        database as never,
        "  USER@EXAMPLE.COM  ",
        env,
      );

      expect(result).toEqual({
        success: true,
      });

      expect(mocks.findUnique).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
      });

      expect(mocks.generateSignupOTP).toHaveBeenCalledWith("user@example.com");

      expect(mocks.createMailer).toHaveBeenCalledWith(env);

      expect(mocks.sendVerificationOTP).toHaveBeenCalledWith(
        "user@example.com",
        "123456",
      );
    });

    it("should throw USER_NOT_FOUND when the user does not exist", async () => {
      mocks.findUnique.mockResolvedValue(null);

      await expect(
        sendSignupOTP(database as never, "unknown@example.com", env),
      ).rejects.toThrow("USER_NOT_FOUND");

      expect(mocks.generateSignupOTP).not.toHaveBeenCalled();
      expect(mocks.createMailer).not.toHaveBeenCalled();
    });

    it("should throw EMAIL_ALREADY_VERIFIED for an already verified user", async () => {
      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: true,
      });

      await expect(
        sendSignupOTP(database as never, "user@example.com", env),
      ).rejects.toThrow("EMAIL_ALREADY_VERIFIED");

      expect(mocks.generateSignupOTP).not.toHaveBeenCalled();
      expect(mocks.createMailer).not.toHaveBeenCalled();
    });
  });

  // verifyEmailOTP
  describe("verifyEmailOTP", () => {
    it("should reject an OTP that is not exactly 6 digits", async () => {
      await expect(
        verifyEmailOTP(database as never, "user@example.com", "12345", env),
      ).rejects.toThrow("INVALID_OTP");

      expect(mocks.verifySignupOTP).not.toHaveBeenCalled();
      expect(mocks.findUnique).not.toHaveBeenCalled();
    });

    it("should reject an OTP containing non-numeric characters", async () => {
      await expect(
        verifyEmailOTP(database as never, "user@example.com", "12AB56", env),
      ).rejects.toThrow("INVALID_OTP");

      expect(mocks.verifySignupOTP).not.toHaveBeenCalled();
    });

    it("should trim the OTP before verification", async () => {
      mocks.verifySignupOTP.mockResolvedValue({
        success: true,
      });

      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
        name: "Test User",
      });

      mocks.update.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: true,
        name: "Test User",
      });

      await verifyEmailOTP(
        database as never,
        " USER@EXAMPLE.COM ",
        " 123456 ",
        env,
      );

      expect(mocks.verifySignupOTP).toHaveBeenCalledWith(
        "user@example.com",
        "123456",
      );
    });

    it("should throw when the OTP is expired", async () => {
      mocks.verifySignupOTP.mockResolvedValue({
        success: false,
        error: "OTP_EXPIRED",
      });

      await expect(
        verifyEmailOTP(database as never, "user@example.com", "123456", env),
      ).rejects.toThrow("OTP_EXPIRED");

      expect(mocks.findUnique).not.toHaveBeenCalled();
    });

    it("should throw when the OTP is invalid", async () => {
      mocks.verifySignupOTP.mockResolvedValue({
        success: false,
        error: "INVALID_OTP",
      });

      await expect(
        verifyEmailOTP(database as never, "user@example.com", "123456", env),
      ).rejects.toThrow("INVALID_OTP");

      expect(mocks.findUnique).not.toHaveBeenCalled();
    });

    it("should throw USER_NOT_FOUND after successful OTP verification", async () => {
      mocks.verifySignupOTP.mockResolvedValue({
        success: true,
      });

      mocks.findUnique.mockResolvedValue(null);

      await expect(
        verifyEmailOTP(database as never, "user@example.com", "123456", env),
      ).rejects.toThrow("USER_NOT_FOUND");

      expect(mocks.update).not.toHaveBeenCalled();
      expect(mocks.sendWelcome).not.toHaveBeenCalled();
    });

    it("should return the user when the email is already verified", async () => {
      const user = {
        id: "user-1",
        email: "user@example.com",
        emailVerified: true,
        name: "Test User",
      };

      mocks.verifySignupOTP.mockResolvedValue({
        success: true,
      });

      mocks.findUnique.mockResolvedValue(user);

      const result = await verifyEmailOTP(
        database as never,
        "user@example.com",
        "123456",
        env,
      );

      expect(result).toEqual({
        success: true,
        user,
      });

      expect(mocks.update).not.toHaveBeenCalled();
      expect(mocks.sendWelcome).not.toHaveBeenCalled();
    });

    it("should verify the user and send a welcome email", async () => {
      const existingUser = {
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
        name: "Test User",
      };

      const updatedUser = {
        id: "user-1",
        email: "user@example.com",
        emailVerified: true,
        name: "Test User",
      };

      mocks.verifySignupOTP.mockResolvedValue({
        success: true,
      });

      mocks.findUnique.mockResolvedValue(existingUser);

      mocks.update.mockResolvedValue(updatedUser);

      mocks.sendWelcome.mockResolvedValue({
        messageId: "welcome-message",
      });

      const result = await verifyEmailOTP(
        database as never,
        "user@example.com",
        "123456",
        env,
      );

      expect(result).toEqual({
        success: true,
        user: updatedUser,
      });

      expect(mocks.update).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
        data: {
          emailVerified: true,
        },
      });

      expect(mocks.createMailer).toHaveBeenCalledWith(env);

      expect(mocks.sendWelcome).toHaveBeenCalledWith(
        "user@example.com",
        "Test User",
      );
    });

    it("should use User as the fallback name when sending welcome email", async () => {
      const existingUser = {
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
        name: null,
      };

      const updatedUser = {
        id: "user-1",
        email: "user@example.com",
        emailVerified: true,
        name: null,
      };

      mocks.verifySignupOTP.mockResolvedValue({
        success: true,
      });

      mocks.findUnique.mockResolvedValue(existingUser);

      mocks.update.mockResolvedValue(updatedUser);

      await verifyEmailOTP(
        database as never,
        "user@example.com",
        "123456",
        env,
      );

      expect(mocks.sendWelcome).toHaveBeenCalledWith(
        "user@example.com",
        "User",
      );
    });
  });

  // resendSignupOTP
  describe("resendSignupOTP", () => {
    it("should resend OTP to an existing unverified user", async () => {
      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
      });

      mocks.canResendSignupOTP.mockResolvedValue({
        allowed: true,
        remainingSeconds: 0,
      });

      mocks.generateSignupOTP.mockResolvedValue("654321");

      mocks.sendVerificationOTP.mockResolvedValue({
        messageId: "message-2",
      });

      const result = await resendSignupOTP(
        database as never,
        " USER@EXAMPLE.COM ",
        env,
      );

      expect(result).toEqual({
        success: true,
      });

      expect(mocks.findUnique).toHaveBeenCalledWith({
        where: {
          email: "user@example.com",
        },
      });

      expect(mocks.canResendSignupOTP).toHaveBeenCalledWith("user@example.com");

      expect(mocks.generateSignupOTP).toHaveBeenCalledWith("user@example.com");

      expect(mocks.sendVerificationOTP).toHaveBeenCalledWith(
        "user@example.com",
        "654321",
      );
    });

    it("should throw USER_NOT_FOUND when resending for an unknown user", async () => {
      mocks.findUnique.mockResolvedValue(null);

      await expect(
        resendSignupOTP(database as never, "unknown@example.com", env),
      ).rejects.toThrow("USER_NOT_FOUND");

      expect(mocks.canResendSignupOTP).not.toHaveBeenCalled();
      expect(mocks.generateSignupOTP).not.toHaveBeenCalled();
    });

    it("should throw EMAIL_ALREADY_VERIFIED when resending for a verified user", async () => {
      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: true,
      });

      await expect(
        resendSignupOTP(database as never, "user@example.com", env),
      ).rejects.toThrow("EMAIL_ALREADY_VERIFIED");

      expect(mocks.canResendSignupOTP).not.toHaveBeenCalled();
      expect(mocks.generateSignupOTP).not.toHaveBeenCalled();
    });

    it("should throw OTP_RESEND_BLOCKED when resend is blocked", async () => {
      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
      });

      mocks.canResendSignupOTP.mockResolvedValue({
        allowed: false,
        remainingSeconds: 300,
      });

      await expect(
        resendSignupOTP(database as never, "user@example.com", env),
      ).rejects.toThrow("OTP_RESEND_BLOCKED:5");

      expect(mocks.generateSignupOTP).not.toHaveBeenCalled();
      expect(mocks.createMailer).not.toHaveBeenCalled();
    });

    it("should round resend blocking time up to the next minute", async () => {
      mocks.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        emailVerified: false,
      });

      mocks.canResendSignupOTP.mockResolvedValue({
        allowed: false,
        remainingSeconds: 301,
      });

      await expect(
        resendSignupOTP(database as never, "user@example.com", env),
      ).rejects.toThrow("OTP_RESEND_BLOCKED:6");
    });
  });

  // sendPasswordReset
  describe("sendPasswordReset", () => {
    it("should send a password reset email", async () => {
      mocks.sendPasswordReset.mockResolvedValue({
        messageId: "reset-message",
      });

      const result = await sendPasswordReset(
        " USER@EXAMPLE.COM ",
        "https://example.com/reset?token=123",
        env,
      );

      expect(result).toEqual({
        success: true,
      });

      expect(mocks.createMailer).toHaveBeenCalledWith(env);

      expect(mocks.sendPasswordReset).toHaveBeenCalledWith(
        "user@example.com",
        "https://example.com/reset?token=123",
      );
    });
  });

  // sendWelcomeEmail
  describe("sendWelcomeEmail", () => {
    it("should send a welcome email with the provided name", async () => {
      mocks.sendWelcome.mockResolvedValue({
        messageId: "welcome-message",
      });

      const result = await sendWelcomeEmail(
        " USER@EXAMPLE.COM ",
        "Chandra",
        env,
      );

      expect(result).toEqual({
        success: true,
      });

      expect(mocks.createMailer).toHaveBeenCalledWith(env);

      expect(mocks.sendWelcome).toHaveBeenCalledWith(
        "user@example.com",
        "Chandra",
      );
    });

    it("should use User when the name is null", async () => {
      await sendWelcomeEmail("USER@EXAMPLE.COM", null, env);

      expect(mocks.sendWelcome).toHaveBeenCalledWith(
        "user@example.com",
        "User",
      );
    });

    it("should use User when the name is undefined", async () => {
      await sendWelcomeEmail("USER@EXAMPLE.COM", undefined, env);

      expect(mocks.sendWelcome).toHaveBeenCalledWith(
        "user@example.com",
        "User",
      );
    });
  });
});
