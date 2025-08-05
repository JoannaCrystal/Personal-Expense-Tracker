// src/pages/DashboardHome.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaUserPlus,
  FaFolderPlus,
  FaMapSigns,
  FaEdit,
  FaChartPie,
} from 'react-icons/fa';

export default function DashboardHome() {
  const cards = [
    {
      title: 'Welcome!',
      description: 'Manage your finances with ease.',
      icon: <FaHome size={40} className="opacity-60" />,
      path: null, // no click on welcome
      color: 'bg-moody',
    },
    {
      title: 'Summary',
      description: null,
      icon: <FaChartPie size={40} />,
      path: '/dashboard/summary',
      color: 'bg-moody-dark',
    },
    {
      title: 'Add Account',
      description: null,
      icon: <FaUserPlus size={40} />,
      path: '/dashboard/add-account',
      color: 'bg-moody-dark',
    },
    {
      title: 'Add Category',
      description: null,
      icon: <FaFolderPlus size={40} />,
      path: '/dashboard/add-category',
      color: 'bg-moody-dark',
    },
    {
      title: 'Map Category',
      description: null,
      icon: <FaMapSigns size={40} />,
      path: '/dashboard/map-category',
      color: 'bg-moody-dark',
    },
    {
      title: 'Update Expenses',
      description: null,
      icon: <FaEdit size={40} />,
      path: '/dashboard/update-expenses',
      color: 'bg-moody-dark',
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl p-6 shadow-md ${card.color} flex flex-col items-start justify-between hover:bg-moody-light transition-all`}
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-1">{card.title}</h3>
            {card.description && <p className="text-sm opacity-70">{card.description}</p>}
            {card.path && (
              <Link
                to={card.path}
                className="mt-4 inline-block text-sm font-semibold text-moody underline"
              >
                Go to {card.title}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
