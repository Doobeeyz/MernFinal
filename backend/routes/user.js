import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// PATCH /api/user/avatar
router.patch("/avatar", authMiddleware, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { avatarUrl });
    res.json({ message: "Avatar updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/user/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email avatarUrl");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
