import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set mode based on current path
  const [mode, setMode] = useState(() =>
    location.pathname === '/register' ? 'register' : 'login'
  );

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const [regForm, setRegForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [regErrors, setRegErrors] = useState({});
  const [regMessage, setRegMessage] = useState('');

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    navigate(`/${newMode}`, { replace: true });
  };

  const validateReg = () => {
    const newErrors = {};
    if (!regForm.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!regForm.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!regForm.username.trim()) newErrors.username = 'Username is required';
    else if (regForm.username.includes(' ')) newErrors.username = 'Username must not contain spaces';
    if (!regForm.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regForm.email)) newErrors.email = 'Email is invalid';
    if (!regForm.password) newErrors.password = 'Password is required';
    else if (regForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (regForm.password !== regForm.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    setRegErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    if (!identifier.trim() || !password) {
      setLoginMessage('⚠️ Please enter username/email and password');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
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
        setLoginMessage(`⚠️ Error: ${err.detail || 'Login failed'}`);
      }
    } catch (error) {
      setLoginMessage(`🚨 Server error: ${error.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMessage('');
    if (!validateReg()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: regForm.first_name,
          last_name: regForm.last_name,
          username: regForm.username,
          email: regForm.email,
          password: regForm.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setLoginMessage(`✅ User ${data.username} registered successfully! Please login.`);
        setRegForm({
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          confirm_password: '',
        });
        setRegErrors({});
        setMode('login');
        navigate('/login', { replace: true });
      } else {
        const err = await response.json();
        setRegMessage(`⚠️ Error: ${err.detail || 'Registration failed'}`);
      }
    } catch (error) {
      setRegMessage(`🚨 Server error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white/90 backdrop-blur rounded-2xl shadow-neumorph">
      <h2 className="text-3xl font-semibold text-center text-moody mb-6">
        {mode === 'login' ? 'Login' : 'Create an Account'}
      </h2>

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Username or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{ color: '#2a2154' }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moody-dark transition"
              placeholder="Enter your username or email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ color: '#2a2154' }}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moody-dark transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full font-semibold py-3 rounded-md shadow-neumorph transition"
            style={{ backgroundColor: '#2a2154', color: 'white' }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#42327d')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2a2154')}
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <button onClick={toggleMode} className="text-accent font-semibold hover:underline">
              Register
            </button>
          </p>

          {loginMessage && (
            <p className="mt-4 p-3 text-center rounded-md text-sm bg-red-100 text-red-700">
              {loginMessage}
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-5">
          {['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}</label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                value={regForm[field]}
                onChange={(e) => setRegForm({ ...regForm, [field]: e.target.value })}
                style={{ color: '#2a2154' }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moody-dark transition"
                placeholder={field === 'confirm_password' ? 'Confirm password' : `Enter your ${field.replace('_', ' ')}`}
              />
              {regErrors[field] && <p className="text-sm text-red-600 mt-1">{regErrors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full font-semibold py-3 rounded-md shadow-neumorph transition"
            style={{ backgroundColor: '#2a2154', color: 'white' }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#42327d')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2a2154')}
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button onClick={toggleMode} className="text-accent font-semibold hover:underline">
              Login
            </button>
          </p>

          {regMessage && (
            <p className="mt-4 p-3 text-center rounded-md text-sm bg-red-100 text-red-700">
              {regMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default AuthPage;
