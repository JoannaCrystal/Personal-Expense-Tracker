import React, { useEffect, useState, useMemo } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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
          fetch(`${API_BASE_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/mappings`, {
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
      const res = await fetch(`${API_BASE_URL}/api/mappings`, {
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

      const updatedRes = await fetch(`${API_BASE_URL}/api/mappings`, {
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

  // UI colors
  const bgColor = '#b49db6';
  const textColor = '#2a2154';
  const hoverColor = '#42327d';

  if (loading) return <p className="p-6" style={{ color: textColor }}>Loading category mappings...</p>;

  return (
    <div className="p-6" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-semibold mb-4">Map Substrings to Categories</h2>

      {/* Mapping Tiles */}
      {Object.keys(groupedMappings).length > 0 ? (
        <div className="mb-6 space-y-4">
          {Object.entries(groupedMappings).map(([catName, substrs]) => (
            <div
              key={catName}
              style={{
                backgroundColor: bgColor,
                borderRadius: '1rem',
                boxShadow: '6px 6px 12px rgba(0,0,0,0.06), -6px -6px 12px rgba(255,255,255,0.4)',
                padding: '1rem',
                color: textColor,
              }}
            >
              <strong className="mr-1">{catName}:</strong> {substrs.join(', ')}
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6">No mappings found.</p>
      )}

      {/* Mapping Form */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          style={{
            backgroundColor: '#fff',
            color: textColor,
            border: `1px solid ${textColor}`,
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
          }}
          className="focus:outline-none focus:ring-2 transition"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={substrings}
          onChange={(e) => setSubstrings(e.target.value)}
          placeholder="e.g. Walmart, Costco"
          style={{
            backgroundColor: '#fff',
            color: textColor,
            border: `1px solid ${textColor}`,
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            flex: '1 1 300px',
          }}
          className="focus:outline-none focus:ring-2 transition"
        />

        <button
          onClick={handleAddMapping}
          disabled={!selectedCategoryId || !substrings.trim()}
          className="font-semibold text-white rounded-md transition"
          style={{
            backgroundColor: textColor,
            padding: '0.5rem 1rem',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
        >
          Add Mapping
        </button>
      </div>

      {/* Message */}
      {message && (
        <p
          className="mt-2 text-sm"
          style={{
            color: message.startsWith('✅')
              ? '#1f7a1f'
              : message.startsWith('⚠️')
              ? '#9b7517'
              : '#c53030',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
