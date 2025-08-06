// src/pages/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage or any auth token
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Optional: Clear additional session/cookies here

    // Redirect to login page after logout
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="p-6 text-center text-lg">
      Logging you out...
    </div>
  );
};

export default Logout;
