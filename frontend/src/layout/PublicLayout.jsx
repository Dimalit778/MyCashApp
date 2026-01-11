import TopBar from 'layout/TopBar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { currentUser } from 'services/reducers/userSlice';

const PublicLayout = () => {
  const user = useSelector(currentUser);

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/analytics" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return (
    <div
      // className="bg-black min-vh-100"
      style={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <TopBar />
      <div
        className="main-content"
        style={{
          paddingTop: '65px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
export default PublicLayout;
