import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  url: "http://localhost:3001/api/uploadthing",
});

export const UploadDropzone = generateUploadDropzone({
  url: "http://localhost:3001/api/uploadthing",
});