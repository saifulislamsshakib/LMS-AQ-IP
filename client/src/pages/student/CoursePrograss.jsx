import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgrssQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
  useSaveVideoProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCheck, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CoursePrograss = () => {
  const { courseId } = useParams();

  const { data, isLoading, isError } = useGetCourseProgrssQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [saveVideoProgress] = useSaveVideoProgressMutation();

  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();

  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const courseDetails = data?.data?.courseDetails;
  const progress = data?.data?.progress || [];
  const completed = data?.data?.completed;
  const lectures = courseDetails?.lectures || [];
  const lastLectureId = data?.data?.lastLecture;
  const lastPosition = data?.data?.lastPosition;

  useEffect(() => {
    if (completedSuccess) toast.success(markCompleteData?.message);
    if (inCompletedSuccess) toast.success(markInCompleteData?.message);
  }, [completedSuccess, inCompletedSuccess]);

  useEffect(() => {
    if (videoRef.current && lastPosition !== undefined) {
      videoRef.current.currentTime = lastPosition;
    }
  }, [lastPosition]);

  useEffect(() => {
    if (!lectures.length) return;

    if (lastLectureId) {
      const found = lectures.find(
        (lec) => lec._id.toString() === lastLectureId.toString(),
      );
      if (found) setCurrentLecture(found);
    } else {
      setCurrentLecture(lectures[0]);
    }
  }, [lectures, lastLectureId]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course</p>;

  const initialLecture = currentLecture || lectures[0];

  const isLectureCompleted = (lectureId) =>
    progress.some(
      (p) => p.lectureId.toString() === lectureId.toString() && p.viewed,
    );

  const handleSelectLecture = async (lecture) => {
    setCurrentLecture(lecture);
    await updateLectureProgress({ courseId, lectureId: lecture._id });
  };

  const handleCompleteCourse = () => completeCourse(courseId);
  const handleInCompleteCourse = () => inCompleteCourse(courseId);

  const handleGenerateQuiz = async () => {
    try {
      setLoadingQuiz(true);
      setQuiz(null);
      setShowQuiz(false);
      setAnswers({});
      setScore(null);

      const res = await fetch(
        `http://localhost:8080/api/v1/quiz/generate/${courseId}`,
        // ` https://lms-aq-ip.onrender.com/api/v1/quiz/generate/${courseId}`,
        { credentials: "include" },
      );

      const result = await res.json();
      setQuiz(result.quiz);
      setShowQuiz(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  // const handleSubmitQuiz = () => {
  //   let correct = 0;
  //   quiz.forEach((q, i) => {
  //     if (answers[i] === q.answer) correct++;
  //   });
  //   setScore(correct);
  // };
  const handleSubmitQuiz = async () => {
    try {
      let correct = 0;

      quiz.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });

      setScore(correct);

      await fetch("http://localhost:8080/api/v1/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          courseId,
          quiz,
          answers,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <div className="flex justify-between mb-4">
        <h1 className="font-bold">{courseDetails?.courseTitle}</h1>

        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
        >
          {completed ? "Completed" : "Mark as Completed"}
        </Button>

        {completed && (
          <Button onClick={handleGenerateQuiz} disabled={loadingQuiz}>
            {loadingQuiz ? "Generating..." : "Generate Quiz"}
          </Button>
        )}
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          {initialLecture?.videoUrl ? (
            <video
              ref={videoRef}
              src={initialLecture.videoUrl}
              controls
              className="w-full"
              onTimeUpdate={(e) => {
                const currentTime = e.target.currentTime;
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                  saveVideoProgress({
                    courseId,
                    lectureId: initialLecture._id,
                    currentTime,
                  });
                }, 1000);
              }}
            />
          ) : (
            <p>No video</p>
          )}
        </div>

        <div className="w-1/3">
          {lectures.map((lecture) => (
            <Card
              key={lecture._id}
              onClick={() => handleSelectLecture(lecture)}
              className="mb-2 cursor-pointer"
            >
              <CardContent>
                <CardTitle>{lecture.lectureTitle}</CardTitle>
                {isLectureCompleted(lecture._id) && <Badge>Completed</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showQuiz && quiz && (
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Your Quiz</h2>

          {quiz.map((q, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 mb-6 border"
            >
              <h3 className="text-lg font-semibold mb-4">
                {index + 1}. {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const isSelected = answers[index] === opt;
                  const isCorrect = q.answer === opt;

                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
                  
                  ${
                    score !== null
                      ? isCorrect
                        ? "bg-green-100 border-green-500"
                        : isSelected
                          ? "bg-red-100 border-red-500"
                          : "bg-gray-50"
                      : isSelected
                        ? "bg-blue-100 border-blue-400"
                        : "hover:bg-gray-100"
                  }
                `}
                    >
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={opt}
                        disabled={score !== null}
                        onChange={() =>
                          setAnswers({ ...answers, [index]: opt })
                        }
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="text-center mt-6">
            <Button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length !== quiz.length}
              className="px-8 py-2 rounded-xl text-lg"
            >
              Submit Quiz
            </Button>
          </div>

          {score !== null && (
            <div className="mt-8 text-center bg-gray-100 p-6 rounded-2xl shadow">
              <h3 className="text-2xl font-bold">
                Your Quiz Score: {score} / {quiz.length}
              </h3>

              <p className="mt-2 text-gray-600">
                {score === quiz.length
                  ? " Perfect!"
                  : score >= quiz.length / 2
                    ? " Good job!"
                    : " Try again!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePrograss;
