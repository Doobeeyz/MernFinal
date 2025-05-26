const { createUploadthing } = require("uploadthing/server");
const User = require('../models/User');
const auth = require('../middleware/auth');

const f = createUploadthing();

const fileRouter = {
  // Avatar uploader
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, res }) => {
      // Используем middleware для проверки авторизации
      return new Promise((resolve, reject) => {
        auth(req, res, () => {
          if (req.userId) {
            resolve({ userId: req.userId });
          } else {
            reject(new Error("Unauthorized"));
          }
        });
      });
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Обновляем аватар пользователя в базе данных
      try {
        await User.findByIdAndUpdate(metadata.userId, {
          avatar: file.url
        });
        console.log("User avatar updated successfully");
      } catch (error) {
        console.error("Error updating user avatar:", error);
      }

      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Movie poster uploader (для будущего использования)
  posterUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, res }) => {
      return new Promise((resolve, reject) => {
        auth(req, res, () => {
          if (req.userId) {
            resolve({ userId: req.userId });
          } else {
            reject(new Error("Unauthorized"));
          }
        });
      });
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Poster upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

module.exports = { fileRouter };