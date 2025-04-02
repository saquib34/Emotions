import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div 
      className={`backdrop-blur-md bg-white bg-opacity-10 rounded-xl border border-white border-opacity-20 shadow-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;