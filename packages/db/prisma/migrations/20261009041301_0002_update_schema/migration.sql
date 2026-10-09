/*
  Warnings:

  - You are about to drop the `recuiter_profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CompanyTier" AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'NOT_VERIFIED');

-- CreateEnum
CREATE TYPE "DriveType" AS ENUM ('IN_PERSON', 'VIRTUAL', 'HYBRID');

-- CreateEnum
CREATE TYPE "DriveStatus" AS ENUM ('DRAFT', 'OPEN', 'ONGOING', 'APPLICATIONS_CLOSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'ATTENDED', 'SHORTLISTED', 'REJECTED', 'ABSENT');

-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('VIRTUAL', 'IN_PERSON', 'HYBRID');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'APPLICATIONS_OPEN', 'APPLICATIONS_CLOSED', 'INTERVIEWING', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPLICATION', 'AI_MATCH', 'INTERVIEW', 'CONFLICT', 'OFFER', 'SYSTEM', 'DRIVE');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'SENT', 'PENDING_ACCEPTANCE', 'ACCEPTED', 'DECLINED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DocumentVerificationStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'ACTION_REQUIRED');

-- CreateEnum
CREATE TYPE "JoiningStatus" AS ENUM ('CONFIRMED', 'AWAITING_ONBOARDING', 'JOINED', 'DECLINED');

-- AlterEnum
ALTER TYPE "AIAnalysisType" ADD VALUE 'INTERVIEW_PREP';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "ApplicationStatus" ADD VALUE 'OFFER_EXTENDED';
ALTER TYPE "ApplicationStatus" ADD VALUE 'ACCEPTED';

-- DropForeignKey
ALTER TABLE "job" DROP CONSTRAINT "job_recruiterId_fkey";

-- DropForeignKey
ALTER TABLE "recuiter_profile" DROP CONSTRAINT "recuiter_profile_companyId_fkey";

-- DropForeignKey
ALTER TABLE "recuiter_profile" DROP CONSTRAINT "recuiter_profile_userId_fkey";

-- AlterTable
ALTER TABLE "admin_profile" ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "application" ADD COLUMN     "coverLetter" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "resumeUrl" TEXT;

-- AlterTable
ALTER TABLE "assessment" ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "passingScore" DOUBLE PRECISION,
ADD COLUMN     "totalQuestions" INTEGER;

-- AlterTable
ALTER TABLE "assessment_result" ADD COLUMN     "answers" JSONB;

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tier" "CompanyTier" NOT NULL DEFAULT 'TIER_3',
ADD COLUMN     "verifiedStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED';

-- AlterTable
ALTER TABLE "education" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "allowedBranches" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "applicationDeadline" TIMESTAMP(3),
ADD COLUMN     "ctc" TEXT,
ADD COLUMN     "driveId" TEXT,
ADD COLUMN     "openPositions" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'APPLICATIONS_OPEN',
ADD COLUMN     "workMode" TEXT;

-- AlterTable
ALTER TABLE "match_result" ADD COLUMN     "gaps" JSONB,
ADD COLUMN     "positiveSignals" JSONB;

-- AlterTable
ALTER TABLE "readiness_result" ADD COLUMN     "breakdown" JSONB,
ADD COLUMN     "communicationScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "student_profile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "department" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "hackerrankUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "leetcodeUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "otherWebsiteUrl" TEXT,
ADD COLUMN     "readinessLabel" TEXT,
ADD COLUMN     "readinessScore" DOUBLE PRECISION,
ADD COLUMN     "rollNo" TEXT,
ADD COLUMN     "targetRole" TEXT;

-- DropTable
DROP TABLE "recuiter_profile";

-- CreateTable
CREATE TABLE "system_setting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruiter_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "designation" TEXT,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "isLeadRecruiter" BOOLEAN NOT NULL DEFAULT false,
    "notificationPrefs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruiter_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_drive" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "tier" "CompanyTier" NOT NULL DEFAULT 'TIER_2',
    "type" "DriveType" NOT NULL DEFAULT 'IN_PERSON',
    "status" "DriveStatus" NOT NULL DEFAULT 'OPEN',
    "salary" TEXT,
    "minCgpa" DOUBLE PRECISION,
    "backlogsAllowed" INTEGER NOT NULL DEFAULT 0,
    "batchEligibility" TEXT,
    "allowedBranches" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rounds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "openings" INTEGER NOT NULL DEFAULT 1,
    "jobIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "driveDate" TIMESTAMP(3) NOT NULL,
    "driveTime" TEXT,
    "venue" TEXT,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placement_drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drive_registration" (
    "id" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drive_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "recruiterId" TEXT,
    "jobId" TEXT,
    "applicationId" TEXT,
    "driveId" TEXT,
    "roundName" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "durationMinutes" INTEGER,
    "mode" "InterviewMode" NOT NULL DEFAULT 'VIRTUAL',
    "venue" TEXT,
    "meetingLink" TEXT,
    "interviewerName" TEXT,
    "interviewerEmail" TEXT,
    "interviewerPanel" TEXT,
    "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
    "feedback" TEXT,
    "rating" DOUBLE PRECISION,
    "hasConflict" BOOLEAN NOT NULL DEFAULT false,
    "conflictDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_round" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notification" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruiter_notification" (
    "id" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruiter_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "jobId" TEXT,
    "applicationId" TEXT,
    "role" TEXT NOT NULL,
    "ctc" TEXT NOT NULL,
    "baseSalary" DOUBLE PRECISION,
    "variableBonus" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "offerDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseDeadline" TIMESTAMP(3),
    "joiningDate" TIMESTAMP(3),
    "offerLetterUrl" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'SENT',
    "documentStatus" "DocumentVerificationStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "documentsVerified" BOOLEAN NOT NULL DEFAULT false,
    "joiningStatus" "JoiningStatus" NOT NULL DEFAULT 'AWAITING_ONBOARDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingOrg" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_resume" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" TEXT,
    "fileUrl" TEXT NOT NULL,
    "parsedText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_userId_idx" ON "audit_log"("userId");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_entityType_idx" ON "audit_log"("entityType");

-- CreateIndex
CREATE INDEX "audit_log_createdAt_idx" ON "audit_log"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "recruiter_profile_userId_key" ON "recruiter_profile"("userId");

-- CreateIndex
CREATE INDEX "recruiter_profile_companyId_idx" ON "recruiter_profile"("companyId");

-- CreateIndex
CREATE INDEX "placement_drive_companyId_idx" ON "placement_drive"("companyId");

-- CreateIndex
CREATE INDEX "placement_drive_status_idx" ON "placement_drive"("status");

-- CreateIndex
CREATE INDEX "placement_drive_driveDate_idx" ON "placement_drive"("driveDate");

-- CreateIndex
CREATE INDEX "placement_drive_tier_idx" ON "placement_drive"("tier");

-- CreateIndex
CREATE INDEX "drive_registration_driveId_idx" ON "drive_registration"("driveId");

-- CreateIndex
CREATE INDEX "drive_registration_studentId_idx" ON "drive_registration"("studentId");

-- CreateIndex
CREATE INDEX "drive_registration_status_idx" ON "drive_registration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "drive_registration_driveId_studentId_key" ON "drive_registration"("driveId", "studentId");

-- CreateIndex
CREATE INDEX "interview_studentId_idx" ON "interview"("studentId");

-- CreateIndex
CREATE INDEX "interview_recruiterId_idx" ON "interview"("recruiterId");

-- CreateIndex
CREATE INDEX "interview_jobId_idx" ON "interview"("jobId");

-- CreateIndex
CREATE INDEX "interview_applicationId_idx" ON "interview"("applicationId");

-- CreateIndex
CREATE INDEX "interview_driveId_idx" ON "interview"("driveId");

-- CreateIndex
CREATE INDEX "interview_status_idx" ON "interview"("status");

-- CreateIndex
CREATE INDEX "interview_scheduledDate_idx" ON "interview"("scheduledDate");

-- CreateIndex
CREATE INDEX "job_round_jobId_idx" ON "job_round"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "job_round_jobId_roundNumber_key" ON "job_round"("jobId", "roundNumber");

-- CreateIndex
CREATE INDEX "user_notification_userId_idx" ON "user_notification"("userId");

-- CreateIndex
CREATE INDEX "user_notification_isRead_idx" ON "user_notification"("isRead");

-- CreateIndex
CREATE INDEX "user_notification_type_idx" ON "user_notification"("type");

-- CreateIndex
CREATE INDEX "user_notification_createdAt_idx" ON "user_notification"("createdAt");

-- CreateIndex
CREATE INDEX "admin_notification_adminId_idx" ON "admin_notification"("adminId");

-- CreateIndex
CREATE INDEX "admin_notification_isRead_idx" ON "admin_notification"("isRead");

-- CreateIndex
CREATE INDEX "admin_notification_type_idx" ON "admin_notification"("type");

-- CreateIndex
CREATE INDEX "admin_notification_createdAt_idx" ON "admin_notification"("createdAt");

-- CreateIndex
CREATE INDEX "recruiter_notification_recruiterId_idx" ON "recruiter_notification"("recruiterId");

-- CreateIndex
CREATE INDEX "recruiter_notification_isRead_idx" ON "recruiter_notification"("isRead");

-- CreateIndex
CREATE INDEX "recruiter_notification_type_idx" ON "recruiter_notification"("type");

-- CreateIndex
CREATE INDEX "recruiter_notification_createdAt_idx" ON "recruiter_notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "offer_applicationId_key" ON "offer"("applicationId");

-- CreateIndex
CREATE INDEX "offer_studentId_idx" ON "offer"("studentId");

-- CreateIndex
CREATE INDEX "offer_companyId_idx" ON "offer"("companyId");

-- CreateIndex
CREATE INDEX "offer_jobId_idx" ON "offer"("jobId");

-- CreateIndex
CREATE INDEX "offer_status_idx" ON "offer"("status");

-- CreateIndex
CREATE INDEX "offer_documentStatus_idx" ON "offer"("documentStatus");

-- CreateIndex
CREATE INDEX "certification_studentId_idx" ON "certification"("studentId");

-- CreateIndex
CREATE INDEX "student_resume_studentId_idx" ON "student_resume"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "company_slug_key" ON "company"("slug");

-- CreateIndex
CREATE INDEX "company_tier_idx" ON "company"("tier");

-- CreateIndex
CREATE INDEX "company_verifiedStatus_idx" ON "company"("verifiedStatus");

-- CreateIndex
CREATE INDEX "job_driveId_idx" ON "job"("driveId");

-- CreateIndex
CREATE INDEX "job_status_idx" ON "job"("status");

-- CreateIndex
CREATE INDEX "project_skill_projectId_idx" ON "project_skill"("projectId");

-- CreateIndex
CREATE INDEX "project_skill_skillId_idx" ON "project_skill"("skillId");

-- CreateIndex
CREATE INDEX "skill_type_idx" ON "skill"("type");

-- CreateIndex
CREATE INDEX "student_profile_department_idx" ON "student_profile"("department");

-- CreateIndex
CREATE INDEX "student_profile_cgpa_idx" ON "student_profile"("cgpa");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiter_profile" ADD CONSTRAINT "recruiter_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiter_profile" ADD CONSTRAINT "recruiter_profile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_drive" ADD CONSTRAINT "placement_drive_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_registration" ADD CONSTRAINT "drive_registration_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "placement_drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_registration" ADD CONSTRAINT "drive_registration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview" ADD CONSTRAINT "interview_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "placement_drive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "placement_drive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_round" ADD CONSTRAINT "job_round_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notification" ADD CONSTRAINT "admin_notification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiter_notification" ADD CONSTRAINT "recruiter_notification_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification" ADD CONSTRAINT "certification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_resume" ADD CONSTRAINT "student_resume_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
