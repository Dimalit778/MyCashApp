import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getUserCategories,
} from "../controllers/categoryController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/get", protectRoute, getCategories);
router.post("/add", protectRoute, addCategory);
router.delete("/delete/:id", protectRoute, deleteCategory);
router.get("/user/:userId", protectRoute, getUserCategories);

export default router;
