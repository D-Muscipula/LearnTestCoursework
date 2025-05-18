'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tests } from '../../lib/api';
import type { TestResult } from '../../lib/api';

export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultData = await tests.getResult(parseInt(params.id));
        setResult(resultData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Ошибка при загрузке результатов');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [params.id]);

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!result) return <div className="p-4">Результат не найден</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
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
  );
}
