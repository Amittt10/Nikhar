import { Link } from "react-router-dom"
import ProductItem from "./ProductItem"

const BestSeller = ({ products }) => {
  // Ensure products is an array
  const bestSellerProducts = Array.isArray(products) ? products : []

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-prata text-secondary-900">Bestsellers</h2>
          <p className="mt-4 text-lg text-secondary-600">Our most popular products</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
          {bestSellerProducts.length > 0 ? (
            bestSellerProducts.map((product) => (
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
              <p className="text-gray-500">No bestseller products available</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/best-sellers"
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
          >
            View All Bestsellers
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
