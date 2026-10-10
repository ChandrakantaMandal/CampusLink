type StudentData = {
  cgpa: number | null;
  resumeText: string | null;
  skills: Array<{
    level: string | null;
    years: number | null;
    skill: {
      name: string;
    };
  }>;

  projects: Array<{
    title: string;
    description: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
  }>;

  assessments: Array<{
    percentage: number;
    passed: boolean;
  }>;

  resumes: Array<{
    parsedText: string | null;
    fileUrl: string;
  }>;
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(Math.max(value, min), max);
}

/* =========================================================
   1. TECHNICAL SKILLS - 30%
   ========================================================= */

function calculateTechnicalScore(student: StudentData): number {
  const skills = student.skills ?? [];

  if (skills.length === 0) {
    return 0;
  }

  const skillPoints = skills.reduce((total, studentSkill) => {
    let points = 5;

    const level = studentSkill.level?.toLowerCase() ?? "";

    if (level.includes("beginner")) {
      points = 5;
    } else if (level.includes("intermediate")) {
      points = 7;
    } else if (level.includes("advanced") || level.includes("expert")) {
      points = 10;
    }

    const years = studentSkill.years ?? 0;

    if (years >= 2) {
      points += 2;
    } else if (years >= 1) {
      points += 1;
    }

    return total + Math.min(points, 10);
  }, 0);

  const maximumScore = skills.length * 10;

  return clamp((skillPoints / maximumScore) * 100);
}

/* =========================================================
   2. MOCK ASSESSMENT - 20%
   ========================================================= */

function calculateAssessmentScore(student: StudentData): number {
  const assessments = student.assessments ?? [];

  if (assessments.length === 0) {
    return 0;
  }

  const totalPercentage = assessments.reduce(
    (total, assessment) => total + assessment.percentage,
    0,
  );

  const averagePercentage = totalPercentage / assessments.length;

  return clamp(averagePercentage);
}

/* =========================================================
   3. PROJECTS & LIVE DEMOS - 20%
   ========================================================= */

function calculateProjectScore(student: StudentData): number {
  const projects = student.projects ?? [];

  if (projects.length === 0) {
    return 0;
  }

  let totalScore = 0;

  for (const project of projects) {
    let projectScore = 0;

    if (project.title?.trim()) {
      projectScore += 10;
    }

    if (project.description?.trim()) {
      projectScore += 20;
    }

    if (project.githubUrl?.trim()) {
      projectScore += 35;
    }

    if (project.liveUrl?.trim()) {
      projectScore += 35;
    }

    totalScore += projectScore;
  }

  const maximumScore = projects.length * 100;

  return clamp((totalScore / maximumScore) * 100);
}

/* =========================================================
   4. ACADEMICS / CGPA - 20%
   ========================================================= */

function calculateAcademicScore(student: StudentData): number {
  if (student.cgpa === null || student.cgpa === undefined) {
    return 0;
  }

  return clamp((student.cgpa / 10) * 100);
}

/* =========================================================
   5. ATS RESUME QUALITY - 10%
   ========================================================= */

function calculateResumeScore(student: StudentData): number {
  const text = student.resumeText?.trim() ?? "";

  if (!text) {
    return 0;
  }

  let score = 40;

  // Resume length
  if (text.length >= 500) {
    score += 15;
  }

  if (text.length >= 1000) {
    score += 15;
  }

  // Important ATS keywords
  const keywords = [
    "skills",
    "education",
    "experience",
    "project",
    "github",
    "python",
    "machine learning",
    "sql",
  ];

  const lowerText = text.toLowerCase();

  const matchedKeywords = keywords.filter((keyword) =>
    lowerText.includes(keyword),
  );

  score += matchedKeywords.length * 2;

  return clamp(score);
}

/* =========================================================
   FINAL READINESS CALCULATION
   ========================================================= */

export function calculateReadiness(student: StudentData) {
  /*
   * 30% Technical Skills
   * 20% Mock Assessment
   * 20% Projects
   * 20% Academics
   * 10% ATS Resume
   */

  const technicalScore = calculateTechnicalScore(student);

  const assessmentScore = calculateAssessmentScore(student);

  const projectScore = calculateProjectScore(student);

  const academicScore = calculateAcademicScore(student);

  const resumeScore = calculateResumeScore(student);

  const roundedBreakdown = {
    technical: Math.round(technicalScore),
    assessment: Math.round(assessmentScore),
    projects: Math.round(projectScore),
    academics: Math.round(academicScore),
    resume: Math.round(resumeScore),
  };

  const overallScore = Math.round(
    roundedBreakdown.technical * 0.3 +
      roundedBreakdown.assessment * 0.2 +
      roundedBreakdown.projects * 0.2 +
      roundedBreakdown.academics * 0.2 +
      roundedBreakdown.resume * 0.1,
  );

  let readinessLabel = "Needs Improvement";

  if (overallScore >= 85) {
    readinessLabel = "Tier-1 Ready";
  } else if (overallScore >= 70) {
    readinessLabel = "Placement Ready";
  } else if (overallScore >= 50) {
    readinessLabel = "Almost Ready";
  }

  return {
    overallScore,

    readinessLabel,

    breakdown: roundedBreakdown,

    weights: {
      technical: 30,
      assessment: 20,
      projects: 20,
      academics: 20,
      resume: 10,
    },

    explanation:
      "Readiness score is calculated using " +
      "Technical Skills (30%), " +
      "Mock Assessments (20%), " +
      "Projects & Live Demos (20%), " +
      "Academics / CGPA (20%), and " +
      "ATS Resume Quality (10%).",
  };
}
