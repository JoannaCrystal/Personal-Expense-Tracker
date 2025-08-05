import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout({ user }) {
  const location = useLocation();

  // State to control whether the sidebar is collapsed. When collapsed, the
  // sidebar shrinks to show only icons or initials. A toggle button in
  // the header controls this state.
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

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
      {/* Top Bar */}
      <header className="bg-moody text-white flex items-center justify-between px-6 py-4 shadow-neumorph">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="mr-4 focus:outline-none"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {/* Simple hamburger / arrow icon using unicode characters. */}
          <span className="text-2xl font-bold">
            {isCollapsed ? '☰' : '✕'}
          </span>
        </button>
        <div className="text-2xl font-bold flex-1">Expense Tracker</div>
        <Link
          to="/dashboard/summary"
          className="text-sm bg-white text-moody font-semibold px-4 py-2 rounded shadow-neumorph hover:bg-moody-light hover:text-white transition"
        >
          View Summary
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
        <aside
          className={`bg-white shadow-neumorph p-4 overflow-y-auto transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* User Info */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={
                user?.profilePic ||
                'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
              }
              alt="User"
              className={`rounded-full mb-2 ${isCollapsed ? 'w-12 h-12' : 'w-20 h-20'}`}
            />
            {!isCollapsed && (
              <div className="text-center">
                <h2 className="text-lg font-semibold text-moody-dark">{user?.firstName}</h2>
                <p className="text-gray-500">{user?.lastName}</p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="space-y-2">
              {navItems.map(({ label, path }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ` +
                        (isActive
                          ? 'bg-moody text-white'
                          : 'bg-transparent text-moody-dark hover:bg-moody-light hover:text-white')
                      }
                    >
                      {/* Icon/Initial or full label based on collapsed state */}
                      <span className="text-lg font-semibold">
                        {isCollapsed ? label.charAt(0) : label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
