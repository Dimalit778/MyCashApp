import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectMongoDB from "./db/connectDB.js";
import bodyParser from "body-parser";
// Routes
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import transactionRoutes from "./routes/transactionsRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import seedRoutes from "./routes/seedRoutes.js";

import adminRoutes from "./routes/adminRoute.js";
// Middleware

import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = 8080;
const ORIGIN =
  process.env.NODE_ENV === "production"
    ? process.env.RENDER_FRONTEND_URL
    : "http://localhost:3000";

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- CORS configurations
app.use(
  cors({
    origin: [
      ORIGIN,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.CLIENT_URL,
      process.env.RENDER_FRONTEND_URL,
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/seed", seedRoutes);

// Additional CORS headers and preflight handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});
//  Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
