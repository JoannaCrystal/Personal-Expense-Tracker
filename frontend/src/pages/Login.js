import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!identifier.trim() || !password) {
      setMessage('⚠️ Please enter username/email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save JWT token separately
        localStorage.setItem('token', data.access_token);

        // Save user info separately
        localStorage.setItem('user', JSON.stringify(data.user));

        setMessage(`✅ Welcome back, ${data.user.first_name}!`);

        // Clear inputs
        setIdentifier('');
        setPassword('');

        // Redirect to dashboard home
        navigate('/dashboard/home');
      } else {
        const err = await response.json();
        setMessage(`⚠️ Error: ${err.detail || 'Login failed'}`);
      }
    } catch (error) {
      setMessage(`🚨 Server error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="identifier" className="block text-gray-700 font-medium mb-2">
            Username or Email
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your username or email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 p-4 rounded-md font-semibold text-center ${
            message.startsWith('✅')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
