import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    console.log("Getting all orders, user:", req.user)
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message })
  }
}

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    console.log("Getting user orders, user:", req.user)
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    res.status(500).json({ success: false, message: "Error fetching your orders", error: error.message })
  }
}

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body

    // Create the order
    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: paymentMethod === "COD" ? "Processing" : "Pending",
    })

    // If payment method is Stripe, create a payment intent
    if (paymentMethod === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Stripe requires amount in cents
        currency: "usd",
        metadata: {
          orderId: order._id.toString(),
        },
      })

      order.paymentInfo = {
        id: paymentIntent.id,
        status: paymentIntent.status,
      }

      await order.save()

      return res.status(201).json({
        success: true,
        order,
        clientSecret: paymentIntent.client_secret,
      })
    }

    // For COD, just save the order
    await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    }

    res.status(201).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ success: false, message: "Error creating order", error: error.message })
  }
}

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    res.status(500).json({ success: false, message: "Error updating order status", error: error.message })
  }
}

// Verify Stripe payment
export const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.query

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      const orderId = paymentIntent.metadata.orderId

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status: "Processing",
          "paymentInfo.status": "succeeded",
        },
        { new: true },
      )

      // Update product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      }

      return res.status(200).json({
        success: true,
        message: "Payment successful",
        order,
      })
    }

    res.status(400).json({
      success: false,
      message: "Payment not successful",
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message })
  }
}
