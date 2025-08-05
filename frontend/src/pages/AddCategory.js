import React, { useEffect, useState } from 'react';

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // get JWT token

  useEffect(() => {
    if (!token) {
      setMessage('❌ Not authenticated. Please log in.');
      return;
    }

    fetch('http://localhost:8000/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
          'Authorization': `Bearer ${token}`,
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-moody-dark mb-4">Your Categories</h2>

      {categories.length ? (
        <ul className="space-y-3 mb-6">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="p-4 bg-white rounded-2xl shadow-neumorph text-gray-800"
            >
              {cat.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-500">No categories found.</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-moody-dark"
        />
        <button
          onClick={handleAddCategory}
          className="bg-moody text-white px-4 py-2 rounded shadow-neumorph hover:bg-moody-dark"
        >
          Add Category
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddCategory;
