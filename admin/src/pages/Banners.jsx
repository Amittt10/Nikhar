"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { backendUrl } from "../App"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/LoadingSpinner"

const Banners = ({ token, loading: parentLoading, setLoading: setParentLoading }) => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingBanner, setEditingBanner] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  })
  const [bannerImage, setBannerImage] = useState(null)
  const [bannerImagePreview, setBannerImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true)
      if (setParentLoading) setParentLoading(true)

      const response = await axios.get(`${backendUrl}/api/banner/list`)

      if (response.data.success) {
        setBanners(response.data.banners)
      } else {
        toast.error(response.data.message || "Failed to fetch banners")
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast.error(error.response?.data?.message || "An error occurred while fetching banners")
    } finally {
      setLoading(false)
      if (setParentLoading) setParentLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchBanners()
    } else {
      setLoading(false)
    }
  }, [token])

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setBannerImage(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setBannerImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!bannerImage && !editingBanner) {
      toast.error("Please select a banner image")
      return
    }

    try {
      setLoading(true)
      if (setParentLoading) setParentLoading(true)

      const bannerFormData = new FormData()
      if (editingBanner) {
        bannerFormData.append("id", editingBanner._id)
      }
      bannerFormData.append("title", formData.title)
      bannerFormData.append("description", formData.description)
      bannerFormData.append("link", formData.link)
      if (bannerImage) {
        bannerFormData.append("image", bannerImage)
      }

      const url = editingBanner ? `${backendUrl}/api/banner/update` : `${backendUrl}/api/banner/add`

      const response = await axios.post(url, bannerFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        toast.success(editingBanner ? "Banner updated successfully" : "Banner added successfully")
        fetchBanners()
        resetForm()
      } else {
        toast.error(response.data.message || "Failed to save banner")
      }
    } catch (error) {
      console.error("Error saving banner:", error)
      toast.error(error.response?.data?.message || "An error occurred while saving the banner")
    } finally {
      setLoading(false)
      if (setParentLoading) setParentLoading(false)
    }
  }

  // Handle banner deletion
  const handleDelete = async (id) => {
    try {
      setLoading(true)
      if (setParentLoading) setParentLoading(true)

      const response = await axios.delete(`${backendUrl}/api/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success("Banner deleted successfully")
        fetchBanners()
      } else {
        toast.error(response.data.message || "Failed to delete banner")
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast.error(error.response?.data?.message || "An error occurred while deleting the banner")
    } finally {
      setLoading(false)
      if (setParentLoading) setParentLoading(false)
      setConfirmDelete(null)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
    })
    setBannerImage(null)
    setBannerImagePreview(null)
    setEditingBanner(null)
    setShowForm(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Set up form for editing
  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      link: banner.link || "",
    })
    setBannerImagePreview(banner.image)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Banners</h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={fetchBanners}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
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
              {showForm ? "Cancel" : "Add New Banner"}
            </button>
          </div>
        </div>

        {/* Banner Form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image {!editingBanner && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center space-x-4">
                  {bannerImagePreview && (
                    <div className="relative">
                      <img
                        src={bannerImagePreview || "/placeholder.svg"}
                        alt="Banner Preview"
                        className="h-32 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerImage(null)
                          setBannerImagePreview(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="bannerImage"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {bannerImagePreview ? "Change Image" : "Select Image"}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x500 pixels, max 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Banner Title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Banner Description"
                ></textarea>
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., /collection or /product/123"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  {loading ? <LoadingSpinner size="small" /> : editingBanner ? "Update Banner" : "Add Banner"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List */}
        {loading ? (
          <div className="py-10 text-center">
            <LoadingSpinner size="large" />
          </div>
        ) : banners.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No banners found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title || "Banner"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{banner.title || "Untitled Banner"}</h3>
                  {banner.description && <p className="text-sm text-gray-500 mb-2">{banner.description}</p>}
                  {banner.link && (
                    <p className="text-xs text-gray-500 mb-4">
                      Link: <span className="font-mono">{banner.link}</span>
                    </p>
                  )}
                  <div className="flex justify-end space-x-2">
                    {confirmDelete === banner._id ? (
                      <>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setConfirmDelete(banner._id)}
                          className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded-md hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Banners
