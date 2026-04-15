import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exiest with this email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body); // <-- এখানে বসবে
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    console.log("USER FOUND:", user); // <-- add
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isPasswordMatch); // <-- add
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    //     generateToken(res, user, `Welcome back ${user.name}`);
    //   } catch (error) {
    //     // console.log(error);
    //     return res.status(500).json({
    //       success: false,
    //       message: "Failed to login",
    //     });
    //   }
    // };

    // ✅ token generate
    generateToken(res, user, `Welcome back ${user.name}`);

    // ✅🔥🔥 এখানেই add করতে হবে (MOST IMPORTANT)
    return res.status(200).json({
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

// export const getUserProfile = async (req, res) => {
//   try {
//     const userId = req.id;
//     const user = await User.findById(userId)
//       .select("-password")
//       .populate("enrolledCourses");

//     if (!user) {
//       return res.status(404).json({
//         message: "Profile not found",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to load user",
//     });
//   }
// };

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
      });

    if (!user) {
      return res.status(404).json({
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

// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { name } = req.body;
//     const profilePhoto = req.file;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         success: false,
//       });
//     }
//     // extract public id of the old image from the url is it exists
//     if (user.photoUrl) {
//       const publicId = user.photoUrl.split("/").pop().split(".")[0];
//       deleteMediaFromCloudinary(publicId);
//     }

//     //upload new photo

//     const cloudResponse = await uploadMedia(profilePhoto.path);
//     const photoUrl = cloudResponse.secure_url;

//     const updatedData = { name, photoUrl };
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       uploadData,
//       { new: true }.select("-password"),
//     );
//     return res.status(200).json({
//       success: true,
//       user: updatedUser,
//       message: "Your profile updated successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update user profile",
//     });
//   }
// };

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
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
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
