'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { tests, Test } from '../lib/api';

export default function TestsPage() {
  const [testList, setTestList] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await tests.getAll();
        setTestList(data);
      } catch (err) {
        setError('Ошибка при загрузке тестов');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-8 flex items-center justify-center">
          <div className="text-xl">Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-8 flex items-center justify-center">
          <div className="text-xl text-red-500">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Тесты</h1>
          <p className="mb-6">
            Здесь вы можете просмотреть и управлять вашими тестами.
          </p>
          
          <div className="space-y-4">
            {testList.map((test) => (
              <div key={test.id} className="border border-gray-200 rounded p-4">
                <h2 className="text-lg font-semibold">{test.title}</h2>
                <p className="text-gray-600 mt-2">{test.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Лимит времени: {test.time_limit} мин.
                  </span>
                  <Link 
                    href={`/tests/${test.id}`}
                    className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700 text-sm"
                  >
                    Начать тест
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
