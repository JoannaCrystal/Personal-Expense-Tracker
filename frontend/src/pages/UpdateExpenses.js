// frontend/src/pages/UpdateExpenses.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UpdateExpenses() {
  const [accounts, setAccounts] = useState([]);
  const [expenseForms, setExpenseForms] = useState([{ accountId: '', file: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Retrieve JWT token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccounts(response.data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts');
      }
    }
    fetchAccounts();
  }, [token]);

  // Add another file/account upload row
  const addExpenseForm = () => {
    setExpenseForms([...expenseForms, { accountId: '', file: null }]);
  };

  // Handle account selection changes
  const handleAccountChange = (index, value) => {
    const updatedForms = [...expenseForms];
    updatedForms[index].accountId = value;
    setExpenseForms(updatedForms);
  };

  // Handle file selection changes
  const handleFileChange = (index, file) => {
    const updatedForms = [...expenseForms];
    updatedForms[index].file = file;
    setExpenseForms(updatedForms);
  };

  // Submit each form row to the backend
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      for (const form of expenseForms) {
        if (!form.accountId) throw new Error('Please select an account for all expense forms.');
        if (!form.file) throw new Error('Please upload a file for all expense forms.');

        const formData = new FormData();
        formData.append('account_id', form.accountId);
        formData.append('file', form.file);

        await axios.post('http://localhost:8000/api/expenses/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setSuccessMessage('Expenses uploaded successfully.');
      // Reset the form rows after successful upload
      setExpenseForms([{ accountId: '', file: null }]);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Update Expenses</h2>

      {expenseForms.map((form, idx) => (
        <div key={idx} className="mb-6 border p-4 rounded shadow-sm">
          <label className="block mb-2 font-medium">
            Select Account:
            <select
              value={form.accountId}
              onChange={(e) => handleAccountChange(idx, e.target.value)}
              className="block mt-1 w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">-- Select Account --</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-2 font-medium">
            Upload Expense Excel Sheet:
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileChange(idx, e.target.files[0])}
              className="block mt-1"
            />
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addExpenseForm}
        className="mb-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add another expense upload
      </button>

      <div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Expenses'}
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </div>
  );
}
