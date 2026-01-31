"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl, loading, setLoading } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState("processing") // processing, success, error

  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")

  const verifyPayment = async () => {
    try {
      if (!token) {
        toast.error("Authentication required")
        navigate("/login")
        return
      }

      if (!orderId) {
        toast.error("Invalid order information")
        navigate("/cart")
        return
      }

      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/order/stripe/verify?orderId=${orderId}&success=${success}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        // Clear cart in local storage too
        localStorage.removeItem("cartItems")
        setCartItems({})
        setVerificationStatus("success")
        toast.success("Payment verified successfully!")
        setTimeout(() => {
          navigate("/orders")
        }, 3000)
      } else {
        setVerificationStatus("error")
        toast.error("Payment verification failed")
        setTimeout(() => {
          navigate("/cart")
        }, 3000)
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setVerificationStatus("error")
      toast.error(error.response?.data?.message || "Payment verification failed")
      setTimeout(() => {
        navigate("/cart")
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token, orderId])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      {loading ? (
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-700">Verifying your payment...</p>
        </div>
      ) : verificationStatus === "success" ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            View Your Orders
          </button>
        </div>
      ) : verificationStatus === "error" ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">There was an issue with your payment. Please try again.</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
          >
            Return to Cart
          </button>
        </div>
      ) : (
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-700">Processing your payment...</p>
        </div>
      )}
    </div>
  )
}

export default Verify
