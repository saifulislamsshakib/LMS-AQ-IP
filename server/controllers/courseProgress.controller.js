import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    //featch the user course progress

    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");
    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    //if not progress found, return course details with empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
          progressPercentage: 0,
        },
      });
    }
    // retunr the users course progrss along with course detailes

    const totalLectures = courseDetails.lectures.length;
    const completedLectures = courseProgress.lectureProgress.filter(
      (lec) => lec.viewed,
    ).length;

    const progressPercentage =
      totalLectures === 0
        ? 0
        : Math.round((completedLectures / totalLectures) * 100);

    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
        progressPercentage,
        lastLecture: courseProgress.lastLecture,
        lastPosition: courseProgress.lastPosition,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLectureProfress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const userId = req.id;
    //fetch or crete course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      //if no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    //find the lecture progress in the cpurse progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId,
    );

    if (lectureIndex !== -1) {
      //if lecture already exist, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      //Add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }
    ///if all lecture is complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed,
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;
    courseProgress.lastLecture = lectureId;
    await courseProgress.save();
    return res.status(200).json({
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true),
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "course mark as completed" });
  } catch (error) {
    console.log(error);
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false),
    );
    courseProgress.completed = false;
    await courseProgress.save();
    return res.status(200).json({ message: "course mark as incompleted" });
  } catch (error) {
    console.log(error);
  }
};

export const saveVideoProgress = async (req, res) => {
  try {
    const { courseId, lectureId, currentTime } = req.body;
    const userId = req.id;

    let progress = await CourseProgress.findOne({ courseId, userId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lectureProgress: [],
      });
    }

    progress.lastLecture = lectureId;
    progress.lastPosition = currentTime;

    await progress.save();

    return res.status(200).json({
      message: "Progress saved",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
