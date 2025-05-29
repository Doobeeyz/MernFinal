'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Actor = {
  _id: string;
  name: string;
  bio: string;
  photoUrl: string;
};

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/actors/all')
      .then((res) => setActors(res.data))
      .catch((err) => console.error('Ошибка при получении актёров:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#fef3e2] text-[#333] p-4">
      <h1 className="text-3xl font-bold text-center mt-[3vh] text-[#e53935]">Актёры</h1>

      <div className="flex flex-wrap justify-center gap-6 px-6 py-8">
        {actors.map((actor) => (
          <Link key={actor._id} href={`/actors/${actor._id}`}>
            <div className="bg-white border-2 border-[#ffcc00] rounded-xl shadow-lg p-5 w-[280px] text-center transition-transform duration-200 hover:-translate-y-1 cursor-pointer">
              <img
                src={actor.photoUrl}
                alt={actor.name}
                className="w-full h-auto rounded mb-4"
              />
              <h2 className="text-xl font-semibold text-[#e53935] mb-2">{actor.name}</h2>
              <p className="text-sm text-gray-700 line-clamp-3">{actor.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
