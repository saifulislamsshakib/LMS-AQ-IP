import React from "react";

import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { useGetCourseProgrssQuery } from "@/features/api/courseProgressApi";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

const Mylearning = () => {
  const [progressMap, setProgressMap] = useState({});
  const [quizAttempts, setQuizAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        //"http://localhost:8080/api/v1/quiz/my-attempts"
        const res = await fetch(
          `https://lms-aq-ip.onrender.com/api/v1/quiz/my-attempts`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        setQuizAttempts(data.attempts || []);
      } catch (error) {
        console.log("Quiz fetch error:", error);
      }
    };

    fetchAttempts();
  }, []);

  const { data, isLoading } = useGetPurchasedCoursesQuery();

  const myLearning =
    data?.purchasedCourses
      ?.map((item) => item.courseId)
      ?.filter((course) => course !== null) || [];

  const totalCourses = myLearning.length;

  const completedCourses = Object.values(progressMap).filter(
    (p) => p === 100,
  ).length;

  const progressValues = Object.values(progressMap);

  const avgProgress =
    progressValues.length === 0
      ? 0
      : Math.round(
          progressValues.reduce((a, b) => a + b, 0) / progressValues.length,
        );

  return (
    <div className="max-w-4xl mx-auto my-20 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>

      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-sm text-gray-500">Total Courses</h2>
          <p className="text-xl font-bold">{totalCourses}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-sm text-gray-500">Completed</h2>
          <p className="text-xl font-bold">{completedCourses}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-sm text-gray-500">Avg Progress</h2>
          <p className="text-xl font-bold">{avgProgress}%</p>
        </div>
      </div>
      <div>
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <p>You have not enrolled any course yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4 py-10">
            {myLearning.map((course) => (
              <CourseWithProgress
                key={course._id}
                course={course}
                setProgressMap={setProgressMap}
              />
            ))}
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mt-10">Quiz Attempts</h2>

      {quizAttempts.length === 0 ? (
        <p className="text-gray-500 mt-2">No quiz attempts yet</p>
      ) : (
        <div className="grid gap-4 mt-4">
          {quizAttempts.map((attempt) => (
            <div key={attempt._id} className="p-4 border rounded shadow-sm">
              <h3 className="font-semibold">
                {attempt.courseId?.courseTitle || "Unknown Course"}
              </h3>

              <p>
                Score: {attempt.score} / {attempt.total}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(attempt.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mylearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);

const CourseWithProgress = ({ course, setProgressMap }) => {
  const { data, isLoading } = useGetCourseProgrssQuery(course._id);
  const lastLecture = data?.data?.lastLecture;
  const lastPosition = data?.data?.lastPosition;
  useEffect(() => {
    if (data?.data?.progressPercentage !== undefined) {
      setProgressMap((prev) => ({
        ...prev,
        [course._id]: data.data.progressPercentage,
      }));
    }
  }, [data, course._id]);
  const navigate = useNavigate();
  if (isLoading) {
    return <div className="p-3">Loading...</div>;
  }

  const progress = data?.data?.progressPercentage || 0;

  return (
    <div className="border p-3 rounded-lg shadow">
      <h2 className="font-bold">{course.courseTitle}</h2>

      <p className="text-sm text-gray-500">Progress: {progress}%</p>
      <p className="text-xs text-gray-400">
        {lastLecture
          ? `Resume from ${(lastPosition / 60).toFixed(1)} min`
          : "Start course"}
      </p>

      <div className="w-full bg-gray-200 h-2 rounded mt-2">
        <div
          className="bg-blue-500 h-2 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <button
        onClick={() => navigate(`/course-progress/${course._id}`)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {progress > 0 ? "Resume Course →" : "Start Course →"}
      </button>
    </div>
  );
};
