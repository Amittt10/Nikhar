import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"

const Sidebar = () => {
  return (
    <div className="w-[70px] md:w-[250px] min-h-screen bg-white shadow-md">
      <div className="flex flex-col gap-2 pt-6 px-4">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500" : "text-gray-600 hover:bg-gray-50"
            }`
          }
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon || "/placeholder.svg"} alt="" />
          <span className="hidden md:block">Add Products</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500" : "text-gray-600 hover:bg-gray-50"
            }`
          }
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon || "/placeholder.svg"} alt="" />
          <span className="hidden md:block">Product List</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500" : "text-gray-600 hover:bg-gray-50"
            }`
          }
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.parcel_icon || "/placeholder.svg"} alt="" />
          <span className="hidden md:block">Manage Orders</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500" : "text-gray-600 hover:bg-gray-50"
            }`
          }
          to="/banners"
        >
          <img className="w-5 h-5" src={assets.image_icon || "/placeholder.svg"} alt="" />
          <span className="hidden md:block">Banners</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
