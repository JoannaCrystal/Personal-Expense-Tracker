import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout({ user }) {
  const location = useLocation();

  const navItems = [
    { label: 'Home Page', path: '/dashboard/home' },
    { label: 'User Account Details', path: '/dashboard/account' },
    { label: 'Add Account', path: '/dashboard/add-account' },
    { label: 'Add Category', path: '/dashboard/add-category' },
    { label: 'Update Expenses', path: '/dashboard/update-expenses' },
    { label: 'Logout', path: '/logout' },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Title Panel */}
      <header className="bg-blue-600 text-white text-xl font-bold px-6 py-4">
        Expense Tracker
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-64 bg-white shadow-md p-4 overflow-y-auto">
          {/* User Info */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={user?.profilePic || 'https://via.placeholder.com/100'}
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
