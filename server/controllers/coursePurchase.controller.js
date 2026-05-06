import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.mode.js";
import { User } from "../models/user.model.js";
import { truncates } from "bcryptjs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSeesion = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["BD"], //Optionally restrict allowed countries
      },
    });
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: session.id,
    });

    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(" ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET,
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      // const { courseId, userId } = session.metadata;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate("courseId");

      if (!purchase) {
        console.log(" Purchase not found");
        return res.status(404).json({ message: "Purchase not found" });
      }

      //  update purchase
      purchase.status = "completed";

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      await purchase.save();
      console.log(" PURCHASE UPDATED");

      // unlock lectures
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } },
        );
      }

      //  user update
      await User.findByIdAndUpdate(purchase.userId, {
        $addToSet: { enrolledCourses: purchase.courseId._id },
      });

      await Course.findByIdAndUpdate(purchase.courseId._id, {
        $addToSet: { enrolledStudents: purchase.userId },
      });
    } catch (error) {
      console.log("Webhook handling error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};

export const getCourseDetailWithStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    // const course = await Course.findById(courseId);
    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.creator.toString() === userId.toString()) {
      return res.status(200).json({
        course,
        purchased: true,
      });
    }

    const purchase = await CoursePurchase.findOne({
      userId,
      courseId,
      // status: "completed",
    });

    return res.status(200).json({
      course,
      purchased: !!purchase,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourses = async (req, res) => {
  try {
    const userId = req.id;

    const purchases = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate("courseId");

    res.status(200).json({
      purchasedCourses: purchases,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.id;

    const courses = await Course.find({ creator: instructorId });

    const courseIds = courses.map((course) => course._id);

    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalSales = purchases.length;

    const totalRevenue = purchases.reduce((sum, item) => sum + item.amount, 0);

    const courseStats = courses.map((course) => {
      const coursePurchases = purchases.filter(
        (p) => p.courseId.toString() === course._id.toString(),
      );

      return {
        name: course.courseTitle,
        sales: coursePurchases.length,
        revenue: coursePurchases.reduce((sum, p) => sum + p.amount, 0),
      };
    });

    res.status(200).json({
      totalSales,
      totalRevenue,
      courseStats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
