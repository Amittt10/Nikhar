import Title from "../components/Title"
import { assets } from "../assets/assets"
import NewsletterBox from "../components/NewsletterBox"

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-3xl text-center pt-12 pb-6 border-t border-gray-100">
        <Title text1={"OUR"} text2={"STORY"} />
      </div>

      <div className="my-12 flex flex-col md:flex-row gap-16 items-center">
        <img
          className="w-full md:max-w-[500px] rounded-lg shadow-lg"
          src={assets.about_img || "/placeholder.svg"}
          alt="Beauty products"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-700">
          <p className="text-lg">
            Founded in 2023, Nikhar Beauty is your ultimate destination for premium skincare and cosmetics. We believe
            everyone deserves to feel beautiful in their own skin.
          </p>
          <p>
            Our carefully curated collection features only the finest beauty products from around the world, selected by
            our team of dermatologists and makeup artists.
          </p>
          <b className="text-gray-900 text-xl font-medium">Our Mission</b>
          <p>
            To help everyone achieve their best skin and express themselves through high-quality, ethically sourced
            beauty products that enhance natural beauty.
          </p>
        </div>
      </div>

      <div className="text-2xl py-8 text-center">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6">
        <div className="border border-pink-100 rounded-lg px-8 py-10 flex flex-col gap-5 bg-white shadow-sm hover:shadow-md transition-shadow">
          <b className="text-lg text-pink-600">Clean Beauty</b>
          <p className="text-gray-600">
            All our products are free from harmful chemicals, parabens, sulfates, and artificial fragrances.
          </p>
        </div>
        <div className="border border-pink-100 rounded-lg px-8 py-10 flex flex-col gap-5 bg-white shadow-sm hover:shadow-md transition-shadow">
          <b className="text-lg text-pink-600">Dermatologist Tested</b>
          <p className="text-gray-600">
            Every product is rigorously tested and approved by leading dermatologists for all skin types.
          </p>
        </div>
        <div className="border border-pink-100 rounded-lg px-8 py-10 flex flex-col gap-5 bg-white shadow-sm hover:shadow-md transition-shadow">
          <b className="text-lg text-pink-600">Personalized Beauty</b>
          <p className="text-gray-600">
            Our beauty experts provide customized recommendations based on your unique skin type and concerns.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
