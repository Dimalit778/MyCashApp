import User from "../models/userSchema.js";
import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import mongoose from "mongoose";
import cloudinary from "../cloudinary.js";

import handleProfileImage from "../utils/handleProfileImage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { customUserFields } from "../utils/customUserFields.js";
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: customUserFields(user),
      },
      "User Fetched Successfully"
    )
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (currentPassword && newPassword) {
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(400, "Incorrect password");
    }
    user.password = newPassword;
  }

  // Check and update fields only if they've changed
  if (firstName !== undefined && firstName.trim() !== user.firstName) {
    if (firstName.trim() === "") {
      throw new ApiError(400, "First name cannot be empty");
    }
    user.firstName = firstName.trim();
  }

  if (lastName !== undefined && lastName.trim() !== user.lastName) {
    if (lastName.trim() === "") {
      throw new ApiError(400, "Last name cannot be empty");
    }
    user.lastName = lastName.trim();
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: customUserFields(user),
      },
      "User Updated Successfully"
    )
  );
});
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "User not found");
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    // Delete all user data within transaction
    const deletedTransactions = await Transaction.deleteMany({
      user: userId,
    }).session(session);
    const deletedCategory = await Category.deleteMany({ user: userId }).session(
      session
    );
    const deletedUser = await User.findByIdAndDelete(userId).session(session);

    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }

    // Delete cloudinary image if exists
    if (deletedUser.imageUrl) {
      await cloudinary.uploader.destroy(deletedUser.imageUrl);
    }

    await session.commitTransaction();
    res.clearCookie("token");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "All user data has been deleted successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Failed to delete user data. Please try again.");
  } finally {
    await session.endSession();
  }
});
const imageActions = asyncHandler(async (req, res) => {
  const { image } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await handleProfileImage(user, image);

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: customUserFields(user),
      },
      "Image updated successfully"
    )
  );
});

export { updateUser, getUser, deleteUser, imageActions };
