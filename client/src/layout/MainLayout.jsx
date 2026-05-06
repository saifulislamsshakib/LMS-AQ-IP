import Navbar from "@/components/ui/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "@/components/ui/ui/Footer.jsx";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className=" flex-1 mt-16">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
