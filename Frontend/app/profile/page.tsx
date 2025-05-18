'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { auth, tests } from '../lib/api';

interface TestResult {
  id: number;
  test: {
    id: number;
    title: string;
  };
  score: number;
  passed_at: string;
  is_passed: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    group_number: string;
    is_teacher: boolean;
  } | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await auth.verifyToken();
        setUserData(response);

        // Загрузка результатов для студента
        if (!response.is_teacher) {
          const userResults = await tests.getUserResults();
          setResults(userResults);
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка профиля...</div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Личная информация */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Личный профиль</h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl text-blue-600">
                      {userData.first_name[0]}{userData.last_name[0]}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {userData.first_name} {userData.last_name}
                  </h3>
                </div>

                <div className="border-t pt-4">
                  <p><strong>Email:</strong> {userData.email}</p>
                  {userData.group_number && (
                    <p><strong>Группа:</strong> {userData.group_number}</p>
                  )}
                  <p>
                    <strong>Роль:</strong> {userData.is_teacher ? 'Преподаватель' : 'Студент'}
                  </p>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Статистика</h2>
              
              {!userData.is_teacher ? (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Пройдено тестов</p>
                      <p className="text-2xl font-bold text-green-600">
                        {results.length}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Успешных тестов</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {results.filter(r => r.is_passed).length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Последние результаты</h3>
                    {results.length === 0 ? (
                      <p className="text-gray-600">Пока нет пройденных тестов</p>
                    ) : (
                      <div className="space-y-2">
                        {results.slice(0, 3).map((result) => (
                          <div 
                            key={result.id} 
                            className={`p-3 rounded ${
                              result.is_passed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <p><strong>{result.test.title}</strong></p>
                            <p>Балл: {result.score.toFixed(1)}</p>
                            <p>Дата: {new Date(result.passed_at).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <p>Статистика для преподавателей недоступна</p>
                  <p>Перейдите в раздел "Результаты", чтобы увидеть статистику тестов</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 