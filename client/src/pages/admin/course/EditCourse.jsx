import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import {
  useGetCourseStudentsQuery,
  useRemoveStudentMutation,
} from "@/features/api/courseApi";
import { useParams } from "react-router-dom";

const EditCourse = () => {
  const { courseId } = useParams();
  const { data, isLoading, refetch } = useGetCourseStudentsQuery(courseId);
  const [removeStudent] = useRemoveStudentMutation();
  if (isLoading) return <p>Loading students...</p>;
  return (
    <div className="flex-1 mx-10 mt-10 ">
      <div className="text-left flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl"> Add course information...</h1>
        <Link to="lecture">
          <Button className="hover:text-blue-600" variant="link">
            {" "}
            Go to Lectures page
          </Button>
        </Link>
      </div>
      {/* <div className="text-left">
        <CourseTab />
      </div> */}
      <div className="text-left">
        <CourseTab />

        {/* 🔥 ADD HERE */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-3">Enrolled Students</h2>

          {data?.students?.length === 0 ? (
            <p>No students enrolled</p>
          ) : (
            data.students.map((student) => (
              <div
                key={student._id}
                className="flex justify-between items-center border p-3 mb-2 rounded"
              >
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>

                <button
                  onClick={async () => {
                    if (!window.confirm("Remove this student?")) return;

                    await removeStudent({ courseId, studentId: student._id });
                    refetch();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
