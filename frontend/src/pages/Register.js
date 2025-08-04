import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setMessage('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (form.username.includes(' ')) newErrors.username = 'Username must not contain spaces';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm_password) newErrors.confirm_password = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ User ${data.username} registered successfully!`);
        setForm({
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          confirm_password: '',
        });
        setErrors({});
      } else {
        const err = await response.json();
        setMessage(`⚠️ Error: ${err.detail || 'Registration failed'}`);
      }
    } catch (error) {
      setMessage(`🚨 Server error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>

      <form onSubmit={handleRegister} className="space-y-5">
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-gray-700 font-medium mb-1">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              errors.first_name
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Your first name"
          />
          {errors.first_name && <p className="mt-1 text-red-600 text-sm">{errors.first_name}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-gray-700 font-medium mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              errors.last_name
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Your last name"
          />
          {errors.last_name && <p className="mt-1 text-red-600 text-sm">{errors.last_name}</p>}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              errors.username
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Choose a unique username"
          />
          {errors.username && <p className="mt-1 text-red-600 text-sm">{errors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              errors.email
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              errors.password
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Create a password"
          />
          {errors.password && <p className="mt-1 text-red-600 text-sm">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm_password" className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            value={form.confirm_password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition ${
              errors.confirm_password
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirm_password && (
            <p className="mt-1 text-red-600 text-sm">{errors.confirm_password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
        >
          Register
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

export default Register;
