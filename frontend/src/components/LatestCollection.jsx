"use client"

import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "./ProductItem"
import { Link } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext)

  // Get the latest 8 products or use empty array if products is undefined
  const latestProducts =
    products && products.length > 0
      ? products.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 8)
      : []

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-prata text-secondary-900">Latest Collection</h2>
            <p className="mt-4 text-lg text-secondary-600">Discover our newest arrivals</p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-prata text-secondary-900">Latest Collection</h2>
          <p className="mt-4 text-lg text-secondary-600">Discover our newest arrivals</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
          {latestProducts && latestProducts.length > 0 ? (
            latestProducts.map((product) => (
              <ProductItem
                key={product._id || Math.random().toString()}
                id={product._id || ""}
                name={product.name || ""}
                price={product.price || 0}
                image={product.image || "/placeholder.svg?height=300&width=300"}
                bestseller={product.bestseller || false}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/new-arrivals"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestCollection
