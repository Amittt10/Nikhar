import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, bestseller, sizes } = req.body

    // Validate required fields
    if (!name || !description || !price || !category || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Handle image uploads
    const image1 = req.files?.image1?.[0]
    const image2 = req.files?.image2?.[0]
    const image3 = req.files?.image3?.[0]
    const image4 = req.files?.image4?.[0]

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      })
    }

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
        return result.secure_url
      }),
    )

    // Parse sizes if it's a string
    let parsedSizes
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes
    } catch (error) {
      parsedSizes = ["S", "M", "L"] // Default sizes if parsing fails
    }

    // Create product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" || bestseller === true,
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    }

    // Save product to database
    const product = new productModel(productData)
    await product.save()

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product: product,
    })
  } catch (error) {
    console.error("Error adding product:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    })
  }
}

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({})
    res.status(200).json({ success: true, products })
  } catch (error) {
    console.error("Error listing products:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    const product = await productModel.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Product removed successfully",
    })
  } catch (error) {
    console.error("Error removing product:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    })
  }
}

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    const product = await productModel.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Error fetching single product:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    console.log("Update product request body:", req.body)
    console.log("Update product request files:", req.files)

    const { id, name, description, price, category, subCategory, bestseller, sizes } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      })
    }

    // Find existing product
    const product = await productModel.findById(id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Update fields if provided
    if (name) product.name = name
    if (description) product.description = description
    if (price) product.price = Number(price)
    if (category) product.category = category
    if (subCategory) product.subCategory = subCategory
    if (bestseller !== undefined) product.bestseller = bestseller === "true" || bestseller === true
    if (sizes) {
      try {
        product.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes
      } catch (error) {
        product.sizes = ["S", "M", "L"]
      }
    }

    // Handle image uploads
    const image1 = req.files?.image1?.[0]
    const image2 = req.files?.image2?.[0]
    const image3 = req.files?.image3?.[0]
    const image4 = req.files?.image4?.[0]

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

    if (images.length > 0) {
      // Upload new images to Cloudinary
      const imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
          return result.secure_url
        }),
      )
      // Replace existing images with new ones
      product.image = imagesUrl
    }

    await product.save()

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    })
  }
}

export { listProduct, addProduct, removeProduct, singleProduct, updateProduct }
