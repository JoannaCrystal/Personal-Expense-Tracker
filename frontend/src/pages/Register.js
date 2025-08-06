import React, { useState } from 'react';
import PublicCardLayout from '../layouts/PublicCardLayout';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

  const textColor = '#2a2154';
  const hoverColor = '#42327d';

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
      const response = await fetch(`${API_BASE_URL}/api/register`, {
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
    <PublicCardLayout>
      <h2 className="text-3xl font-semibold text-center mb-6">Create an Account</h2>
      <form onSubmit={handleRegister} className="space-y-5">
        {[
          { name: 'first_name', label: 'First Name', type: 'text' },
          { name: 'last_name', label: 'Last Name', type: 'text' },
          { name: 'username', label: 'Username', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'confirm_password', label: 'Confirm Password', type: 'password' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block font-medium mb-1">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition"
              style={{
                color: textColor,
                backgroundColor: '#b49db6',
                border: `1px solid ${textColor}`,
              }}
              placeholder={`Enter your ${label.toLowerCase()}`}
              required
            />
            {errors[name] && <p className="mt-1 text-red-600 text-sm">{errors[name]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className="w-full font-semibold py-3 rounded-md text-white transition"
          style={{ backgroundColor: textColor }}
          onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
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
    </PublicCardLayout>
  );
};

export default Register;
