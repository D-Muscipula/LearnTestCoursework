
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreateTest: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Создать новый тест</h1>
          <form>
            <div className="mb-4">
              <label htmlFor="testName" className="block text-sm font-semibold mb-1">
                Название теста:
              </label>
              <input
                type="text"
                id="testName"
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="testDescription" className="block text-sm font-semibold mb-1">
                Описание:
              </label>
              <textarea
                id="testDescription"
                className="w-full border border-gray-300 rounded p-2"
                rows={4}
              />
            </div>
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Сохранить тест
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTest;
