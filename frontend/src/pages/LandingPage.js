import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const bgColor = '#b49db6';
  const textColor = '#2a2154';
  const hoverColor = '#42327d';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div
        className="rounded-2xl p-10 max-w-xl w-full text-center"
        style={{
          backgroundColor: bgColor,
          borderRadius: '1.25rem',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.05), -6px -6px 12px rgba(255,255,255,0.4)',
        }}
      >
        <h1 className="text-5xl font-bold mb-4">Expense Tracker</h1>
        <p className="text-lg mb-8">
          Take control of your finances. Track expenses, income, and savings — all in one place.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl font-semibold text-white transition"
            style={{ backgroundColor: textColor }}
            onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = textColor)}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 rounded-xl font-semibold border-2 transition"
            style={{
              borderColor: textColor,
              color: textColor,
              backgroundColor: 'transparent',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = hoverColor;
              e.target.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = textColor;
            }}
          >
            Register
          </button>
        </div>
      </div>
      <footer className="mt-10 text-sm" style={{ color: '#2a2154' }}>
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
