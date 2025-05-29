import express from "express";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/movie/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const reviews = await Review.find({ movieId })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movieId, rating, text } = req.body;
    const userId = req.user.id;
    const superUser = req.user.superUser

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Фильм не найден" });
    }

    const existingReview = await Review.findOne({ userId, movieId });
    if (existingReview) {
      return res.status(400).json({ error: "Вы уже оставили отзыв на этот фильм" });
    }

    const review = new Review({
      userId,
      movieId,
      rating,
      text,
      isSuperUser:superUser ?? false
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username avatarUrl');

    await updateMovieRating(movieId);

    const io = req.app.get('io');
    if (io) {
      io.emit('newReview', {
        movieId,
        review: populatedReview
      });
    }

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Ошибка при создании отзыва:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Вы уже оставили отзыв на этот фильм" });
    }
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.delete("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ error: "Отзыв не найден или вы не можете его удалить" });
    }

    const movieId = review.movieId;
    await Review.findByIdAndDelete(reviewId);

    await updateMovieRating(movieId);

    const io = req.app.get('io');
    if (io) {
      io.emit('reviewDeleted', {
        movieId,
        reviewId
      });
    }

    res.json({ message: "Отзыв удален" });
  } catch (error) {
    console.error("Ошибка при удалении отзыва:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

async function updateMovieRating(movieId) {
  try {
    const reviews = await Review.find({ movieId });
    
    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      await Movie.findByIdAndUpdate(movieId, { 
        rating: Math.round(averageRating * 10) / 10
      });
    } else {
      await Movie.findByIdAndUpdate(movieId, { rating: 0 });
    }
  } catch (error) {
    console.error("Ошибка при обновлении рейтинга фильма:", error);
  }
}

export default router;