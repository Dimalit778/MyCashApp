import express from "express";

import {
  addTransaction,
  deleteTransaction,
  getMonthlyData,
  getOneTransaction,
  getYearlyData,
  updateTransaction,
  getUserTransactions,
} from "../controllers/transactionController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router
  .get("/monthly", getMonthlyData)
  .get("/yearly", getYearlyData)
  .get("/getOne/:id", getOneTransaction)
  .post("/add", addTransaction)
  .patch("/update", updateTransaction) // change to req.body
  .delete("/delete/:id", deleteTransaction)
  .get("/user/:userId", getUserTransactions);

export default router;
