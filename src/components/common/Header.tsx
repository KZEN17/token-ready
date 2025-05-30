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
import { AccountBalanceWallet, Person, Twitter, Telegram, MenuBook } from '@mui/icons-material';

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

                    {/* Social Links next to logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                        <IconButton
                            size="small"
                            sx={{ color: '#00ff88' }}
                            href="https://twitter.com/tokenready"
                            target="_blank"
                        >
                            <Twitter fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{ color: '#00ff88' }}
                            href="https://t.me/tokenready"
                            target="_blank"
                        >
                            <Telegram fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{ color: '#00ff88' }}
                            href="https://docs.tokenready.io"
                            target="_blank"
                        >
                            <MenuBook fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                        <Link href="/explore" passHref>
                            <Button color="inherit" sx={{ mx: 1, fontSize: '0.875rem' }}>
                                Explore
                            </Button>
                        </Link>
                        <Link href="/submit" passHref>
                            <Button color="inherit" sx={{ mx: 1, fontSize: '0.875rem' }}>
                                Submit Project
                            </Button>
                        </Link>
                        <Link href="/staking" passHref>
                            <Button color="inherit" sx={{ mx: 1, fontSize: '0.875rem' }}>
                                Staking
                            </Button>
                        </Link>
                        <Button color="inherit" sx={{ mx: 1, fontSize: '0.875rem' }}>
                            Leaderboard
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <Button
                            variant="outlined"
                            startIcon={<AccountBalanceWallet sx={{ display: { xs: 'none', sm: 'block' } }} />}

                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                fontSize: { xs: '0.8rem', md: '0.875rem' },
                                // px: { xs: 1.5, md: 2 },
                                // py: { xs: 0.5, md: 1 },
                                // minWidth: { xs: 'auto', md: 'auto' },
                                '&:hover': {
                                    borderColor: 'primary.light',
                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                },
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                Connect Wallet
                            </Box>
                            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                                Connect
                            </Box>
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
                            <MenuItem onClick={handleMenuClose}>Believer Points</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}