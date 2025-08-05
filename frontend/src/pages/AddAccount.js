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
      <h2 className="text-2xl font-semibold text-moody-dark mb-4">Your Accounts</h2>

      {accounts.length ? (
        <ul className="space-y-3 mb-6">
          {accounts.map((acc) => (
            <li
              key={acc.id}
              className="p-4 bg-white rounded-2xl shadow-neumorph text-gray-800"
            >
              {acc.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-500">No accounts found.</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          value={newAccount}
          onChange={(e) => setNewAccount(e.target.value)}
          placeholder="New Account Name"
          className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-moody-dark"
        />
        <button
          onClick={handleAddAccount}
          className="bg-moody text-white px-4 py-2 rounded shadow-neumorph hover:bg-moody-dark"
        >
          Add Account
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

export default AddAccount;
