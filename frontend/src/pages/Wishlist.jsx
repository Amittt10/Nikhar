"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import LoadingSpinner from "../components/LoadingSpinner"
import ProductItem from "../components/ProductItem"

const Wishlist = () => {
  const { wishlistItems, products, loading, navigate, isAuthenticated, addToCart } = useContext(ShopContext)
  const [wishlistProducts, setWishlistProducts] = useState([])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !loading) {
      navigate("/login")
    }

    // Get wishlist products
    if (products && products.length > 0 && wishlistItems && wishlistItems.length > 0) {
      const items = products.filter((product) => wishlistItems.includes(product._id))
      setWishlistProducts(items)
    } else {
      setWishlistProducts([])
    }
  }, [isAuthenticated, loading, navigate, products, wishlistItems])

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
      addToCart(product._id, 1, defaultSize)
    })
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Title text1="MY" text2="WISHLIST" />
      </div>

      {wishlistProducts.length === 0 ? (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Add items you love to your wishlist. Review them anytime and easily move them to the cart.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{wishlistProducts.length} items in your wishlist</p>
            <button
              onClick={handleAddAllToCart}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
            >
              Add All to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Wishlist
