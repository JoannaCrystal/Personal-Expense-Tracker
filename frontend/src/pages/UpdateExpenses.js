import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UpdateExpenses() {
  const [accounts, setAccounts] = useState([]);
  const [expenseForms, setExpenseForms] = useState([{ accountId: '', file: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(response.data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts');
      }
    }
    fetchAccounts();
  }, [token]);

  const addExpenseForm = () => {
    setExpenseForms([...expenseForms, { accountId: '', file: null }]);
  };

  const handleAccountChange = (index, value) => {
    const updatedForms = [...expenseForms];
    updatedForms[index].accountId = value;
    setExpenseForms(updatedForms);
  };

  const handleFileChange = (index, file) => {
    const updatedForms = [...expenseForms];
    updatedForms[index].file = file;
    setExpenseForms(updatedForms);
  };

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
      setExpenseForms([{ accountId: '', file: null }]);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = '#b49db6';
  const textColor = '#2a2154';
  const hoverColor = '#42327d';

  return (
    <div className="p-6" style={{ backgroundColor: bgColor, color: textColor }}>
      <h2 className="text-2xl font-semibold mb-6">Update Expenses</h2>

      {expenseForms.map((form, idx) => (
        <div
          key={idx}
          className="mb-6 inline-block"
          style={{
            backgroundColor: bgColor,
            borderRadius: '1.25rem',
            padding: '1.25rem',
            boxShadow: '6px 6px 12px rgba(0,0,0,0.05), -6px -6px 12px rgba(255,255,255,0.4)',
            maxWidth: '100%',
            minWidth: '280px',
          }}
        >
          <label className="block mb-3 font-medium" style={{ color: textColor }}>
            Select Account:
            <select
              value={form.accountId}
              onChange={(e) => handleAccountChange(idx, e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: '#fff',
                color: textColor,
                border: `1px solid ${textColor}`,
              }}
            >
              <option value="">-- Select Account --</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block font-medium" style={{ color: textColor }}>
            Upload Expense Excel Sheet:
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileChange(idx, e.target.files[0])}
              className="block mt-2"
              style={{ color: textColor }}
            />
          </label>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          type="button"
          onClick={addExpenseForm}
          className="font-semibold rounded text-white transition"
          style={{
            backgroundColor: textColor,
            padding: '0.5rem 1rem',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
        >
          + Add another expense upload
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="font-semibold rounded text-white transition disabled:opacity-50"
          style={{
            backgroundColor: textColor,
            padding: '0.5rem 1.25rem',
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = hoverColor;
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = textColor;
          }}
        >
          {loading ? 'Uploading...' : 'Upload Expenses'}
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </div>
  );
}
