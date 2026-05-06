import React, { useState } from "react";
import { useChangePasswordMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await changePassword(form).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full border p-2"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
