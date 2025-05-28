'use client';

import { UploadButton } from '@uploadthing/react';
import { useUploadThing } from '@/uploadthing';
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
      const token = localStorage.getItem('token'); // JWT

      const res = await axios.post(
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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Добавить фильм</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Ссылка на трейлер"
          value={trailerUrl}
          onChange={(e) => setTrailerUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Режиссёр"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="block mb-1">Загрузить постер:</label>
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
          />
          {posterUrl && (
            <img src={posterUrl} alt="Постер" className="mt-4 w-40" />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Добавить
        </button>
      </form>
    </div>
  );
}
