import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    // <div className=" hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-l-sky-300 border-gray-700 bg-[#f0f0f0] p-8 sticky top-0 h-screen">
    <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-l border-gray-300 bg-[#f0f0f0] p-8 sticky top-0 h-screen">
      <div className="mt-10 space-y ">
        <Link to="dashboard" className="flex items-center gap-2">
          <ChartNoAxesColumn size={22} />
          <h1>Dashoard</h1>
        </Link>
        <Link to="course" className="flex items-center gap-2">
          <SquareLibrary size={22} />
          <h1>Courses</h1>
        </Link>
      </div>
      {/* <div>
          <Outlet />
        </div> */}
    </div>
  );
};

export default Sidebar;
