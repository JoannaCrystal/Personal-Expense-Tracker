import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie } from 'react-icons/fa';

export default function DashboardHome() {
  const cards = [
    {
      label: 'Welcome!',
      subtext: 'Manage your finances with ease.',
      to: null,
    },
    {
      label: 'Summary',
      to: '/dashboard/summary',
      icon: <FaChartPie size={32} style={{ color: '#2a2154', opacity: 0.7, marginBottom: '0.75rem' }} />,
    },
    {
      label: 'Add Account',
      to: '/dashboard/add-account',
    },
    {
      label: 'Add Category',
      to: '/dashboard/add-category',
    },
    {
      label: 'Map Category',
      to: '/dashboard/map-category',
    },
    {
      label: 'Update Expenses',
      to: '/dashboard/update-expenses',
    },
  ];

  // Embossed tile styling matching the summary page
  const cardStyle = {
    backgroundColor: '#b49db6',
    borderRadius: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.4)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '160px', // optional: consistent height for tiles
  };

  return (
    <div className="p-8 min-h-screen" style={{ color: '#2a2154', backgroundColor: '#b49db6' }}>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => {
          const content = (
            <div style={cardStyle}>
              {card.icon}
              <h2 style={{ color: '#2a2154' }} className="text-2xl font-semibold mb-1">
                {card.label}
              </h2>
              {card.subtext && (
                <p style={{ color: '#2a2154' }} className="text-sm mt-1">
                  {card.subtext}
                </p>
              )}
            </div>
          );
          return card.to ? (
            <Link to={card.to} key={idx}>
              {content}
            </Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
