import nodemailer from "nodemailer";

import {
  verificationOtpTemplate,
  passwordResetTemplate,
  welcomeTemplate,
} from "./template/index";

type MailerEnv = {
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
};

export function createMailer(env: MailerEnv) {
  if (!env.SMTP_USER) {
    throw new Error("SMTP_USER is missing");
  }

  if (!env.SMTP_PASSWORD) {
    throw new Error("SMTP_PASSWORD is missing");
  }

  if (!env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  async function verifyConnection() {
    try {
      await transporter.verify();
      console.log("✅ Gmail SMTP connection successful");
    } catch (error) {
      console.error("❌ Gmail SMTP connection failed:", error);
      throw error;
    }
  }

  async function sendVerificationOTP(email: string, otp: string) {
    const template = verificationOtpTemplate(otp);

    console.log(`📧 Sending signup OTP to ${email}`);

    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      ...template,
    });

    console.log(`✅ OTP email sent: ${info.messageId}`);

    return info;
  }

  async function sendPasswordReset(email: string, resetUrl: string) {
    const template = passwordResetTemplate(resetUrl);

    return transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      ...template,
    });
  }

  async function sendWelcome(email: string, name: string) {
    const template = welcomeTemplate(name);

    return transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      ...template,
    });
  }

  return {
    sendVerificationOTP,
    sendPasswordReset,
    sendWelcome,
    verifyConnection,
  };
}
