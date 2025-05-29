'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const ActorPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/actors/${id}`);
        setActor(response.data);
      } catch (err) {
        setError('Актёр не найден');
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-[#fef3e2] text-[#333] p-4">
      <div className="max-w-4xl mx-auto bg-white border-2 border-[#ffcc00] rounded-xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={actor.photoUrl}
              alt={actor.name}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#e53935] mb-4">{actor.name}</h1>
            <h2 className="text-xl font-semibold mb-2">Биография</h2>
            <p className="text-gray-700 leading-relaxed">{actor.bio}</p>
            <Link href="/actors" className="text-blue-600 underline mt-4 inline-block">
              Вернуться к списку актёров
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
