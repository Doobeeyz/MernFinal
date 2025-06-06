import express from "express";
import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";

const router = express.Router();

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
  try {
    const movies = await Movie.find().populate('actors', 'name bio photoUrl');
    res.json(movies);
  } catch (error) {
    console.error('Ошибка при получении фильмов:', error);
    res.status(500).json({ message: 'Ошибка при получении фильмов', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('actors', 'name bio photoUrl');;
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }
    res.json(movie.toObject());
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении фильма', error: error.message });
  }
});

export default router;