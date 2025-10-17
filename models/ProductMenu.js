import mongoose from 'mongoose';

// ✅ Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: {          // Supabase backend me 'user_name' ke saath match kare
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt automatically add hote hain
);

// ✅ Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image_url: {        // ✅ Use consistent image_url key
      type: String,
      required: true,
    },
    reviews: [reviewSchema], // Embed reviewSchema
  },
  { timestamps: true }
);

// ✅ Model
const Product = mongoose.model('Product', productSchema);

export default Product;
