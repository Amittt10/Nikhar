"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

// Create context with default value
export const ShopContext = createContext(null)

// Separate named export for the provider component
export const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [banners, setBanners] = useState([])
  const [brands, setBrands] = useState([])
  const currency = "$"
  const delivery_fee = 10
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
  const [search, setSearch] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])

  // Refactor state updates to be more atomic and prevent race conditions
  const updateCartItemsState = (newItems) => {
    setCartItems(newItems)
    // Also update localStorage for backup
    localStorage.setItem("cartItems", JSON.stringify(newItems))
  }

  // Centralize error handling for API calls
  const handleApiError = (error, fallbackAction, errorMessage) => {
    console.error(errorMessage || "API Error:", error)

    if (error.response?.status === 401) {
      logoutUser()
      toast.error("Session expired. Please login again.")
    } else if (fallbackAction) {
      fallbackAction()
    } else {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.")
    }
  }

  // Create a more robust authentication check
  const checkAuthentication = () => {
    if (!isAuthenticated || !token) {
      toast.warning("Please login to continue")
      navigate("/login")
      return false
    }
    return true
  }

  // Centralized data fetching with retry logic
  const fetchData = async (url, options = {}) => {
    const { onSuccess, onError, retries = 2, retryDelay = 1000 } = options

    let currentRetry = 0

    const attemptFetch = async () => {
      try {
        const response = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (response.data.success) {
          if (onSuccess) onSuccess(response.data)
          return response.data
        } else {
          throw new Error(response.data.message || "API returned unsuccessful response")
        }
      } catch (error) {
        console.error(`Error fetching ${url}:`, error)

        if (currentRetry < retries) {
          currentRetry++
          console.log(`Retrying (${currentRetry}/${retries}) after ${retryDelay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          return attemptFetch()
        }

        if (onError) onError(error)
        throw error
      }
    }
    return attemptFetch()
  }

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        setToken(token)
        setIsAuthenticated(true)
        // Set axios default headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        try {
          // Get user profile first
          await getUserProfile()
          // Then get user cart and wishlist
          await Promise.all([getUserCart(), getUserWishlist()])
        } catch (error) {
          console.error("Error initializing user data:", error)
          // If there's an authentication error, logout
          if (error.response?.status === 401) {
            logoutUser()
          }
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setCartItems([])
        setWishlist([])
      }

      // Get all products regardless of authentication
      getAllProducts()
      // Get banners and brands
      getBanners()
      getBrands()
    }

    checkAuth()
  }, [])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing saved cart:", error)
        localStorage.removeItem("cartItems")
      }
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlistItems")
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error parsing saved wishlist:", error)
        localStorage.removeItem("wishlistItems")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlistItems.length > 0) {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems])

  // Extract unique categories and subcategories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map((item) => item.category))]
      setCategories(uniqueCategories)

      const uniqueSubCategories = [...new Set(products.map((item) => item.subCategory))]
      setSubCategories(uniqueSubCategories)
    }
  }, [products])

  // Fix the API endpoints
  const getAllProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/product/list`)

      if (response.data.success && response.data.products) {
        console.log("Products fetched successfully:", response.data.products.length)
        setProducts(response.data.products)
      } else {
        console.error("API returned success but no products:", response.data)
        toast.error("Failed to load products. Please try again later.")
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)

      // Try to fetch products again after a short delay
      setTimeout(() => {
        fetchProductsRetry()
      }, 3000)
    }
  }

  // Add a retry function for fetching products
  const fetchProductsRetry = async () => {
    try {
      console.log("Retrying product fetch...")
      const response = await axios.get(`${backendUrl}/api/product/list`)

      if (response.data.success && response.data.products) {
        console.log("Products fetched successfully on retry:", response.data.products.length)
        setProducts(response.data.products)

        // Cache products for offline use
        localStorage.setItem("cachedProducts", JSON.stringify(response.data.products))
      } else {
        // If still no products, try to load from local fallback
        console.error("API retry returned success but no products:", response.data)
        loadFallbackProducts()
      }
    } catch (error) {
      console.error("Error retrying product fetch:", error)
      loadFallbackProducts()
    } finally {
      setLoading(false)
    }
  }

  // Add a function to load fallback products if API fails
  const loadFallbackProducts = () => {
    console.log("Loading fallback products...")
    // Check if we have products in localStorage
    const cachedProducts = localStorage.getItem("cachedProducts")
    if (cachedProducts) {
      try {
        const parsedProducts = JSON.parse(cachedProducts)
        setProducts(parsedProducts)
        console.log("Loaded products from cache:", parsedProducts.length)
      } catch (error) {
        console.error("Error parsing cached products:", error)
        setProducts([])
      }
    } else {
      setProducts([])
      toast.error("Failed to load products. Please check your internet connection and try again.")
    }
  }

  // Add this effect to cache products when they're successfully fetched
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("cachedProducts", JSON.stringify(products))
    }
  }, [products])

  // Fix the getBanners function
  const getBanners = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/banner/list`)
      if (response.data && response.data.banners) {
        setBanners(response.data.banners)
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      // Don't show error toast for banners as it's not critical
    }
  }

  // Get all brands
  const getBrands = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/brand/list`)
      if (response.data && response.data.success) {
        setBrands(response.data.brands)
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      // Don't show error toast for brands as it's not critical
    }
  }

  // Register user
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, userData)
      toast.success("Registration successful! Please verify your email.")
      return response.data
    } catch (error) {
      console.error("Error registering user:", error)
      toast.error(error.response?.data?.message || "Registration failed. Please try again.")
      throw error
    }
  }

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/verify/${token}`)
      toast.success("Email verified successfully! You can now login.")
      return response.data
    } catch (error) {
      console.error("Error verifying email:", error)
      toast.error(error.response?.data?.message || "Email verification failed.")
      throw error
    }
  }

  // Login user
  const loginUser = async (userData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, userData)
      localStorage.setItem("token", response.data.token)
      setToken(response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
      setIsAuthenticated(true)
      setUser(response.data.user)
      toast.success("Login successful!")
      return response.data
    } catch (error) {
      console.error("Error logging in:", error)
      toast.error(error.response?.data?.message || "Login failed.")
      throw error
    }
  }

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem("token")
    setToken("")
    delete axios.defaults.headers.common["Authorization"]
    setIsAuthenticated(false)
    setUser(null)
    setCartItems([])
    setWishlist([])
    toast.success("Logged out successfully!")
  }

  // Get user cart
  const getUserCart = async () => {
    if (!isAuthenticated || !token) return

    try {
      const response = await axios.get(`${backendUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        // Ensure we're setting a valid array of items
        const cartItems = response.data.cart?.items || []
        updateCartItemsState(cartItems)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)

      // Try to load from localStorage as fallback
      const savedCart = localStorage.getItem("cartItems")
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (parseError) {
          console.error("Error parsing saved cart:", parseError)
          setCartItems([])
        }
      } else {
        setCartItems([])
      }

      // If unauthorized, logout user
      if (error.response?.status === 401) {
        logoutUser()
        toast.error("Session expired. Please login again.")
      }
    }
  }

  // Get user profile
  const getUserProfile = async () => {
    if (!isAuthenticated || !token) return

    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      // If there's an error fetching profile, user might be logged out
      // Check if token is invalid and logout if necessary
      if (error.response?.status === 401) {
        logoutUser()
        toast.error("Session expired. Please login again.")
      }
    }
  }

  // Get user wishlist
  const getUserWishlist = async () => {
    if (!isAuthenticated || !token) return

    try {
      const response = await axios.get(`${backendUrl}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setWishlist(response.data.wishlist?.items || [])
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      // Don't show error toast for wishlist as it might be empty
      // Instead, set wishlist to empty array
      setWishlist([])
    }
  }

  // Add to cart
  const addToCart = async (productId, quantity = 1, size = "M") => {
    if (!isAuthenticated) {
      toast.warning("Please login to add items to cart")
      navigate("/login")
      return
    }

    try {
      setLoading(true)

      // Find the product to show in toast notification
      const product = products.find((p) => p._id === productId)

      if (!product) {
        toast.error("Product not found")
        return
      }

      console.log("Adding to cart:", { productId, quantity, size })

      const response = await axios.post(
        `${backendUrl}/api/cart/items`,
        {
          productId,
          quantity,
          size,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        // Update cart items with the response data
        updateCartItemsState(response.data.cart.items)

        // Show success toast with product image and name
        toast.success(
          <div className="flex items-center">
            <img
              src={product?.image?.[0] || "/placeholder.svg"}
              alt={product?.name}
              className="w-10 h-10 object-cover rounded mr-2"
            />
            <div>
              <strong>{product?.name}</strong> added to cart!
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 2000,
          },
        )
      } else {
        toast.error(response.data.message || "Failed to add item to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)

      // More specific error messages
      if (error.response?.status === 401) {
        logoutUser()
        toast.error("Session expired. Please login again.")
      } else if (error.response?.status === 404) {
        toast.error("Product not found. Please refresh and try again.")
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid request. Please check product details.")
      } else {
        toast.error("Failed to add item to cart. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Update cart item
  const updateCartItem = async (productId, quantity, size = "M") => {
    if (!isAuthenticated || !token) return

    try {
      setLoading(true)
      const response = await axios.put(
        `${backendUrl}/api/cart`,
        {
          productId,
          quantity,
          size,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        updateCartItemsState(response.data.cart.items)
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
      toast.error("Failed to update cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !token) return

    try {
      setLoading(true)
      const response = await axios.delete(`${backendUrl}/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        updateCartItemsState(response.data.cart.items)
        toast.success("Item removed from cart")
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast.error("Failed to remove item from cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated || !token) return

    try {
      setLoading(true)
      const response = await axios.delete(`${backendUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        updateCartItemsState([])
        toast.success("Cart cleared successfully")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Failed to clear cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Function to add items to wishlist
  const addToWishlist = (itemId) => {
    if (wishlistItems.includes(itemId)) {
      // Remove from wishlist if already there
      const updatedWishlist = wishlistItems.filter((id) => id !== itemId)
      setWishlistItems(updatedWishlist)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist))

      // Find product name
      const product = products.find((p) => p._id === itemId)
      if (product) {
        toast.info(
          <div className="flex items-center">
            <img
              src={product.image?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-md mr-3"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm">Removed from wishlist</p>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 2000,
          },
        )
      }
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlistItems, itemId]
      setWishlistItems(updatedWishlist)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist))

      // Find product name
      const product = products.find((p) => p._id === itemId)
      if (product) {
        toast.success(
          <div className="flex items-center">
            <img
              src={product.image?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-md mr-3"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm">Added to wishlist</p>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 2000,
          },
        )
      }
    }
  }

  // Function to check if item is in wishlist
  const isInWishlist = (itemId) => {
    return wishlistItems.includes(itemId)
  }

  // Function to calculate total items in the cart
  const getCartCount = () => {
    let totalCount = 0

    // Check if cartItems is an array (from API) or object (from local storage)
    if (Array.isArray(cartItems)) {
      return cartItems.reduce((count, item) => count + item.quantity, 0)
    }

    // Handle object format
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size]
      }
    }
    return totalCount
  }

  // Function to update item quantity in the cart
  const updateQuantity = async (itemId, quantity, size = "M") => {
    try {
      setLoading(true)

      if (token) {
        await updateCartItem(itemId, quantity, size)
      } else {
        // Handle local cart updates if needed
        const cartData = { ...cartItems }
        // Update local cart logic here
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to calculate total cart amount
  const getCartAmount = () => {
    let totalAmount = 0

    // Check if cartItems is an array (from API)
    if (Array.isArray(cartItems)) {
      return cartItems.reduce((total, item) => {
        const product = products.find((p) => p._id === item.product._id || p._id === item.product)
        return total + (product?.price || 0) * item.quantity
      }, 0)
    }

    // Handle object format (from local storage)
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId)
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            totalAmount += itemInfo.price * cartItems[itemId][size]
          }
        }
      }
    }
    return totalAmount
  }

  // Create order
  const createOrder = async (orderData) => {
    if (!isAuthenticated || !token) {
      toast.warning("Please login to place an order")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        // Clear cart after successful order
        updateCartItemsState([])
        return response.data
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error(error.response?.data?.message || "Failed to create order. Please try again.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category)
  }

  // Get products by subcategory
  const getProductsBySubCategory = (subCategory) => {
    return products.filter((product) => product.subCategory === subCategory)
  }

  // Get bestseller products
  const getBestsellerProducts = () => {
    return products.filter((product) => product.bestseller === true)
  }

  // Value to provide global state and functions
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    loading,
    setLoading,
    logout: logoutUser,
    getUserCart,
    userProfile: user,
    setUserProfile: setUser,
    getUserProfile,
    wishlistItems,
    addToWishlist,
    isInWishlist,
    registerUser,
    verifyEmail,
    loginUser,
    isAuthenticated,
    logoutUser,
    wishlist,
    banners,
    brands,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    categories,
    subCategories,
    getProductsByCategory,
    getProductsBySubCategory,
    getBestsellerProducts,
  }

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
}

// Default export for the provider component
export default ShopContextProvider
