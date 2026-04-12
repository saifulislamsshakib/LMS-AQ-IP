import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSeesion,
  getAllPurchasedCourses,
  getCourseDetailWithStatus,
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

router.route("/").get(isAuthenticated, getAllPurchasedCourses);
export default router;
