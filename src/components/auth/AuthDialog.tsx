// src/components/auth/AuthDialog.tsx
'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    alpha,
} from '@mui/material';
import { Close, X, Login } from '@mui/icons-material';

interface AuthDialogProps {
    open: boolean;
    onClose: () => void;
    onLogin: () => void;
    message: string;
}

export default function AuthDialog({ open, onClose, onLogin, message }: AuthDialogProps) {
    const handleLogin = () => {
        onLogin();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 1,
                color: 'primary.main',
                fontWeight: 700,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Login />
                    Authentication Required
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: alpha('#ff6b6b', 0.1),
                            color: 'secondary.main',
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            color: '#000',
                            fontSize: '2rem',
                        }}
                    >
                        🔐
                    </Box>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Join the TokenReady Community
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
                        {message}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Connect with X to:
                    </Typography>

                    <Box sx={{ textAlign: 'left', mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            • 📝 Submit and review projects
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            • 👍 Upvote your favorite projects
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            • 💎 Earn BOB and Believer Points
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            • 🏆 Climb the leaderboard
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            • 🎯 Get early access to launches
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderColor: 'text.secondary',
                        color: 'text.secondary',
                        '&:hover': {
                            borderColor: 'secondary.main',
                            backgroundColor: alpha('#ff6b6b', 0.1),
                        }
                    }}
                >
                    Maybe Later
                </Button>
                <Button
                    onClick={handleLogin}
                    variant="contained"
                    startIcon={<X />}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                        color: '#000',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)',
                        }
                    }}
                >
                    Login with X
                </Button>
            </DialogActions>
        </Dialog>
    );
}