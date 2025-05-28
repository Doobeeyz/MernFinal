'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      router.push('/profile');
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fef3e2]">
      <div className="bg-white border-2 border-yellow-400 p-10 w-full max-w-sm mb-90 mt-20 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Вход в аккаунт</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label htmlFor="email" className="block text-gray-800 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-2 border-yellow-300 rounded-md bg-[#fff8e1] focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
              placeholder="Введите ваш email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-800 font-medium mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-yellow-300 rounded-md bg-[#fff8e1] focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
              placeholder="Введите ваш пароль"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-700">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
}
