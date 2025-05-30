
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Movie = {
  _id: string | { $oid: string };
  title: string;
  trailerUrl: string;
  posterUrl: string;
  director: string;
  description: String;
  releaseDate: string | { $date: string };
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/movies/all')
      .then((res) => setMovies(res.data))
      .catch((err) => console.error('Ошибка при получении фильмов:', err));
  }, []);

 
  const getMovieId = (movie: Movie): string => {
    if (typeof movie._id === 'string') {
      return movie._id;
    }
    return movie._id.$oid;
  };


  const getReleaseDate = (movie: Movie): string => {
    if (typeof movie.releaseDate === 'string') {
      return movie.releaseDate;
    }
    return movie.releaseDate.$date;
  };

  return (
    <div className="min-h-screen bg-[#fef3e2] text-[#333] p-4">
      <h1 className="text-3xl font-bold text-center mt-[3vh] text-[#e53935]">Фильмы</h1>

      <div className="flex flex-wrap justify-center gap-6 px-6 py-8">
        {movies.map((movie) => {
          const movieId = getMovieId(movie);
          return (
            <Link key={movieId} href={`/movies/${movieId}`}>
              <div className="bg-white border-2 border-[#ffcc00] rounded-xl shadow-lg p-5 w-[280px] text-center transition-transform duration-200 hover:-translate-y-1 cursor-pointer">
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-auto rounded mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-[#e53935] mb-2">{movie.title} ({new Date(getReleaseDate(movie)).getFullYear()})</h2>
                <p className="text-sm text-gray-700 line-clamp-3">{movie.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
