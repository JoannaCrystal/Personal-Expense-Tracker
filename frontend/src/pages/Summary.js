import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Summary() {
  const [pieData, setPieData] = useState({ total_income: 0, total_expense: 0 });
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Fetch available categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('http://localhost:8000/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    if (token) fetchCategories();
  }, [token]);

  // Fetch report summaries
  const fetchReports = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.category_id) params.append('category_id', filters.category_id);

        const { data } = await axios.get(
          `http://localhost:8000/api/summary/reports?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPieData(data.pie || { total_income: 0, total_expense: 0 });
        setBarData(Array.isArray(data.bar) ? data.bar : []);
        setLineData(Array.isArray(data.line) ? data.line : []);
        setTopCategories(Array.isArray(data.top_categories) ? data.top_categories : []);
      } catch {
        setError('Failed to fetch summary data.');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchReports();
  }, [token, fetchReports]);

  // Apply filters to fetch reports
  const applyFilters = () => {
    const f = {};
    if (startDate) f.start_date = startDate;
    if (endDate) f.end_date = endDate;
    if (selectedCategory) f.category_id = selectedCategory;
    fetchReports(f);
  };

  // Chart data definitions
  const pieChartData = useMemo(
    () => ({
      labels: ['Income', 'Expense'],
      datasets: [
        {
          label: 'Total',
          data: [Math.abs(pieData.total_income), pieData.total_expense],
          backgroundColor: ['#8C6BB8', '#4C316C'],
        },
      ],
    }),
    [pieData]
  );

  const barChartData = useMemo(
    () => ({
      labels: barData.map((item) => item.category),
      datasets: [
        {
          label: 'Expense ($)',
          data: barData.map((item) => parseFloat(item.total)),
          backgroundColor: '#6B4C9A',
        },
      ],
    }),
    [barData]
  );

  const lineChartData = useMemo(
    () => ({
      labels: lineData.map((item) => {
        const m = item.month;
        return typeof m === 'number'
          ? new Date(2000, m - 1, 1).toLocaleString('default', { month: 'short' })
          : String(m);
      }),
      datasets: [
        {
          label: 'Income ($)',
          data: lineData.map((item) => parseFloat(item.total_income)),
          fill: false,
          borderColor: '#8C6BB8',
          tension: 0.3,
        },
        {
          label: 'Expense ($)',
          data: lineData.map((item) => parseFloat(item.total_expense)),
          fill: false,
          borderColor: '#4C316C',
          tension: 0.3,
        },
      ],
    }),
    [lineData]
  );

  const topBarData = useMemo(
    () => ({
      labels: topCategories.map((item) => item.category),
      datasets: [
        {
          label: 'Total Expense ($)',
          data: topCategories.map((item) => parseFloat(item.total)),
          backgroundColor: '#8C6BB8',
        },
      ],
    }),
    [topCategories]
  );

  // Shared chart options for consistent sizing
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-moody-dark mb-4">
        Expense Summary & Reports
      </h2>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="bg-moody text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Display charts or data messages */}
      {loading ? (
        <p>Loading reports…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Income (Pie Chart) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-neumorph flex flex-col">
            <h3 className="text-lg font-semibold text-moody mb-4">
              Total Income
            </h3>
            <div className="relative flex-grow">
              <Pie data={pieChartData} options={{ ...chartOptions, plugins: { legend: { position: 'right' } }} } />
            </div>
          </div>

          {/* Expenses by Category (Bar Chart) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-neumorph flex flex-col">
            <h3 className="text-lg font-semibold text-moody mb-4">
              Expenses by Category
            </h3>
            <div className="relative flex-grow">
              {barData.length ? (
                <Bar data={barChartData} options={chartOptions} />
              ) : (
                <p>No category data</p>
              )}
            </div>
          </div>

          {/* Income & Expenses (Line Chart) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-neumorph flex flex-col">
            <h3 className="text-lg font-semibold text-moody mb-4">
              Income &amp; Expenses
            </h3>
            <div className="relative flex-grow">
              {lineData.length ? (
                <Line data={lineChartData} options={chartOptions} />
              ) : (
                <p>No time series data</p>
              )}
            </div>
          </div>

          {/* Top Categories (Horizontal Bar Chart) */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-neumorph flex flex-col">
            <h3 className="text-lg font-semibold text-moody mb-4">
              Top Categories
            </h3>
            <div className="relative flex-grow">
              {topCategories.length ? (
                <Bar data={topBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
              ) : (
                <p>No top categories data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
