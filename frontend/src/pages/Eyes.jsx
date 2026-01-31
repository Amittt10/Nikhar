const Eyes = () => {
  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-pink-500 mb-5">Makeup - Eye Products</h1>
      <p>Shop the best products for stunning eye makeup, including mascaras, eyeliners, and eyeshadows.</p>
      {/* Product List */}
      <ul className="mt-5 space-y-4">
        <li className="font-medium text-gray-800">Mascara</li>
        <li className="font-medium text-gray-800">Eyeliner</li>
        <li className="font-medium text-gray-800">Eyeshadow</li>
        <li className="font-medium text-gray-800">Brow Pencils</li>
      </ul>
    </div>
  )
}

export default Eyes
