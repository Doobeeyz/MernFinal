const express = require('express');
const { createRouteHandler } = require("uploadthing/express");
const { createUploadthing } = require("uploadthing/server");
const User = require('../models/User');

const router = express.Router();
const f = createUploadthing();

// Определяем uploaders
const avatarUploader = f({
  image: {
    maxFileSize: "4MB",
    maxFileCount: 1,
  },
})
  .middleware(async ({ req }) => {
    console.log("Middleware called for avatar upload");
    
    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No Bearer token found");
      throw new Error("No token provided");
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("Token extracted:", token.substring(0, 20) + "...");

    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log("Token decoded, userId:", decoded.userId);
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log("User not found in database");
        throw new Error("User not found");
      }
      
      console.log("User found:", user.email);
      return { userId: decoded.userId };
    } catch (error) {
      console.error("Token verification error:", error);
      throw new Error("Invalid token");
    }
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete!");
    console.log("File:", file);
    console.log("Metadata:", metadata);

    try {
      // Обновляем аватар пользователя
      const updatedUser = await User.findByIdAndUpdate(
        metadata.userId, 
        { avatar: file.url },
        { new: true }
      );
      
      console.log("User avatar updated:", updatedUser.avatar);
      
      return { 
        uploadedBy: metadata.userId, 
        url: file.url,
        success: true 
      };
    } catch (error) {
      console.error("Error updating user avatar:", error);
      throw error;
    }
  });

// Создаем обработчик маршрутов
const uploadthingHandler = createRouteHandler({
  router: {
    avatarUploader,
  },
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  }
});

// Применяем обработчик
router.use(uploadthingHandler);

module.exports = router;
