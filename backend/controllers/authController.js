import User from "../models/userSchema.js";
import Category from "../models/categorySchema.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { customUserFields } from "../utils/customUserFields.js";

const generateTokenAndSetCookie = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate token");
  }
};
const signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw new ApiError(400, "All fields are required");
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new ApiError(400, "User already exists");
  }

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    const newUser = await user.save();
    await Category.insertMany([
      { user: newUser._id, name: "Home", type: "expenses" },
      { user: newUser._id, name: "Other", type: "expenses" },
      { user: newUser._id, name: "Job", type: "incomes" },
      { user: newUser._id, name: "Other", type: "incomes" },
    ]);

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          user: {
            ...user._doc,
          },
        },
        "User successfully created"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Failed to create user", error.stack);
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token").clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Invalid Email or Password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Email or Password");
  }

  const { accessToken, refreshToken } = await generateTokenAndSetCookie(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password ");
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("token", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: customUserFields(loggedInUser),
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export { signup, login, logout };
