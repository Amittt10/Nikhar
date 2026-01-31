"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import DropdownMenu from "./DropdownMenu"

const Navbar = () => {
  const { getCartCount, setShowSearch, isAuthenticated, logout, userProfile, wishlistItems } = useContext(
    ShopContext,
  ) || {
    getCartCount: () => 0,
    setShowSearch: () => {},
    isAuthenticated: false,
    logout: () => {},
    userProfile: null,
    wishlistItems: [],
  }
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-600">NIKHAR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/makeup/face">Face</NavLink>
            <NavLink to="/makeup/eyes">Eyes</NavLink>
            <NavLink to="/makeup/lips">Lips</NavLink>
            <NavLink to="/skincare/cleansers">Skincare</NavLink>
            <NavLink to="/best-sellers">Best Sellers</NavLink>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setShowSearch(true)}
              className="text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="text-gray-700 hover:text-pink-600 transition-colors relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="text-gray-700 hover:text-pink-600 transition-colors relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative">
                <DropdownMenu
                  trigger={
                    <button className="flex items-center text-gray-700 hover:text-pink-600 transition-colors">
                      {userProfile?.profilePicture ? (
                        <img
                          src={userProfile.profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </button>
                  }
                  items={[
                    { label: "My Profile", link: "/profile" },
                    { label: "My Orders", link: "/orders" },
                    { label: "My Wishlist", link: "/wishlist" },
                    { label: "Logout", onClick: logout },
                  ]}
                />
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-pink-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <ul className="space-y-4">
              <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/makeup/face" onClick={() => setIsMobileMenuOpen(false)}>
                Face
              </MobileNavLink>
              <MobileNavLink to="/makeup/eyes" onClick={() => setIsMobileMenuOpen(false)}>
                Eyes
              </MobileNavLink>
              <MobileNavLink to="/makeup/lips" onClick={() => setIsMobileMenuOpen(false)}>
                Lips
              </MobileNavLink>
              <MobileNavLink to="/skincare/cleansers" onClick={() => setIsMobileMenuOpen(false)}>
                Skincare
              </MobileNavLink>
              <MobileNavLink to="/best-sellers" onClick={() => setIsMobileMenuOpen(false)}>
                Best Sellers
              </MobileNavLink>
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    My Profile
                  </MobileNavLink>
                  <MobileNavLink to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                    My Orders
                  </MobileNavLink>
                  <li>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Login / Register
                </MobileNavLink>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

// Desktop Navigation Link
const NavLink = ({ to, children }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive ? "text-pink-600" : "text-gray-700 hover:text-pink-600"
      }`}
    >
      {children}
    </Link>
  )
}

// Mobile Navigation Link
const MobileNavLink = ({ to, onClick, children }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`block px-4 py-2 ${
          isActive ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600 hover:bg-gray-50"
        } transition-colors`}
      >
        {children}
      </Link>
    </li>
  )
}

export default Navbar
