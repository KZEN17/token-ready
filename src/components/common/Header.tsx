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
        hasWallet,
        walletAddress,
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
            <AppBar position="sticky">
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
                                    backgroundColor: `${theme.palette.primary.main}15`,
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
                                '&:hover': {
                                    backgroundColor: `${theme.palette.primary.main}15`,
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
                                    backgroundColor: `${theme.palette.primary.main}15`,
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
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: `${theme.palette.primary.main}08`,
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
                                        backgroundColor: `${theme.palette.primary.main}08`,
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
                                        backgroundColor: `${theme.palette.primary.main}08`,
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
                                    backgroundColor: `${theme.palette.primary.main}08`,
                                },
                            }}
                        >
                            Leaderboard
                        </Button>
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
                                    color: '#fff',
                                    background: '#000',
                                }}
                            >
                                {loading ? 'Connecting...' : 'Login with X'}
                            </Button>
                        ) : (
                            // Authenticated - show user profile and wallet
                            <>
                                {/* Wallet Connection Status */}
                                {hasWallet ? (
                                    <Chip
                                        icon={<AccountBalanceWallet />}
                                        label={formatWalletAddress(walletAddress!)}
                                        size="small"
                                        color="success"
                                        sx={{
                                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                                            display: { xs: 'none', sm: 'flex' },
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
                                        }}
                                    >
                                        Connect Wallet
                                    </Button>
                                )}

                                {/* User Menu */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {/* User Points - Desktop only */}
                                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            icon={<Stars />}
                                            label={`${user?.bobPoints || 0} BOB`}
                                            size="small"
                                            color="primary"
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                        <Chip
                                            icon={<TrendingUp />}
                                            label={`${user?.believerPoints || 0} BP`}
                                            size="small"
                                            color="secondary"
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                    </Box>

                                    {/* User Avatar and Name */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            p: 0.5,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: `${theme.palette.primary.main}15`,
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
                                            }}
                                        >
                                            {!userAvatar && (userDisplayName.charAt(0) || 'U')}
                                        </Avatar>
                                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                                                {userDisplayName}
                                                {isKOL && (
                                                    <Chip
                                                        label="KOL"
                                                        size="small"
                                                        color="secondary"
                                                        sx={{ ml: 1, fontSize: '0.6rem', height: 16 }}
                                                    />
                                                )}
                                            </Typography>
                                            {hasTwitter && (
                                                <Typography variant="caption" color="text.secondary">
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
                                                    color="secondary"
                                                    sx={{ ml: 1, fontSize: '0.6rem', height: 16 }}
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
                                                color="primary"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                            <Chip
                                                icon={<TrendingUp />}
                                                label={`${user?.believerPoints || 0} Believer Points`}
                                                size="small"
                                                color="secondary"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    </Box>

                                    <Divider />

                                    {/* Menu Items */}
                                    <MenuItem onClick={handleMenuClose}>
                                        <AccountBox sx={{ mr: 2 }} />
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        <Stars sx={{ mr: 2 }} />
                                        My Reviews ({user?.reviewsCount || 0})
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        <TrendingUp sx={{ mr: 2 }} />
                                        My Projects ({user?.projectsSupported || 0})
                                    </MenuItem>

                                    {/* Connect X if not connected */}
                                    {!hasTwitter && (
                                        <MenuItem onClick={() => { connectTwitter(); handleMenuClose(); }}>
                                            <X sx={{ mr: 2 }} />
                                            Connect X Account
                                        </MenuItem>
                                    )}

                                    {/* Connect Wallet if not connected */}
                                    {!hasWallet && (
                                        <MenuItem onClick={handleMenuClose}>
                                            <AccountBalanceWallet sx={{ mr: 2 }} />
                                            Connect Wallet
                                        </MenuItem>
                                    )}

                                    <MenuItem onClick={handleMenuClose}>
                                        <Settings sx={{ mr: 2 }} />
                                        Settings
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem onClick={handleLogout}>
                                        <Logout sx={{ mr: 2 }} />
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