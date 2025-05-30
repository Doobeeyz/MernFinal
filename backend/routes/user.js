import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


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


router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email avatarUrl");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select("username email avatarUrl");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
