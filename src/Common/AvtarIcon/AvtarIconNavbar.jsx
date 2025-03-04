import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import { Box, IconButton } from '@mui/material';

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
        '0%': { transform: 'scale(.8)', opacity: 1 },
        '100%': { transform: 'scale(2.4)', opacity: 0 },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
            <Tooltip title={storedUsername} arrow>
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
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
            </Menu>

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                TransitionComponent={Transition}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '400px',
                        height: '300px',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        position: 'relative'
                    }
                }}
            >
                <IconButton
                    onClick={handleDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'gray',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <WarningAmberIcon sx={{ fontSize: 50, color: 'orange' }} />
                </Box>

                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Confirm Sign Out
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to sign out ?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button onClick={handleDialogClose} variant="outlined" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleSignOut} variant="contained" color="error">
                        Sign Out
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AvatarIcon;
