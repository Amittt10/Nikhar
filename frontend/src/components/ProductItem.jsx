"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const ProductItem = ({ id, name, price, image, bestseller }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Handle quick add to cart
  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success(`${name} added to cart!`)
  }

  // Handle quick add to wishlist
  const handleAddToWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success(`${name} added to wishlist!`)
  }

  return (
    <Link
      to={`/product/${id}`}
      className="product-card group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-white">
        {/* Bestseller badge */}
        {bestseller && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-pink-600 px-2 py-1 text-xs font-medium text-white">
            Bestseller
          </div>
        )}

        {/* Product image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={image || "/placeholder.svg?height=300&width=300"}
            alt={name || "Product"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Quick action buttons */}
        <div
          className={`product-actions absolute bottom-0 left-0 right-0 flex justify-center space-x-2 bg-white/80 p-2 backdrop-blur-sm ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleQuickAdd}
            className="rounded-full bg-pink-600 p-2 text-white transition-colors hover:bg-pink-700"
            aria-label="Add to cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </button>
          <button
            onClick={handleAddToWishlist}
            className="rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300"
            aria-label="Add to wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3 text-center">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{name || "Product Name"}</h3>
        <p className="mt-1 text-sm font-semibold text-pink-600">₹{price || 0}</p>
      </div>
    </Link>
  )
}

export default ProductItem
