"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import { Link } from "react-router-dom" // Import Link for navigation
import Title from "./Title"
import ProductItem from "./ProductItem"

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext) // Access products from ShopContext
  const [related, setRelated] = useState([]) // State for related products

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const filteredProducts = products.filter((item) => item.category === category && item.subCategory === subCategory)

      // Limit to 5 related products
      setRelated(filteredProducts.slice(0, 5))
    }
  }, [products, category, subCategory])

  return (
    <div className="my-24">
      {/* Section Title */}
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <Link to={`/product/${item._id}`} key={index} aria-label={`View details for ${item.name || "Product"}`}>
            <ProductItem
              id={item._id}
              name={item.name || "Unnamed Product"}
              price={item.price || "0"}
              image={item.image || ["/placeholder.png"]}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
