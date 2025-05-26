'use client';

import { useState } from 'react';
import { UploadButton } from '../lib/uploadthing';
import { useAuth } from '..//app/context/AuthContext';

export default function AvatarUpload({ onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const { user, token } = useAuth();

  const handleUploadComplete = (res) => {
    console.log("Upload completed:", res);
    setIsUploading(false);
    
    if (res && res.length > 0) {
      const uploadedFile = res[0];
      console.log("Uploaded file URL:", uploadedFile.url);
      
      if (onUploadComplete) {
        onUploadComplete(uploadedFile.url);
      }
      
      // Перезагружаем страницу для обновления данных пользователя
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setIsUploading(false);
    alert(`Ошибка загрузки: ${error.message}`);
  };

  const handleUploadBegin = () => {
    console.log("Upload began");
    setIsUploading(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            onError={(e) => {
              console.error("Error loading avatar image:", e);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      <UploadButton
        endpoint="avatarUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        onUploadBegin={handleUploadBegin}
        appearance={{
          button: {
            background: isUploading ? "#9CA3AF" : "#4F46E5",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isUploading ? "not-allowed" : "pointer",
          },
          allowedContent: {
            color: "#6B7280",
            fontSize: "12px",
            marginTop: "4px",
          },
        }}
        content={{
          button: isUploading ? "Загрузка..." : "Загрузить аватар",
          allowedContent: "Изображение до 4МБ",
        }}
        headers={{
          Authorization: `Bearer ${token}`,
        }}
      />
      
      {isUploading && (
        <div className="text-sm text-gray-500">
          Загрузка файла...
        </div>
      )}
    </div>
  );
}