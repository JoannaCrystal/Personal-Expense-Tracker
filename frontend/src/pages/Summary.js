import React, { useEffect, useState } from 'react';
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
  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await axios.get('http://localhost:8000/api/summary/reports', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log('📊 Summary data:', data);
      setReport(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const pieChartData = report?.pie
    ? {
        labels: ['Income', 'Expense'],
        datasets: [
          {
            label: `Income vs Expense (${report.pie.month})`,
            data: [Math.abs(report.pie.total_income), report.pie.total_expense],
            backgroundColor: ['#16a34a', '#ef4444'],
          },
        ],
      }
    : null;

  const barChartData = report?.bar
    ? {
        labels: report.bar.map((row) => row.category),
        datasets: [
          {
            label: 'Expenses by Category',
            data: report.bar.map((row) => row.total),
            backgroundColor: '#3b82f6',
          },
        ],
      }
    : null;

  const lineChartData = report?.line
    ? {
        labels: report.line.map((row) => `Month ${row.month}`),
        datasets: [
          {
            label: 'Income',
            data: report.line.map((row) => Math.abs(row.total_income)),
            borderColor: '#16a34a',
            fill: false,
          },
          {
            label: 'Expense',
            data: report.line.map((row) => row.total_expense),
            borderColor: '#ef4444',
            fill: false,
          },
        ],
      }
    : null;

  const topCategoriesData = report?.top_categories
    ? {
        labels: report.top_categories.map((row) => row.category),
        datasets: [
          {
            label: 'Top Categories',
            data: report.top_categories.map((row) => row.total),
            backgroundColor: '#f59e0b',
          },
        ],
      }
    : null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Expense Summary</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-6 sm:mt-auto hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : report ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie: Income vs Expense */}
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Income vs Expense (Latest Month)</h3>
            <Pie data={pieChartData} />
          </div>

          {/* Bar: Expenses by Category */}
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Expenses by Category</h3>
            <Bar data={barChartData} />
          </div>

          {/* Line: Income & Expense Trend */}
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Yearly Trend</h3>
            <Line data={lineChartData} />
          </div>

          {/* Horizontal Bar: Top Categories */}
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Top Categories</h3>
            <Bar
              data={{
                ...topCategoriesData,
                indexAxis: 'y',
              }}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No report data available.</p>
      )}
    </div>
  );
}
