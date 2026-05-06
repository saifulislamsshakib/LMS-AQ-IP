import axios from "axios";
import { Interview } from "../models/interview.model.js";

export const generateInterview = async (req, res) => {
  try {
    const { topic, level } = req.body;
    const userId = req.id;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const prompt = `
Generate 3 interview questions for ${topic} (${level} level).

Return ONLY JSON array:
[
  {
    "question": "",
    "answer": "",
    "explanation": ""
  }
]
`;

    let response;

    for (let i = 0; i < 2; i++) {
      try {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
        );

        break;

        //  success loop stop
      } catch (err) {
        const status = err.response?.status;

        if ((status === 503 || status === 429) && i < 1) {
          console.log("Retrying AI request...");

          await new Promise((res) => setTimeout(res, 4000));
        }

        //  api quota  ses hoile  429 error return korbe
        else if (status === 429) {
          return res.status(429).json({
            message: "Daily limit reached. Try again later",
          });
        } else {
          return res.status(503).json({
            message: "AI is busy, please try again later",
          });
        }
      }
    }

    //  safety check
    if (!response) {
      return res.status(500).json({
        message: "AI failed after retry",
      });
    }

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || ""; //API response, forstoutput r actual text.  //text akare ai response

    if (!text) {
      return res.status(500).json({
        message: "AI did not return valid content",
      });
    }

    const jsonMatch = text.match(/\[[\s\S]*\]/); //json akare

    if (!jsonMatch) {
      console.log("RAW AI:", text);
      return res.status(500).json({ message: "Invalid AI response" });
    }

    let questions = [];

    try {
      questions = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.log("PARSE ERROR:", err);
      return res.status(500).json({ message: "Parsing failed" });
    }

    await Interview.create({
      userId,
      topic,
      level,
      questions,
    });

    res.json({ questions });
  } catch (error) {
    if (error.response?.status === 429) {
      return res.status(429).json({
        message: "Daily limit reached. Try later",
      });
    }

    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Failed" });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.id;

    const history = await Interview.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
export const evaluateAnswer = async (req, res) => {
  try {
    if (process.env.NODE_ENV === "development") {
      return res.json({
        score: 8,
        feedback: "Good answer (mock)",
      });
    }
    const { question, correctAnswer, userAnswer } = req.body;

    if (!userAnswer) {
      return res.status(400).json({ message: "Answer required" });
    }

    const prompt = `
You are an interview evaluator.

Question: ${question}

Correct Answer: ${correctAnswer}

User Answer: ${userAnswer}

Give:
1. Score out of 10
2. Short feedback

Return ONLY JSON:
{
  "score": number,
  "feedback": ""
}
`;

    const response = await axios.post(
      //Google AI server, API version + models path, gemini version, method..generateContent, apikey

      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.log("RAW AI:", text);
      return res.status(500).json({ message: "Invalid AI response" });
    }

    const result = JSON.parse(jsonMatch[0]);

    res.json(result);
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Evaluation failed" });
  }
};
