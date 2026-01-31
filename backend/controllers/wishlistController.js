import wishlistModel from "../models/wishlistModel.js"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.body.userId

    // Check if user exists
    const userExists = await userModel.findById(userId)
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if product exists
    const product = await productModel.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Find user's wishlist
    let wishlist = await wishlistModel.findOne({ user: userId })

    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
      wishlist = new wishlistModel({
        user: userId,
        items: [{ product: productId }],
      })
    } else {
      // Check if product already exists in wishlist
      const itemIndex = wishlist.items.findIndex((item) => item.product.toString() === productId)

      if (itemIndex > -1) {
        // Remove product if it already exists (toggle functionality)
        wishlist.items.splice(itemIndex, 1)
      } else {
        // Add new product to wishlist
        wishlist.items.push({ product: productId })
      }
    }

    // Save wishlist
    await wishlist.save()

    // Populate product details
    const populatedWishlist = await wishlistModel.findById(wishlist._id).populate("items.product")

    res.status(200).json({
      success: true,
      message: "Wishlist updated successfully",
      wishlist: populatedWishlist,
    })
  } catch (error) {
    console.error("Error updating wishlist:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
      error: error.message,
    })
  }
}

export const getWishlist = async (req, res) => {
  try {
    const userId = req.body.userId

    // Check if user exists
    const userExists = await userModel.findById(userId)
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Find user's wishlist and populate product details
    const wishlist = await wishlistModel.findOne({ user: userId }).populate("items.product")

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        wishlist: { items: [] },
      })
    }

    res.status(200).json({
      success: true,
      wishlist,
    })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    })
  }
}

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.body.userId

    // Find user's wishlist
    const wishlist = await wishlistModel.findOne({ user: userId })

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      })
    }

    // Remove the item from the wishlist
    wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId)

    // Save wishlist
    await wishlist.save()

    // Populate product details
    const populatedWishlist = await wishlistModel.findById(wishlist._id).populate("items.product")

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist successfully",
      wishlist: populatedWishlist,
    })
  } catch (error) {
    console.error("Error removing wishlist item:", error)
    res.status(500).json({
      success: false,
      message: "Failed to remove item from wishlist",
      error: error.message,
    })
  }
}

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.body.userId

    // Find user's wishlist
    const wishlist = await wishlistModel.findOne({ user: userId })

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      })
    }

    // Clear wishlist items
    wishlist.items = []

    // Save wishlist
    await wishlist.save()

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist,
    })
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    })
  }
}
