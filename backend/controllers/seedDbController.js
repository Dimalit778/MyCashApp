import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Category from "./../models/categorySchema.js";
import Transaction from "./../models/transactionSchema.js";
import User from "./../models/userSchema.js";
import DefaultCategory from "../models/defaultCategorySchema.js";

const seedUserWithCategories = asyncHandler(async (req, res) => {
  // Delete all users except those with role 'admin'
  await User.deleteMany({ email: { $ne: "cypress-ad@gmail.com" } });
  await Category.deleteMany({});

  const user = new User({
    firstName: "Test",
    lastName: "User",
    email: "cypress@gmail.com",
    password: "cypress123",
    imageUrl: null,
    role: "user",
  });
  await user.save();

  const categories = await Category.insertMany([
    { user: user._id, name: "Home", type: "expenses" },
    { user: user._id, name: "Other", type: "expenses" },
    { user: user._id, name: "Job", type: "incomes" },
    { user: user._id, name: "Other", type: "incomes" },
  ]);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user,
        categories,
      },
      "User created successfully"
    )
  );
});

const seedAdminUser = asyncHandler(async (req, res) => {
  await User.deleteMany({});
  await DefaultCategory.deleteMany({});

  const adminUser = await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "cypress-ad@gmail.com",
    password: "admin123",
    role: "admin",
    imageUrl: null,
  });

  // Create some default categories for admin user
  const categories = await DefaultCategory.insertMany([
    { name: "Home", type: "expenses", isActive: true },
    { name: "Other", type: "expenses", isActive: true },
    { name: "Work", type: "incomes", isActive: true },
    { name: "Other", type: "incomes", isActive: true },
  ]);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: adminUser,
        categories,
      },
      "Admin user created successfully"
    )
  );
});

const seedTransactions = asyncHandler(async (req, res) => {
  await Transaction.deleteMany({});
  const { count = 45, type, monthly } = req.body;

  const user = await User.findOne({ email: "cypress@gmail.com" });
  if (!user) throw new ApiError(404, "User not found");

  const categories = await Category.find({ user: user._id });
  if (!categories) throw new ApiError(404, "User not found");

  const transactions = [];

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const transactionType = type || (i % 2 === 0 ? "expenses" : "incomes");

    const categoriesForType = categories.filter(
      (cat) => cat.type === transactionType
    );
    const categoryIndex = i % categoriesForType.length;
    const selectedCategory = categoriesForType[categoryIndex];
    const day = 1 + Math.floor(Math.random() * 28);
    const month = monthly
      ? new Date().getMonth()
      : Math.floor(Math.random() * 12);

    transactions.push({
      description: `${selectedCategory.name} ${i + 1}`,
      amount: Math.floor(Math.random() * 10000),
      date: new Date(currentYear, month, day),
      transactionType,
      category: selectedCategory.name,
      user: user._id,
    });
  }

  const savedTransactions = await Transaction.insertMany(transactions);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transactionsCount: savedTransactions.length,
      },
      "Transactions seeded successfully"
    )
  );
});
const seedMultipleUsers = asyncHandler(async (req, res) => {
  await User.deleteMany({});
  const user1 = await User.create({
    firstName: "Test",
    lastName: "User",
    email: "cypress@gmail.com",
    password: "144695",
    imageUrl: null,
  });

  const user2 = await User.create({
    firstName: "Daniel",
    lastName: "Smith",
    email: "daniel@gmail.com",
    password: "144695",
    imageUrl: null,
  });

  const user3 = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    password: "144695",
    imageUrl: null,
  });

  const user4 = await User.create({
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@gmail.com",
    password: "144695",
    imageUrl: null,
  });

  const users = [user1, user2, user3, user4];

  return res
    .status(201)
    .json(new ApiResponse(201, { users }, "Users created successfully"));
});

const seedClearDb = asyncHandler(async (req, res) => {
  await Transaction.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});
  await DefaultCategory.deleteMany({});
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Database cleared successfully"));
});

// Seed default categories
const seedDefaultCategories = asyncHandler(async (req, res) => {
  // Clear existing default categories
  await DefaultCategory.deleteMany({});

  // Create new default categories
  const defaultCategories = [
    { name: "Home", type: "expenses", isActive: true },
    { name: "Other", type: "expenses", isActive: true },
    { name: "Work", type: "incomes", isActive: true },
    { name: "Other", type: "incomes", isActive: true },
  ];

  await DefaultCategory.insertMany(defaultCategories);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: defaultCategories.length },
        "Default categories seeded successfully"
      )
    );
});

const handleDatabaseOperation = asyncHandler(async (req, res) => {
  const { operation } = req.params;

  switch (operation) {
    case "users":
      await User.deleteMany({});
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "All users deleted successfully"));

    case "transactions":
      await Transaction.deleteMany({});
      return res
        .status(200)
        .json(
          new ApiResponse(200, {}, "All transactions deleted successfully")
        );

    case "categories":
      await Category.deleteMany({});
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "All categories deleted successfully"));

    case "default-categories":
      await DefaultCategory.deleteMany({});
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "All default categories deleted successfully"
          )
        );

    case "expenses":
      await Transaction.deleteMany({ type: "expenses" });
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "All expenses deleted successfully"));

    case "incomes":
      await Transaction.deleteMany({ type: "incomes" });
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "All incomes deleted successfully"));

    case "all":
      await Transaction.deleteMany({});
      await Category.deleteMany({});
      await User.deleteMany({});
      await DefaultCategory.deleteMany({});
      return res
        .status(200)
        .json(
          new ApiResponse(200, {}, "All database data deleted successfully")
        );

    default:
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid operation specified"));
  }
});

export {
  seedUserWithCategories,
  seedAdminUser,
  seedTransactions,
  seedMultipleUsers,
  seedClearDb,
  seedDefaultCategories,
  handleDatabaseOperation,
};
