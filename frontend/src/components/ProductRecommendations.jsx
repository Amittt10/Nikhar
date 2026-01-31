"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "./ProductItem"

const ProductRecommendations = ({ currentProductId, category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (products.length > 0 && currentProductId) {
      // First, get products in the same subcategory
      let similarProducts = products.filter((item) => item.subCategory === subCategory && item._id !== currentProductId)

      // If we don't have enough, add products from the same category
      if (similarProducts.length < 4) {
        const categoryProducts = products.filter(
          (item) => item.category === category && item.subCategory !== subCategory && item._id !== currentProductId,
        )
        similarProducts = [...similarProducts, ...categoryProducts]
      }

      // If we still don't have enough, add bestsellers
      if (similarProducts.length < 4) {
        const bestsellers = products.filter(
          (item) => item.bestseller && item._id !== currentProductId && !similarProducts.includes(item),
        )
        similarProducts = [...similarProducts, ...bestsellers]
      }

      // Limit to 4 products
      setRecommendations(similarProducts.slice(0, 4))
    }
  }, [products, currentProductId, category, subCategory])

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((item) => (
          <div key={item._id}>
            <ProductItem
              id={item._id}
              name={item.name || "Unnamed Product"}
              price={item.price || "0"}
              image={item.image || ["/placeholder.png"]}
              bestseller={item.bestseller}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductRecommendations
