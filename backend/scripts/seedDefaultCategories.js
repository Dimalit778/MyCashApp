import mongoose from "mongoose";
import dotenv from "dotenv";
import DefaultCategory from "../models/defaultCategorySchema.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedDefaultCategories = async () => {
  try {
    // Clear existing default categories
    await DefaultCategory.deleteMany({});
    console.log("Cleared existing default categories");

    // Create new default categories
    const defaultCategories = [
      // Income categories
      { name: "Salary", type: "incomes", isActive: true },
      { name: "Freelance", type: "incomes", isActive: true },
      { name: "Investment", type: "incomes", isActive: true },
      { name: "Gifts", type: "incomes", isActive: true },
      { name: "Other Income", type: "incomes", isActive: true },

      // Expense categories
      { name: "Food", type: "expenses", isActive: true },
      { name: "Transport", type: "expenses", isActive: true },
      { name: "Housing", type: "expenses", isActive: true },
      { name: "Utilities", type: "expenses", isActive: true },
      { name: "Healthcare", type: "expenses", isActive: true },
      { name: "Entertainment", type: "expenses", isActive: true },
      { name: "Shopping", type: "expenses", isActive: true },
      { name: "Education", type: "expenses", isActive: true },
      { name: "Other Expense", type: "expenses", isActive: true },
    ];

    const result = await DefaultCategory.insertMany(defaultCategories);
    console.log(`${result.length} default categories created successfully`);

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding default categories:", error);
    process.exit(1);
  }
};

seedDefaultCategories();
