"use client"

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Hero from "../components/Hero"
import BestSeller from "../components/BestSeller"
import LatestCollection from "../components/LatestCollection"
import OurPolicy from "../components/OurPolicy"
import NewsletterBox from "../components/NewsletterBox"
import LoadingSpinner from "../components/LoadingSpinner"
import HeroCarousel from "../components/HeroCarousel"

const Home = () => {
  const { products, loading, banners } = useContext(ShopContext) || { products: [], loading: false, banners: [] }
  const [bestSellers, setBestSellers] = useState([])
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    // Filter bestseller products
    if (products && products.length > 0) {
      const bestsellers = products.filter((item) => item.bestseller === true).slice(0, 8)
      setBestSellers(bestsellers)

      // Get latest products (assuming products are sorted by date)
      const latest = [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 8)
      setLatestProducts(latest)
    }
  }, [products])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Banner Carousel */}
      {banners && banners.length > 0 ? <HeroCarousel banners={banners} /> : <Hero />}

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard title="Makeup" image="/placeholder.svg?height=200&width=200" link="/makeup/face" />
          <CategoryCard title="Skincare" image="/placeholder.svg?height=200&width=200" link="/skincare/cleansers" />
          <CategoryCard title="Haircare" image="/placeholder.svg?height=200&width=200" link="/haircare/shampoo" />
          <CategoryCard title="Fragrance" image="/placeholder.svg?height=200&width=200" link="/collection" />
        </div>
      </div>

      {/* Bestsellers Section */}
      <div className="bg-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BestSeller products={bestSellers} />
        </div>
      </div>

      {/* Latest Collection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LatestCollection />
      </div>

      {/* Trending Brands */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Trending Brands</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <BrandCard image="/placeholder.svg?height=100&width=100" />
            <BrandCard image="/placeholder.svg?height=100&width=100" />
            <BrandCard image="/placeholder.svg?height=100&width=100" />
            <BrandCard image="/placeholder.svg?height=100&width=100" />
            <BrandCard image="/placeholder.svg?height=100&width=100" />
            <BrandCard image="/placeholder.svg?height=100&width=100" />
          </div>
        </div>
      </div>

      {/* Our Policy */}
      <OurPolicy />

      {/* Newsletter */}
      <NewsletterBox />
    </div>
  )
}

// Category Card Component
const CategoryCard = ({ title, image, link }) => {
  return (
    <a href={link} className="group">
      <div className="overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
    </a>
  )
}

// Brand Card Component
const BrandCard = ({ image }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <img src={image || "/placeholder.svg"} alt="Brand" className="h-full w-full object-contain p-4" />
    </div>
  )
}

export default Home
