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

export default function DashboardLayout({ user }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard/home', icon: <FaHome /> },
    { label: 'Add Account', path: '/dashboard/add-account', icon: <FaUserPlus /> },
    { label: 'Add Category', path: '/dashboard/add-category', icon: <FaFolderPlus /> },
    { label: 'Map Category', path: '/dashboard/map-category', icon: <FaMapSigns /> },
    { label: 'Update Expenses', path: '/dashboard/update-expenses', icon: <FaEdit /> },
    { label: 'Summary', path: '/dashboard/summary', icon: <FaChartPie /> },
    { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  const baseBg = '#b49db6';
  const textColor = '#2a2154';
  const hoverBg = '#d2bfd9';

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: baseBg, color: textColor }}>
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-6 py-4 shadow-neumorph"
        style={{ backgroundColor: baseBg }}
      >
        <button
          onClick={toggleSidebar}
          className="mr-4 focus:outline-none"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FaBars size={20} color={textColor} /> : <FaTimes size={20} color={textColor} />}
        </button>
        <div className="text-2xl font-bold flex-1" style={{ color: textColor }}>Dashboard</div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="p-2 rounded-lg shadow-neumorph" style={{ backgroundColor: baseBg }}>
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUserCircle size={24} color={textColor} />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 flex-shrink-0 ${
            isCollapsed ? 'w-20' : 'w-60'
          } shadow-neumorph p-4`}
          style={{ backgroundColor: baseBg }}
        >
          <nav>
            <ul className="space-y-2">
              {navItems.map(({ label, path, icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200"
                      style={{
                        backgroundColor: isActive ? hoverBg : 'transparent',
                        color: textColor,
                      }}
                    >
                      <span className="text-lg">{icon}</span>
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
