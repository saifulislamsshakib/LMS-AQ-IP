import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.mode.js";
import { User } from "../models/user.model.js";
import { truncates } from "bcryptjs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSeesion = async (req, res) => {
  console.log("🔥 API HIT");
  console.log("BODY:", req.body);
  console.log("USER:", req.id);
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    //create a new course purchase record
    // const newPurchase = new CoursePurchase({
    //   courseId,
    //   userId,
    //   amount: course.coursePrice,
    //   status: "Pending",
    // });
    //create a stripe checkut session
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
      // success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      // cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
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
      status: "pending", // ✅ lowercase
      paymentId: session.id, // ✅ MUST MATCH SCHEMA
    });

    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });

    // if (!session.url) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Error while creating session" });
    // }

    // newPurchase.paymentIntentId = session.id;
    // await newPurchase.save();
    // return res.status(200).json({
    //   success: true,
    //   url: session.url,
    // });
    // } catch (error) {
    //   console.log(error);
    // }
  } catch (error) {
    console.log("❌ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//strip controller

// export const stripeWebhook = async (req, res) => {
//   let event;
//   try {
//     const payloadString = JSON.stringify(req.body, null, 2);
//     const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret,
//     });
//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error:${error.message}`);
//   }

//   //HANDLE THE CHECKOUT SESSION COMPLETED EVENT

//   if (event.type === "checkout.session.completed") {
//     try {
//       const session = event.data.object;
//       const purchase = await CoursePurchase.findOne({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });
//       if (!purchase) {
//         return res.status(404).json({ message: "Purchase not found" });
//       }
//       if (session.amount_total) {
//         purchase.amount = session.amount_total / 100;
//       }
//       purchase.status = "completed";

//       if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//         await Lecture.updateMany(
//           { _id: { $in: purchase.courseId.lectures } },
//           { $set: { isPreviewFree: true } },
//         );
//       }
//       await purchase.save();

//       await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourses: purchase.courseId._id } },
//         { new: true },
//       );

//       await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } },
//         { new: true },
//       );
//     } catch (error) {
//       console.log("Error handling event:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
//   res.status(200).send();
// };

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

  // ✅ PAYMENT SUCCESS হলে
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const { courseId, userId } = session.metadata;

      const purchase = await CoursePurchase.findOne({
        courseId,
        userId,
      }).populate("courseId");
      // const purchase = await CoursePurchase.findOne({
      //   paymentId: session.id,
      // }).populate("courseId");

      if (!purchase) {
        console.log("❌ Purchase not found");
        return res.status(404).json({ message: "Purchase not found" });
      }

      // ✅ update purchase
      purchase.status = "completed";

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      await purchase.save();
      console.log("✅ PURCHASE UPDATED");

      // ✅ unlock lectures
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } },
        );
      }

      // ✅ user update
      await User.findByIdAndUpdate(purchase.userId, {
        $addToSet: { enrolledCourses: purchase.courseId._id },
      });

      // ✅ course update
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

//adding

// export const getCourseDetailWithStatus = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { courseId } = req.params;

//     const purchase = await CoursePurchase.findOne({
//       userId,
//       courseId,
//     });

//     if (!purchase) {
//       return res.status(404).json({
//         purchased: false,
//         message: "Course not purchased",
//       });
//     }

//     return res.status(200).json({
//       purchased: true,
//       courseId,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const getCourseDetailWithStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    // const course = await Course.findById(courseId);
    const course = await Course.findById(courseId)
      .populate("creator") // 🔥 MUST
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ creator হলে direct access
    if (course.creator.toString() === userId.toString()) {
      return res.status(200).json({
        course,
        purchased: true,
      });
    }

    const purchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
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

    const purchases = await CoursePurchase.find({ userId }).populate(
      "courseId",
    );

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
