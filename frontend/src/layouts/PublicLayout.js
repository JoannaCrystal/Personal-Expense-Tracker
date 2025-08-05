import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';

const PublicLayout = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <Link to="/" className="text-gray-300 hover:text-white text-3xl" title="Go to Home">
          <AiOutlineHome />
        </Link>
      </div>

      {/* This renders the actual page content */}
      <div className="pt-12">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
