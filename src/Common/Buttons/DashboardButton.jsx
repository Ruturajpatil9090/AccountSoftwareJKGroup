// DashboardButton.js
import React from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const DashboardButton = ({ label, icon: Icon, path }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(path);
  };

  return (
    <Button
      onClick={handleButtonClick}
      style={{ width: '250px', height: '80px' }}
        className="btn btn-primary"
    >
      <Icon /> {label}
    </Button>
  );
};

export default DashboardButton;
