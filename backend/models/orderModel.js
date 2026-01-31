import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to user's ObjectId
    ref: "user", // Assuming a "user" model exists
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to product's ObjectId
        ref: "product", // Assuming a "product" model exists
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Order Placed", "Shipped", "Delivered", "Cancelled"], // Restrict to these statuses
    default: "Order Placed",
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Stripe", "Razorpay"], // Add more methods if applicable
  },
  payment: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date, // Use Date type for consistency and easier manipulation
    default: Date.now,
  },
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
export default orderModel
