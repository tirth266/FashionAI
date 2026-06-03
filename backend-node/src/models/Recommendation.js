import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalImage: {
      type: String, // URL of the uploaded image
      required: true,
    },
    recommendedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FashionItem',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
