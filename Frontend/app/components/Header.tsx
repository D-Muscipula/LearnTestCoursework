
import React from 'react';
import Link from 'next/link'; 

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="flex items-center space-x-2">
          <img
            src="/owl-logo.png"
            alt="Owl Logo"
            className="h-10 w-auto"
          />
          <span className="font-bold text-lg">Тестирование студентов</span>
        </div>

        <nav className="flex space-x-4">
          <Link href="/" className="hover:text-gray-400">
            Главная
          </Link>
          <Link href="/tests" className="hover:text-gray-400">
            Тесты
          </Link>
          <Link href="#about" className="hover:text-gray-400">
            О нас
          </Link>
          <Link href="#contact" className="hover:text-gray-400">
            Контакты
          </Link>

          <Link href="/login" className="hover:text-gray-400">
            Войти
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
