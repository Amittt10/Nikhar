"use client"

import { useContext, useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import ProductRecommendations from "../components/ProductRecommendations"
import LoadingSpinner from "../components/LoadingSpinner"

const Product = () => {
  const { productId } = useParams()
  const { products, addToCart, addToWishlist, isInWishlist, currency, loading, navigate, isAuthenticated } =
    useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [mainImage, setMainImage] = useState("")
  const [activeTab, setActiveTab] = useState("description")
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find((p) => p._id === productId)
      if (foundProduct) {
        setProduct(foundProduct)
        setMainImage(foundProduct.image && foundProduct.image.length > 0 ? foundProduct.image[0] : "")
        setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : "")

        // Find related products (same category or subcategory)
        const related = products
          .filter(
            (p) =>
              p._id !== productId &&
              (p.category === foundProduct.category || p.subCategory === foundProduct.subCategory),
          )
          .slice(0, 8)
        setRelatedProducts(related)
      } else {
        navigate("/")
      }
    }
  }, [products, productId, navigate])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    addToCart(productId, quantity, selectedSize)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    addToCart(productId, quantity, selectedSize)
    navigate("/cart")
  }

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    addToWishlist(productId)
  }

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Calculate discount
  const discount = Math.floor(Math.random() * 30) + 10 // Random discount between 10-40%
  const originalPrice = (product.price / (1 - discount / 100)).toFixed(2)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg bg-white">
            <img src={mainImage || "/placeholder.svg"} alt={product.name} className="h-[400px] w-full object-contain" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.image &&
              product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`overflow-hidden rounded-md border-2 ${
                    mainImage === img ? "border-pink-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">
              {product.category} • {product.subCategory}
            </p>

            <div className="flex items-center mb-4">
              <div className="flex items-center bg-green-50 text-green-700 rounded-md px-2 py-1 text-sm mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">{Math.floor(Math.random() * 500) + 50} Reviews</span>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-2">
                {currency}
                {product.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500 line-through mr-2">
                {currency}
                {originalPrice}
              </span>
              <span className="text-sm font-medium text-green-600">{discount}% OFF</span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Availability:</span> <span className="text-green-600">In Stock</span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">SKU:</span> {product._id.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[40px] rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-pink-600 bg-pink-50 text-pink-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-l-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-16 border-y border-gray-300 py-1.5 text-center text-gray-700 focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-r-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-md bg-pink-600 py-3 text-white hover:bg-pink-700 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-md bg-pink-800 py-3 text-white hover:bg-pink-900 transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`rounded-md border px-4 ${
                isInWishlist(product._id)
                  ? "border-pink-600 bg-pink-50 text-pink-600"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${isInWishlist(product._id) ? "fill-pink-600 text-pink-600" : "fill-none"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Delivery & Returns */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Free Delivery</h4>
                <p className="text-xs text-gray-500">Free standard delivery on orders over $35</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Easy Returns</h4>
                <p className="text-xs text-gray-500">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === "description"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === "details"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === "reviews"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Product Details</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      <span className="font-medium">Brand:</span> {product.brand || "Nikhar"}
                    </li>
                    <li>
                      <span className="font-medium">Category:</span> {product.category}
                    </li>
                    <li>
                      <span className="font-medium">Subcategory:</span> {product.subCategory}
                    </li>
                    <li>
                      <span className="font-medium">SKU:</span> {product._id.substring(0, 8).toUpperCase()}
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      <span className="font-medium">Weight:</span> 0.5 kg
                    </li>
                    <li>
                      <span className="font-medium">Dimensions:</span> 10 × 5 × 5 cm
                    </li>
                    <li>
                      <span className="font-medium">Shipping:</span> Free shipping on orders over $35
                    </li>
                    <li>
                      <span className="font-medium">Delivery:</span> 2-5 business days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                <button className="text-sm font-medium text-pink-600 hover:text-pink-800">Write a Review</button>
              </div>

              <div className="space-y-6">
                {/* Sample reviews */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-yellow-500 mr-2">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${index < 4 + (i % 2) ? "fill-current" : "fill-gray-300"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">Customer {i}</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {i === 1
                        ? "This product is amazing! I've been using it for a month and I can already see the difference."
                        : i === 2
                          ? "Great quality product. The packaging is beautiful and the product works as described."
                          : "I bought this as a gift for my friend and she loved it! Will definitely buy again."}
                    </p>
                    <p className="text-xs text-gray-500">Posted on {new Date().toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <ProductRecommendations products={relatedProducts} />
      </div>
    </div>
  )
}

export default Product
