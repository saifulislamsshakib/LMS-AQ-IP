import axios from "axios";
import { Course } from "../models/course.model.js";
import { QuizAttempt } from "../models/quizAttempt.model.js";
export const generateQuiz = async (req, res) => {
  try {
    // console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const content = course.lectures.map((lec) => lec.lectureTitle).join(", ");

    const prompt = `
Generate 5 DIFFERENT multiple choice questions every time.

Do NOT repeat previous questions.

Course Title: ${course.courseTitle}
Lectures: ${content}

Return JSON format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
]
`;

    const response = await axios.post(
      //Google AI server, API version + models path, gemini version, method..generateContent, apikey
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          //actual formt of requiating AI
          {
            parts: [{ text: prompt }],
          },
        ],
      },
    );
    //safe vabe json akare ber korte
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || ""; //API response, forstoutput r actual text.  //text akare ai response
    const jsonMatch = text.match(/\[[\s\S]*\]/); //json e convert korchi
    if (!jsonMatch) {
      // console.log("RAW AI:", text);

      return res.json({
        //default sample jate app crushed na kore
        quiz: [
          {
            question: "Fallback: What is HTML?",
            options: ["Markup", "Style", "Logic", "Database"],
            answer: "Markup",
          },
        ],
      });
    }
    const quiz = JSON.parse(jsonMatch[0]);
    res.status(200).json({ quiz });
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { courseId, quiz, answers } = req.body;
    const userId = req.id;

    let score = 0;

    const result = quiz.map((q, index) => {
      const isCorrect = answers[index] === q.answer;
      if (isCorrect) score++;

      return {
        question: q.question,
        selectedAnswer: answers[index],
        correctAnswer: q.answer,
        isCorrect,
      };
    });

    const attempt = await QuizAttempt.create({
      userId,
      courseId,
      quiz: result,
      score,
      total: quiz.length,
    });

    res.status(200).json({ success: true, attempt });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Submit failed" });
  }
};

export const getMyQuizAttempts = async (req, res) => {
  try {
    const userId = req.id;

    const attempts = await QuizAttempt.find({ userId })
      .populate("courseId")
      .sort({ createdAt: -1 }); //last attept age dekhabe

    res.json({ attempts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch attempts" });
  }
};
