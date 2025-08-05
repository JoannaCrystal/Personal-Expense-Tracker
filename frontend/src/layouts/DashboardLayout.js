import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout({ user }) {
  const location = useLocation();

  const navItems = [
    { label: 'Home Page', path: '/dashboard/home' },
    { label: 'User Account Details', path: '/dashboard/account' },
    { label: 'Add Account', path: '/dashboard/add-account' },
    { label: 'Add Category', path: '/dashboard/add-category' },
    { label: 'Map Category', path: '/dashboard/map-category' },
    { label: 'Update Expenses', path: '/dashboard/update-expenses' },
    { label: 'Logout', path: '/logout' },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Title Panel */}
      <header className="bg-blue-600 text-white text-xl font-bold px-6 py-4">
        <div>Expense Tracker</div>
        <Link
          to="/dashboard/summary"
          className="text-sm bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-blue-100">
          View Summary
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-64 bg-white shadow-md p-4 overflow-y-auto">
          {/* User Info */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={user?.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
              alt="User"
              className="w-24 h-24 rounded-full"
            />
            <div className="mt-2 text-center">
              <h2 className="text-lg font-semibold">{user?.firstName}</h2>
              <p className="text-gray-600">{user?.lastName}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="space-y-3">
              {navItems.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`block px-3 py-2 rounded hover:bg-blue-100 ${
                      location.pathname === path ? 'bg-blue-200 font-medium' : ''
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Center Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
