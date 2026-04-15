import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:8080/api/v1/progress";

// export const courseProgressApi = createApi({
//   reducerPath: "courseProgressApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: COURSE_PROGRESS_API,
//     credentials: "include",
//   }),
//   endpoints: (builder) => ({
//     getCourseProgrss: builder.query({
//       query: (courseId) => ({
//         url: `/${courseId}`,
//         method: "GET",
//       }),
//     }),
//     updateLectureProgress: builder.mutation({
//       query: ({ courseId, lectureId }) => ({
//         url: `/${courseId}/lecture/${lectureId}/view`,
//         method: "POST",
//       }),
//     }),
//     completeCourse: builder.mutation({
//       query: (courseId) => ({
//         url: `/${courseId}/complete`,
//         method: "POST",
//       }),
//     }),
//     inCompleteCourse: builder.mutation({
//       query: (courseId) => ({
//         url: `/${courseId}/incomplete`,
//         method: "POST",
//       }),
//     }),
//   }),
// });
export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),

  tagTypes: ["CourseProgress"], // 🔥 important

  endpoints: (builder) => ({
    // 📌 Get course progress
    getCourseProgrss: builder.query({
      query: (courseId) => `/${courseId}`,
      providesTags: ["CourseProgress"], // 🔥
    }),

    // 📌 Update lecture progress (video play)
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"], // 🔥 auto refetch
    }),

    // 📌 Mark course as completed
    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"], // 🔥 auto update UI
    }),

    // 📌 Mark course as incomplete
    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"], // 🔥
    }),
  }),
});
export const {
  useGetCourseProgrssQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} = courseProgressApi;
