import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-smoky to-moody-light flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 max-w-xl w-full text-center shadow-neumorph">
        <h1 className="text-5xl font-bold text-moody mb-4">Expense Tracker</h1>
        <p className="text-gray-600 text-lg mb-8">
          Take control of your finances. Track expenses, income, and savings — all in one place.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-moody text-white rounded-xl shadow-neumorph hover:bg-moody-dark transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 border-2 border-moody text-moody rounded-xl shadow-neumorph hover:bg-moody-light hover:text-white transition"
          >
            Register
          </button>
        </div>
      </div>
      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
