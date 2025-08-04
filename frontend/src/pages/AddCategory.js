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
      <h2 className="text-2xl font-bold mb-4">Your Categories</h2>

      {categories.length ? (
        <ul className="space-y-2 mb-6">
          {categories.map((cat) => (
            <li key={cat.id} className="p-3 bg-gray-100 rounded shadow">
              {cat.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-600">No categories found.</p>
      )}

      <div className="flex items-center space-x-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border px-4 py-2 rounded w-64"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Category
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default AddCategory;
