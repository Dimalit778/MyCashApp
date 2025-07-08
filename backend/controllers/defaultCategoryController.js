import DefaultCategory from "../models/defaultCategorySchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all default categories
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

// Add a new default category
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

// Update a default category
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

// Delete a default category
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

export {
  getAllDefaultCategories,
  addDefaultCategory,
  updateDefaultCategory,
  deleteDefaultCategory,
};
