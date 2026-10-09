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

  async function sendAssessmentLink(email: string, name: string, jobTitle: string, companyName: string, assessmentUrl: string) {
    return transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: `Assessment invitation: ${jobTitle}`,
      text: `Hi ${name},\n\nYou have been shortlisted for ${jobTitle} at ${companyName}. Please complete the 10-question assessment using this secure link:\n${assessmentUrl}\n\nThis link expires in 7 days.`,
      html: `<p>Hi ${escapeHtml(name)},</p><p>You have been shortlisted for <strong>${escapeHtml(jobTitle)}</strong> at ${escapeHtml(companyName)}.</p><p>Please complete the 10-question assessment using the secure link below. It expires in 7 days.</p><p><a href="${escapeHtml(assessmentUrl)}">Start assessment</a></p>`,
    });
  }

  async function sendOfferLetter(email: string, name: string, companyName: string, role: string, ctc: string, baseSalary: string, variableBonus: string, joiningDate: string, pdf: Buffer) {
    const filenamePart = (value: string) => value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    return transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: `Offer letter: ${role} at ${companyName}`,
      text: `Hi ${name},\n\n${companyName} is pleased to offer you the position of ${role}. Total compensation: ${ctc}. Base salary: ${baseSalary}. Variable bonus: ${variableBonus}. Expected joining date: ${joiningDate}. The offer letter PDF is attached.`,
      html: `<p>Hi ${escapeHtml(name)},</p><p>${escapeHtml(companyName)} is pleased to offer you the position of <strong>${escapeHtml(role)}</strong>.</p><p>Total compensation: ${escapeHtml(ctc)}<br>Base salary: ${escapeHtml(baseSalary)}<br>Variable bonus: ${escapeHtml(variableBonus)}<br>Expected joining date: ${escapeHtml(joiningDate)}</p><p>Your offer letter PDF is attached.</p>`,
      attachments: [{ filename: `Offer-Letter-${filenamePart(companyName)}-${filenamePart(name)}-${filenamePart(role)}.pdf`, content: pdf, contentType: "application/pdf" }],
    });
  }

  function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
  }

  return {
    sendVerificationOTP,
    sendPasswordReset,
    sendWelcome,
    sendAssessmentLink,
    sendOfferLetter,
    verifyConnection,
  };
}
