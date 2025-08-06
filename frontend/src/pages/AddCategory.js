import React, { useEffect, useState } from 'react';
const API_BASE_URL = process.env.REACT_APP_API_URL;

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('❌ Not authenticated. Please log in.');
      return;
    }

    fetch(`${API_BASE_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch(() => setMessage('⚠️ Failed to fetch categories'));
  }, [token]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        const added = await response.json();
        setCategories([...categories, added]);
        setNewCategory('');
        setMessage('✅ Category added');
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.detail}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  // Styling
  const bgColor = '#b49db6';
  const textColor = '#2a2154';
  const hoverColor = '#42327d';

  return (
    <div className="p-6" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-semibold mb-4">Your Categories</h2>

      {categories.length ? (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: bgColor,
                borderRadius: '1rem',
                boxShadow: '6px 6px 12px rgba(0,0,0,0.06), -6px -6px 12px rgba(255,255,255,0.4)',
                padding: '0.75rem 1rem',
                color: textColor,
              }}
            >
              {cat.name}
            </div>
          ))}

          {/* Input + Button inline after tiles */}
          <div className="flex items-center gap-4">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category Name"
              className="focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: '#ffffff',
                color: textColor,
                border: `1px solid ${textColor}`,
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
              }}
            />
            <button
              onClick={handleAddCategory}
              className="font-semibold rounded-md text-white transition"
              style={{
                backgroundColor: textColor,
                padding: '0.5rem 1rem',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
            >
              Add Category
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-6">No categories found.</p>
      )}

      {message && (
        <p
          className="mt-4 text-sm"
          style={{
            color: message.startsWith('✅') ? '#1f7a1f' : '#c53030',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddCategory;
