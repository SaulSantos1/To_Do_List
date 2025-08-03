import React from 'react';

const LoadingSpinner = ({ className = '' }) => {
  return (
    <div className={`loading-spinner ${className}`}></div>
  );
};

export default LoadingSpinner;