import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema({
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
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
wishlistSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const wishlistModel = mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema)
export default wishlistModel
