import Category from "../models/categorySchema.js";
import { CATEGORY_LIMITS } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getCategories = asyncHandler(async (req, res) => {
  const type = req.query.type;
  const userId = req.user._id;
  const maxCategories = CATEGORY_LIMITS[req.user.subscription];

  if (!type || (type !== "expenses" && type !== "incomes")) {
    throw new ApiError(400, "Invalid category type");
  }
  const categories = await Category.find({
    user: userId,
    type: type,
  });

  return res.status(200).json(
    new ApiResponse(200, {
      categories,
      maxCategories,
    })
  );
});
const addCategory = asyncHandler(async (req, res) => {
  const { categoryName: name, type } = req.body;
  const userId = req.user._id;

  // Validate name
  if (!name || name.length < 2 || name.length > 20) {
    throw new ApiError(400, "Name must be between 2 and 20 characters");
  }

  // Check for category limit
  const existingCategories = await Category.countDocuments({
    user: userId,
    type: type,
  });

  const limit = CATEGORY_LIMITS[req.user.subscription];
  if (existingCategories >= limit) {
    throw new ApiError(400, `Cannot add more than ${limit} categories`);
  }

  // Check for duplicates
  const isDuplicate = await Category.findOne({
    user: userId,
    type: type,
    name: { $regex: new RegExp(`^${name}$`, "i") }, // Case insensitive check
  });

  if (isDuplicate) {
    throw new ApiError(400, "Category already exists");
  }

  // Create new category
  const newCategory = await Category.create({
    name,
    type,
    user: userId,
  });

  // Get all user categories to return
  const userCategories = await Category.find({ user: userId });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        category: newCategory,
        categories: userCategories,
      },
      "Category added successfully"
    )
  );
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find the category
  const category = await Category.findOne({
    _id: id,
    user: userId,
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Delete the category
  await Category.deleteOne({ _id: id, user: userId });

  // Get updated categories list
  const categories = await Category.find({ user: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Category deleted successfully")
    );
});

export { getCategories, addCategory, deleteCategory };
