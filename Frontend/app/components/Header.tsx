'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <img
            src="/owl-logo.png"
            alt="Owl Logo"
            className="h-10 w-auto"
          />
          <span className="font-bold text-lg">Тестирование студентов</span>
        </Link>
        
        <nav className="flex space-x-4">
          <Link href="/tests" className="hover:text-gray-400">
            Тесты
          </Link>
 
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-gray-400"
            >
              Выйти
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-400">
                Войти
              </Link>
              <Link href="/register" className="hover:text-gray-400">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
