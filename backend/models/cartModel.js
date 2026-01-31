import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
      size: {
        type: String,
        default: "M",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema)
export default cartModel
