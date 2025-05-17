
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">

          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Тестирование. Все права защищены.
          </div>
          
          {/* <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/facebook-icon.svg" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="/twitter-icon.svg" alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/instagram-icon.svg" alt="Instagram" className="h-6 w-6" />
            </a>

          </div> */}
        </div>
        
        {/* Контактная информация */}
        <div className="text-center mt-4">
          <p>Телефон: +1-234-567-8901</p>
          <p>Email: contact@university.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
