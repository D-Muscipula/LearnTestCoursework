'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import { auth } from './lib/api';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    is_teacher: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await auth.verifyToken();
        setUser(userData);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">
              Добро пожаловать в LearnTest
            </h1>
            
            {user && !user.is_teacher && (
              <div>
                <p className="mb-4">
                  Здесь вы можете проходить тесты и отслеживать свои результаты.
                </p>
                <a 
                  href="/tests" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Перейти к тестам
                </a>
              </div>
            )}

            {user && user.is_teacher && (
              <div>
                <p className="mb-4">
                  Вы можете создавать тесты и просматривать результаты студентов.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="/tests/create" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Создать тест
                  </a>
                  <a 
                    href="/tests/results" 
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Результаты
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}