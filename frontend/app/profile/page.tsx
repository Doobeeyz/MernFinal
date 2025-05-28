'use client';

import { UploadButton } from '@uploadthing/react';
import { useUploadThing } from '@/uploadthing';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:3001/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAvatarUrl(res.data.avatarUrl))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Профиль</h1>

      <div className="mt-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-32 h-32 rounded-full" />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full" />
        )}
      </div>

      <UploadButton
        endpoint="avatarUploader"
        onClientUploadComplete={async (res) => {
          const uploadedUrl = res[0].url;
          setAvatarUrl(uploadedUrl);

          await axios.patch(
            'http://localhost:3001/api/user/avatar',
            { avatarUrl: uploadedUrl },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
        }}
      />
    </div>
  );
}
