import express from "express"
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updatePassword,
} from "../controllers/userController.js"
import authUser from "../middleware/auth.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)

// Protected routes
userRouter.get("/profile", authUser, getUserProfile)
userRouter.put("/profile", authUser, updateUserProfile)
userRouter.put("/password", authUser, updatePassword)
userRouter.post("/profile-picture", authUser, upload.single("profilePicture"), updateProfilePicture)

export default userRouter
