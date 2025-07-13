import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import { TRANSACTION_TYPES } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getYearlyData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { year } = req.query;

  if (!year) {
    throw new ApiError(400, "Year is required");
  }

  const yearNum = parseInt(year);
  const result = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        $expr: {
          $and: [{ $eq: [{ $year: "$date" }, yearNum] }],
        },
      },
    },
    {
      $facet: {
        yearlyTotals: [
          {
            $group: {
              _id: "$transactionType",
              total: { $sum: "$amount" },
            },
          },
        ],
        monthlyStats: [
          {
            $group: {
              _id: {
                month: { $month: "$date" },
                transactionType: "$transactionType",
              },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.month": 1 } },
        ],
      },
    },
  ]);

  // Create an object with defaulted values for both expense and income types
  const yearlyTotals = {
    totalIncomes: 0,
    totalExpenses: 0,
    totalBalance: 0,
  };

  // Process yearly totals
  result[0].yearlyTotals.forEach((item) => {
    if (item._id === "incomes") yearlyTotals.totalIncomes = item.total;
    if (item._id === "expenses") yearlyTotals.totalExpenses = item.total;
  });

  // Calculate balance (improved sign handling)
  yearlyTotals.totalBalance =
    yearlyTotals.totalIncomes - yearlyTotals.totalExpenses;

  // More efficient monthly stats creation
  const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalIncomes: 0,
    totalExpenses: 0,
    balance: 0,
  }));

  // Fill in the actual values from the aggregation
  result[0].monthlyStats.forEach((stat) => {
    const monthIndex = stat._id.month - 1;
    if (stat._id.transactionType === "incomes") {
      monthlyStats[monthIndex].totalIncomes = stat.total;
    } else if (stat._id.transactionType === "expenses") {
      monthlyStats[monthIndex].totalExpenses = stat.total;
    }
  });

  monthlyStats.forEach((month) => {
    month.balance = month.totalIncomes - month.totalExpenses;
  });

  return res.json(
    new ApiResponse(
      200,
      {
        yearlyStats: yearlyTotals,
        monthlyStats,
      },
      "Yearly data retrieved successfully"
    )
  );
});

const getMonthlyData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { year, month, type } = req.query;

  if (!year || !month || !type) {
    throw new ApiError(400, "Year, month, and type parameters are required");
  }
  if (month < 0 || month > 11) {
    throw new ApiError(400, "Invalid month");
  }

  const yearNum = parseInt(year);
  const monthNum = parseInt(month) + 1;

  const transactions = await Transaction.find({
    user: userId,
    transactionType: type,
    $expr: {
      $and: [
        { $eq: [{ $year: "$date" }, yearNum] },
        { $eq: [{ $month: "$date" }, monthNum] },
      ],
    },
  })
    .populate("category", "description type")
    .lean();

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transactions,
        total,
      },
      "Monthly Transactions retrieved successfully"
    )
  );
});

const getOneTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
  });
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transaction },
        "Transaction retrieved successfully"
      )
    );
});

const addTransaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { description, amount, category, date, type } = req.body;

  if (!description || !date || !category || !type || amount === undefined) {
    throw new ApiError(400, "All required fields must be provided", [
      "description",
      "date",
      "category",
      "type",
      "amount",
    ]);
  }
  if (typeof amount !== "number" || isNaN(amount)) {
    throw new ApiError(400, "Amount must be a number");
  }
  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }

  if (amount > 1000000) {
    throw new ApiError(400, "Amount must be less than 1000000");
  }

  if (type !== TRANSACTION_TYPES.INCOME && type !== TRANSACTION_TYPES.EXPENSE) {
    throw new ApiError(400, "Invalid transaction type");
  }

  if (description.length > 20 || description.length <= 1) {
    throw new ApiError(400, "Description must be between 1 and 20 characters");
  }

  // Create transaction with just the category description
  const transaction = new Transaction({
    description,
    amount,
    date,
    transactionType: type,
    category,
    user: userId,
  });

  await transaction.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, { transaction }, "Transaction created successfully")
    );
});

const updateTransaction = asyncHandler(async (req, res) => {
  const { _id, description, amount, date, type, category } = req.body;
  const userId = req.user._id;

  const existingTransaction = await Transaction.findOne({
    _id,
    user: userId,
  });

  if (!existingTransaction) {
    throw new ApiError(404, "Transaction not found");
  }
  if (amount !== undefined) {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new ApiError(400, "Amount must be a number");
    }
    if (amount <= 0) {
      throw new ApiError(400, "Amount must be greater than 0");
    }

    if (amount > 1000000) {
      throw new ApiError(400, "Amount must be less than 1000000");
    }
  }

  let updateData = { description, amount, date };

  if (category) {
    const categoryToUpdate = await Category.findOne({
      user: userId,
      type: type,
      name: category,
    });

    if (!categoryToUpdate) {
      throw new ApiError(400, "Invalid category");
    }

    if (
      categoryToUpdate.type !== type &&
      type !== existingTransaction.transactionType
    ) {
      throw new ApiError(400, "Category type doesn't match transaction type");
    }

    updateData.category = categoryToUpdate.name;
  }

  // Update transaction
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id, user: userId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transaction: updatedTransaction },
        "Transaction updated successfully"
      )
    );
});
const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transactionId: id },
        "Transaction deleted successfully"
      )
    );
});

export {
  getYearlyData,
  getMonthlyData,
  getOneTransaction,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
