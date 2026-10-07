import { db } from "../../services";
import { getImageKit, imageKitFolder } from "../../lib/imagekit";
import { invalidateStudentCaches } from "../students/student.service";

type UploadedFile = Express.Multer.File;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function uploadToImageKit(
  file: UploadedFile,
  folder: string,
  prefix: string,
): Promise<string> {
  const imagekit = getImageKit();

  const safeName = sanitizeFileName(file.originalname || "file");
  const fileName = `${prefix}-${Date.now()}-${safeName}`;

  const result = await imagekit.upload({
    file: file.buffer,
    fileName,
    folder: imageKitFolder(folder),
    useUniqueFileName: true,
  });

  return result.url;
}

export async function uploadStudentResume(userId: string, file: UploadedFile) {
  const student = await db.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const resumeUrl = await uploadToImageKit(file, "resume", "resume");

  await db.studentProfile.update({
    where: { userId },
    data: { resumeUrl },
  });

  await invalidateStudentCaches(userId, student.id);

  return { resumeUrl };
}

export async function uploadStudentPhoto(userId: string, file: UploadedFile) {
  const image = await uploadToImageKit(file, "photos", "photo");

  await db.user.update({
    where: { id: userId },
    data: { image },
  });

  await invalidateStudentCaches(userId);

  return { image };
}

export async function uploadCompanyLogo(userId: string, file: UploadedFile) {
  const recruiter = await db.recruiterProfile.findUnique({
    where: { userId },
    select: { id: true, companyId: true },
  });

  if (!recruiter) {
    throw new Error("Recruiter company not found");
  }

  const logoUrl = await uploadToImageKit(file, "logos", "logo");

  await db.company.update({
    where: { id: recruiter.companyId },
    data: { logoUrl },
  });

  return { logoUrl };
}
