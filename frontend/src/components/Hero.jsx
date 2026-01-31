import { assets } from "../assets/assets"

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">LUXURY BEAUTY</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Glow & Radiance</h1>
          <p className="text-gray-600 my-3 max-w-md">
            Discover premium skincare and makeup products that enhance your natural beauty
          </p>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero right side */}
      <img className="w-full sm:w-1/2" src={assets.hero_img || "/placeholder.svg"} alt="Beauty products showcase" />
      <div></div>
    </div>
  )
}

export default Hero
