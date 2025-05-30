import express from "express";
import Actor from "../models/Actor.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.post("/add", auth, async (req, res) => {
  const actor = new Actor(req.body);
  await actor.save();
  res.status(201).json({ message: "Актёр добавлен" });
});


router.get("/all", async (req, res) => {
  const actors = await Actor.find();
  res.json(actors);
});

   router.get("/:id", async (req, res) => {
     try {
       const actor = await Actor.findById(req.params.id);
       if (!actor) {
         return res.status(404).json({ message: "Актёр не найден" });
       }
       res.json(actor);
     } catch (error) {
       res.status(500).json({ message: "Ошибка при получении актёра", error: error.message });
     }
   });
   

export default router;
