"use client"

import { useContext, useState, useEffect } from "react"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "../components/ProductItem"
import { Link } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import Title from "../components/Title"

const NewArrivals = () => {
  const { products, loading } = useContext(ShopContext)
  const [newArrivals, setNewArrivals] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      // Sort products by date (newest first) and take the first 20
      const sorted = [...products].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20)
      setNewArrivals(sorted)
    }
  }, [products])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Title text1="NEW" text2="ARRIVALS" />
        <p className="text-gray-600 mt-2">Explore our latest collection of products freshly curated for you!</p>
      </div>

      {newArrivals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any new arrivals at the moment.</p>
          <Link
            to="/collection"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
          {newArrivals.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              bestseller={product.bestseller}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NewArrivals
