import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    // <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 py-4 gap-4">
    <div className="flex flex-col md:flex-row items-start gap-6">
      {/* <Link
        to={`/course-details/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={
            course.courseThumbnail ||
            "https://dummyimage.com/300x150/000/fff&text=Course"
          }
          alt="course"
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>
          <p className="text-sm text-gray-600">{course.subTitle}</p>
          <p className="text-sm text-gray-700">
            Instructor:{" "}
            <span className="font-bold">
              {course.creator?.name || "Unknown"}
            </span>{" "}
          </p>
          <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge>
        </div>
      </Link> */}

      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-6 w-full"
      >
        {/* IMAGE */}
        <img
          src={
            course.courseThumbnail ||
            "https://dummyimage.com/300x150/000/fff&text=Course"
          }
          alt="course"
          className="w-full md:w-64 h-40 object-cover rounded-lg"
        />

        {/* CONTENT */}
        <div className="flex flex-col justify-start flex-1 text-left">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>

          <p className="text-sm text-gray-600 mt-1">{course.subTitle}</p>

          <p className="text-sm text-gray-700 mt-1">
            Instructor:{" "}
            <span className="font-bold">{course.creator?.name}</span>
          </p>

          <Badge className="w-fit mt-2">{course.courseLevel}</Badge>
        </div>
      </Link>
      <div className="mt-4 mdLmt-0 md:text-right w-full md:w-auto">
        <h1 className="font-bold text-lg md:text-xl">
          Tk {course.coursePrice}
        </h1>
      </div>
    </div>
  );
};

export default SearchResult;
