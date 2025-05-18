'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/api';

const Header: React.FC = () => {
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await auth.verifyToken();
          setIsLoggedIn(true);
          setIsTeacher(response.is_teacher || false);
        } catch {
          // Если токен невалиден, разлогиниваем
          localStorage.removeItem('token');
          localStorage.removeItem('is_teacher');
          setIsLoggedIn(false);
          setIsTeacher(false);
        }
      }
    };

    checkUserStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_teacher');
    setIsLoggedIn(false);
    setIsTeacher(false);
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
          
          {isLoggedIn && isTeacher && (
            <Link href="/tests/create" className="hover:text-gray-400">
              Создать тест
            </Link>
          )}
 
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
