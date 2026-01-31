"use client"

import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import { Routes, Route, Navigate } from "react-router-dom"
import Add from "./pages/Add"
import List from "./pages/List"
import Orders from "./pages/Orders"
import Login from "./components/Login"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Banners from "./pages/Banners"

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {token ? (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full md:w-[80%] mx-auto p-6 text-gray-600">
              <Routes>
                <Route path="/" element={<Navigate to="/list" replace />} />
                <Route path="/add" element={<Add token={token} loading={loading} setLoading={setLoading} />} />
                <Route
                  path="/add/:productId"
                  element={<Add token={token} loading={loading} setLoading={setLoading} />}
                />
                <Route path="/list" element={<List token={token} loading={loading} setLoading={setLoading} />} />
                <Route path="/orders" element={<Orders token={token} loading={loading} setLoading={setLoading} />} />
                <Route path="/banners" element={<Banners token={token} loading={loading} setLoading={setLoading} />} />
                <Route path="*" element={<Navigate to="/list" replace />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setToken={setToken} loading={loading} setLoading={setLoading} />
      )}
    </div>
  )
}

export default App
