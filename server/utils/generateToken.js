// import jwt from "jsonwebtoken";

// export const generateToken = (res, user, message) => {
//   console.log("SECRET KEY:", process.env.SECRET_KEY);
//   const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//     expiresIn: "1d",
//   });
//   return res
//     .status(200)
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: true, // 🔥 add this
//       // sameSite: "strict",
//       sameSite: "none", // 🔥 change here
//       path: "/", // 🔥 important
//       maxAge: 24 * 60 * 60 * 1000,
//     })
//     .json({
//       success: true,
//       message,
//       user,
//     });
// };

import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost এ false
      sameSite: "lax", // 🔥 এটা important
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message,
      user,
    });
};
