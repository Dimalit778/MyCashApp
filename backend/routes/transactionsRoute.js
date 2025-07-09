import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyData,
  getOneTransaction,
  getYearlyData,
  updateTransaction,
} from "../controllers/transactionController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/monthly", getMonthlyData);
router.get("/yearly", getYearlyData);
router.get("/getOne/:id", getOneTransaction);
router.post("/add", addTransaction);
router.patch("/update", updateTransaction);
router.delete("/delete/:id", deleteTransaction);

export default router;
