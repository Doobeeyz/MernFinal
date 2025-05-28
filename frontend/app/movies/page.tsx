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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Фильмы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie._id} className="border p-4 rounded shadow">
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-60 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-gray-700">Режиссёр: {movie.director}</p>
            <p className="text-gray-600 text-sm">
              Дата выхода: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
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
