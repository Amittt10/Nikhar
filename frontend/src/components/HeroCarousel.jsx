"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const HeroCarousel = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  // Auto-slide functionality
  useEffect(() => {
    if (!banners || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [banners])

  if (!banners || banners.length === 0) {
    return null
  }

  const handleBannerClick = (banner) => {
    if (banner.link) {
      navigate(banner.link)
    }
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            onClick={() => handleBannerClick(banner)}
          >
            <img
              src={banner.image || "/placeholder.svg"}
              alt={banner.title || "Banner"}
              className="h-full w-full object-cover object-center"
            />
            {banner.title && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/40 p-4 md:p-6 rounded-lg max-w-md text-center">
                  <h2 className="text-xl md:text-3xl font-bold text-white mb-2">{banner.title}</h2>
                  {banner.description && <p className="text-sm md:text-base text-white mb-4">{banner.description}</p>}
                  {banner.link && (
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors">
                      Shop Now
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
        onClick={goToPrevSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
        onClick={goToNextSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-4" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
