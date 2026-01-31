import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import { v2 as cloudinary } from "cloudinary"

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const Exists = await userModel.findOne({ email })
    if (Exists) {
      return res.json({ success: false, message: "User already exists" })
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    })

    const user = await newUser.save()
    const token = createToken(user._id)

    res.json({ success: true, token })
  } catch (error) {
    console.error("Error registering user:", error.message)
    res.json({ success: false, message: "Internal Server Error" })
  }
}

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" })
    }

    // Validate password
    const isMatched = await bcrypt.compare(password, user.password)
    if (isMatched) {
      const token = createToken(user._id)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid Credentials" })
    }
  } catch (error) {
    console.error("Error logging in user:", error.message)
    res.json({ success: false, message: "Internal Server Error" })
  }
}

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      return res.json({ success: false, message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Error logging in admin:", error.message)
    res.json({ success: false, message: "Internal Server Error" })
  }
}

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId
    const { name, phone } = req.body

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update fields
    if (name) user.name = name
    if (phone) user.phone = phone

    // Handle profile picture upload if provided
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pictures",
          width: 300,
          crop: "scale",
        })

        user.profilePicture = result.secure_url
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError)
        return res.status(400).json({
          success: false,
          message: "Error uploading profile picture",
        })
      }
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

// Update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.body.userId

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      })
    }

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
      width: 300,
      crop: "scale",
    })

    user.profilePicture = result.secure_url
    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    })
  } catch (error) {
    console.error("Error updating profile picture:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

// Update user password
const updatePassword = async (req, res) => {
  try {
    const userId = req.body.userId
    const { currentPassword, newPassword } = req.body

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    user.password = hashedPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Error updating password:", error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, updateProfilePicture, updatePassword }
