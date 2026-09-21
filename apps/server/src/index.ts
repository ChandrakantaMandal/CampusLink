import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import {
  pipeUIMessageStreamToResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
  convertToModelMessages,
  wrapLanguageModel,
} from "ai";
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

const app = express();

app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

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


app.post("/ai", async (req, res) => {
  const { messages = [] } = (req.body || {}) as { messages: UIMessage[] };
  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });
  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });
  pipeUIMessageStreamToResponse({
    response: res,
    stream: toUIMessageStream({ stream: result.stream }),
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
