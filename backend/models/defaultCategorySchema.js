import mongoose from "mongoose";
import { TRANSACTION_TYPES } from "../config/config.js";

const defaultCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(TRANSACTION_TYPES),
        message: "{VALUE} is not a valid type",
      },
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DefaultCategory = mongoose.model(
  "DefaultCategory",
  defaultCategorySchema
);
export default DefaultCategory;
