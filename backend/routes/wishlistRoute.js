import express from "express"
import { addToWishlist, getWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishlistController.js"
import authUser from "../middleware/auth.js"

const wishlistRouter = express.Router()

// Route to get user wishlist data
wishlistRouter.get("/", authUser, getWishlist)

// Route to add/remove product to/from user wishlist
wishlistRouter.post("/", authUser, addToWishlist)

// Route to remove item from wishlist
wishlistRouter.delete("/:productId", authUser, removeFromWishlist)

// Route to clear wishlist
wishlistRouter.delete("/", authUser, clearWishlist)

export default wishlistRouter
