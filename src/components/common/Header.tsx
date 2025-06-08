// src/components/common/Header.tsx (Fixed with Believer Points Integration)
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
    LocalFireDepartment,
} from '@mui/icons-material';
import Logo from './Logo';
import BelieverPointsWidget from './BelieverPointsWidget';
import { useUser } from '@/hooks/useUser';
import { useBelieverPoints } from '@/hooks/useBelieverPoints';

export default function Header() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const {
        user,
        authenticated,
        loading,
        hasTwitter,
        userDisplayName,
        userAvatar,
        isKOL,
        login,
        logout,
        connectTwitter,
        ready
    } = useUser();

    const { totalPoints, rank } = useBelieverPoints();

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
                                    position: 'relative',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                        color: theme.palette.primary.main,
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                Submit Project
                                {/* Points indicator */}
                                <Chip
                                    label="+250"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -6,
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        fontSize: '0.6rem',
                                        height: 16,
                                        minWidth: 28,
                                        fontWeight: 'bold',
                                        '& .MuiChip-label': { px: 0.5 }
                                    }}
                                />
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
                            // Authenticated - show believer points widget and user profile
                            <>
                                {/* Believer Points Widget */}
                                <BelieverPointsWidget compact={true} showRank={true} />

                                {/* User Menu */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                                    @{user?.username}
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
                                            minWidth: 280,
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
                                                @{user?.username} • {user?.followerCount?.toLocaleString()} followers
                                            </Typography>
                                        )}

                                        {/* Believer Points in Menu */}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Chip
                                                icon={<LocalFireDepartment />}
                                                label={`${user?.believerPoints?.toLocaleString() || 0} Believer Points`}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                    color: theme.palette.primary.main,
                                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                                }}
                                            />
                                            <Chip
                                                label={user?.believerRank || 'Believer'}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                    color: theme.palette.primary.main,
                                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                                }}
                                            />
                                        </Box>

                                        {/* Legacy points for compatibility */}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                            <Chip
                                                icon={<Stars />}
                                                label={`${user?.bobPoints || 0} BOB`}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem',
                                                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                                    color: theme.palette.primary.main,
                                                    border: '1px solid rgba(0, 255, 136, 0.3)',
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
                                    <MenuItem
                                        component={Link}
                                        href="/leaderboard"
                                        onClick={handleMenuClose}
                                        sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}
                                    >
                                        <LocalFireDepartment sx={{ mr: 2, color: theme.palette.primary.main }} />
                                        Believer Dashboard
                                    </MenuItem>

                                    {/* Connect X if not connected */}
                                    {!hasTwitter && (
                                        <MenuItem onClick={() => { connectTwitter(); handleMenuClose(); }} sx={{ '&:hover': { backgroundColor: 'rgba(0, 255, 136, 0.1)' } }}>
                                            <X sx={{ mr: 2, color: theme.palette.primary.main }} />
                                            Connect X Account
                                        </MenuItem>
                                    )}

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