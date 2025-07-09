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
} from "../controllers/adminController.js";
const router = express.Router();

router.use(protectRoute, adminOnly);
router
  .get("/all", getAllUsers)
  .get("/stats", getUserStats)
  .get("/user/:id", getUserDetails)
  .delete("/deleteUser/:id", adminDeleteUser)
  .patch("/updateUser/:id/role", updateUserRole)
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
