import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Колонка с логотипом и описанием */}
        <div>
          <h3 className="text-2xl font-bold mb-4">LearnTest</h3>
          <p className="text-sm text-gray-300">
            Современная платформа для онлайн-тестирования, 
            помогающая студентам и преподавателям эффективно 
            взаимодействовать в образовательном процессе.
          </p>
        </div>

        {/* Контакты */}
        <div>
          <h4 className="font-semibold mb-4">Контакты</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 +7 (000) 111-22-33</li>
            <li>✉️ support@learntest-edu.online</li>
            <li>🏫 г. Наукоград, ул. Знаний, д. 42</li>
          </ul>
        </div>
      </div>

      {/* Копирайт */}
      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} LearnTest. Все права защищены. 
          Разработано с ❤️ для образования.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
