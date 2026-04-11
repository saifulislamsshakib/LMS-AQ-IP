import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
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
      <div className="text-left">
        <CourseTab />
      </div>
    </div>
  );
};

export default EditCourse;
