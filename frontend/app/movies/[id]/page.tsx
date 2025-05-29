'use client';

import { use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { io } from 'socket.io-client';
import ReviewForm from '../../../components/ReviewForm';
import ReviewList from '../../../components/ReviewList';

type MongoId = string | { $oid: string };
type MongoDate = string | { $date: string };

type Movie = {
  _id: MongoId;
  title: string;
  trailerUrl?: string;
  posterUrl?: string;
  director?: string;
  releaseDate?: MongoDate;
  description?: string;
  rating?: number;
};

type Review = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  movieId: string;
  rating: number;
  text: string;
  isSuperUser: boolean;
  createdAt: string;
};

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentUser, setCurrentUser] = useState<{id: string} | null>(null)
  const [socket, setSocket] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {newSocket.close();}
  }, []);

  useEffect(() => {
    if (params.id) {
      Promise.all([
        axios.get(`http://localhost:3001/api/movies/${params.id}`),
        axios.get(`http://localhost:3001/api/reviews/movie/${params.id}`),
        getCurrentUser()
      ])
        .then(([movieRes, reviewRes, user]) => {
          setMovie(movieRes.data);
          setReviews(reviewRes.data);
          setCurrentUser(user)
          setLoading(false);
        })
        .catch((err) => {
          console.error('Ошибка при получении фильма:', err);
          setError('Фильм не найден');
          setLoading(false);
        });
    }
  }, [params.id]);

  useEffect(() => {
    if (socket && params.id) {
      socket.emit('joinMovie', params.id);

      socket.on('newReview', (data) => {
        if (data.movieId === params.id) {
          setReviews(prev => [data.review, ...prev]);

          updateMovieRating();
        }
      });

      socket.on('reviewDeleted', (data) => {
        if (data.movieId === params.id) {
          setReviews(prev => prev.filter(review => review._id !== data.reviewId));

          updateMovieRating();
        }
      });

      return () => {
        socket.emit('leaveMovie', params.id);
        socket.off('newReview');
        socket.off('reviewDeleted');
      };
    }
  }, [socket, params.id]);

  const updateMovieRating = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/movies/${params.id}`);
      setMovie(prev => prev ? { ...prev, rating: res.data.rating } : null);
    } catch (err) {
      console.error('Ошибка при обновлении рейтинга:', err);
    }
  }

  const handleReviewAdded = () => {
    console.log('Отзыв добавлен');
  };

  const handleReviewDeleted = (reviewId) => {
    console.log('Отзыв удален:', reviewId);
  };

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) return null;

      const res = await axios.get('http://localhost:3001/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { id: res.data._id };
    } catch (err) {
      return null;
    }
  };

  const getReleaseDate = (date?: MongoDate): string | null => {
    if (!date) return null;
    
    if (typeof date === 'string') {
      return date;
    }
    
    if (date.$date) {
      return date.$date;
    }
    
    return null;
  };

  const formatDate = (date?: MongoDate): string => {
    const dateString = getReleaseDate(date);
    if (!dateString) return 'Дата не указана';
    
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Неверный формат даты';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef3e2] flex items-center justify-center">
        <div className="text-2xl text-[#e53935]">Загрузка...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#fef3e2] flex flex-col items-center justify-center">
        <div className="text-2xl text-[#e53935] mb-4">{error || 'Фильм не найден'}</div>
        <Link href="/movies" className="text-blue-600 underline">
          Вернуться к списку фильмов
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef3e2] text-[#333] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-[#ffcc00] rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Нет постера</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#e53935] mb-4">
                {movie.title || 'Без названия'}
              </h1>
              
              <div className="space-y-3 mb-6">
                {movie.director && (
                  <p className="text-lg">
                    <span className="font-semibold">Режиссёр:</span> {movie.director}
                  </p>
                )}
                
                <p className="text-lg">
                  <span className="font-semibold">Дата выхода:</span> {formatDate(movie.releaseDate)}
                </p>
                
                <p className="text-lg">
                <span className="font-semibold">Рейтинг:</span>{' '}
                {movie.rating && movie.rating > 0 ? (
                    <span className="text-[#e53935]">{movie.rating}/10</span>
                ) : (
                    <span className="text-gray-500">Нет оценок</span>
                )}
                </p>
              </div>

              {movie.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Описание</h2>
                  <p className="text-gray-700 leading-relaxed">{movie.description}</p>
                </div>
              )}
            </div>
            
        </div>
        {movie.trailerUrl && (
            <div>
                <h2 className="text-2xl font-semibold text-center mt-6">Трейлер</h2>
                <div className="flex justify-center mt-4">
                    <iframe
                    width="800"
                    height="450"
                    src={movie.trailerUrl}
                    title={movie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full max-w-full h-[450px] rounded-xl shadow-lg"
                    ></iframe>
                </div></div>
            )}
          </div>
            <div className="max-w-4xl mx-auto">
            {currentUser && (
              <ReviewForm 
                movieId={params.id as string}
                onReviewAdded={handleReviewAdded}
              />
            )}

            <ReviewList 
              reviews={reviews}
              currentUserId={currentUser?.id}
              onReviewDeleted={handleReviewDeleted}
            />
          </div>
      </div>
    </div>
  );
}
