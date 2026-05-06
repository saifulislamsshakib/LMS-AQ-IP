import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
const InterviewPrep = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);

  const [activeId, setActiveId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [evaluating, setEvaluating] = useState({});
  const [showHint, setShowHint] = useState({});
  const [showAnswer, setShowAnswer] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    if (loading) return;

    setActiveId(null);
    setUserAnswers({});
    setFeedback({});
    setEvaluating({});
    setShowHint({});
    setShowAnswer({});

    setLoading(true);

    try {
      let res;
      let retries = 2;

      while (retries > 0) {
        res = await fetch("http://localhost:8080/api/v1/interview/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ topic, level }),
        });

        if (res.status === 503 || res.status === 429) {
          retries--;
          if (retries === 0) break;

          await new Promise((r) => setTimeout(r, 2000)); // wait eita dile api valo kaj kore fast call kome tai
        } else {
          break;
        }
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setResult(data.questions);
      fetchHistory();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };
  const fetchHistory = async () => {
    const res = await fetch("http://localhost:8080/api/v1/interview/history", {
      credentials: "include",
    });

    const data = await res.json();
    setHistory(data.history);
  };
  const handleOpenHistory = (item) => {
    setResult(item.questions);
    setActiveId(item._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEvaluate = async (question, index) => {
    const answer = userAnswers[index];

    if (!answer) {
      alert("Write your answer first");
      return;
    }

    setEvaluating({ ...evaluating, [index]: true });

    const res = await fetch("http://localhost:8080/api/v1/interview/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        question: question.question,
        correctAnswer: question.answer,
        userAnswer: answer,
      }),
    });

    const data = await res.json();

    setFeedback({
      ...feedback,
      [index]: data,
    });

    setEvaluating({ ...evaluating, [index]: false });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4">Interview Preparation</h1>

        <input
          type="text"
          placeholder="Enter topic (React, Node...)"
          className="w-full border p-2 mb-3"
          onChange={(e) => setTopic(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-3"
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>

        {result &&
          result.map((q, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-bold">{q.question}</h3>

              <textarea
                className="w-full border p-2 mt-2 rounded"
                placeholder="Write your answer..."
                onChange={(e) =>
                  setUserAnswers({ ...userAnswers, [i]: e.target.value })
                }
              />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowHint({ ...showHint, [i]: true })}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Hints
                </button>

                <button
                  onClick={() => setShowAnswer({ ...showAnswer, [i]: true })}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Show Answer
                </button>
              </div>

              {showHint[i] && (
                <p className="text-sm text-blue-500 mt-2">
                  Hint: {q.explanation.slice(0, 80)}...
                </p>
              )}

              {showAnswer[i] && (
                <>
                  <p>
                    <b>Answer:</b> {q.answer}
                  </p>
                  <p>
                    <b>Explanation:</b> {q.explanation}
                  </p>
                </>
              )}

              <Button
                className="mt-2"
                onClick={() => handleEvaluate(q, i)}
                disabled={evaluating[i]}
              >
                {evaluating[i] ? "Evaluating..." : "Evaluate"}
              </Button>
              {feedback[i] && (
                <div className="mt-2 p-3 bg-gray-100 rounded">
                  <p>
                    <b>Score:</b> {feedback[i].score}/10
                  </p>
                  <p>
                    <b>Feedback:</b> {feedback[i].feedback}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="max-w-3xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4"> Interview History</h2>

        {history.length === 0 ? (
          <p>No interview history yet</p>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              onClick={() => handleOpenHistory(item)}
              className={`border p-4 rounded-lg mb-3 shadow-sm cursor-pointer transition
  ${activeId === item._id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"}
`}
            >
              <p>
                <b>Topic:</b> {item.topic}
              </p>
              <p>
                <b>Level:</b> {item.level}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default InterviewPrep;
