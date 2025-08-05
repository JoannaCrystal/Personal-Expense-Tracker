import React, { useEffect, useState, useMemo } from 'react';

export default function MapCategory() {
  const [categories, setCategories] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [substrings, setSubstrings] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [catRes, mapRes] = await Promise.all([
          fetch('http://localhost:8000/api/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/api/mappings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const catData = await catRes.json();
        const mapData = await mapRes.json();
        setCategories(Array.isArray(catData) ? catData : []);
        setMappings(Array.isArray(mapData) ? mapData : []);
      } catch (err) {
        setMessage('⚠️ Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleAddMapping = async () => {
    if (!selectedCategoryId || !substrings.trim()) return;

    setMessage('');
    const substringsList = substrings.split(',').map((s) => s.trim()).filter(Boolean);
    if (substringsList.length === 0) {
      setMessage('⚠️ Please enter at least one substring');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: parseInt(selectedCategoryId, 10),
          substrings: substringsList,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        let msg = 'Failed to save mapping';
        if (Array.isArray(result.detail)) {
          msg = result.detail.map((e) => e.msg).join('; ');
        } else if (typeof result.detail === 'string') {
          msg = result.detail;
        }
        throw new Error(msg);
      }

      setMessage(result.detail || '✅ Mapping saved');
      setSelectedCategoryId('');
      setSubstrings('');

      const updatedRes = await fetch('http://localhost:8000/api/mappings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setMappings(Array.isArray(updatedData) ? updatedData : []);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const groupedMappings = useMemo(() => {
    const grouped = {};
    if (!Array.isArray(mappings)) return grouped;

    mappings.forEach(({ category, category_name, substring }) => {
      const cat = category || category_name || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(substring);
    });

    return grouped;
  }, [mappings]);

  if (loading) return <p className="p-6 text-gray-600">Loading category mappings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-moody-dark mb-4">Map Substrings to Categories</h2>

      {/* Existing Mappings Section */}
      {Object.keys(groupedMappings).length > 0 ? (
        <div className="mb-6 space-y-3">
          {Object.entries(groupedMappings).map(([catName, substrs]) => (
            <div
              key={catName}
              className="p-4 bg-white rounded-2xl shadow-neumorph text-gray-800"
            >
              <strong className="text-moody-dark mr-1">{catName}:</strong> {substrs.join(', ')}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-6">No mappings found.</p>
      )}

      {/* Mapping Form */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-moody-dark"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={substrings}
          onChange={(e) => setSubstrings(e.target.value)}
          placeholder="e.g. Walmart, Costco"
          className="border border-gray-300 rounded px-4 py-2 w-full sm:flex-1 focus:outline-none focus:ring-2 focus:ring-moody-dark"
        />

        <button
          onClick={handleAddMapping}
          className="bg-moody text-white px-4 py-2 rounded shadow-neumorph hover:bg-moody-dark disabled:opacity-50"
        >
          Add Mapping
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.startsWith('✅') ? 'text-green-600' :
            message.startsWith('⚠️') ? 'text-yellow-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
