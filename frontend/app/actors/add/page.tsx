'use client';

import { useState } from 'react';
import axios from 'axios';
import { UploadButton } from '@uploadthing/react';
import { useRouter } from 'next/navigation';

export default function AddActorPage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);

     if (!photoUrl) {
       alert('Пожалуйста, загрузите фото актёра.');
       setLoading(false);
       return;
     }

     try {
       const token = localStorage.getItem('accessToken');
       await axios.post(
         'http://localhost:3001/api/actors/add',
         { name, bio, photoUrl },
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );
       router.push('/actors'); 
     } catch (err) {
       console.error('Ошибка при добавлении актёра:', err);
     } finally {
       setLoading(false);
     }
   };
   

  return (
    <div className="min-h-screen bg-[#fef3e2] text-[#333] p-4">
      <h1 className="text-3xl font-bold text-center mt-[3vh] text-[#e53935]">Добавить актёра</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white border-2 border-[#ffcc00] rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#e53935] mb-1">Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border-2 border-[#ffcc00] rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#e53935] mb-1">Биография</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full p-2 border-2 border-[#ffcc00] rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#e53935] mb-1">Фото</label>
                  <UploadButton
     endpoint="avatarUploader" 
     onClientUploadComplete={(res) => {
       if (res && res.length > 0) {
         setPhotoUrl(res[0].ufsUrl);
       }
     }}
     onUploadError={(error) => {
       alert(`Ошибка при загрузке: ${error.message}`);
     }}
   />
   
   
   
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e53935] text-white py-2 rounded"
        >
          {loading ? 'Добавляем...' : 'Добавить актёра'}
        </button>
      </form>
    </div>
  );
}
