
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Пароль:
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
