import { getStudentByUserId } from "../students/student.service";
import { getJobById } from "./job.service";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

type StudentForAI = {
  id: string;
  resumeText: string | null;
  skills: Array<{
    skill: {
      name: string;
    };
  }>;
  projects: Array<{
    title: string;
  }>;
};

type JobForAI = {
  id: string;
  title: string;
  description: string | null;
  company?: {
    name: string;
  } | null;
  skills: Array<{
    required: boolean;
    skill: {
      name: string;
    };
  }>;
};

/* =========================
   RESUME HELPERS
========================= */

const RESUME_SECTION_HEADERS = new Set([
  "Skills",
  "Projects",
  "Education",
  "Certifications",
  "Strengths",
  "Weaknesses",
  "Recommendations",
]);

/**
 * Extract the skill list from the structured text persisted by the student
 * profile's resume analysis (`buildResumeText` in the web app). Only that
 * exact format is accepted; free-form resume text yields nothing.
 */
function extractSkillsFromResumeText(
  text: string | null | undefined,
): string[] {
  if (!text) return [];

  const lines = text.split("\n");

  if (lines[0]?.trim() !== "Resume Analysis") return [];

  const skills: string[] = [];
  let inSkills = false;

  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (!line) continue;

    const header = line.replace(/:$/, "");
    if (RESUME_SECTION_HEADERS.has(header)) {
      inSkills = header === "Skills";
      continue;
    }

    if (inSkills) skills.push(line);
  }

  return skills;
}

/**
 * DB skills plus any skills recovered from the persisted resume analysis,
 * de-duplicated case-insensitively.
 */
function resolveStudentSkills(
  student: StudentForAI,
): string[] {
  const dbSkills = student.skills.map(
    (item) => item.skill.name,
  );

  const seen = new Set<string>();
  const merged: string[] = [];

  for (const name of [
    ...dbSkills,
    ...extractSkillsFromResumeText(student.resumeText),
  ]) {
    const key = name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(name.trim());
  }

  return merged;
}

/* =========================
   MATCH SINGLE JOB
========================= */

export async function matchStudentWithJob(
  userId: string,
  jobId: string,
) {
  const [studentResult, jobResult] =
    await Promise.all([
      getStudentByUserId(userId),
      getJobById(jobId),
    ]);

  if (!studentResult) {
    throw new Error(
      "Student profile not found",
    );
  }

  if (!jobResult) {
    throw new Error(
      "Job not found",
    );
  }

  const student =
    studentResult as StudentForAI;

  const job =
    jobResult as JobForAI;

  const studentSkills =
    resolveStudentSkills(student);

  const projects =
    student.projects.map(
      (project) => project.title,
    );

  const requiredSkills =
    job.skills
      .filter(
        (item) => item.required,
      )
      .map(
        (item) => item.skill.name,
      );

  const response = await fetch(
    `${AI_SERVICE_URL}/match/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        student: {
          student_id: student.id,
          skills: studentSkills,
          projects,
          resume_text:
            student.resumeText ?? "",
        },

        job: {
          job_id: job.id,
          title: job.title,
          company:
            job.company?.name,
          required_skills:
            requiredSkills,
          description:
            job.description ?? "",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `AI service failed: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}

/* =========================
   SKILL GAP
========================= */

export async function analyzeStudentSkillGap(
  userId: string,
  jobId: string,
) {
  const [studentResult, jobResult] =
    await Promise.all([
      getStudentByUserId(userId),
      getJobById(jobId),
    ]);

  if (!studentResult) {
    throw new Error(
      "Student profile not found",
    );
  }

  if (!jobResult) {
    throw new Error(
      "Job not found",
    );
  }

  const student =
    studentResult as StudentForAI;

  const job =
    jobResult as JobForAI;

  const studentSkills =
    resolveStudentSkills(student);

  const requiredSkills =
    job.skills
      .filter(
        (item) => item.required,
      )
      .map(
        (item) => item.skill.name,
      );

  const response = await fetch(
    `${AI_SERVICE_URL}/skill-gap/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        student: {
          student_id: student.id,
          skills: studentSkills,
          projects: [],
          resume_text:
            student.resumeText ?? "",
        },

        job: {
          job_id: job.id,
          title: job.title,
          company:
            job.company?.name,
          required_skills:
            requiredSkills,
          description:
            job.description ?? "",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `AI skill gap service failed: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}

/* =========================
   MATCH MULTIPLE JOBS
========================= */

export async function matchStudentWithJobs(
  userId: string,
  jobs: JobForAI[],
) {
  const studentResult =
    await getStudentByUserId(userId);

  if (!studentResult) {
    throw new Error(
      "Student profile not found",
    );
  }

  const student =
    studentResult as StudentForAI;

  const studentSkills =
    resolveStudentSkills(student);

  const projects =
    student.projects.map(
      (project) => project.title,
    );

  const results =
    await Promise.all(
      jobs.map(async (job) => {
        try {
          const requiredSkills =
            job.skills
              .filter(
                (item) =>
                  item.required,
              )
              .map(
                (item) =>
                  item.skill.name,
              );

          const response =
            await fetch(
              `${AI_SERVICE_URL}/match/`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  student: {
                    student_id:
                      student.id,
                    skills:
                      studentSkills,
                    projects,
                    resume_text:
                      student.resumeText ??
                      "",
                  },

                  job: {
                    job_id: job.id,
                    title:
                      job.title,
                    company:
                      job.company
                        ?.name,
                    required_skills:
                      requiredSkills,
                    description:
                      job.description ??
                      "",
                  },
                }),
              },
            );

          if (!response.ok) {
            return {
              jobId: job.id,
              match: null,
            };
          }

          const result =
            await response.json();

          return {
            jobId: job.id,
            match:
              (result as any).data ??
              result,
          };
        } catch {
          return {
            jobId: job.id,
            match: null,
          };
        }
      }),
    );

  return results;
}