"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const DropdownMenu = () => {
  // State to manage dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Function to toggle dropdown visibility
  const handleDropdownToggle = (dropdownName) => {
    // If the same dropdown is clicked, close it; otherwise, open it
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(dropdownName)
    }
  }

  // Function to close dropdown when clicked outside
  const closeDropdown = () => {
    setActiveDropdown(null)
  }

  return (
    <div className="MegaDropdownHeading flex flex-wrap gap-4 p-4 bg-gray-100 rounded shadow-md">
      {/* Makeup Dropdown */}
      <div className="relative w-40">
        <p
          className="font-medium text-gray-800 cursor-pointer hover:text-pink-500"
          onClick={() => handleDropdownToggle("makeup")}
        >
          Makeup
        </p>
        {activeDropdown === "makeup" && (
          <div className="absolute bg-white rounded shadow-md mt-2 z-50" onMouseLeave={closeDropdown}>
            <ul className="py-2 px-4">
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/makeup/face">Face (Foundation, Blush)</Link>
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/makeup/eyes">Eyes (Mascara, Eyeshadow)</Link>
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                <Link to="/makeup/lips">Lips (Lipstick, Gloss)</Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Skincare Dropdown */}
      <div className="relative w-40">
        <p
          className="font-medium text-gray-800 cursor-pointer hover:text-blue-500"
          onClick={() => handleDropdownToggle("skincare")}
        >
          Skincare
        </p>
        {activeDropdown === "skincare" && (
          <div className="absolute bg-white rounded shadow-md mt-2 z-50" onMouseLeave={closeDropdown}>
            <ul className="py-2 px-4">
              <li className="hover:text-blue-500 cursor-pointer">
                <Link to="/skincare/cleansers">Cleansers</Link>
              </li>
              <li className="hover:text-blue-500 cursor-pointer">
                <Link to="/skincare/moisturizers">Moisturizers</Link>
              </li>
              <li className="hover:text-blue-500 cursor-pointer">
                <Link to="/skincare/sunscreen">Sunscreen</Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Haircare Dropdown */}
      <div className="relative w-40">
        <p
          className="font-medium text-gray-800 cursor-pointer hover:text-yellow-500"
          onClick={() => handleDropdownToggle("haircare")}
        >
          Haircare
        </p>
        {activeDropdown === "haircare" && (
          <div className="absolute bg-white rounded shadow-md mt-2 z-50" onMouseLeave={closeDropdown}>
            <ul className="py-2 px-4">
              <li className="hover:text-yellow-500 cursor-pointer">
                <Link to="/haircare/shampoo">Shampoo</Link>
              </li>
              <li className="hover:text-yellow-500 cursor-pointer">
                <Link to="/haircare/conditioner">Conditioner</Link>
              </li>
              <li className="hover:text-yellow-500 cursor-pointer">
                <Link to="/haircare/styling">Styling Products</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default DropdownMenu
