import express from "express"
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js"
import authUser from "../middleware/auth.js"

const cartRouter = express.Router()

// Route to get user cart data
cartRouter.get("/", authUser, getCart)

// Route to add product to user cart
cartRouter.post("/items", authUser, addToCart)

// Route to update cart item
cartRouter.put("/", authUser, updateCartItem)

// Route to remove item from cart
cartRouter.delete("/:productId", authUser, removeCartItem)

// Route to clear cart
cartRouter.delete("/", authUser, clearCart)

export default cartRouter
