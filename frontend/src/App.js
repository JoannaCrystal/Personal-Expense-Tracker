import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import AddAccount from './pages/AddAccount';
import AddCategory from './pages/AddCategory';
import UpdateExpenses from './pages/UpdateExpenses';
import Summary from './pages/Summary';

const DashboardHome = () => (
  <div className="text-lg px-4 py-6">Welcome to your dashboard!</div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Shared Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="add-account" element={<AddAccount />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="update-expenses" element={<UpdateExpenses />} /> {/* Added route */}
          <Route path="summary" element={<Summary />} />
          {/* Add other sidebar items here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
