'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { tests } from '../../lib/api';

interface Question {
  text: string;
  answers: {
    text: string;
    is_correct: boolean;
  }[];
}

export default function CreateTestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time_limit: 30,
    is_published: false,
    allowed_groups: '',
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      answers: [
        { text: '', is_correct: true },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
    },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    text: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].text = text;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.forEach((answer, idx) => {
      answer.is_correct = idx === answerIndex;
    });
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        answers: [
          { text: '', is_correct: true },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Создаем тест
      const testData = {
        ...formData,
        questions: questions.map((q, index) => ({
          text: q.text,
          order: index,
          answers: q.answers.map(a => ({
            text: a.text,
            is_correct: a.is_correct,
          })),
        })),
      };

      await tests.create(testData);
      router.push('/tests');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при создании теста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Создание теста</h1>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Название теста
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Время на выполнение (минуты)
              </label>
              <input
                type="number"
                name="time_limit"
                value={formData.time_limit}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Доступные группы (через запятую)
              </label>
              <input
                type="text"
                name="allowed_groups"
                value={formData.allowed_groups}
                onChange={handleChange}
                placeholder="Например: ИВТ-101, ИВТ-102"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">
                Опубликовать тест
              </label>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Вопросы</h2>
              {questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Вопрос {questionIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Удалить вопрос
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Текст вопроса
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border rounded"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Варианты ответов
                    </label>
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={answer.is_correct}
                          onChange={() =>
                            handleCorrectAnswerChange(
                              questionIndex,
                              answerIndex
                            )
                          }
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            handleAnswerChange(
                              questionIndex,
                              answerIndex,
                              e.target.value
                            )
                          }
                          required
                          placeholder={`Вариант ${answerIndex + 1}`}
                          className="flex-grow px-3 py-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400"
              >
                + Добавить вопрос
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Создание теста...' : 'Создать тест'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 