import express from "express";
import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";

const router = express.Router();

// Middleware to verify JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token missing" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

router.post("/add", auth, async (req, res) => {
  const movie = new Movie({ ...req.body, createdBy: req.user.id });
  await movie.save();
  res.status(201).json({ message: "Movie added" });
});

router.get("/all", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

export default router;