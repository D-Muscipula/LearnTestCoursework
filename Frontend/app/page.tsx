import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <p className="text-lg text-center">
          Добро пожаловать на платформу тестирования студентов!
        </p>
        {/* Добавьте остальной контент здесь */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;