import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie } from 'react-icons/fa';

/**
 * DashboardHome renders the landing page within the dashboard section. It
 * displays a grid of action cards that link to different parts of the
 * application. The layout follows the neumorphic dark theme illustrated
 * in the provided mock‑up: a deep purple background, soft shadows and
 * rounded corners. When additional cards are added, the grid simply
 * wraps to another row.
 */
export default function DashboardHome() {
  // Define the cards to show on the dashboard. Each card can optionally
  // specify a route via the `to` property. If no route is defined, the
  // card will render as a static box (used for the welcome message).
  const cards = [
    {
      label: 'Welcome!',
      subtext: 'Manage your finances with ease.',
      to: null,
    },
    {
      label: 'Summary',
      to: '/dashboard/summary',
      icon: <FaChartPie size={32} className="opacity-70 mb-3" />,
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

  return (
    <div className="p-8 bg-moody-dark min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => {
          const content = (
            <div className="p-6 rounded-xl bg-moody shadow-neumorph transition-colors hover:bg-moody-light h-full flex flex-col justify-center">
              {card.icon}
              <h2 className="text-2xl font-semibold mb-1">{card.label}</h2>
              {card.subtext && (
                <p className="text-sm text-gray-300 mt-1">{card.subtext}</p>
              )}
            </div>
          );
          return card.to ? (
            <Link to={card.to} key={idx}>{content}</Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
