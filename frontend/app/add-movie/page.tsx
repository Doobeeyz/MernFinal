'use client';

import { UploadButton } from '@uploadthing/react';
import { useState } from 'react';
import axios from 'axios';

export default function AddMoviePage() {
  const [title, setTitle] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [director, setDirector] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:3001/api/movies/add',
        {
          title,
          trailerUrl,
          posterUrl,
          director,
          releaseDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Фильм успешно добавлен!');
      setTitle('');
      setTrailerUrl('');
      setPosterUrl('');
      setDirector('');
      setReleaseDate('');
    } catch (err) {
      console.error(err);
      setMessage('Ошибка при добавлении фильма');
    }
  };

  return (
    <div className="bg-[#fef3e2] min-h-screen flex items-center justify-center font-['Segoe_UI',sans-serif]">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-[#ffcc00] p-5 w-[500px] shadow-lg rounded-[10px]"
      >
        <h1 className="text-center text-[#e53935] text-xl font-bold mb-6">
          Добавить фильм
        </h1>

        {message && (
          <p className="mb-4 text-green-600 text-center text-sm">{message}</p>
        )}

        <div className="mb-2">
          <label className="block text-[#333] font-bold mb-1">Название:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[93%] p-2 border-2 border-[#ffcc00] rounded bg-[#fff8e1] text-sm text-gray-800"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-[#333] font-bold mb-1">Ссылка на трейлер:</label>
          <input
            type="text"
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
            className="w-[93%] p-2 border-2 border-[#ffcc00] rounded bg-[#fff8e1] text-sm text-gray-800"
          />
        </div>

        <div className="mb-2">
          <label className="block text-[#333] font-bold mb-1">Режиссёр:</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="w-[93%] p-2 border-2 border-[#ffcc00] rounded bg-[#fff8e1] text-sm text-gray-800"
          />
        </div>

        <div className="mb-2">
          <label className="block text-[#333] font-bold mb-1">Дата релиза:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-[93%] p-2 border-2 border-[#ffcc00] rounded bg-[#fff8e1] text-sm text-gray-800"
          />
        </div>

        <div className="mb-2">
          <label className="block text-[#333] font-bold mb-1">Загрузить постер:</label>
          <UploadButton 
            endpoint="posterUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                setPosterUrl(res[0].url);
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
          {posterUrl && (
            <img
              src={posterUrl}
              alt="Постер"
              className="mt-4 w-40 rounded shadow"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#e53935] hover:bg-[#d32f2f] text-white rounded text-base font-medium transition"
        >
          Добавить
        </button>
      </form>
    </div>
  );
}
