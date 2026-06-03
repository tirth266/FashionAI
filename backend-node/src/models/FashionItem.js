import mongoose from 'mongoose';

const fashionItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number], // For AI similarity search
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const FashionItem = mongoose.model('FashionItem', fashionItemSchema);

export default FashionItem;
