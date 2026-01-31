import { v2 as cloudinary } from "cloudinary"
import bannerModel from "../models/bannerModel.js"

const addBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, order } = req.body

    // Validate required fields
    if (!title || !subtitle || !buttonText || !buttonLink) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Handle image upload
    const image = req.file
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      })
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" })
    const imageUrl = result.secure_url

    // Create banner data
    const bannerData = {
      title,
      subtitle,
      buttonText,
      buttonLink,
      image: imageUrl,
      order: order || 0,
      date: Date.now(),
    }

    // Save banner to database
    const banner = new bannerModel(bannerData)
    await banner.save()

    res.status(201).json({
      success: true,
      message: "Banner Added Successfully",
      banner: banner,
    })
  } catch (error) {
    console.error("Error adding banner:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    })
  }
}

const listBanners = async (req, res) => {
  try {
    const banners = await bannerModel.find({ active: true }).sort({ order: 1 })
    res.status(200).json({ success: true, banners })
  } catch (error) {
    console.error("Error listing banners:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

const removeBanner = async (req, res) => {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Banner ID is required",
      })
    }

    const banner = await bannerModel.findByIdAndDelete(id)

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Banner removed successfully",
    })
  } catch (error) {
    console.error("Error removing banner:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    })
  }
}

const updateBanner = async (req, res) => {
  try {
    const { id, title, subtitle, buttonText, buttonLink, active, order } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Banner ID is required",
      })
    }

    // Find existing banner
    const banner = await bannerModel.findById(id)
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    // Update fields if provided
    if (title) banner.title = title
    if (subtitle) banner.subtitle = subtitle
    if (buttonText) banner.buttonText = buttonText
    if (buttonLink) banner.buttonLink = buttonLink
    if (active !== undefined) banner.active = active
    if (order !== undefined) banner.order = order

    // Handle image upload if provided
    const image = req.file
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" })
      banner.image = result.secure_url
    }

    await banner.save()

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    })
  } catch (error) {
    console.error("Error updating banner:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    })
  }
}

export { addBanner, listBanners, removeBanner, updateBanner }
