'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Stack, CircularProgress } from '@mui/material';
import ProjectForm from '@/components/projects/ProjectForm';
import AuthDialog from '@/components/auth/AuthDialog';
import { theme } from '@/lib/theme';
import { useUser } from '@/hooks/useUser';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function SubmitPage() {
    const router = useRouter();
    const { authenticated, ready, loading } = useUser();
    const { requireAuth, showAuthDialog, hideAuthDialog, authMessage, login } = useAuthGuard();
    if (!ready || loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            }}>
                <CircularProgress size={60} sx={{ color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    Loading...
                </Typography>
            </Box>
        );
    }
    if (!authenticated) {
        return (
            <>
                <Container maxWidth="md" sx={{ py: 8 }}>
                    <Box sx={{
                        textAlign: 'center',
                        p: 6,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                        border: '1px solid rgba(0, 255, 136, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}>
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 4,
                                color: '#000',
                                fontSize: '3rem',
                            }}
                        >
                            🚀
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{
                                mb: 3,
                                background: `linear-gradient(135deg, #ffffff 0%, ${theme.palette.primary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                            }}
                        >
                            Submit Your Project
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 4, maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
                        >
                            Join the TokenReady community to submit your project for curation and launch scheduling.
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            Please login with X to access the project submission form.
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body2" sx={{ color: 'primary.main', mb: 2, fontWeight: 600 }}>
                                After logging in, you'll be able to:
                            </Typography>
                            <Box sx={{ textAlign: 'left', maxWidth: '400px', mx: 'auto' }}>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    📝 Submit detailed project information
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    🎯 Get community feedback and reviews
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    📊 Track your project's performance
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    🚀 Schedule your BelieverApp launch
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    💎 Earn BOB and Believer Points
                                </Typography>
                            </Box>
                        </Box>

                        <Box>
                            <button
                                onClick={() => requireAuth(() => { }, 'submit projects')}
                                style={{
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '16px 32px',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                🔐 Login with X to Continue
                            </button>
                        </Box>
                    </Box>
                </Container>
                <AuthDialog
                    open={showAuthDialog}
                    onClose={hideAuthDialog}
                    message={authMessage}
                    onLogin={() => login()}
                />
            </>
        );
    } else {
        return <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction='row' spacing={2} justifyContent='center' alignItems='center' sx={{ mb: 2 }}>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    🚀
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 2,
                        textAlign: 'center',
                        background: `linear-gradient(135deg, #ffffff 0%,${theme.palette.primary.main}  100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Submit Your Project to TokenReady
                </Typography>
            </Stack>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, textAlign: 'center' }}
            >
                Register to get curated by the community and schedule your BelieverApp launch.
            </Typography>

            <Box sx={{ mb: 4 }}>
                <ProjectForm />
            </Box>
        </Container>
    }
}
