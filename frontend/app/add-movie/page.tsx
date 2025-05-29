'use client';

import { UploadButton } from '@uploadthing/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function convertToEmbedLink(link: string): string {
  const idx = link.indexOf("&");
  if (idx !== -1) {
    link = link.substring(0, idx);
  }

  link = link.replace("watch?v=", "embed/");

  return link;
}

export default function AddMoviePage() {
  const [title, setTitle] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [director, setDirector] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [actors, setActors] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/actors/all');
        setActors(response.data);
      } catch (err) {
        console.error('Ошибка при получении актёров:', err);
      }
    };

    fetchActors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');

      await axios.post(
        'http://localhost:3001/api/movies/add',
        {
          title,
          trailerUrl,
          posterUrl,
          director,
          description,
          releaseDate,
          actors: selectedActors, // Добавляем выбранных актёров
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
      setDescription('');
      setReleaseDate('');
      setSelectedActors([]); // Сбрасываем выбранных актёров
      router.push('/movies'); // Перенаправление на страницу фильмов
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
            onChange={(e) => setTrailerUrl(convertToEmbedLink(e.target.value))}
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
          <label className="block text-[#333] font-bold mb-1">Описание:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <label className="block text-[#333] font-bold mb-1">Актёры:</label>
          <select
            multiple
            value={selectedActors}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedActors(options);
            }}
            className="w-[93%] p-2 border-2 border-[#ffcc00] rounded bg-[#fff8e1] text-sm text-gray-800"
          >
            {actors.map(actor => (
              <option key={actor._id} value={actor._id}>
                {actor.name}
              </option>
            ))}
          </select>
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
