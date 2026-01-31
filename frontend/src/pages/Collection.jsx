"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import ProductItem from "../components/ProductItem"
import LoadingSpinner from "../components/LoadingSpinner"
import { useSearchParams } from "react-router-dom"

const Collection = () => {
  const { products, search, showSearch, loading } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category") || ""
  const subCategoryParam = searchParams.get("subCategory") || ""

  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(categoryParam ? [categoryParam] : [])
  const [selectedSubCategories, setSelectedSubCategories] = useState(subCategoryParam ? [subCategoryParam] : [])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortType, setSortType] = useState("relevant")
  const [currentPriceRange, setCurrentPriceRange] = useState({ min: 0, max: 0 })

  // Extract unique categories and subcategories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map((item) => item.category))]
      setCategories(uniqueCategories)

      const uniqueSubCategories = [...new Set(products.map((item) => item.subCategory))]
      setSubCategories(uniqueSubCategories)

      // Find min and max prices
      const prices = products.map((p) => p.price).filter((p) => p !== undefined)
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices))
        const maxPrice = Math.ceil(Math.max(...prices))
        setCurrentPriceRange({ min: minPrice, max: maxPrice })
        setPriceRange({ min: minPrice, max: maxPrice })
      }
    }
  }, [products])

  // Toggle filter options dynamically
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    )
  }

  const toggleSubCategory = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory) ? prev.filter((item) => item !== subCategory) : [...prev, subCategory],
    )
  }

  // Apply filters to the product list
  useEffect(() => {
    if (products.length === 0) return

    let filteredProducts = [...products]

    // Apply search filter from URL or search bar
    const searchTerm = searchQuery || (showSearch ? search : "")
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((item) => selectedCategories.includes(item.category))
    }

    // Apply subcategory filter
    if (selectedSubCategories.length > 0) {
      filteredProducts = filteredProducts.filter((item) => selectedSubCategories.includes(item.subCategory))
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter((item) => item.price >= priceRange.min && item.price <= priceRange.max)

    // Apply sorting
    switch (sortType) {
      case "low-high":
        filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "high-low":
        filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "newest":
        filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "bestseller":
        filteredProducts.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0))
        break
      default:
        // Keep original order for "relevant"
        break
    }

    setFilterProducts(filteredProducts)
  }, [products, search, showSearch, selectedCategories, selectedSubCategories, priceRange, sortType, searchQuery])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                {showFilter ? "Hide" : "Show"}
              </button>
            </div>

            <div className={`${showFilter ? "block" : "hidden lg:block"} space-y-6`}>
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto filter-scroll pr-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Subcategories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto filter-scroll pr-2">
                  {subCategories.map((subCategory) => (
                    <label key={subCategory} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(subCategory)}
                        onChange={() => toggleSubCategory(subCategory)}
                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{subCategory}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Min"
                      min={currentPriceRange.min}
                      max={priceRange.max}
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Max"
                      min={priceRange.min}
                      max={currentPriceRange.max}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={currentPriceRange.min}
                  max={currentPriceRange.max}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full mt-2 accent-pink-500"
                />
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedSubCategories([])
                  setPriceRange({ min: currentPriceRange.min, max: currentPriceRange.max })
                  setSortType("relevant")
                }}
                className="text-sm text-pink-600 hover:text-pink-800 font-medium"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <Title text1={searchQuery ? "SEARCH" : "BEAUTY"} text2={searchQuery ? "RESULTS" : "COLLECTION"} />
              <p className="text-gray-500 text-sm mt-1">
                {filterProducts.length} {filterProducts.length === 1 ? "product" : "products"} found
                {searchQuery && <span> for "{searchQuery}"</span>}
              </p>
            </div>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="mt-3 sm:mt-0 border border-gray-300 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="relevant">Sort by: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="bestseller">Bestsellers</option>
            </select>
          </div>

          {filterProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategories([])
                  setSelectedSubCategories([])
                  setPriceRange({ min: currentPriceRange.min, max: currentPriceRange.max })
                  setSortType("relevant")
                }}
                className="text-pink-600 hover:text-pink-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filterProducts.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  bestseller={item.bestseller}
                  category={item.category}
                  subCategory={item.subCategory}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
