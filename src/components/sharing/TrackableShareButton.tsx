// src/components/sharing/TrackableShareButton.tsx
'use client';

import { useState } from 'react';
import {
    Button,
    Box,
    Typography,
    alpha,
    CircularProgress,
    Chip,
} from '@mui/material';
import { X } from '@mui/icons-material';
import { TrackableShareService } from '@/lib/trackableShareService';
import { useUser } from '@/hooks/useUser';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import AuthDialog from '@/components/auth/AuthDialog';
import { ShareGenerationResult } from '@/lib/types';

interface TrackableShareButtonProps {
    project: {
        $id: string;
        name: string;
        ticker: string;
    };
    variant?: 'button' | 'card';
    size?: 'small' | 'medium' | 'large';
}

export default function TrackableShareButton({
    project,
    variant = 'button',
    size = 'medium'
}: TrackableShareButtonProps) {
    const { user, authenticated } = useUser();
    const { requireAuth, showAuthDialog, hideAuthDialog, authMessage, login } = useAuthGuard();

    const [sharing, setSharing] = useState(false);
    const [shareResult, setShareResult] = useState<string>('');
    const [shareData, setShareData] = useState<ShareGenerationResult | null>(null);

    const handleShare = async () => {
        if (!authenticated || !user) {
            requireAuth(() => handleShare(), 'share projects on Twitter');
            return;
        }

        setSharing(true);
        setShareResult('Generating trackable link...');

        try {
            // Generate trackable share
            const result = await TrackableShareService.generateTrackableShare(
                user.$id,
                project.$id,
                project.name,
                project.ticker
            );

            setShareData(result);
            setShareResult('Opening Twitter...');

            // Set up popup tracking
            const { openTwitterIntent, cleanup } =
                TrackableShareService.setupTwitterIntentTracking(result.shareId);

            // Open Twitter intent
            openTwitterIntent(result.twitterIntentUrl);

            // Show success message
            setShareResult('✅ Twitter opened! You\'ll earn 150 points if someone visits via your shared link.');

            // Cleanup after 5 minutes
            setTimeout(cleanup, 300000);

        } catch (error) {
            console.error('Share failed:', error);
            setShareResult('❌ Share failed. Please try again.');
        }

        setSharing(false);
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                };
            case 'large':
                return {
                    padding: '16px 32px',
                    fontSize: '1.1rem',
                };
            default:
                return {
                    padding: '12px 24px',
                    fontSize: '1rem',
                };
        }
    };

    if (variant === 'card') {
        return (
            <>
                <Box sx={{
                    padding: '20px',
                    border: '1px solid #1DA1F2',
                    borderRadius: '12px',
                    backgroundColor: alpha('#1DA1F2', 0.05),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: alpha('#1DA1F2', 0.1),
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(29, 161, 242, 0.2)',
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: '#1DA1F2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}>
                            <X fontSize="large" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1DA1F2' }}>
                                📈 Smart Share & Earn
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                We track your shares automatically - earn points when people visit!
                            </Typography>
                        </Box>
                        <Chip
                            label="+150 Points"
                            sx={{
                                backgroundColor: '#00ff88',
                                color: '#000',
                                fontWeight: 'bold',
                            }}
                        />
                    </Box>

                    <Button
                        onClick={handleShare}
                        disabled={sharing}
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={sharing ? <CircularProgress size={20} /> : <X />}
                        sx={{
                            backgroundColor: '#1DA1F2',
                            color: 'white',
                            fontWeight: 'bold',
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: '#1991DB',
                                transform: 'translateY(-1px)',
                            },
                            '&:disabled': {
                                backgroundColor: alpha('#1DA1F2', 0.5),
                            }
                        }}
                    >
                        {sharing ? 'Preparing...' : `Share ${project.name} on Twitter`}
                    </Button>

                    {shareResult && (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: shareResult.includes('✅')
                                ? alpha('#00ff88', 0.1)
                                : alpha('#ff6b6b', 0.1),
                            border: `1px solid ${shareResult.includes('✅') ? '#00ff88' : '#ff6b6b'}`,
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                        }}>
                            {shareResult}
                        </Box>
                    )}

                    {shareData && (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: alpha('#000', 0.2),
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: '#888'
                        }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                                🔗 Tracking ID: {shareData.shareId.slice(-8)}
                            </Typography>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                wordBreak: 'break-all',
                                lineHeight: 1.3
                            }}>
                                📊 Link: {shareData.trackableUrl}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <AuthDialog
                    open={showAuthDialog}
                    onClose={hideAuthDialog}
                    onLogin={login}
                    message={authMessage}
                />
            </>
        );
    }

    // Button variant
    return (
        <>
            <Button
                onClick={handleShare}
                disabled={sharing}
                variant="contained"
                startIcon={sharing ? <CircularProgress size={16} /> : <X />}
                sx={{
                    backgroundColor: '#1DA1F2',
                    color: 'white',
                    fontWeight: 'bold',
                    position: 'relative',
                    ...getSizeStyles(),
                    '&:hover': {
                        backgroundColor: '#1991DB',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(29, 161, 242, 0.3)',
                    },
                    '&:disabled': {
                        backgroundColor: alpha('#1DA1F2', 0.5),
                    }
                }}
            >
                {sharing ? 'Sharing...' : 'Share & Earn'}
                <Chip
                    label="+150"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#00ff88',
                        color: '#000',
                        fontSize: '0.6rem',
                        height: 16,
                        minWidth: 24,
                        fontWeight: 'bold',
                        '& .MuiChip-label': { px: 0.5 }
                    }}
                />
            </Button>

            <AuthDialog
                open={showAuthDialog}
                onClose={hideAuthDialog}
                onLogin={login}
                message={authMessage}
            />
        </>
    );
}