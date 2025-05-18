'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tests } from '../../lib/api';
import type { Test, Question } from '../../lib/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testData = await tests.getById(parseInt(params.id));
        setTest(testData);
        setTimeLeft(testData.time_limit * 60); // Конвертируем минуты в секунды
      } catch (err) {
        setError('Ошибка при загрузке теста');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [params.id]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Автоматическая отправка при истечении времени
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await tests.submitResult(parseInt(params.id), answers);
      router.push(`/results/${result.id}`);
    } catch (err) {
      setError('Ошибка при отправке результатов');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{test.title}</h1>
            <div className="text-lg font-semibold">
              Осталось времени: {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="space-y-6">
            {test.questions.map((question: Question) => (
              <div key={question.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-3">
                  {question.order}. {question.text}
                </h3>
                <div className="space-y-2">
                  {question.answers.map((answer) => (
                    <label key={answer.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={answers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                        className="form-radio"
                      />
                      <span>{answer.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Назад
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Отправка...' : 'Завершить тест'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
