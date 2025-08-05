import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';

const PublicLayout = () => {
  const bgColor = '#b49db6';
  const textColor = '#2a2154';

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Home Icon in Top-Right */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/"
          className="text-3xl"
          title="Go to Home"
          style={{ color: textColor }}
          onMouseOver={(e) => (e.target.style.color = '#42327d')}
          onMouseOut={(e) => (e.target.style.color = textColor)}
        >
          <AiOutlineHome />
        </Link>
      </div>

      {/* Page Content */}
      <div className="pt-12">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
