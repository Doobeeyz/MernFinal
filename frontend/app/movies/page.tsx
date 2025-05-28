'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Movie = {
  _id: string;
  title: string;
  trailerUrl: string;
  posterUrl: string;
  director: string;
  releaseDate: string;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/movies/all')
      .then((res) => setMovies(res.data))
      .catch((err) => console.error('Ошибка при получении фильмов:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#fef3e2] text-[#333] p-4">
      <h1 className="text-3xl font-bold text-center mt-[3vh] text-[#e53935]">Фильмы</h1>

      <div className="flex flex-wrap justify-center gap-6 px-6 py-8">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white border-2 border-[#ffcc00] rounded-xl shadow-lg p-5 w-[280px] text-center transition-transform duration-200 hover:-translate-y-1"
          >
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-auto rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-[#e53935] mb-2">{movie.title}</h2>
            <p className="text-sm text-gray-700">Режиссёр: {movie.director}</p>
            <p className="text-xs text-gray-600">
              Дата выхода: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>

            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline mt-2 inline-block"
              >
                Смотреть трейлер
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
