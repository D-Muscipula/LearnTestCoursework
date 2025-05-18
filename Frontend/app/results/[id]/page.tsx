'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { tests } from '../../lib/api';
import type { TestResult } from '../../lib/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultData = await tests.getResult(parseInt(id));
        setResult(resultData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Ошибка при загрузке результатов');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-4 flex items-center justify-center">
          <div>Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-4 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-4 flex items-center justify-center">
          <div>Результат не найден</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Результаты теста</h1>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Статус: </span>
                <span className={result.is_passed ? 'text-green-600' : 'text-red-600'}>
                  {result.is_passed ? 'Тест пройден' : 'Тест не пройден'}
                </span>
              </div>
              <div>
                <span className="font-medium">Набрано баллов: </span>
                <span>{result.score}</span>
              </div>
              <div>
                <span className="font-medium">Дата прохождения: </span>
                <span>{new Date(result.passed_at).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/tests')}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Вернуться к списку тестов
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
