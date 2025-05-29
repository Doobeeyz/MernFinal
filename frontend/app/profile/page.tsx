'use client';

import { UploadButton } from '@uploadthing/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  username: string;
  email: string;
  avatarUrl?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();


  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await axios.get('http://localhost:3001/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache', // <--- добавьте это!
        }
      });

      // Если res.data пустой, не сбрасывайте пользователя
      if (!res.data || Object.keys(res.data).length === 0) {
        throw new Error('Пустой ответ');
      }

      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [router]);


const handleAvatarUpload = async (uploadedUrl: string) => {
  setUploading(true);
  try {
    await axios.patch(
      'http://localhost:3001/api/user/avatar',
      { avatarUrl: uploadedUrl },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // исправлено!
        },
      }
    );

    setUser(prev => prev ? { ...prev, avatarUrl: uploadedUrl } : null);
  } catch (err) {
    console.error('Ошибка при обновлении аватара:', err);
  } finally {
    setUploading(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fef3e2] text-[#333]">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fef3e2] text-[#333]">
        <div className="text-lg">Пользователь не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef3e2] py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-[#e53935] mb-8">Профиль</h1>

      <div className="max-w-md mx-auto bg-white border-2 border-[#ffcc00] shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Аватар */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Аватар"
              className="w-32 h-32 rounded-full object-cover shadow"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center shadow">
              <span className="text-4xl text-gray-500">👤</span>
            </div>
          )}

          {/* Upload */}
          <div className="text-center">
            <UploadButton
              endpoint="avatarUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  handleAvatarUpload(res[0].url);
                }
              }}
              onUploadError={(error) => {
                alert(`Ошибка при загрузке: ${error.message}`);
              }}
              appearance={{
                button: {
                  background: '#f0b100',
                  color: 'white',
                  fontSize: '14px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                },
              }}
            />
            {uploading && (
              <p className="mt-2 text-sm text-gray-500">Обновляем аватар...</p>
            )}
          </div>

          {/* User Info */}
          <div className="w-full">
            <div className="mb-4">
              <label className="block text-sm font-bold text-[#e53935] mb-1">Имя пользователя</label>
              <p className="text-[#333] border-2 border-[#ffcc00] bg-[#fff8e1] px-3 py-2 rounded-md text-sm">
                {user.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#e53935] mb-1">Email</label>
              <p className="text-[#333] border-2 border-[#ffcc00] bg-[#fff8e1] px-3 py-2 rounded-md text-sm">
                {user.email}
              </p>
            </div>
          </div>

          {/* Кнопка "Добавить фильм" */}
          <div className="w-full pt-4">
            <Link
              href="/add-movie"
              className="block w-full text-center bg-[#f0b100] hover:bg-[#ffcc00] text-white font-semibold py-2 rounded-md transition-colors"
            >
              Добавить фильм
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
