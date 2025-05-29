import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  isSuperUser: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ movieId: 1, createdAt: -1 });

reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);