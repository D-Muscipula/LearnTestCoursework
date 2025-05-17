
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Tests: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Тесты</h1>
          <p className="mb-6">
            Здесь вы можете просмотреть и управлять вашими тестами.
          </p>
          <Link href="/create-test">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Создать новый тест
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tests;
