'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-[#fff8e1] border-b-2 border-[#ffcc00] px-8 py-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-[#e53935] hover:underline">
          Movie App
        </Link>

        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/movies"
                className="bg-[#e53935] text-white font-medium rounded-md px-4 py-2 hover:bg-[#d32f2f] transition-colors"
              >
                Фильмы
              </Link>
              <Link
                href="/add-movie"
                className="bg-[#e53935] text-white font-medium rounded-md px-4 py-2 hover:bg-[#d32f2f] transition-colors"
              >
                Добавить фильм
              </Link>
              <Link
                href="/profile"
                className="bg-[#e53935] text-white font-medium rounded-md px-4 py-2 hover:bg-[#d32f2f] transition-colors"
              >
                Профиль
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#e53935] text-white font-medium rounded-md px-4 py-2 hover:bg-[#d32f2f] transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-[#e53935] text-white font-medium rounded-md px-4 py-2 hover:bg-[#d32f2f] transition-colors"
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="bg-[#e53935] text-white font-medium rounded-md px-4 py-2 hover:bg-[#d32f2f] transition-colors"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
