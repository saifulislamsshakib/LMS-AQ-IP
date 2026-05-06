import express from "express";
import {
  register,
  login,
  getUserProfile,
  logout,
  updateProfile,
  changePassword,
  getPendingTeachers,
  approveTeacher,
  rejectTeacher,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.get("/pending-teachers", isAuthenticated, getPendingTeachers);
router.put("/approve-teacher/:userId", isAuthenticated, approveTeacher);
router.delete("/reject-teacher/:userId", isAuthenticated, rejectTeacher);
export default router;
