import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movie.js";
import userRoutes from "./routes/user.js";
import reviewRouter from "./routes/review.js"
import actorRoutes from "./routes/actorRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: "*" ,
    methods: ["GET", "POST", "DELETE"]
  } 
});

// Middleware
app.use(cors());
app.use(express.json());

app.set('io', io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRouter)
app.use("/api/actors", actorRoutes);

// WebSocket
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinMovie", (movieId) => {
    socket.join(`movie_${movieId}`);
    console.log(`User ${socket.id} joined movie room: movie_${movieId}`);
  })

  socket.on("leaveMovie", (movieId) => {
    socket.leave(`movie_${movieId}`);
    console.log(`User ${socket.id} leaved movie room: movie_${movieId}`);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
