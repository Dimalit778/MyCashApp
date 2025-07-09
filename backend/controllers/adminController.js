import User from "../models/userSchema.js";
import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import DefaultCategory from "../models/defaultCategorySchema.js";
import mongoose from "mongoose";
import cloudinary from "../cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
  console.log("getUserStats");
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

// Default Categories
const getAllDefaultCategories = asyncHandler(async (req, res) => {
  const defaultCategories = await DefaultCategory.find().sort({
    type: 1,
    name: 1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        defaultCategories,
        "Default categories fetched successfully"
      )
    );
});

const addDefaultCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    throw new ApiError(400, "Name and type are required");
  }

  if (name.length < 2) {
    throw new ApiError(400, "Category name must be at least 2 characters");
  }

  if (name.length > 30) {
    throw new ApiError(400, "Category name must not exceed 30 characters");
  }

  // Check if category with same name and type already exists
  const existingCategory = await DefaultCategory.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
    type,
  });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const defaultCategory = await DefaultCategory.create({
    name,
    type,
    isActive: true,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        defaultCategory,
        "Default category created successfully"
      )
    );
});

const updateDefaultCategory = asyncHandler(async (req, res) => {
  const { name, type, isActive, _id } = req.body;

  if (!_id) {
    throw new ApiError(400, "Category ID is required");
  }

  const defaultCategory = await DefaultCategory.findById(_id);

  if (!defaultCategory) {
    throw new ApiError(404, "Default category not found");
  }

  if (name) defaultCategory.name = name;
  if (type) defaultCategory.type = type;
  if (isActive !== undefined) defaultCategory.isActive = isActive;

  await defaultCategory.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        defaultCategory,
        "Default category updated successfully"
      )
    );
});

const deleteDefaultCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Category ID is required");
  }

  const deletedCategory = await DefaultCategory.findByIdAndDelete(id);

  if (!deletedCategory) {
    throw new ApiError(404, "Default category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Default category deleted successfully"));
});
// Database Stats
const getDatabaseStats = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  const transactions = await Transaction.find({});

  const categories = await Category.find();
  const defaultCategories = await DefaultCategory.find({});
  const expenses = await Transaction.find({ transactionType: "expenses" });
  const incomes = await Transaction.find({ transactionType: "incomes" });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        usersCount: users.length,
        transactions,
        transactionsCount: transactions.length,
        categories,
        categoriesCount: categories.length,
        defaultCategories,
        defaultCategoriesCount: defaultCategories.length,
        expenses,
        expensesCount: expenses.length,
        incomes,
        incomesCount: incomes.length,
      },
      "Database stats fetched successfully"
    )
  );
});
const dbActions = asyncHandler(async (req, res) => {
  const { operation } = req.params;
  switch (operation) {
    case "users":
      await User.deleteMany({ _id: { $ne: req.user._id } });
      await Transaction.deleteMany({});
      await Category.deleteMany({});
      break;
    case "transactions":
      await Transaction.deleteMany({});
      break;
    case "categories":
      await Category.deleteMany({});
      break;
    case "defaultCategories":
      await DefaultCategory.deleteMany({});
      break;
    case "expenses":
      await Transaction.deleteMany({ transactionType: "expenses" });
      break;
    case "incomes":
      await Transaction.deleteMany({ transactionType: "incomes" });
      break;
    case "all":
      await User.deleteMany({ _id: { $ne: req.user._id } });
      await Transaction.deleteMany({});
      await Category.deleteMany({});
      await DefaultCategory.deleteMany({});
      break;
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Database operation completed successfully")
    );
});

export {
  getAllUsers,
  getUserStats,
  adminDeleteUser,
  updateUserRole,
  getUserDetails,
  getHistoricalData,
  getDatabaseStats,
  getAllDefaultCategories,
  addDefaultCategory,
  updateDefaultCategory,
  deleteDefaultCategory,
  dbActions,
};
