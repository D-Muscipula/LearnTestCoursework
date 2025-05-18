'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { auth, tests } from '../../lib/api';

interface TestResult {
  id: number;
  test: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
    group_number: string;
  };
  score: number;
  passed_at: string;
  is_passed: boolean;
}

export default function TestResultsPage() {
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTeacherStatus = async () => {
      try {
        const userData = await auth.verifyToken();
        if (!userData.is_teacher) {
          router.push('/login');
        } else {
          setIsTeacher(true);
          await fetchTestResults();
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    const fetchTestResults = async () => {
      try {
        const fetchedResults = await tests.getAllResults();
        setResults(fetchedResults);
      } catch (err: any) {
        setError('Не удалось загрузить результаты тестов');
        console.error(err);
      }
    };

    checkTeacherStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Проверка прав доступа...</div>
      </div>
    );
  }

  if (!isTeacher) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Результаты тестов</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {results.length === 0 ? (
            <div className="text-center text-gray-600">
              Пока нет результатов тестов
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Тест</th>
                    <th className="px-4 py-2 text-left">Студент</th>
                    <th className="px-4 py-2 text-left">Группа</th>
                    <th className="px-4 py-2 text-center">Баллы</th>
                    <th className="px-4 py-2 text-center">Статус</th>
                    <th className="px-4 py-2 text-left">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{result.test?.title || 'Неизвестный тест'}</td>
                      <td className="px-4 py-2">
                        {result.user?.first_name || 'Неизвестный'} {result.user?.last_name || ''}
                      </td>
                      <td className="px-4 py-2">{result.user?.group_number || 'Без группы'}</td>
                      <td className="px-4 py-2 text-center">
                        {result.score?.toFixed(1) || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span 
                          className={`px-2 py-1 rounded text-sm ${
                            result.is_passed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.is_passed ? 'Пройден' : 'Не пройден'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {result.passed_at ? new Date(result.passed_at).toLocaleString() : 'Дата неизвестна'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 