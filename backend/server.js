import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import bannerRouter from "./routes/bannerRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL, process.env.ADMIN_URL]
        : "*",
    credentials: true,
  })
);

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/wishlist", wishlistRouter);

// Home route
app.get("/", (req, res) => {
  res.send("Nikhar API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Start server after DB + Cloudinary connection
const startServer = async () => {
  await connectDB();
  await connectCloudinary();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
