import React from 'react';

const PublicCardLayout = ({ children }) => {
  const bgColor = '#b49db6';
  const textColor = '#2a2154';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div
        className="max-w-md w-full p-8"
        style={{
          backgroundColor: bgColor,
          borderRadius: '1.25rem',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.06), -6px -6px 12px rgba(255,255,255,0.4)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PublicCardLayout;
