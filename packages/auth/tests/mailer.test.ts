import { describe, expect, it, vi } from "vitest";

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(),
      verify: vi.fn(),
    })),
  },
}));

import { createMailer } from "../src/sendMail/mailer";

describe("Mailer", () => {
  const validConfig = {
    SMTP_USER: "test@example.com",
    SMTP_PASSWORD: "test-password",
    EMAIL_FROM: "CampusLink <test@example.com>",
  };

  it("should create a mailer with valid configuration", () => {
    const mailer = createMailer(validConfig);

    expect(mailer).toBeDefined();
    expect(mailer.sendVerificationOTP).toBeDefined();
    expect(mailer.sendPasswordReset).toBeDefined();
    expect(mailer.sendWelcome).toBeDefined();
    expect(mailer.verifyConnection).toBeDefined();
  });

  it("should reject missing SMTP_USER", () => {
    expect(() =>
      createMailer({
        ...validConfig,
        SMTP_USER: "",
      }),
    ).toThrow("SMTP_USER is missing");
  });

  it("should reject missing SMTP_PASSWORD", () => {
    expect(() =>
      createMailer({
        ...validConfig,
        SMTP_PASSWORD: "",
      }),
    ).toThrow("SMTP_PASSWORD is missing");
  });

  it("should reject missing EMAIL_FROM", () => {
    expect(() =>
      createMailer({
        ...validConfig,
        EMAIL_FROM: "",
      }),
    ).toThrow("EMAIL_FROM is missing");
  });
});
