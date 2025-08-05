// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import AddAccount from './pages/AddAccount';
import AddCategory from './pages/AddCategory';
import UpdateExpenses from './pages/UpdateExpenses';
import Summary from './pages/Summary';
import MapCategory from './pages/MapCategory';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<DashboardHome />} />
          <Route path="add-account" element={<AddAccount />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="map-category" element={<MapCategory />} />
          <Route path="update-expenses" element={<UpdateExpenses />} />
          <Route path="summary" element={<Summary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
