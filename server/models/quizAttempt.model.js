import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, //only user id niteche
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  quiz: [
    {
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
    },
  ],
  score: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
