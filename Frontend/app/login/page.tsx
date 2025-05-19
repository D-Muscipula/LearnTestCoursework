'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await auth.login({ username, password });
      localStorage.setItem('token', response.token);
      router.push('/');
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm mb-4">{error}</div>
          )}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold mb-1">
              Почта:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Имя пользователя"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Пароль:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Пароль"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Нет аккаунта? </span>
          <Link href="/register" className="text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}
