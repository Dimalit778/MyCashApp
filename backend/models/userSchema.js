import mongoose from "mongoose";
import { SUBSCRIPTION_TYPES } from "../config/config.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    subscription: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TYPES),
      default: SUBSCRIPTION_TYPES.FREE,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("categories", {
  ref: "Category",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "user",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  if (!process.env.TOKEN) {
    throw new ApiError(500, "JWT secret key is not defined");
  }

  return jwt.sign({ userId: this._id }, process.env.TOKEN, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN) {
    throw new ApiError(500, "Refresh token secret is not defined");
  }

  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
