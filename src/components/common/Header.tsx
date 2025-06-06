'use client';

import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { AccountBalanceWallet, Person, Twitter, Telegram, MenuBook } from '@mui/icons-material';
import Logo from './Logo';

export default function Header() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Logo size="medium" />

                    {/* Social Links next to logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                        <IconButton
                            size="small"
                            sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: (theme) => `${theme.palette.primary.main}15`,
                                },
                            }}
                            href="https://twitter.com/tokenready"
                            target="_blank"
                        >
                            <Twitter fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: (theme) => `${theme.palette.primary.main}15`,
                                },
                            }}
                            href="https://t.me/tokenready"
                            target="_blank"
                        >
                            <Telegram fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: (theme) => `${theme.palette.primary.main}15`,
                                },
                            }}
                            href="https://docs.tokenready.io"
                            target="_blank"
                        >
                            <MenuBook fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                        <Link href="/explore" passHref>
                            <Button
                                color="inherit"
                                sx={{
                                    mx: 1,
                                    fontSize: '0.875rem',
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                                    },
                                }}
                            >
                                Explore
                            </Button>
                        </Link>
                        <Link href="/submit" passHref>
                            <Button
                                color="inherit"
                                sx={{
                                    mx: 1,
                                    fontSize: '0.875rem',
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                                    },
                                }}
                            >
                                Submit Project
                            </Button>
                        </Link>
                        <Link href="/staking" passHref>
                            <Button
                                color="inherit"
                                sx={{
                                    mx: 1,
                                    fontSize: '0.875rem',
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                                    },
                                }}
                            >
                                Staking
                            </Button>
                        </Link>
                        <Button
                            color="inherit"
                            sx={{
                                mx: 1,
                                fontSize: '0.875rem',
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: (theme) => `${theme.palette.primary.main}08`,
                                },
                            }}
                        >
                            Leaderboard
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <Button
                            variant="outlined"
                            startIcon={<AccountBalanceWallet sx={{ display: { xs: 'none', sm: 'block' } }} />}
                            sx={{
                                fontSize: { xs: '0.8rem', md: '0.875rem' },
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