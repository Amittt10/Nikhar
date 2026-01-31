"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "../components/ProductItem"
import { Link } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"

const Lips = () => {
  const { products, loading } = useContext(ShopContext)
  const [lipProducts, setLipProducts] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => product.category === "Women" && product.subCategory === "Lips")
      setLipProducts(filtered)
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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lip Products</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/collection?category=Women&subCategory=Lips" className="text-gray-600 hover:text-pink-600">
                  All Lip Products
                </Link>
              </li>
              <li>
                <Link to="/collection?search=lipstick" className="text-gray-600 hover:text-pink-600">
                  Lipstick
                </Link>
              </li>
              <li>
                <Link to="/collection?search=lip%20gloss" className="text-gray-600 hover:text-pink-600">
                  Lip Gloss
                </Link>
              </li>
              <li>
                <Link to="/collection?search=lip%20liner" className="text-gray-600 hover:text-pink-600">
                  Lip Liner
                </Link>
              </li>
              <li>
                <Link to="/collection?search=lip%20balm" className="text-gray-600 hover:text-pink-600">
                  Lip Balm
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Products */}
        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Lip Products</h1>

          {lipProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any lip products.</p>
              <Link
                to="/collection"
                className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {lipProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <ProductItem
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    bestseller={product.bestseller}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lips
