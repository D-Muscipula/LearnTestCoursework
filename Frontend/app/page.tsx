'use client';

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              LearnTest: Платформа для онлайн-тестирования
            </h1>
            
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                LearnTest - современная образовательная платформа, 
                которая помогает преподавателям создавать и проводить 
                тестирование, а студентам - эффективно проходить обучение.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Для преподавателей
                  </h2>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Создание тестов</li>
                    <li>• Настройка доступа по группам</li>
                    <li>• Контроль результатов</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-green-800 mb-4">
                    Для студентов
                  </h2>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Прохождение тестов</li>
                    <li>• Мгновенная оценка знаний</li>
                    <li>• История результатов</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-purple-800 mb-4">
                    Преимущества
                  </h2>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Удобный интерфейс</li>
                    <li>• Гибкая настройка тестов</li>
                    <li>• Безопасность данных</li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}