import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Verify from "./pages/Verify"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import PlaceOrder from "./pages/PalceOrder"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Collection from "./pages/Collection"
import Trending from "./pages/Trending"
import BestSellers from "./pages/BestSellers"
import NewArrivals from "./pages/NewArrivals"
import Face from "./pages/Face"
import Eyes from "./pages/Eyes"
import Lips from "./pages/Lips"
import Cleansers from "./pages/Cleansers"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />

          {/* Makeup Sub-Routes */}
          <Route path="/makeup/face" element={<Face />} />
          <Route path="/makeup/eyes" element={<Eyes />} />
          <Route path="/makeup/lips" element={<Lips />} />
          <Route path="/makeup/nails" element={<Collection />} />
          <Route path="/makeup/brushes" element={<Collection />} />

          {/* Skincare Sub-Routes */}
          <Route path="/skincare/cleansers" element={<Cleansers />} />
          <Route path="/skincare/moisturizers" element={<Collection />} />
          <Route path="/skincare/serums" element={<Collection />} />
          <Route path="/skincare/masks" element={<Collection />} />
          <Route path="/skincare/sunscreen" element={<Collection />} />

          {/* Haircare Sub-Routes */}
          <Route path="/haircare/shampoo" element={<Collection />} />
          <Route path="/haircare/conditioner" element={<Collection />} />
          <Route path="/haircare/styling" element={<Collection />} />
          <Route path="/haircare/treatment" element={<Collection />} />

          {/* User Routes */}
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
