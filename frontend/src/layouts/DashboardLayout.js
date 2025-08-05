import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUserPlus,
  FaFolderPlus,
  FaMapSigns,
  FaEdit,
  FaChartPie,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';

/**
 * DashboardLayout is responsible for rendering the persistent shell around
 * authenticated pages. It includes a collapsible sidebar and a top bar with a
 * menu toggle and user icon. The sidebar lists navigation items with icons,
 * mirroring the design shown in the provided mock-up image. Active routes
 * are highlighted, and the sidebar collapses down to show only icons when
 * toggled.
 */
export default function DashboardLayout({ user }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  /**
   * Define navigation items for the sidebar. Each item includes a label,
   * destination path, and an icon component. The order here will dictate
   * the order they appear in the sidebar.
   */
  const navItems = [
    { label: 'Dashboard', path: '/dashboard/home', icon: <FaHome /> },
    { label: 'Add Account', path: '/dashboard/add-account', icon: <FaUserPlus /> },
    { label: 'Add Category', path: '/dashboard/add-category', icon: <FaFolderPlus /> },
    { label: 'Map Category', path: '/dashboard/map-category', icon: <FaMapSigns /> },
    { label: 'Update Expenses', path: '/dashboard/update-expenses', icon: <FaEdit /> },
    { label: 'Summary', path: '/dashboard/summary', icon: <FaChartPie /> },
    { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-moody-dark text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-moody-dark shadow-neumorph">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="mr-4 focus:outline-none"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
        {/* Title */}
        <div className="text-2xl font-bold flex-1">Dashboard</div>
        {/* User Icon */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Replace with actual profile picture if available */}
          <div className="bg-moody p-2 rounded-lg shadow-neumorph">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUserCircle size={24} className="text-white" />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 flex-shrink-0 ${
            isCollapsed ? 'w-20' : 'w-60'
          } bg-moody shadow-neumorph p-4`}
        >
          {/* Navigation Links */}
          <nav>
            <ul className="space-y-2">
              {navItems.map(({ label, path, icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ` +
                        (isActive
                          ? 'bg-moody-dark text-white'
                          : 'bg-transparent text-white hover:bg-moody-light')
                      }
                    >
                      {/* Icon */}
                      <span className="text-lg">{icon}</span>
                      {/* Label (hidden when collapsed) */}
                      {!isCollapsed && (
                        <span className="font-medium">{label}</span>
                      )}
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
