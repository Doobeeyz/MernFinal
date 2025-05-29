'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ReviewList({ reviews, currentUserId, onReviewDeleted }) {
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }

    setDeletingIds(prev => new Set([...prev, reviewId]));

    try {
      await axios.delete(`http://localhost:3001/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err);
      alert('Ошибка при удалении отзыва');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white border-2 border-[#ffcc00] rounded-lg p-6 text-center">
        <p className="text-gray-600">Пока нет отзывов. Будьте первым!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#e53935] mb-4">
        Отзывы ({reviews.length})
      </h3>
      
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white border-2 border-[#ffcc00] rounded-lg p-6 shadow-lg p-8"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              {review.userId?.avatarUrl ? (
                <img
                  src={review.userId.avatarUrl}
                  alt={review.userId.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">👤</span>
                </div>
              )}
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#333]">
                    {review.userId?.username || 'Удаленный пользователь'}
                  </span>
                  {review.isSuperUser && (
                    <span className="bg-[#e53935] text-white text-xs px-2 py-1 rounded">
                      СУПЕР
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`text-lg font-bold ${getRatingColor(review.rating)}`}>
                {review.rating}/10
              </span>
              
              {currentUserId && review.userId?._id === currentUserId && (
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={deletingIds.has(review._id)}
                  className="text-red-600 hover:text-red-800 text-sm underline disabled:opacity-50"
                >
                  {deletingIds.has(review._id) ? 'Удаление...' : 'Удалить'}
                </button>
              )}
            </div>
          </div>

          <p className="text-[#333] leading-relaxed">{review.text}</p>
        </div>
      ))}
    </div>
  );
}