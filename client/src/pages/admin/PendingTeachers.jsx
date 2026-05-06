import React from "react";
import {
  useGetPendingTeachersQuery,
  useApproveTeacherMutation,
  useRejectTeacherMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const PendingTeachers = () => {
  const { data, isLoading, refetch } = useGetPendingTeachersQuery();
  const [rejectTeacher] = useRejectTeacherMutation();
  const [approveTeacher, { isLoading: approving }] =
    useApproveTeacherMutation();

  const handleApprove = async (id) => {
    try {
      const res = await approveTeacher(id).unwrap();
      toast.success(res.message || "Approved successfully");
      refetch(); // 🔥 auto refresh
    } catch (err) {
      toast.error(err?.data?.message || "Error");
    }
  };
  const handleReject = async (id) => {
    try {
      const res = await rejectTeacher(id).unwrap();
      toast.success(res.message || "Rejected");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Error");
    }
  };

  if (isLoading) return <p className="pt-20">Loading...</p>;

  return (
    <div className="pt-20 px-6">
      <h2 className="text-xl font-bold mb-4">Pending Teachers</h2>

      {data?.users?.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        data.users.map((user) => (
          <div
            key={user._id}
            className="border p-4 mb-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(user._id)}
                disabled={approving}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                {approving ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={() => handleReject(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingTeachers;
