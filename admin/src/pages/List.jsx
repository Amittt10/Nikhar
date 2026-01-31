"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { backendUrl } from "../App"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/LoadingSpinner"

const List = ({ token, loading, setLoading }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [subCategoryFilter, setSubCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    makeup: 0,
    skincare: 0,
    haircare: 0,
    fragrance: 0,
    bestsellers: 0,
  })

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/product/list`)

      if (response.data.success) {
        setProducts(response.data.products)
        setFilteredProducts(response.data.products)
        calculateStats(response.data.products)
      } else {
        toast.error(response.data.message || "Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error(error.response?.data?.message || "An error occurred while fetching products")
    } finally {
      setLoading(false)
    }
  }

  // Calculate product statistics
  const calculateStats = (productsList) => {
    const stats = {
      total: productsList.length,
      makeup: 0,
      skincare: 0,
      haircare: 0,
      fragrance: 0,
      bestsellers: 0,
    }

    productsList.forEach((product) => {
      const category = product.category || ""

      // Count by category
      if (category.toLowerCase().includes("makeup")) stats.makeup++
      else if (category.toLowerCase().includes("skincare")) stats.skincare++
      else if (category.toLowerCase().includes("haircare")) stats.haircare++
      else if (category.toLowerCase().includes("fragrance")) stats.fragrance++

      // Count bestsellers
      if (product.bestseller) stats.bestsellers++
    })

    setStats(stats)
  }

  // Delete product
  const handleDelete = async (id) => {
    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } })

      if (response.data.success) {
        toast.success("Product removed successfully")
        fetchProducts()
      } else {
        toast.error(response.data.message || "Failed to remove product")
      }
    } catch (error) {
      console.error("Error removing product:", error)
      toast.error(error.response?.data?.message || "An error occurred while removing the product")
    } finally {
      setLoading(false)
      setConfirmDelete(null)
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((product) => product.category === categoryFilter)
    }

    // Apply subcategory filter
    if (subCategoryFilter) {
      result = result.filter((product) => product.subCategory === subCategoryFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [products, searchTerm, categoryFilter, subCategoryFilter, sortBy])

  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [])

  // Get unique categories and subcategories
  const categories = [...new Set(products.map((product) => product.category))].sort()
  const subCategories = [...new Set(products.map((product) => product.subCategory))].sort()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Products" value={stats.total} color="bg-blue-500" />
        <StatCard title="Makeup" value={stats.makeup} color="bg-pink-500" />
        <StatCard title="Skincare" value={stats.skincare} color="bg-green-500" />
        <StatCard title="Haircare" value={stats.haircare} color="bg-purple-500" />
        <StatCard title="Fragrance" value={stats.fragrance} color="bg-yellow-500" />
        <StatCard title="Bestsellers" value={stats.bestsellers} color="bg-red-500" />
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={fetchProducts}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
            >
              Refresh
            </button>
            <a
              href="/add"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              id="subCategory"
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Subcategories</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="py-10 text-center">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.image[0] || "/placeholder.svg"}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      <div className="text-sm text-gray-500">{product.subCategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.bestseller ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Bestseller
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {confirmDelete === product._id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                            Confirm
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="text-gray-600 hover:text-gray-900">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setConfirmDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = `/add/${product._id}`
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 border-t-4 ${color}`}>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

export default List
