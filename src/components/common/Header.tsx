'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { AccountBalanceWallet, Person } from '@mui/icons-material';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky" sx={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(10px)' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            TokenReady
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                        <Link href="/explore" passHref>
                            <Button color="inherit" sx={{ mx: 1 }}>
                                Explore
                            </Button>
                        </Link>
                        <Link href="/submit" passHref>
                            <Button color="inherit" sx={{ mx: 1 }}>
                                Submit Project
                            </Button>
                        </Link>
                        <Button color="inherit" sx={{ mx: 1 }}>
                            Staking
                        </Button>
                        <Button color="inherit" sx={{ mx: 1 }}>
                            Leaderboard
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AccountBalanceWallet />}
                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    borderColor: 'primary.light',
                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                },
                            }}
                        >
                            Connect Wallet
                        </Button>

                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <Person />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleMenuClose}>My Projects</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}