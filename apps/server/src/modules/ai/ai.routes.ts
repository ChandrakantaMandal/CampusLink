import { Router } from "express";
import { chatStreamController } from "./ai.controller";

const router = Router();

// Chat streaming endpoints
router.post("/chat", chatStreamController);
router.post("/", chatStreamController);

export default router;
