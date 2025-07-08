import express from "express";
import {
  seedClearDb,
  seedMultipleUsers,
  seedTransactions,
  seedUserWithCategories,
  seedAdminUser,
  seedDefaultCategories,
  handleDatabaseOperation,
} from "../controllers/seedDbController.js";
import { protectRoute, adminOnly } from "../middleware/protectRoute.js";

const router = express.Router();

router
  .post("/userAndCategories", seedUserWithCategories)
  .post("/admin", seedAdminUser)
  .post("/transactions", seedTransactions)
  .post("/multipleUsers", seedMultipleUsers)
  .post("/default-categories", seedDefaultCategories)
  .delete("/clear", seedClearDb)
  .delete(
    "/operation/:operation",
    protectRoute,
    adminOnly,
    handleDatabaseOperation
  );

export default router;
