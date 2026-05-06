import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    topic: String,
    level: String,
    questions: Array,
  },
  { timestamps: true },
);

export const Interview = mongoose.model("Interview", interviewSchema);
