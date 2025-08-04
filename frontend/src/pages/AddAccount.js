import React, { useEffect, useState } from 'react';

const AddAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token'); // ⬅️ get JWT token from localStorage

  useEffect(() => {
    if (!token) {
      setMessage('❌ Not authenticated. Please log in.');
      return;
    }

    fetch('http://localhost:8000/api/accounts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
          'Authorization': `Bearer ${token}`, // ⬅️ send token here too
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Accounts</h2>

      {accounts.length ? (
        <ul className="space-y-2 mb-6">
          {accounts.map((acc) => (
            <li key={acc.id} className="p-3 bg-gray-100 rounded shadow">
              {acc.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-600">No accounts found.</p>
      )}

      <div className="flex items-center space-x-4">
        <input
          value={newAccount}
          onChange={(e) => setNewAccount(e.target.value)}
          placeholder="New Account Name"
          className="border px-4 py-2 rounded w-64"
        />
        <button
          onClick={handleAddAccount}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Account
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default AddAccount;
