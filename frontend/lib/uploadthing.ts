// Только этот файл использует TypeScript
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file, metadata }) => {
      // тут ты можешь обработать файл, если нужно
      console.log("Upload complete", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
