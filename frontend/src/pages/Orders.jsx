"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const Orders = () => {
  const { backendUrl, token, currency, navigate, isAuthenticated } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrderData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!token) {
        toast.error("Please login to view your orders")
        navigate("/login")
        return
      }

      const response = await axios.get(`${backendUrl}/api/order/userorder`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Orders API response:", response.data)

      if (response.data && Array.isArray(response.data)) {
        // Handle case where API returns array directly
        setOrders(response.data)
      } else if (response.data && response.data.orders) {
        // Handle case where API returns { orders: [...] }
        setOrders(response.data.orders)
      } else if (response.data && response.data.success) {
        // Handle case where API returns { success: true, orders: [...] }
        setOrders(response.data.orders || [])
      } else {
        setError("Failed to load orders: Invalid response format")
        toast.error("Failed to load orders: Invalid response format")
      }
    } catch (error) {
      console.error("Error loading orders:", error)
      setError("An error occurred while loading orders. Please try again later.")
      toast.error("Failed to load orders. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadOrderData()
    } else {
      setLoading(false)
    }
  }, [token])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-2xl mb-6">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadOrderData}
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors mr-4"
          >
            Try Again
          </button>
          <Link
            to="/collection"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-2xl mb-6">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please Login</h3>
          <p className="text-gray-500 mb-4">You need to be logged in to view your orders.</p>
          <Link
            to="/login"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-2xl mb-6">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/collection"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Group items by order
  const groupedOrders = orders
    .map((order) => {
      return {
        _id: order._id,
        date: new Date(order.date || order.createdAt || Date.now()),
        status: order.status || "Processing",
        payment: order.payment || false,
        paymentMethod: order.paymentMethod || "N/A",
        amount: order.amount || order.totalAmount || 0,
        address: order.address || order.shippingAddress || {},
        items: order.items || [],
      }
    })
    .sort((a, b) => b.date - a.date) // Sort by date, newest first

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="space-y-6">
        {groupedOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
              <div>
                <p className="text-sm text-gray-500">
                  Order placed on {order.date.toLocaleDateString()} at {order.date.toLocaleTimeString()}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">Order ID: {order._id}</p>
              </div>

              <div className="mt-2 sm:mt-0 flex items-center">
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : order.status === "Shipped"
                          ? "bg-blue-500"
                          : order.status === "Cancelled"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="text-sm font-medium">{order.status}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              {order.items.map((item, index) => (
                <div
                  key={`${item.itemId || item.product || index}-${index}`}
                  className={`flex items-start gap-4 py-4 ${
                    index < order.items.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <Link to={`/product/${item.itemId || item.product}`}>
                    <img
                      src={
                        (item.image && item.image[0]) ||
                        (item.product && item.product.image && item.product.image[0]) ||
                        "/placeholder.png"
                      }
                      alt={item.name || (item.product && item.product.name) || "Product"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={`/product/${item.itemId || item.product}`}
                      className="font-medium text-gray-900 hover:text-pink-600"
                    >
                      {item.name || (item.product && item.product.name) || "Product"}
                    </Link>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size || "Standard"}</p>
                      <p>
                        Price: {currency}
                        {(item.price || (item.product && item.product.price) || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 border-t">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Method: {order.paymentMethod}</p>
                  <p className="text-sm text-gray-500 mt-1">Payment Status: {order.payment ? "Paid" : "Pending"}</p>
                </div>

                <div className="mt-3 sm:mt-0 text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    {currency}
                    {order.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
