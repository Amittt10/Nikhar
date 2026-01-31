"use client"

import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"

const CartTotal = ({ couponDiscount = 0 }) => {
  const { cartItems, products, currency, delivery_fee } = useContext(ShopContext)

  // Calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0
    if (Array.isArray(cartItems)) {
      cartItems.forEach((item) => {
        const product = products.find((p) => p._id === (item.product._id || item.product))
        if (product) {
          subtotal += product.price * item.quantity
        }
      })
    }
    return subtotal
  }

  const subtotal = calculateSubtotal()
  const discount = couponDiscount || 0
  const shipping = subtotal > 0 ? (subtotal > 35 ? 0 : delivery_fee) : 0
  const total = subtotal - discount + shipping

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium text-gray-900">
          {currency}
          {subtotal.toFixed(2)}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-green-600">
            -{currency}
            {discount.toFixed(2)}
          </span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium text-gray-900">
          {shipping === 0 ? "Free" : `${currency}${shipping.toFixed(2)}`}
        </span>
      </div>

      {subtotal > 0 && subtotal < 35 && (
        <div className="text-xs text-gray-500 italic">
          Add {currency}
          {(35 - subtotal).toFixed(2)} more to get free shipping
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 flex justify-between">
        <span className="text-base font-medium text-gray-900">Total</span>
        <span className="text-base font-bold text-gray-900">
          {currency}
          {total.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

export default CartTotal
