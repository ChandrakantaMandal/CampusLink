import { Router } from "express";
import { chatStreamController } from "./ai.controller";

const router = Router();

// Chat streaming endpoint
router.post("/chat", chatStreamController);

export default router;
