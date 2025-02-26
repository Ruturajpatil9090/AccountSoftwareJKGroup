import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

const DeleteButton = ({ deleteModeHandler, user, isEditing }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      deleteModeHandler(user);
    }
  };

  return (
    <IconButton
      className="ms-2"
      onClick={() => deleteModeHandler(user)}
      onKeyDown={handleKeyDown}
      disabled={!isEditing}
      color="error"
      aria-label="delete"
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteButton;
