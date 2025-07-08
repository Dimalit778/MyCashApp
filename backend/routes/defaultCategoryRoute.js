import express from "express";
import {
  getAllDefaultCategories,
  addDefaultCategory,
  updateDefaultCategory,
  deleteDefaultCategory,
} from "../controllers/defaultCategoryController.js";
import { protectRoute, adminOnly } from "../middleware/protectRoute.js";

const router = express.Router();

// All routes require authentication and admin privileges
router.use(protectRoute);
router.use(adminOnly);

router
  .get("/", getAllDefaultCategories)
  .post("/add", addDefaultCategory)
  .patch("/update/:id", updateDefaultCategory)
  .delete("/delete/:id", deleteDefaultCategory);

export default router;
