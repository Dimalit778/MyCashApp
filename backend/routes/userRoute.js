import express from "express";

import {
  deleteUser,
  getUser,
  imageActions,
  updateUser,
  // Admin imports
  getAllUsers,
  getUserStats,
  adminDeleteUser,
  updateUserRole,
  getUserDetails,
  getHistoricalData,
  getDatabaseStats,
} from "../controllers/userController.js";
import { protectRoute, adminOnly } from "../middleware/protectRoute.js";

const router = express.Router();

// Regular user routes
router.use(protectRoute); // Protect all routes
router
  .get("/users/get", getUser)
  .patch("/users/update", updateUser)
  .delete("/users/delete", deleteUser)
  .patch("/users/imageActions", imageActions);

// Admin only routes
router.use(adminOnly); // All routes below require admin access
router
  .get("/admin/all", getAllUsers)
  .get("/admin/stats", getUserStats)
  .get("/admin/user/:id", getUserDetails)
  .delete("/admin/user/:id", adminDeleteUser)
  .patch("/admin/user/:id/role", updateUserRole)
  .get("/admin/historical", getHistoricalData)
  .get("/admin/database-stats", getDatabaseStats);

export default router;
