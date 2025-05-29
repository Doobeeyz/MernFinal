'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ReviewForm({ movieId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Необходимо войти в систему для написания отзыва');
      return;
    }

    if (text.trim().length < 10) {
      setError('Отзыв должен содержать минимум 10 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:3001/api/reviews',
        {
          movieId,
          rating,
          text: text.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setText('');
      setRating(5);
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      console.error('Ошибка при отправке отзыва:', err);
      setError(err.response?.data?.error || 'Ошибка при отправке отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#ffcc00] rounded-lg p-6 my-6 shadow-lg p-8">
      <h3 className="text-xl font-semibold text-[#e53935] mb-4">Написать отзыв</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => {
              const value = i + 1;
              return (
                <span
                  key={value}
                  onClick={() => setRating(value)}
                  className={`cursor-pointer text-2xl ${
                    value <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишите ваш отзыв о фильме..."
            rows={4}
            className="w-full p-3 border-2 border-[#ffcc00] rounded bg-[#fff8e1] text-gray-800 focus:outline-none focus:border-[#e53935]"
            required
            minLength={10}
          />
          <div className="text-sm text-gray-600 mt-1">
            {text.length}/500 символов (минимум 10)
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || text.trim().length < 10}
          className="w-full bg-[#e53935] hover:bg-[#d32f2f] text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Отправляем...' : 'Отправить отзыв'}
        </button>
      </form>
    </div>
  );
}