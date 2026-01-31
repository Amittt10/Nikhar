"use client"

import { useState } from "react"

const NewsletterBox = () => {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="py-16 px-4 bg-primary-50">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-prata text-secondary-900 mb-3">Join our beauty community</h2>
        <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
          Subscribe to receive exclusive offers, beauty tips, and new product alerts
        </p>

        {submitted ? (
          <div className="bg-white p-8 rounded-lg shadow-soft max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-primary-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
            <p className="text-secondary-600">You'll be the first to know about our new products and special offers.</p>
          </div>
        ) : (
          <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors flex-shrink-0 font-medium shadow-md transform hover:scale-105 transition-transform duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "SUBSCRIBE NOW"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default NewsletterBox
