"use client"
import { assets } from "../assets/assets"

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken("")
    localStorage.removeItem("token")
  }

  return (
    <div className="flex items-center py-4 px-6 justify-between bg-white shadow-sm">
      <div className="flex items-center">
        <img className="h-10" src={assets.logo || "/placeholder.svg"} alt="Nikhar Admin" />
        <h1 className="ml-4 text-xl font-semibold text-gray-800 hidden sm:block">Admin Dashboard</h1>
      </div>
      <button
        onClick={handleLogout}
        className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors text-sm"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
