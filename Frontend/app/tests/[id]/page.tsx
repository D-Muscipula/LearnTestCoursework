'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tests, Test } from '../../lib/api';

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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!test) return <div>Тест не найден</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
      <p className="mb-6">{test.description}</p>
      <div className="space-y-4">
        {test.questions.map((question) => (
          <div key={question.id} className="border p-4 rounded">
            <h3 className="font-semibold">{question.text}</h3>
            <ul className="mt-2 space-y-2">
              {question.answers.map((answer) => (
                <li key={answer.id}>
                  <label className="flex items-center">
                    <input type="radio" name={`question-${question.id}`} className="mr-2" />
                    {answer.text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button className="mt-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
        Отправить ответы
      </button>
    </div>
  );
}
