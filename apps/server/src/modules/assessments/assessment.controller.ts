import type { Request, Response } from "express";
import { z } from "zod";





import { getAssessmentInvite, submitAssessmentInvite } from "./assessment.service";

export async function getAssessmentInviteController(req: Request, res: Response) {
  try {
    const token = req.params.token;
    if (!token || Array.isArray(token)) return res.status(400).json({ success: false, message: "Invalid assessment link" });
    return res.json({ success: true, data: await getAssessmentInvite(token) });
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to load assessment" });
  }
}

export async function submitAssessmentInviteController(req: Request, res: Response) {
  try {
    const token = req.params.token;
    if (!token || Array.isArray(token)) return res.status(400).json({ success: false, message: "Invalid assessment link" });
    const parsed = z.object({ answers: z.array(z.number().int().min(0).max(3)).length(10) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: "Submit one answer for each of the 10 questions" });
    return res.json({ success: true, data: await submitAssessmentInvite(token, parsed.data.answers) });
  } catch (error) {
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Unable to submit assessment" });
  }
}
