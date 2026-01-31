"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { backendUrl } from "../App"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/LoadingSpinner"

const Orders = ({ token, loading: parentLoading, setLoading: setParentLoading }) => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  })

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      if (setParentLoading) setParentLoading(true)

      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
        )
        setOrders(sortedOrders)
        setFilteredOrders(sortedOrders)
        calculateStats(sortedOrders)
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
        )
        setOrders(sortedOrders)
        setFilteredOrders(sortedOrders)
        calculateStats(sortedOrders)
      } else {
        toast.error(response.data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error(error.response?.data?.message || "An error occurred while fetching orders")
    } finally {
      setLoading(false)
      if (setParentLoading) setParentLoading(false)
    }
  }

  // Calculate order statistics
  const calculateStats = (ordersList) => {
    const stats = {
      total: ordersList.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      revenue: 0,
    }

    ordersList.forEach((order) => {
      const status = order.status || "Processing"
      const amount = order.amount || order.totalAmount || 0

      // Count by status
      if (status.toLowerCase().includes("pending")) stats.pending++
      else if (status.toLowerCase().includes("processing")) stats.processing++
      else if (status.toLowerCase().includes("shipped")) stats.shipped++
      else if (status.toLowerCase().includes("delivered")) stats.delivered++
      else if (status.toLowerCase().includes("cancelled")) stats.cancelled++

      // Calculate revenue (excluding cancelled orders)
      if (!status.toLowerCase().includes("cancelled")) {
        stats.revenue += amount
      }
    })

    setStats(stats)
  }

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true)
      if (setParentLoading) setParentLoading(true)

      const response = await axios.patch(
        `${backendUrl}/api/order/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.success) {
        toast.success("Order status updated successfully")
        fetchOrders()
      } else {
        toast.error(response.data.message || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error(error.response?.data?.message || "An error occurred while updating order status")
    } finally {
      setLoading(false)
      if (setParentLoading) setParentLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let result = [...orders]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.includes(searchTerm) ||
          (order.address?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.address?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.address?.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      result = result.filter((order) => {
        const orderDate = new Date(order.date || order.createdAt)

        switch (dateFilter) {
          case "today":
            return orderDate >= today
          case "yesterday":
            return orderDate >= yesterday && orderDate < today
          case "week":
            return orderDate >= lastWeek
          case "month":
            return orderDate >= lastMonth
          default:
            return true
        }
      })
    }

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter, dateFilter])

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [token])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Orders" value={stats.total} color="bg-blue-500" />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" />
        <StatCard title="Processing" value={stats.processing} color="bg-purple-500" />
        <StatCard title="Shipped" value={stats.shipped} color="bg-indigo-500" />
        <StatCard title="Delivered" value={stats.delivered} color="bg-green-500" />
        <StatCard title="Cancelled" value={stats.cancelled} color="bg-red-500" />
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
        <p className="text-sm opacity-80 mt-1">Excluding cancelled orders</p>
      </div>

      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <button
            onClick={fetchOrders}
            className="mt-2 sm:mt-0 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
          >
            Refresh
          </button>
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
              placeholder="Search by order ID or customer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <select
              id="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
                setDateFilter("all")
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="py-10 text-center">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <>
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order._id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.address?.firstName || ""} {order.address?.lastName || ""}
                        </div>
                        <div className="text-sm text-gray-500">{order.address?.email || "No email"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.date || order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${(order.amount || order.totalAmount || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod || "N/A"} - {order.payment ? "Paid" : "Pending"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status || "Processing"}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                          className="text-pink-600 hover:text-pink-900"
                        >
                          {expandedOrder === order._id ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Order Details */}
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Order Items</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-md">
                                  <img
                                    src={
                                      (item.image && item.image[0]) ||
                                      (item.product && item.product.image && item.product.image[0]) ||
                                      "/placeholder.png"
                                    }
                                    alt={item.name || (item.product && item.product.name) || "Product"}
                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.name || (item.product && item.product.name) || "Product"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ${(item.price || (item.product && item.product.price) || 0).toFixed(2)} ×{" "}
                                      {item.quantity}
                                      {item.size && ` • Size: ${item.size}`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                            <p className="text-sm text-gray-700">
                              {order.address?.firstName || ""} {order.address?.lastName || ""}
                              <br />
                              {order.address?.street || "No street address"}
                              <br />
                              {order.address?.city || ""}, {order.address?.state || ""} {order.address?.zipcode || ""}
                              <br />
                              {order.address?.country || ""}
                              <br />
                              Phone: {order.address?.phone || "No phone"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
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

export default Orders
