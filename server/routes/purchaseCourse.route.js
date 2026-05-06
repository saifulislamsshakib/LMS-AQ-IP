import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSeesion,
  getAllPurchasedCourse,
  getAllPurchasedCourses,
  getCourseDetailWithStatus,
  getInstructorDashboard,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSeesion);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);
router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailWithStatus);

// router.route("/").get(isAuthenticated, getAllPurchasedCourse);
router.route("/").get(isAuthenticated, getAllPurchasedCourses);
router
  .route("/instructor/dashboard")
  .get(isAuthenticated, getInstructorDashboard);
export default router;
