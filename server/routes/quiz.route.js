import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  generateQuiz,
  getMyQuizAttempts,
} from "../controllers/quiz.controller.js";
import { submitQuiz } from "../controllers/quiz.controller.js";
const router = express.Router();

router.get("/generate/:courseId", isAuthenticated, generateQuiz);

router.post("/submit", isAuthenticated, submitQuiz);
router.get("/my-attempts", isAuthenticated, getMyQuizAttempts);

export default router;
