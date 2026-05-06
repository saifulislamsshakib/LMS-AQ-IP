import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        //client vhul data pathaile
        success: false,
        message: "All fields are required.",
      });
    }

    // password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // role & status setup
    let userRole = role || "student";
    let status = "approved";

    if (userRole === "instructor") {
      status = "pending";
    }

    // create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      //kono kichu successfully create kkorle
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      //server side problem jmn db or server crushed
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  input check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (user.role === "instructor" && user.status !== "approved") {
      return res.status(403).json({
        //kono kichur access deny korle
        success: false,
        message: "Wait for admin approval",
      });
    }

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    generateToken(res, user, `Welcome back ${user.name}`);

    return res.status(200).json({
      //req thik vabe complete hoile
      success: true,
      user,
      message: `Welcome back ${user.name}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Loged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "enrolledCourses",
        populate: {
          path: "creator",
          select: "name photoUrl",
        },
      })
      .populate({
        path: "createdCourses",
        populate: {
          path: "creator",
          select: "name photoUrl",
        },
      });

    if (!user) {
      return res.status(404).json({
        //kono kichu khuje na paile
        message: "Profile not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let photoUrl = user.photoUrl;

    // delete old photo
    if (user.photoUrl && profilePhoto) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; //url theke oublic id ber kora hoitache cloudanary er
      await deleteMediaFromCloudinary(publicId);
    }

    // upload new photo
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }

    const updatedData = {
      name: name || user.name,
      photoUrl,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Your profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

export const getPendingTeachers = async (req, res) => {
  try {
    const users = await User.find({
      role: "instructor",
      status: "pending",
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
    });
  }
};

export const approveTeacher = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    user.status = "approved";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Teacher approved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectTeacher = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Teacher request rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reject failed",
    });
  }
};
