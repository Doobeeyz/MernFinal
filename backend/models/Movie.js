import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  trailerUrl: String,
  posterUrl: String,
  director: String,
  releaseDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Movie", movieSchema);