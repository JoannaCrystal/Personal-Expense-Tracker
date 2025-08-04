import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Expense Tracker</h1>
        <p className="text-gray-600 text-lg mb-8">
          Take control of your finances. Track expenses, income, and savings—all in one place.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-600">
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
