// DashboardButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardButton = ({ label, icon: Icon, path }) => {
  const navigate = useNavigate();

  // Inline styles
  const buttonStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    width: '250px',
    height: '80px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    gap: '10px',
  };

  const buttonHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#0056b3',
  };

  const buttonActiveStyle = {
    transform: 'scale(0.98)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const iconStyle = {
    fontSize: '28px',
    marginRight: '8px',
  };

  const labelStyle = {
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#fff',
    display: 'inline-block',
  };

  const handleButtonClick = () => {
    navigate(path);
  };

  return (
    <button
      onClick={handleButtonClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = buttonHoverStyle.transform;
        e.target.style.boxShadow = buttonHoverStyle.boxShadow;
        e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = '';
        e.target.style.boxShadow = '';
        e.target.style.backgroundColor = '';
      }}
      onMouseDown={(e) => {
        e.target.style.transform = buttonActiveStyle.transform;
        e.target.style.boxShadow = buttonActiveStyle.boxShadow;
      }}
      onMouseUp={(e) => {
        e.target.style.transform = '';
        e.target.style.boxShadow = '';
      }}
    >
      <Icon style={iconStyle} />
      <span style={labelStyle}>{label}</span>
    </button>
  );
};

export default DashboardButton;
