"use client"

import { useContext, useState, useEffect } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import CartTotal from "../components/CartTotal"
import LoadingSpinner from "../components/LoadingSpinner"
import ProductRecommendations from "../components/ProductRecommendations"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    products,
    currency,
    loading,
    navigate,
    isAuthenticated,
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext)

  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !loading) {
      navigate("/login")
    }

    // Get recommended products
    if (products && products.length > 0) {
      // Get random products for recommendations
      const shuffled = [...products].sort(() => 0.5 - Math.random())
      setRecommendedProducts(shuffled.slice(0, 8))
    }
  }, [isAuthenticated, loading, navigate, products])

  const handleQuantityChange = (productId, newQuantity, size) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity, size)
    }
  }

  const handleCouponApply = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setCouponApplied(true)
      setCouponDiscount(getCartAmount() * 0.1) // 10% discount
      toast.success("Coupon applied successfully!")
    } else {
      toast.error("Invalid coupon code")
    }
  }

  const handleCouponRemove = () => {
    setCouponApplied(false)
    setCouponDiscount(0)
    setCouponCode("")
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Check if cart is empty
  const isCartEmpty = !cartItems || cartItems.length === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Title text1="SHOPPING" text2="CART" />
      </div>

      {isCartEmpty ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                  </h2>
                  <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-800 transition-colors">
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const product = products.find((p) => p._id === (item.product._id || item.product))
                  if (!product) return null

                  return (
                    <div key={`${item.product._id || item.product}-${item.size}`} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                          <img
                            src={
                              (product.image && product.image[0]) ||
                              (item.product.image && item.product.image[0]) ||
                              "/placeholder.svg"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="sm:ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {product.category} • {product.subCategory}
                              </p>
                              {item.size && <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>}
                            </div>
                            <p className="text-base font-medium text-gray-900">
                              {currency}
                              {(product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.product._id || item.product, item.quantity - 1, item.size)
                                }
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.product._id || item.product, item.quantity + 1, item.size)
                                }
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product._id || item.product)}
                              className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                  Apply Coupon
                </label>
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">WELCOME10</p>
                      <p className="text-xs text-green-600">10% discount applied</p>
                    </div>
                    <button
                      onClick={handleCouponRemove}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      onClick={handleCouponApply}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <CartTotal couponDiscount={couponDiscount} />

              <button
                onClick={() => navigate("/place-order")}
                className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors mt-6"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">We Accept</h3>
                <div className="flex space-x-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8 w-auto" />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
                    alt="MasterCard"
                    className="h-8 w-auto"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196565.png"
                    alt="PayPal"
                    className="h-8 w-auto"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
                    alt="American Express"
                    className="h-8 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isCartEmpty ? "Popular Products" : "You May Also Like"}
        </h2>
        <ProductRecommendations products={recommendedProducts} />
      </div>
    </div>
  )
}

export default Cart
