import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };
  return (
    <div className="relative bg-linear-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-25 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find your courses.
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn and Upskill with our wide range of courses
        </p>
        {/* <form action="" className="">
          <Input
            type="text"
            className="flex-grow bg-white border-none focus-visible:ring-0 px-6 py-3  dark:text-gray-100 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
          />
          <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">
            Search
          </Button>
        </form> */}

        {/* uporer tao hobe. */}

        <form onSubmit={searchHandler} className="flex justify-center">
          <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-xl w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="flex-grow border-none focus-visible:ring-0 px-6 py-3 rounded-l-full text-black"
            />

            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-full hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </form>
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="bg-white dark:bg-gray-800 text-blue-600 my-3 rounded-full hover:bg-gray-200 cursor-pointer"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;

// "flex-grow bg-white border-none focus-visible:ring-0 px-6 py-3  dark:text-gray-100 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
