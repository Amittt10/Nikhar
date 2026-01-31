import express from "express"
import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
} from "../controllers/productController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const productRouter = express.Router()

// Add product route with file uploads
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct,
)

// Update product route with file uploads
productRouter.post(
  "/update",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
)

// Remove product route
productRouter.post("/remove", adminAuth, removeProduct)

// List all products route
productRouter.get("/list", listProduct)

// Get single product route
productRouter.post("/single", singleProduct)

export default productRouter
