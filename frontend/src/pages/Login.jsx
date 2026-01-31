"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const [currentState, setCurrentState] = useState("Login")
  const { token, setToken, navigate, backendUrl, loading, setLoading } = useContext(ShopContext)

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formErrors, setFormErrors] = useState({})

  // Improve form validation and error handling
  const validateForm = () => {
    const errors = {}

    if (currentState === "Sign Up") {
      if (!name.trim()) errors.name = "Name is required"
      if (password !== confirmPassword) errors.confirmPassword = "Passwords don't match"
    }

    if (!email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid"

    if (!password) errors.password = "Password is required"
    else if (password.length < 8) errors.password = "Password must be at least 8 characters"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Fix the onSubmitHandler function to use backendUrl consistently
  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      if (currentState === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
          toast.success("Account created successfully!")
          navigate("/")
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
          toast.success("Logged in successfully!")
          navigate("/")
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      toast.error(error.response?.data?.message || "An error occurred during authentication")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token, navigate])

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <form onSubmit={onSubmitHandler} className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{currentState}</h2>
          <p className="text-gray-600 mt-1">
            {currentState === "Login"
              ? "Welcome back! Please enter your details."
              : "Create an account to get started."}
          </p>
        </div>

        {currentState === "Sign Up" && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="John Doe"
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            placeholder="you@example.com"
          />
          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className={`w-full px-3 py-2 border rounded-md ${
              formErrors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            placeholder="••••••••"
          />
          {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
        </div>

        {currentState === "Sign Up" && (
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="••••••••"
            />
            {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
          </div>
        )}

        {currentState === "Login" && (
          <div className="flex justify-end mb-4">
            <Link to="/forgot-password" className="text-sm text-pink-600 hover:text-pink-800">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
        >
          {loading ? <LoadingSpinner size="small" /> : currentState === "Login" ? "Sign In" : "Create Account"}
        </button>

        <div className="mt-4 text-center text-sm">
          {currentState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setCurrentState("Sign Up")
                  setFormErrors({})
                }}
                className="text-pink-600 hover:text-pink-800 font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setCurrentState("Login")
                  setFormErrors({})
                }}
                className="text-pink-600 hover:text-pink-800 font-medium"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
