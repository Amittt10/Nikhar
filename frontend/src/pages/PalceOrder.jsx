"use client"

import { useContext, useState, useEffect } from "react"
import Title from "../components/Title"
import CartTotal from "../components/CartTotal"
import { assets } from "../assets/assets"
import { ShopContext } from "../context/ShopContext"
import axios from "axios"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/LoadingSpinner"

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod")
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    loading,
    setLoading,
  } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const [formErrors, setFormErrors] = useState({})
  const [cartCount, setCartCount] = useState(0)

  // Check if cart is empty
  useEffect(() => {
    let count = 0
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        count += cartItems[productId][size]
      }
    }
    setCartCount(count)

    // Redirect to cart if empty
    if (count === 0 && !loading) {
      toast.error("Your cart is empty")
      navigate("/cart")
    }

    // Redirect to login if not authenticated
    if (!token && !loading) {
      toast.error("Please login to checkout")
      navigate("/login")
    }
  }, [cartItems, loading, token])

  const validateForm = () => {
    const errors = {}

    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"
    if (!formData.street.trim()) errors.street = "Street address is required"
    if (!formData.city.trim()) errors.city = "City is required"
    if (!formData.state.trim()) errors.state = "State is required"
    if (!formData.zipcode.trim()) errors.zipcode = "Zip code is required"
    if (!formData.country.trim()) errors.country = "Country is required"
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, "")))
      errors.phone = "Please enter a valid phone number"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData((data) => ({ ...data, [name]: value }))

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null })
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly")
      return
    }

    try {
      setLoading(true)

      // Prepare order items
      const orderItems = []
      for (const productId in cartItems) {
        const product = products.find((p) => p._id === productId)
        if (product) {
          for (const size in cartItems[productId]) {
            const quantity = cartItems[productId][size]
            if (quantity > 0) {
              orderItems.push({
                itemId: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
                quantity,
              })
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      }

      // Process order based on payment method
      switch (method) {
        case "cod":
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.data.success) {
            setCartItems({})
            toast.success("Order placed successfully!")
            navigate("/orders")
          } else {
            toast.error(response.data.message || "Failed to place order")
          }
          break

        case "stripe":
          const stripeResponse = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (stripeResponse.data.success) {
            const { session_url } = stripeResponse.data
            window.location.replace(session_url)
          } else {
            toast.error(stripeResponse.data.message || "Failed to initialize payment")
          }
          break

        default:
          toast.error("Please select a payment method")
          break
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(error.response?.data?.message || "An error occurred during checkout")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-2xl mb-6">
        <Title text1={"CHECKOUT"} text2={"DETAILS"} />
      </div>

      <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-8">
        {/* Delivery Information */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.firstName ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.lastName ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.email ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="email"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
                <input
                  name="street"
                  value={formData.street}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.street ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.street && <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.city ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province*</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.state ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code*</label>
                <input
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.zipcode ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.zipcode && <p className="text-red-500 text-xs mt-1">{formErrors.zipcode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.country ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="text"
                />
                {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={onChangeHandler}
                  className={`w-full border ${formErrors.phone ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  type="tel"
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary and Payment */}
        <div className="lg:w-2/5">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <CartTotal />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

            <div className="space-y-3">
              <label
                className={`flex items-center p-3 border rounded-md cursor-pointer ${method === "stripe" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={method === "stripe"}
                  onChange={() => setMethod("stripe")}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                />
                <img className="h-6 mx-4" src={assets.stripe_logo || "/placeholder.svg"} alt="Stripe" />
                <span className="text-sm text-gray-700">Pay with Credit/Debit Card</span>
              </label>

              <label
                className={`flex items-center p-3 border rounded-md cursor-pointer ${method === "cod" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                />
                <span className="mx-4 text-sm font-medium text-gray-700">Cash on Delivery</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              {loading ? <LoadingSpinner size="small" /> : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder
