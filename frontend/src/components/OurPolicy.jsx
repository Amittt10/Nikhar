import { assets } from "../assets/assets"

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.exchange_icon || "/placeholder.svg"} className="w-12 m-auto mb-5" alt="Cruelty-free icon" />
        <p className="font-semibold">Cruelty-Free Products</p>
        <p className="text-gray-400">We never test on animals</p>
      </div>

      <div>
        <img src={assets.quality_icon || "/placeholder.svg"} className="w-12 m-auto mb-5" alt="Quality icon" />
        <p className="font-semibold">Premium Ingredients</p>
        <p className="text-gray-400">Ethically sourced, high-quality formulations</p>
      </div>

      <div>
        <img src={assets.support_img || "/placeholder.svg"} className="w-12 m-auto mb-5" alt="Support icon" />
        <p className="font-semibold">Beauty Consultations</p>
        <p className="text-gray-400">Free skincare and makeup advice</p>
      </div>
    </div>
  )
}

export default OurPolicy
