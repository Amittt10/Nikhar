"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { Link } from "react-router-dom"

const SearchBar = () => {
  const { products, showSearch, setShowSearch } = useContext(ShopContext) || {
    products: [],
    showSearch: false,
    setShowSearch: () => {},
  }
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const searchRef = useRef(null)

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setSearchResults([])
      return
    }

    // Filter products based on search term
    if (products && products.length > 0) {
      const results = products.filter((product) => product.name.toLowerCase().includes(term.toLowerCase()))
      setSearchResults(results.slice(0, 5)) // Limit to 5 results
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setShowSearch])

  // Focus input when search is shown
  useEffect(() => {
    if (showSearch && searchRef.current) {
      const input = searchRef.current.querySelector("input")
      if (input) input.focus()
    }
  }, [showSearch])

  if (!showSearch) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div ref={searchRef} className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {searchResults.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                onClick={() => setShowSearch(false)}
                className="flex items-center p-3 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={product.image || "/placeholder.svg?height=60&width=60"}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-pink-600">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <div className="p-4 text-center text-gray-500">No products found</div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
