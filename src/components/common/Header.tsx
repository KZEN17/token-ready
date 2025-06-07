// src/components/common/Header.tsx
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
    Avatar,
    Typography,
    Chip,
    Divider,
    CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import {
    AccountBalanceWallet,
    X,
    Telegram,
    MenuBook,
    Logout,
    Settings,
    AccountBox,
    Stars,
    TrendingUp,
} from '@mui/icons-material';
import Logo from './Logo';
import { useUser } from '@/hooks/useUser';

export default function Header() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const {
        user,
        authenticated,
        loading,
        hasTwitter,
        // hasWallet,
        // walletAddress,
        userDisplayName,
        userAvatar,
        isKOL,
        login,
        logout,
        connectTwitter,
        ready
    } = useUser();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        login();
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
    };

    const formatWalletAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    // Show loading state while Privy is initializing
    if (!ready) {
        return (
            <AppBar
                position="sticky"
                sx={{
                    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Logo size="medium" />
                        <Box sx={{ flexGrow: 1 }} />
                        <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
                    </Toolbar>
                </Container>
            </AppBar>
        );
    }

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0, 255, 136, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
        >
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
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 136, 0.15)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
                                },
                            }}
                            href="https://x.com/tokenready"
                            target="_blank"
                        >
                            <X fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                color: 'primary.main',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 136, 0.15)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
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
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 136, 0.15)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
                                },
                            }}
                            href="https://docs.tokenready.io"
                            target="_blank"
                        >
                            <MenuBook fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                        <Link href="/explore" passHref>
                            <Button
                                color="inherit"
                                sx={{
                                    mx: 1,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                        color: theme.palette.primary.main,
                                        transform: 'translateY(-1px)',
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
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                        color: theme.palette.primary.main,
                                        transform: 'translateY(-1px)',
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
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                        color: theme.palette.primary.main,
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                Staking
                            </Button>
                        </Link>
                        <Link href="/leaderboard" passHref>
                            <Button
                                color="inherit"
                                sx={{
                                    mx: 1,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                        color: theme.palette.primary.main,
                                        transform: 'translateY(-1px)',
                                    },
                                }}

                            >
                                Leaderboard
                            </Button>
                        </Link>
                    </Box>

                    {/* Authentication Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        {!authenticated ? (
                            // Not authenticated - show login button
                            <Button
                                variant="contained"
                                onClick={handleLogin}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={16} /> : <X />}
                                sx={{
                                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                                    fontWeight: 600,
                                    color: '#000',
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    border: 'none',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0, 255, 136, 0.3)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                    }
                                }}
                            >
                                {loading ? 'Connecting...' : 'Login with X'}
                            </Button>
                        ) : (
                            // Authenticated - show user profile and wallet
                            <>
                                {/* Wallet Connection Status */}
                                <></>
                                {/* {hasWallet ? (
                                    <Chip
                                        icon={<AccountBalanceWallet />}
                                        label={formatWalletAddress(walletAddress!)}
                                        size="small"
                                        color="success"
                                        sx={{
                                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                                            display: { xs: 'none', sm: 'flex' },
                                            backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                            border: '1px solid rgba(0, 255, 136, 0.3)',
                                        }}
                                    />
                                ) : (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AccountBalanceWallet />}
                                        sx={{
                                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                                            display: { xs: 'none', sm: 'flex' },
                                            borderColor: 'rgba(0, 255, 136, 0.5)',
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        Connect Wallet
                                    </Button>
                                )} */}

                                {/* User Menu */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {/* User Points - Desktop only */}
                                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            icon={<Stars />}
                                            label={`${user?.bobPoints || 0} BOB`}
                                            size="small"
                                            sx={{
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                color: theme.palette.primary.main,
                                                border: '1px solid rgba(0, 255, 136, 0.3)',
                                            }}
                                        />
                                        <Chip
                                            icon={<TrendingUp />}
                                            label={`${user?.believerPoints || 0} BP`}
                                            size="small"
                                            sx={{
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                color: theme.palette.secondary.main,
                                                border: '1px solid rgba(255, 107, 107, 0.3)',
                                            }}
                                        />
                                    </Box>

                                    {/* User Avatar and Name */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            p: 1,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 255, 136, 0.15)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.2)',
                                            }
                                        }}
                                        onClick={handleMenuOpen}
                                    >
                                        <Avatar
                                            src={userAvatar || undefined}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: theme.palette.primary.main,
                                                color: '#000',
                                                fontSize: '0.875rem',
                                                fontWeight: 'bold',
                                                border: '2px solid rgba(0, 255, 136, 0.3)',
                                            }}
                                        >
                                            {!userAvatar && (userDisplayName.charAt(0) || 'U')}
                                        </Avatar>
                                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 'bold',
                                                lineHeight: 1,
                                                color: 'rgba(255, 255, 255, 0.95)'
                                            }}>
                                                {userDisplayName}
                                                {isKOL && (
                                                    <Chip
                                                        label="KOL"
                                                        size="small"
                                                        sx={{
                                                            ml: 1,
                                                            fontSize: '0.6rem',
                                                            height: 16,
                                                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                                            color: theme.palette.secondary.main,
                                                        }}
                                                    />
                                                )}
                                            </Typography>
                                            {hasTwitter && (
                                                <Typography variant="caption" sx={{
                                                    color: 'rgba(255, 255, 255, 0.6)'
                                                }}>
                                                    @{user?.twitterHandle}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* User Menu Dropdown */}
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
                                    sx={{
                                        '& .MuiPaper-root': {
                                            minWidth: 240,
                                            mt: 1.5,
                                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                                            border: '1px solid rgba(0, 255, 136, 0.2)',
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                                        }
                                    }}
                                >
                                    {/* User Info Header */}
                                    <Box sx={{ p: 2, pb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {userDisplayName}
                                            {isKOL && (
                                                <Chip
                                                    label="KOL"
                                                    size="small"
                                                    sx={{
                                                        ml: 1,
                                                        fontSize: '0.6rem',
                                                        height: 16,
                                                        backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                                        color: theme.palette.secondary.main,
                                                    }}
                                                />
                                            )}
                                        </Typography>
                                        {hasTwitter && (
                                            <Typography variant="body2" color="text.secondary">
                                                @{user?.twitterHandle} • {user?.followerCount.toLocaleString()} followers
                                            </Typography>
                                        )}

                                        {/* Points */}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Chip
                                                icon={<Stars />}
                                                label={`${user?.bobPoints || 0} BOB Points`}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                    color: theme.palette.primary.main,
                                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                                }}
                                            />
                                            <Chip
                                                icon={<TrendingUp />}
                                                label={`${user?.believerPoints || 0} Believer Points`}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                    color: theme.palette.secondary.main,
                                                    border: '1px solid rgba(255, 107, 107, 0.3)',
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(0, 255, 136, 0.1)' }} />

                                    {/* Menu Items */}
                                    <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                        <AccountBox sx={{ mr: 2, color: theme.palette.primary.main }} />
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                        <Stars sx={{ mr: 2, color: theme.palette.primary.main }} />
                                        My Reviews ({user?.reviewsCount || 0})
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                        <TrendingUp sx={{ mr: 2, color: theme.palette.primary.main }} />
                                        My Projects ({user?.projectsSupported || 0})
                                    </MenuItem>

                                    {/* Connect X if not connected */}
                                    {!hasTwitter && (
                                        <MenuItem onClick={() => { connectTwitter(); handleMenuClose(); }} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                            <X sx={{ mr: 2, color: theme.palette.primary.main }} />
                                            Connect X Account
                                        </MenuItem>
                                    )}

                                    {/* Connect Wallet if not connected */}
                                    {/* {!hasWallet && (
                                        <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                            <AccountBalanceWallet sx={{ mr: 2, color: theme.palette.primary.main }} />
                                            Connect Wallet
                                        </MenuItem>
                                    )} */}

                                    <MenuItem onClick={handleMenuClose} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                        <Settings sx={{ mr: 2, color: theme.palette.primary.main }} />
                                        Settings
                                    </MenuItem>

                                    <Divider sx={{ borderColor: 'rgba(0, 255, 136, 0.1)' }} />

                                    <MenuItem onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}>
                                        <Logout sx={{ mr: 2, color: theme.palette.secondary.main }} />
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}