import "varlock/auto-load";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  SkillLevel,
} from "./generated/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("👤 Setting up student profile...");

  // Find the existing STUDENT account.
  const user = await prisma.user.findUnique({
  where: {
    email: "kalakanhuswain246@gmail.com",
  },
});

  if (!user) {
    throw new Error("No STUDENT user found.");
  }

  console.log(`✅ Student user found: ${user.email}`);

  // Create/update StudentProfile for the existing user.
  const student = await prisma.studentProfile.upsert({
    where: {
      userId: user.id,
    },
    update: {
      college: "Ajay Binay Institute of Technology",
      degree: "B.Tech",
      branch: "Computer Science and Engineering",
      department: "Computer Science",
      graduationYear: 2027,
      cgpa: 8.41,
      backlogs: 0,
      targetRole: "AI/ML Engineer",
      bio: "Computer Science student interested in AI, Machine Learning and software development.",
      isPublic: true,
    },
    create: {
      userId: user.id,
      college: "Ajay Binay Institute of Technology",
      degree: "B.Tech",
      branch: "Computer Science and Engineering",
      department: "Computer Science",
      graduationYear: 2027,
      cgpa: 8.41,
      backlogs: 0,
      targetRole: "AI/ML Engineer",
      bio: "Computer Science student interested in AI, Machine Learning and software development.",
      isPublic: true,
    },
  });

  console.log(`✅ StudentProfile ready: ${student.id}`);

  // Skills to attach to the student.
  const studentSkills = [
    "Python",
    "Machine Learning",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "SQL",
    "Flask",
    "FastAPI",
    "React",
    "Git",
    "GitHub",
    "Docker",
  ];

  for (const skillName of studentSkills) {
    const skill = await prisma.skill.findUnique({
      where: {
        name: skillName,
      },
    });

    if (!skill) {
      console.log(`⚠️ Skill not found: ${skillName}`);
      continue;
    }

    await prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: student.id,
          skillId: skill.id,
        },
      },
      update: {
        level: SkillLevel.INTERMEDIATE,
      },
      create: {
        studentId: student.id,
        skillId: skill.id,
        level: SkillLevel.INTERMEDIATE,
        source: "profile",
      },
    });
  }

  console.log("✅ Student skills ready");

  // Create useful projects if they don't already exist.
  const projects = [
    {
      title: "SmartReco",
      description:
        "AI-powered recommendation application using React, Flask and machine learning.",
      githubUrl: "https://github.com/",
      skills: ["Python", "Machine Learning", "Flask", "React"],
    },
    {
      title: "CrowdShield",
      description:
        "Computer vision based crowd monitoring system using YOLO and FastAPI.",
      githubUrl: "https://github.com/",
      skills: ["Python", "FastAPI", "Machine Learning", "Docker"],
    },
  ];

  for (const projectData of projects) {
    let project = await prisma.project.findFirst({
      where: {
        studentId: student.id,
        title: projectData.title,
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          studentId: student.id,
          title: projectData.title,
          description: projectData.description,
          githubUrl: projectData.githubUrl,
        },
      });
    }

    for (const skillName of projectData.skills) {
      const skill = await prisma.skill.findUnique({
        where: {
          name: skillName,
        },
      });

      if (!skill) continue;

      await prisma.projectSkill.upsert({
        where: {
          projectId_skillId: {
            projectId: project.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: {
          projectId: project.id,
          skillId: skill.id,
        },
      });
    }
  }

  console.log("✅ Projects ready");
  console.log("🎉 Student setup completed!");
}

main()
  .catch((error) => {
    console.error("❌ Student setup failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });