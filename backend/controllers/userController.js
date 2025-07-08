import User from "../models/userSchema.js";
import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import DefaultCategory from "../models/defaultCategorySchema.js";
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

// Admin Controllers
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", role = "" } = req.query;

  // Build search query
  const searchQuery = {};

  if (search) {
    searchQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role && role !== "all") {
    searchQuery.role = role;
  }

  const users = await User.find(searchQuery)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const totalUsers = await User.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      "Users fetched successfully"
    )
  );
});

const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: "admin" });
  const regularUsers = await User.countDocuments({ role: "user" });

  // Get user registrations for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Get total transactions and categories across all users
  const totalTransactions = await Transaction.countDocuments();
  const totalCategories = await Category.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        adminUsers,
        regularUsers,
        recentUsers,
        totalTransactions,
        totalCategories,
      },
      "User statistics fetched successfully"
    )
  );
});

const adminDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  // Don't allow admin to delete themselves
  if (id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    // Delete all user data within transaction
    await Transaction.deleteMany({ user: id }).session(session);
    await Category.deleteMany({ user: id }).session(session);
    const deletedUser = await User.findByIdAndDelete(id).session(session);

    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }

    // Delete cloudinary image if exists
    if (deletedUser.imageUrl) {
      await cloudinary.uploader.destroy(deletedUser.imageUrl);
    }

    await session.commitTransaction();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "User and all associated data deleted successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Failed to delete user. Please try again.");
  } finally {
    await session.endSession();
  }
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  if (!role || !["admin", "user"].includes(role)) {
    throw new ApiError(400, "Valid role is required (admin or user)");
  }

  // Don't allow admin to change their own role
  if (id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User role updated successfully"));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(id)
    .select("-password -refreshToken")
    .populate({
      path: "transactions",
      options: { sort: { createdAt: -1 }, limit: 5 },
    });
  console.log("user ----------", user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Get user statistics
  const userTransactionCount = await Transaction.countDocuments({ user: id });
  const userCategoryCount = await Category.countDocuments({ user: id });

  // Calculate total income and expenses
  const incomeTotal = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(id), type: "incomes" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const expenseTotal = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(id), type: "expenses" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        stats: {
          transactionCount: userTransactionCount,
          categoryCount: userCategoryCount,
          totalIncome: incomeTotal[0]?.total || 0,
          totalExpenses: expenseTotal[0]?.total || 0,
          balance: (incomeTotal[0]?.total || 0) - (expenseTotal[0]?.total || 0),
        },
      },
      "User details fetched successfully"
    )
  );
});

const getHistoricalData = asyncHandler(async (req, res) => {
  const period = parseInt(req.query.period) || 30;

  // Calculate the date 'period' days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Aggregate users by creation date
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Aggregate transactions by type
  const transactionTypes = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
  ]);

  // Fill in missing dates for user growth data
  const userGrowthByDate = {};
  for (let i = 0; i < period; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    userGrowthByDate[dateStr] = 0;
  }

  // Populate with actual data
  userGrowth.forEach((item) => {
    userGrowthByDate[item._id] = item.count;
  });

  // Convert to array format for frontend
  const userGrowthData = Object.entries(userGrowthByDate).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  res.status(200).json({
    success: true,
    data: {
      userGrowth: userGrowthData,
      transactionTypes,
    },
  });
});
const getDatabaseStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.find({}).select("-password -refreshToken");

  const totalTransactions = await Transaction.find({});

  const totalCategories = await Category.find();
  const totalDefaultCategories = await DefaultCategory.find({});
  const totalExpenses = await Transaction.find({ transactionType: "expenses" });
  const totalIncomes = await Transaction.find({ transactionType: "incomes" });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalTransactions,
        totalCategories,
        totalDefaultCategories,
        totalExpenses,
        totalIncomes,
      },
      "Database stats fetched successfully"
    )
  );
});

export {
  updateUser,
  getUser,
  deleteUser,
  imageActions,
  // Admin exports
  getAllUsers,
  getUserStats,
  adminDeleteUser,
  updateUserRole,
  getUserDetails,
  getHistoricalData,
  getDatabaseStats,
};
