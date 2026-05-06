import express from "express";
import { generateInterview } from "../controllers/interview.controller.js";
import { getInterviewHistory } from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { evaluateAnswer } from "../controllers/interview.controller.js";
const router = express.Router();

router.post("/generate", isAuthenticated, generateInterview);

router.post("/evaluate", evaluateAnswer);
router.get("/history", isAuthenticated, getInterviewHistory);

export default router;
