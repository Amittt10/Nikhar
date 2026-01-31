import cartModel from "../models/cartModel.js"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user.id

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

    // Find user's cart
    let cart = await cartModel.findOne({ user: userId })

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [{ product: productId, quantity }],
      })
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity = quantity
      } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity })
      }
    }

    // Save cart
    await cart.save()

    // Populate product details
    const populatedCart = await cartModel.findById(cart._id).populate("items.product", "name price images")

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: populatedCart,
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    })
  }
}

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id

    // Check if user exists
    const userExists = await userModel.findById(userId)
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Find user's cart and populate product details
    const cart = await cartModel.findOne({ user: userId }).populate("items.product", "name price images")

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: { items: [] },
      })
    }

    res.status(200).json({
      success: true,
      cart,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    })
  }
}

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user.id

    // Find user's cart
    const cart = await cartModel.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      })
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity

    // Save cart
    await cart.save()

    // Populate product details
    const populatedCart = await cartModel.findById(cart._id).populate("items.product", "name price images")

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart: populatedCart,
    })
  } catch (error) {
    console.error("Error updating cart item:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    })
  }
}

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.user.id

    // Find user's cart
    const cart = await cartModel.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => item.product.toString() !== productId)

    // Save cart
    await cart.save()

    // Populate product details
    const populatedCart = await cartModel.findById(cart._id).populate("items.product", "name price images")

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: populatedCart,
    })
  } catch (error) {
    console.error("Error removing cart item:", error)
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    })
  }
}

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id

    // Find user's cart
    const cart = await cartModel.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    // Clear cart items
    cart.items = []

    // Save cart
    await cart.save()

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    })
  } catch (error) {
    console.error("Error clearing cart:", error)
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    })
  }
}
