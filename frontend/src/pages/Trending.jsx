"use client"

import { useContext, useState, useEffect } from "react"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "../components/ProductItem"
import { Link } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import Title from "../components/Title"

const Trending = () => {
  const { products, loading } = useContext(ShopContext)
  const [trendingProducts, setTrendingProducts] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      // For now, we'll just show a mix of bestsellers and new products
      // In a real app, you might have a "trending" flag or calculate based on sales/views
      const bestsellers = products.filter((product) => product.bestseller)
      const others = products.filter((product) => !product.bestseller)

      // Take some bestsellers and some other products
      const trending = [
        ...bestsellers.slice(0, Math.min(10, bestsellers.length)),
        ...others.slice(0, Math.min(10, others.length)),
      ].sort(() => Math.random() - 0.5) // Shuffle

      setTrendingProducts(trending.slice(0, 16)) // Take up to 16 products
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
        <Title text1="TRENDING" text2="NOW" />
        <p className="text-gray-600 mt-2">See what's popular right now in our store!</p>
      </div>

      {trendingProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any trending products at the moment.</p>
          <Link
            to="/collection"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
          {trendingProducts.map((product) => (
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

export default Trending
