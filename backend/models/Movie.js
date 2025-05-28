import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  releaseDate: Date,
  trailerUrl: String,
  posterUrl: String,
});

export default mongoose.model("Movie", movieSchema);
