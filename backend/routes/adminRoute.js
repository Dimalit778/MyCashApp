import express from "express";
import { adminOnly, protectRoute } from "../middleware/protectRoute.js";
import {
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
  getUserCategories,
  getUserTransactions,
  getUserTransactionsPaginated,
} from "../controllers/adminController.js";
const router = express.Router();

router.use(protectRoute, adminOnly);
router
  .get("/all", getAllUsers)
  .get("/stats", getUserStats)
  .get("/user/:id", getUserDetails)
  .delete("/deleteUser/:id", adminDeleteUser)
  .patch("/updateUser/:id/role", updateUserRole)
  // User Categories
  .get("/user/:userId/categories", getUserCategories)
  // User Transactions
  .get("/user/:userId/transactions", getUserTransactions)
  .get("/user/:userId/transactions-paginated", getUserTransactionsPaginated)
  // Historical Data
  .get("/historical", getHistoricalData)
  .get("/database-stats", getDatabaseStats)
  // Default Categories
  .get("/getDefaultCategories", getAllDefaultCategories)
  .post("/addDefaultCategory", addDefaultCategory)
  .patch("/updateDefaultCategory/:id", updateDefaultCategory)
  .delete("/deleteDefaultCategory/:id", deleteDefaultCategory)
  // Database Actions DELETE
  .delete("/dbActions/:operation", dbActions);

export default router;
