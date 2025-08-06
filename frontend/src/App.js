import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';
import AddAccount from './pages/AddAccount';
import AddCategory from './pages/AddCategory';
import UpdateExpenses from './pages/UpdateExpenses';
import Summary from './pages/Summary';
import MapCategory from './pages/MapCategory';
import DashboardHome from './pages/DashboardHome';
import PublicLayout from './layouts/PublicLayout';
import Logout from './pages/Logout';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes with Shared Layout (Home Icon Panel) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* Protected Routes - Dashboard */}
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
