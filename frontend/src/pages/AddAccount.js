import React, { useEffect, useState } from 'react';

const AddAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('❌ Not authenticated. Please log in.');
      return;
    }

    fetch('http://localhost:8000/api/accounts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setAccounts(data))
      .catch(() => setMessage('⚠️ Failed to fetch accounts'));
  }, [token]);

  const handleAddAccount = async () => {
    if (!newAccount.trim()) return;
    try {
      const response = await fetch('http://localhost:8000/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newAccount }),
      });
      if (response.ok) {
        const added = await response.json();
        setAccounts([...accounts, added]);
        setNewAccount('');
        setMessage('✅ Account added');
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.detail}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  // Colours
  const bgColor = '#b49db6';
  const textColor = '#2a2154';
  const hoverColor = '#42327d';

  return (
    <div className="p-6" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-semibold mb-4">Your Accounts</h2>

      {accounts.length ? (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              style={{
                backgroundColor: bgColor,
                borderRadius: '1rem',
                boxShadow: '6px 6px 12px rgba(0,0,0,0.06), -6px -6px 12px rgba(255,255,255,0.4)',
                padding: '0.75rem 1rem',
                color: textColor,
              }}
            >
              {acc.name}
            </div>
          ))}

          {/* Input + Button */}
          <div className="flex items-center gap-4">
            <input
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
              placeholder="New Account Name"
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
              onClick={handleAddAccount}
              className="font-semibold rounded-md text-white transition"
              style={{
                backgroundColor: textColor,
                padding: '0.5rem 1rem',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
            >
              Add Account
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-6">No accounts found.</p>
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

export default AddAccount;
