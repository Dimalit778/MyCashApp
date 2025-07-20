import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  let token, refreshToken;

  if (req.cookies.token || req.cookies.refreshToken) {
    token = req.cookies.token;
    refreshToken = req.cookies.refreshToken;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    refreshToken = req.headers.refresh;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN);
      const user = await User.findById(decoded.userId).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Unauthorized: User not found");
      }
      req.user = user;
      return next();
    } catch (error) {
      console.log("Access token verification failed:", error.message);
    }
  }

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized: No tokens available");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    if (req.cookies.token || req.cookies.refreshToken) {
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
    } else {
      // Set the header name to match what the frontend is expecting
      res.set("MobileToken", newAccessToken);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (req.cookies.token) {
      res.clearCookie("token");
      res.clearCookie("refreshToken");
    }
    throw new ApiError(401, "Invalid refresh token");
  }
});

// Admin authorization middleware
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized: Please login first");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admin access required");
  }

  next();
});
