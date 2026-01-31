"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { ShopContext } from "../context/ShopContext"
import { toast } from "react-toastify"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"

const Profile = () => {
  const { token, backendUrl, loading, setLoading, userProfile, getUserProfile } = useContext(ShopContext)
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [addresses, setAddresses] = useState([])
  const [newAddress, setNewAddress] = useState({
    addressType: "Home",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    isDefault: false,
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (token) {
      getUserProfile()
      fetchAddresses()
    }
  }, [token])

  useEffect(() => {
    if (userProfile) {
      setFormData({
        ...formData,
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
      })

      if (userProfile.profilePicture) {
        setProfileImagePreview(userProfile.profilePicture)
      }
    }
  }, [userProfile])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      // This is a placeholder - you would need to implement this API endpoint
      const response = await axios.get(`${backendUrl}/api/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setAddresses(response.data.addresses || [])
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileImageUpload = async () => {
    if (!profileImage) {
      toast.error("Please select an image first")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("profilePicture", profileImage)

      const response = await axios.post(`${backendUrl}/api/user/profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        toast.success("Profile picture updated successfully")
        getUserProfile()
      } else {
        toast.error(response.data.message || "Failed to update profile picture")
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast.error(error.response?.data?.message || "An error occurred while uploading profile picture")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      // This is a placeholder - you would need to implement this API endpoint
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          name: formData.name,
          phone: formData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        toast.success("Profile updated successfully")
        getUserProfile()
      } else {
        toast.error(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "An error occurred while updating profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    try {
      setLoading(true)
      // This is a placeholder - you would need to implement this API endpoint
      const response = await axios.put(
        `${backendUrl}/api/user/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        toast.success("Password updated successfully")
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast.error(response.data.message || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error(error.response?.data?.message || "An error occurred while updating password")
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      // This is a placeholder - you would need to implement this API endpoint
      const url = editingAddressId
        ? `${backendUrl}/api/user/addresses/${editingAddressId}`
        : `${backendUrl}/api/user/addresses`

      const method = editingAddressId ? axios.put : axios.post

      const response = await method(url, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success(editingAddressId ? "Address updated successfully" : "Address added successfully")
        fetchAddresses()
        setShowAddressForm(false)
        setEditingAddressId(null)
        setNewAddress({
          addressType: "Home",
          street: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
          isDefault: false,
        })
      } else {
        toast.error(response.data.message || "Failed to save address")
      }
    } catch (error) {
      console.error("Error saving address:", error)
      toast.error(error.response?.data?.message || "An error occurred while saving address")
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = (address) => {
    setNewAddress({
      addressType: address.addressType || "Home",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipcode: address.zipcode || "",
      country: address.country || "",
      isDefault: address.isDefault || false,
    })
    setEditingAddressId(address._id)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      setLoading(true)
      // This is a placeholder - you would need to implement this API endpoint
      const response = await axios.delete(`${backendUrl}/api/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success("Address deleted successfully")
        fetchAddresses()
      } else {
        toast.error(response.data.message || "Failed to delete address")
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error(error.response?.data?.message || "An error occurred while deleting address")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-pink-200">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-pink-50 text-pink-500">
                      <svg
                        className="h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1 shadow-md hover:bg-pink-600 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {profileImage && (
                <button
                  onClick={handleProfileImageUpload}
                  disabled={loading}
                  className="text-sm bg-pink-600 text-white px-3 py-1 rounded-md hover:bg-pink-700 transition-colors"
                >
                  {loading ? <LoadingSpinner size="small" /> : "Upload Photo"}
                </button>
              )}
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900">{userProfile?.name || "User"}</h2>
                <p className="text-sm text-gray-500">{userProfile?.email || ""}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "personal"
                    ? "bg-pink-50 text-pink-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-pink-700"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${activeTab === "personal" ? "text-pink-500" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Personal Information
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "addresses"
                    ? "bg-pink-50 text-pink-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-pink-700"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${activeTab === "addresses" ? "text-pink-500" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Manage Addresses
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "password"
                    ? "bg-pink-50 text-pink-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-pink-700"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${activeTab === "password" ? "text-pink-500" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === "personal" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      {loading ? <LoadingSpinner size="small" /> : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setShowAddressForm(true)
                        setEditingAddressId(null)
                        setNewAddress({
                          addressType: "Home",
                          street: "",
                          city: "",
                          state: "",
                          zipcode: "",
                          country: "",
                          isDefault: false,
                        })
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      Add New Address
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h3>
                    <form onSubmit={handleAddressSubmit}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="addressType" className="block text-sm font-medium text-gray-700">
                            Address Type
                          </label>
                          <select
                            id="addressType"
                            name="addressType"
                            value={newAddress.addressType}
                            onChange={handleAddressInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="street"
                            id="street"
                            value={newAddress.street}
                            onChange={handleAddressInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={newAddress.city}
                            onChange={handleAddressInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State / Province
                          </label>
                          <input
                            type="text"
                            name="state"
                            id="state"
                            value={newAddress.state}
                            onChange={handleAddressInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                            ZIP / Postal Code
                          </label>
                          <input
                            type="text"
                            name="zipcode"
                            id="zipcode"
                            value={newAddress.zipcode}
                            onChange={handleAddressInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            id="country"
                            value={newAddress.country}
                            onChange={handleAddressInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center">
                            <input
                              id="isDefault"
                              name="isDefault"
                              type="checkbox"
                              checked={newAddress.isDefault}
                              onChange={handleAddressInputChange}
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                              Set as default address
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          {loading ? (
                            <LoadingSpinner size="small" />
                          ) : editingAddressId ? (
                            "Update Address"
                          ) : (
                            "Save Address"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : null}

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{address.addressType}</span>
                              {address.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              {address.street}, {address.city}, {address.state} {address.zipcode}, {address.country}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-sm text-pink-600 hover:text-pink-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      {loading ? <LoadingSpinner size="small" /> : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
