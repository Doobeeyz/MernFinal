import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  releaseDate: Date,
  description: String,
  trailerUrl: String,
  posterUrl: String,
  rating: {
    type: Number,
    default: 0,
  },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }], 
});

export default mongoose.model("Movie", movieSchema);
