import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicCardLayout from '../layouts/PublicCardLayout';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const textColor = '#2a2154';
  const hoverColor = '#42327d';

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
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
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
    <PublicCardLayout>
      <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block font-medium mb-2" htmlFor="identifier">
            Username or Email
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition"
            style={{
              color: textColor,
              backgroundColor: '#b49db6',
              border: `1px solid ${textColor}`,
            }}
            placeholder="Enter your username or email"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition"
            style={{
              color: textColor,
              backgroundColor: '#b49db6',
              border: `1px solid ${textColor}`,
            }}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full font-semibold py-3 rounded-md text-white transition"
          style={{ backgroundColor: textColor }}
          onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
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
    </PublicCardLayout>
  );
};

export default Login;
