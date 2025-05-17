'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tests, Test } from '../../lib/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TestDetailsPage() {
  const params = useParams();
  const testId = Number(params.id);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await tests.getById(testId);
        setTest(data);
      } catch (err) {
        setError('Тест не найден');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-8 flex items-center justify-center">
          <div className="text-xl">Загрузка теста...</div>
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

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-100 p-8 flex items-center justify-center">
          <div className="text-xl">Тест не найден</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
          <p className="mb-6 text-gray-600">{test.description}</p>
          
          <div className="space-y-6">
            {test.questions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{question.text}</h3>
                <ul className="space-y-2">
                  {question.answers.map((answer) => (
                    <li key={answer.id}>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name={`question-${question.id}`} 
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span>{answer.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition">
            Отправить ответы
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
