import express from "express"
import {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  verifyPayment,
} from "../controllers/orderController.js"
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"

const orderRouter = express.Router()

// Admin routes
orderRouter.get("/list", adminAuth, getAllOrders) // Fetch all orders (admin only)
orderRouter.patch("/status/:orderId", adminAuth, updateOrderStatus) // Update order status (admin only)

// User routes
orderRouter.get("/userorder", authUser, getUserOrders) // Fetch user's orders
orderRouter.post("/place", authUser, createOrder) // Place an order via COD
orderRouter.post("/stripe", authUser, createOrder) // Place an order via Stripe
orderRouter.get("/stripe/verify", authUser, verifyPayment) // Verify Stripe payment

export default orderRouter
