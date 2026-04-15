import { populate } from "dotenv";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.mode.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title & category is required.",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      course,
      message: "Course created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course.",
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;
    //create search querry
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
    // if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }
    //define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; //sort by proce in assending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; //desending
    }
    let courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);
    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

// export const getPublishedCourse = async (_, res) => {
//   try {
//     const courses = await Course.find({ isPublished: true }).populate({
//       path: "creator",
//       select: "name photoUrl",
//     });
//     if (!courses) {
//       return res.status(404).json({
//         message: "Course not found",
//       });
//     }
//     return res.status(200).json({
//       courses,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       courses: [],
//       message: "Failed to get published courses..",
//     });
//   }
// };

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    console.log("PUBLISHED COURSES:", courses); // 👈 debug

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      courses: [],
      message: "Failed to get published courses..",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course.",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found...",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); //delete old image
      }
      //upload thumbnail in cloudnary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    //  updated data here

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      // courseThumbnail: courseThumbnail?.secure_url,
      courseThumbnail: courseThumbnail?.secure_url || course.courseThumbnail,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update  course.",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course Not found.",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get  course.",
    });
  }
};

//Lecture Controler code
export const CreateLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    //create leacture
    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
      return res.status(201).json({
        lecture,
        message: "Lecture created successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Leacture.",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Leacture.",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not Found!!!",
      });
    }
    //update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    // if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    //ensure course still has the lectur id if it was no already added;

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully...",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit Leacture.",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!!!",
      });
    }
    //coudinary theke lecture video o delet korte hobe
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    //course er sathe jukto lecture reference o delet
    await Course.updateOne(
      { lectures: lectureId }, //courese khuje ber kora jeikhane lecture ache
      { $pull: { lectures: lectureId } }, //lecture array theke lecture id remove
    );
    return res.status(200).json({
      message: "Lecture removed successfully..",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Leacture.",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!!!",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get Leacture by id.",
    });
  }
};

//published and unpublished course logic

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //ture or false
    const courese = await Course.findById(courseId);
    if (!courese) {
      return res.status(404).json({
        message: "Course not found!!!",
      });
    }
    //publish status based on the query paramater
    courese.isPublished = publish === "true";
    await courese.save();
    const statusMessage = courese.isPublished ? "Published" : "Unpublished";

    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update ststus.",
    });
  }
};
