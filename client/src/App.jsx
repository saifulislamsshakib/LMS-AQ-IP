import "./App.css";
import { Toaster } from "sonner";
import Login from "./pages/login.jsx";

import Navbar from "./components/ui/Navbar";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import Mylearning from "./pages/student/Mylearning";
import Profile from "./pages/student/Profile";
import ChangePassword from "./pages/ChangePassword";
import Sidebar from "./pages/admin/lecture/Sidebar";
import Dashboard from "./pages/admin/lecture/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import { Outlet } from "react-router-dom";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/createLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CoursePrograss from "./pages/student/CoursePrograss";
import InterviewPrep from "./pages/student/InterviewPrep";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchPage from "./pages/student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ui/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/ui/PurchaseCourseProtectedRoute";
import PendingTeachers from "./pages/admin/PendingTeachers";
import { AdminOnlyRoute } from "./components/ui/ProtectedRoutes";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },

      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <Mylearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "interview-prep",
        element: (
          <ProtectedRoute>
            <InterviewPrep />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CoursePrograss />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },

      // {
      //   path: "course-prograss/:courseId",
      //   element: <CoursePrograss />,
      // },

      // admin routes starts

      // {
      //   path: "admin",
      //   element: <Sidebar />,
      //   children: [
      //     { path: "dashboard", element: <Dashboard /> },
      //     { path: "course", element: <CourseTable /> },
      //   ],
      // },

      {
        path: "admin",
        element: (
          <div className="flex min-h-screen">
            <AdminRoute>
              <Sidebar />
            </AdminRoute>

            <div className="flex-1 p-5">
              <Outlet />
            </div>
          </div>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },

          { path: "course", element: <CourseTable /> },
          { path: "course/create", element: <AddCourse /> },
          { path: "course/:courseId", element: <EditCourse /> },
          { path: "course/:courseId/lecture", element: <CreateLecture /> },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
          {
            path: "pending-teachers",
            element: (
              <AdminOnlyRoute>
                <PendingTeachers />
              </AdminOnlyRoute>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
