import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/";
// const USER_API = `${import.meta.env.VITE_API_URL}/api/v1/user`;
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
        credentials: "include",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "change-password",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
        credentials: "include",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getPendingTeachers: builder.query({
      query: () => ({
        url: "pending-teachers",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["PendingTeachers"],
    }),

    approveTeacher: builder.mutation({
      query: (id) => ({
        url: `approve-teacher/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["PendingTeachers"],
    }),
    rejectTeacher: builder.mutation({
      query: (id) => ({
        url: `reject-teacher/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["PendingTeachers"],
    }),
  }),
});
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetPendingTeachersQuery,
  useApproveTeacherMutation,
  useRejectTeacherMutation,
} = authApi;
