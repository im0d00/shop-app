import React from 'react';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

export default AuthLayout;
