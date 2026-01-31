import express from "express"
import { addBanner, listBanners, removeBanner, updateBanner } from "../controllers/bannerController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const bannerRouter = express.Router()

// Add banner route with file upload
bannerRouter.post("/add", adminAuth, upload.single("image"), addBanner)

// Update banner route with file upload
bannerRouter.post("/update", adminAuth, upload.single("image"), updateBanner)

// Remove banner route
bannerRouter.post("/remove", adminAuth, removeBanner)

// List all banners route (public)
bannerRouter.get("/list", listBanners)

export default bannerRouter
