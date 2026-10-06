
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

import { ENV } from "./env.server";
import { auth } from "./services";

import { globalLimiter } from "./middleware/rateLimiters";
import { errorMiddleware } from "./middleware/error.middleware";

import studentRoutes from "./modules/students/student.routes";
import companyRoutes from "./modules/companies/company.routes";
import jobRoutes from "./modules/jobs/job.routes";
import applicationRoutes from "./modules/applications/application.routes";
import skillRoutes from "./modules/skills/skill.routes";
import educationRoutes from "./modules/education/education.routes";
import projectRoutes from "./modules/projects/project.routes";
import assessmentRoutes from "./modules/assessments/assessment.routes";
import adminRoutes from "./modules/admin/admin.routes";
import aiRoutes from "./modules/ai/ai.routes";
import recruiterRoutes from "./modules/recruiter/recruiter.routes";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost/127.0.0.1 port, the configured CORS_ORIGIN, or server-to-server requests
      if (
        !origin ||
        origin === ENV.CORS_ORIGIN ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-gemini-api-key"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

// AI Routes mounted universally on both /api/ai and /ai before rate-limiting
app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

app.use(globalLimiter);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

export default app;
