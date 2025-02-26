import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

function AvatarIcon() {
    const storedUsername = sessionStorage.getItem('username');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOutClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleSignOut = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            </div>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{ fontSize: 30 }}
            >
                <Avatar
                    alt="User Avatar"
                    src=""
                    onClick={handleClick}
                    sx={{ cursor: 'pointer' }}
                />
                
            </StyledBadge>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
            </Menu>
            <h4 style={{marginLeft:"-40px"}}>{storedUsername}</h4>

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}

            >
                <DialogTitle>Confirm Sign Out</DialogTitle>
                <DialogContent>
                    Are you sure you want to Sign out ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} >
                        Cancel
                    </Button>
                    <Button onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AvatarIcon;
