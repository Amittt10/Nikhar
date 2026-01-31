"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import axios from "axios"
import { backendUrl } from "../App"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/LoadingSpinner"

const Add = ({ token, loading, setLoading }) => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Makeup",
    subCategory: "Face",
    bestseller: false,
    sizes: ["25ml", "50ml", "100ml"],
  })

  const [newSize, setNewSize] = useState("")

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  })

  const [imagePreview, setImagePreview] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  })

  const [errors, setErrors] = useState({})

  const fileInputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    image4: useRef(null),
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  // Fetch product data if in edit mode
  useEffect(() => {
    if (productId) {
      setIsEditMode(true)
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const response = await axios.post(`${backendUrl}/api/product/single`, { productId }, { headers: { token } })
          if (response.data.success) {
            const product = response.data.product
            setFormData({
              name: product.name || "",
              description: product.description || "",
              price: product.price ? product.price.toString() : "",
              category: product.category || "Makeup",
              subCategory: product.subCategory || "Face",
              bestseller: product.bestseller || false,
              sizes: product.sizes || ["25ml", "50ml", "100ml"],
            })
            // Set image previews from existing product images
            const previews = {}
            product.image.forEach((imgUrl, index) => {
              previews[`image${index + 1}`] = imgUrl
            })
            setImagePreview(previews)
          } else {
            toast.error(response.data.message || "Failed to fetch product data")
          }
        } catch (error) {
          console.error("Error fetching product data:", error)
          toast.error(error.response?.data?.message || "An error occurred while fetching product data")
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [productId, token, setLoading])

  const handleNewSizeChange = (e) => {
    setNewSize(e.target.value)
  }

  const handleAddSize = () => {
    const trimmedSize = newSize.trim()
    if (trimmedSize === "") {
      toast.error("Size cannot be empty")
      return
    }
    if (formData.sizes.includes(trimmedSize)) {
      toast.error("Size already exists")
      return
    }
    setFormData({
      ...formData,
      sizes: [...formData.sizes, trimmedSize],
    })
    setNewSize("")
    if (errors.sizes) {
      setErrors({ ...errors, sizes: null })
    }
  }

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setImages({
      ...images,
      [imageKey]: file,
    })

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview({
        ...imagePreview,
        [imageKey]: reader.result,
      })
    }
    reader.readAsDataURL(file)

    // Clear error
    if (errors.images) {
      setErrors({ ...errors, images: null })
    }
  }

  const handleSizeToggle = (size) => {
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter((s) => s !== size),
      })
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size],
      })
    }

    // Clear error
    if (errors.sizes) {
      setErrors({ ...errors, sizes: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price.trim()) newErrors.price = "Price is required"
    else if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = "Price must be a positive number"

    if (formData.sizes.length === 0) newErrors.sizes = "At least one size must be selected"

    // Check if at least one image is uploaded or available in edit mode
    const hasImages =
      Object.values(images).some((img) => img !== null) || Object.values(imagePreview).some((img) => img !== null)

    if (!hasImages) {
      newErrors.images = "At least one product image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    try {
      setLoading(true)

      // Create form data for multipart/form-data
      const productFormData = new FormData()
      if (isEditMode) {
        productFormData.append("id", productId)
      }
      productFormData.append("name", formData.name)
      productFormData.append("description", formData.description)
      productFormData.append("price", formData.price)
      productFormData.append("category", formData.category)
      productFormData.append("subCategory", formData.subCategory)
      productFormData.append("bestseller", formData.bestseller)
      productFormData.append("sizes", JSON.stringify(formData.sizes))

      // Append images
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          productFormData.append(key, images[key])
        }
      })

      const url = isEditMode ? `${backendUrl}/api/product/update` : `${backendUrl}/api/product/add`

      const response = await axios.post(url, productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      })

      if (response.data.success) {
        toast.success(isEditMode ? "Product updated successfully!" : "Product added successfully!")

        if (!isEditMode) {
          // Reset form only if adding new product
          setFormData({
            name: "",
            description: "",
            price: "",
            category: "Makeup",
            subCategory: "Face",
            bestseller: false,
            sizes: ["S", "M", "L"],
          })

          setImages({
            image1: null,
            image2: null,
            image3: null,
            image4: null,
          })

          setImagePreview({
            image1: null,
            image2: null,
            image3: null,
            image4: null,
          })
        } else {
          // After update, navigate back to product list
          navigate("/list")
        }
      } else {
        toast.error(response.data.message || (isEditMode ? "Failed to update product" : "Failed to add product"))
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating product:" : "Error adding product:", error)
      toast.error(
        error.response?.data?.message ||
          (isEditMode ? "An error occurred while updating the product" : "An error occurred while adding the product"),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => {
              const imageKey = `image${num}`
              return (
                <div key={imageKey} className="relative">
                  <input
                    type="file"
                    id={imageKey}
                    ref={fileInputRefs[imageKey]}
                    onChange={(e) => handleImageChange(e, imageKey)}
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor={imageKey}
                    className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-pink-500 transition-colors"
                  >
                    {imagePreview[imageKey] ? (
                      <img
                        src={imagePreview[imageKey] || "/placeholder.svg"}
                        alt={`Preview ${num}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-md">
                        <img
                          className="w-10 h-10 mb-2 opacity-50"
                          src={assets.upload_area || "/placeholder.svg"}
                          alt=""
                        />
                        <span className="text-xs text-gray-500">Upload Image {num}</span>
                      </div>
                    )}
                  </label>
                  {imagePreview[imageKey] && (
                    <button
                      type="button"
                      onClick={() => {
                        setImages({ ...images, [imageKey]: null })
                        setImagePreview({ ...imagePreview, [imageKey]: null })
                        if (fileInputRefs[imageKey].current) {
                          fileInputRefs[imageKey].current.value = ""
                        }
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className={`w-full px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
            placeholder="Enter product description"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Category, Subcategory, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="Makeup">Makeup</option>
              <option value="Skincare">Skincare</option>
              <option value="Haircare">Haircare</option>
              <option value="Fragrance">Fragrance</option>
              <option value="Bath & Body">Bath & Body</option>
            </select>
          </div>

          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {formData.category === "Makeup" && (
                <>
                  <option value="Face">Face</option>
                  <option value="Eyes">Eyes</option>
                  <option value="Lips">Lips</option>
                  <option value="Nails">Nails</option>
                  <option value="Brushes">Brushes</option>
                </>
              )}
              {formData.category === "Skincare" && (
                <>
                  <option value="Cleansers">Cleansers</option>
                  <option value="Moisturizers">Moisturizers</option>
                  <option value="Serums">Serums</option>
                  <option value="Masks">Masks</option>
                  <option value="Sunscreen">Sunscreen</option>
                </>
              )}
              {formData.category === "Haircare" && (
                <>
                  <option value="Shampoo">Shampoo</option>
                  <option value="Conditioner">Conditioner</option>
                  <option value="Styling">Styling</option>
                  <option value="Treatment">Treatment</option>
                </>
              )}
              {formData.category === "Fragrance" && (
                <>
                  <option value="Perfume">Perfume</option>
                  <option value="Cologne">Cologne</option>
                  <option value="Body Spray">Body Spray</option>
                </>
              )}
              {formData.category === "Bath & Body" && (
                <>
                  <option value="Soap">Soap</option>
                  <option value="Lotion">Lotion</option>
                  <option value="Scrub">Scrub</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Sizes <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  formData.sizes.includes(size)
                    ? "bg-pink-100 text-pink-700 border border-pink-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {errors.sizes && <p className="text-red-500 text-xs mt-1">{errors.sizes}</p>}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSize}
              onChange={handleNewSizeChange}
              placeholder="Add new size"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 flex-grow"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Add Size
            </button>
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center">
          <input
            id="bestseller"
            name="bestseller"
            type="checkbox"
            checked={formData.bestseller}
            onChange={handleInputChange}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-700">
            Add to bestseller collection
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-pink-600 text-white py-2 px-6 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? <LoadingSpinner size="small" /> : isEditMode ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
