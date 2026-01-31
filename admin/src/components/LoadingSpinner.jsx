const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-4",
  }

  const sizeClass = sizeClasses[size] || sizeClasses.medium

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClass} border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
      ></div>
    </div>
  )
}

export default LoadingSpinner
