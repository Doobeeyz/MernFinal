// Только этот файл использует TypeScript
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Avatar uploaded:", file.url);
  }),

  posterUploader: f({
    image: { maxFileSize: "5MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Poster uploaded:", file.url);
  }),
} satisfies FileRouter;
