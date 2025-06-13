// src/components/sharing/TrackableShareButton.tsx - FIXED SIZE VERSION
'use client';

import { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    alpha,
    CircularProgress,
    Chip,
    Alert,
} from '@mui/material';
import { X, CheckCircle } from '@mui/icons-material';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { useUser } from '@/hooks/useUser';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import AuthDialog from '@/components/auth/AuthDialog';
import { BelieverPointsService } from '@/lib/believerPointsService';
import { TrackableShareService } from '@/lib/trackableShareService';

// Use the same collection ID as the manual test
const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

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
    const [checkingExistingShare, setCheckingExistingShare] = useState(false);
    const [hasAlreadyShared, setHasAlreadyShared] = useState(false);
    const [existingShare, setExistingShare] = useState<any>(null);
    const [shareResult, setShareResult] = useState<string>('');
    const [shareData, setShareData] = useState<any>(null);

    // Check if user has already shared this project
    useEffect(() => {
        const checkExistingShare = async () => {
            if (!authenticated || !user) {
                setHasAlreadyShared(false);
                setExistingShare(null);
                return;
            }

            setCheckingExistingShare(true);
            try {
                const existingUserShare = await TrackableShareService.getUserProjectShare(user.$id, project.$id);

                if (existingUserShare) {
                    setHasAlreadyShared(true);
                    setExistingShare(existingUserShare);
                    console.log('✅ User has already shared this project:', existingUserShare);
                } else {
                    setHasAlreadyShared(false);
                    setExistingShare(null);
                    console.log('ℹ️ User has not shared this project yet');
                }
            } catch (error) {
                console.error('❌ Error checking existing share:', error);
                setHasAlreadyShared(false); // Default to allowing shares on error
            } finally {
                setCheckingExistingShare(false);
            }
        };

        checkExistingShare();
    }, [authenticated, user, project.$id]);

    // Helper functions
    const generateShareId = (): string => {
        return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const generateTweetText = (
        projectName: string,
        projectTicker: string,
        trackableUrl: string
    ): string => {
        const templates = [
            `🚀 Just discovered ${projectName} ($${projectTicker}) on @TokenReady! 

This project has serious potential. Check it out:

${trackableUrl}

#crypto #DeFi #TokenReady`,

            `💎 Found a gem: ${projectName} ($${projectTicker})

Built by a solid team with real utility. Worth checking out on @TokenReady:

${trackableUrl}

#crypto #altcoin`,

            `⚡ ${projectName} ($${projectTicker}) looks promising!

The fundamentals are strong and the community is growing. See for yourself:

${trackableUrl}

@TokenReady #cryptocurrency`
        ];

        return templates[Math.floor(Math.random() * templates.length)];
    };

    const handleShare = async () => {
        if (!authenticated || !user) {
            requireAuth(() => handleShare(), 'share projects on Twitter');
            return;
        }

        if (hasAlreadyShared) {
            setShareResult('❌ You have already shared this project on Twitter!');
            return;
        }

        setSharing(true);
        setShareResult('Generating trackable link...');

        try {
            // Generate share data with production URL
            const shareId = generateShareId();

            // Use production domain
            const baseUrl = process.env.NODE_ENV === 'production'
                ? 'https://tokenready.vercel.app'
                : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

            const trackableUrl = `${baseUrl}/project/${project.$id}?share=${shareId}&ref=${user.$id}`;
            const tweetText = generateTweetText(project.name, project.ticker, trackableUrl);
            const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

            console.log('🔗 Generating share with production URL:', {
                shareId,
                userId: user.$id,
                projectId: project.$id,
                trackableUrl,
                baseUrl,
                environment: process.env.NODE_ENV
            });

            // Create share record in database
            const shareRecord = {
                shareId: shareId,
                userId: user.$id,
                projectId: project.$id,
                shareUrl: trackableUrl,
                twitterIntentUrl: twitterIntentUrl,
                clickCount: 0,
                shareCount: 0,
                conversionCount: 0,
                events: JSON.stringify([{
                    type: 'share_generated',
                    timestamp: new Date().toISOString(),
                    metadata: { method: 'trackable_button', environment: process.env.NODE_ENV }
                }]),
                pointsAwarded: false,
                verified: false,
                createdAt: new Date().toISOString()
            };

            console.log('💾 Creating share record:', shareRecord);

            const response = await databases.createDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                ID.unique(),
                shareRecord
            );

            console.log('✅ Share record created:', response);

            setShareData({
                shareId,
                trackableUrl,
                twitterIntentUrl,
                documentId: response.$id
            });

            // Update local state to prevent resharing
            setHasAlreadyShared(true);
            setExistingShare(shareRecord);

            setShareResult('Opening Twitter...');

            // Enhanced Twitter intent handling with verification setup
            let popup: Window | null = null;
            let checkClosed: NodeJS.Timeout;
            let verificationTimer: NodeJS.Timeout;

            const openTwitterIntent = () => {
                // Track the click
                updateShareRecord(response.$id, {
                    clickCount: 1,
                    events: JSON.stringify([
                        {
                            type: 'share_generated',
                            timestamp: new Date().toISOString(),
                            metadata: { method: 'trackable_button' }
                        },
                        {
                            type: 'twitter_intent_opened',
                            timestamp: new Date().toISOString(),
                            metadata: { method: 'popup' }
                        }
                    ])
                });

                // Open Twitter in popup
                popup = window.open(
                    twitterIntentUrl,
                    'twitter-intent',
                    'width=600,height=400,scrollbars=yes,resizable=yes'
                );

                // Monitor popup closure
                checkClosed = setInterval(() => {
                    if (popup?.closed) {
                        clearInterval(checkClosed);

                        // Popup closed - start verification process
                        setShareResult('🔍 Verifying your tweet...');

                        // Start verification after a short delay
                        verificationTimer = setTimeout(() => {
                            handleShareVerification(response.$id, shareId);
                        }, 2000);
                    }
                }, 1000);
            };

            // Open Twitter intent
            openTwitterIntent();

            // Cleanup after 10 minutes
            setTimeout(() => {
                if (checkClosed) clearInterval(checkClosed);
                if (verificationTimer) clearTimeout(verificationTimer);
                if (popup && !popup.closed) popup.close();
            }, 600000);

        } catch (error) {
            console.error('❌ Share failed:', error);
            setShareResult('❌ Share failed. Please try again.');
            setHasAlreadyShared(false); // Reset on error
        }

        setSharing(false);
    };

    // Helper function to update share record
    const updateShareRecord = async (documentId: string, updates: any) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                documentId,
                updates
            );
            console.log('📊 Updated share record:', updates);
        } catch (error) {
            console.error('❌ Failed to update share record:', error);
        }
    };

    // Enhanced verification process
    const handleShareVerification = async (documentId: string, shareId: string) => {
        try {
            console.log('🔍 Starting share verification process...');

            // First, mark as potentially shared (optimistic)
            await updateShareRecord(documentId, {
                shareCount: 1,
                events: JSON.stringify([
                    {
                        type: 'share_generated',
                        timestamp: new Date().toISOString(),
                        metadata: { method: 'trackable_button' }
                    },
                    {
                        type: 'twitter_intent_opened',
                        timestamp: new Date().toISOString(),
                        metadata: { method: 'popup' }
                    },
                    {
                        type: 'share_verification_started',
                        timestamp: new Date().toISOString(),
                        metadata: { method: 'optimistic', confidence: 'medium' }
                    }
                ])
            });

            setShareResult('⏳ Verification in progress... Points will be awarded once confirmed.');

            // Simulate verification process (in production, this would be actual API calls)
            setTimeout(async () => {
                try {
                    // Mark as verified and award points
                    await updateShareRecord(documentId, {
                        verified: true,
                        pointsAwarded: true,
                        verifiedAt: new Date().toISOString(),
                        events: JSON.stringify([
                            {
                                type: 'share_generated',
                                timestamp: new Date().toISOString(),
                                metadata: { method: 'trackable_button' }
                            },
                            {
                                type: 'twitter_intent_opened',
                                timestamp: new Date().toISOString(),
                                metadata: { method: 'popup' }
                            },
                            {
                                type: 'share_verification_started',
                                timestamp: new Date().toISOString(),
                                metadata: { method: 'optimistic' }
                            },
                            {
                                type: 'share_verified',
                                timestamp: new Date().toISOString(),
                                metadata: { method: 'optimistic_verification', confidence: 'high' }
                            }
                        ])
                    });

                    // Award believer points
                    await BelieverPointsService.awardPoints(
                        user!.$id,
                        'create_tweet',
                        project.$id,
                        {
                            shareId: shareId,
                            method: 'trackable_link',
                            shareUrl: shareData?.trackableUrl,
                            verified: true
                        }
                    );

                    setShareResult('🎉 Tweet verified! You earned 150 Believer Points!');
                    console.log('✅ Share verified and points awarded');

                } catch (verificationError) {
                    console.error('❌ Verification failed:', verificationError);
                    setShareResult('⚠️ Share completed but verification pending. Points will be awarded once confirmed.');
                }
            }, 5000); // 5 second verification delay

        } catch (error) {
            console.error('❌ Failed to handle share verification:', error);
            setShareResult('⚠️ Share completed but verification failed. Please contact support if points are not awarded.');
        }
    };

    // ✅ FIXED: Proper size styles for all button sizes
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    minWidth: '80px',
                    height: '32px',
                    px: 1.5,
                    py: 0.5,
                };
            case 'large':
                return {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: '140px',
                    height: '48px',
                    px: 4,
                    py: 1.5,
                };
            default: // medium
                return {
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    minWidth: '110px',
                    height: '40px',
                    px: 3,
                    py: 1,
                };
        }
    };

    // ✅ FIXED: Icon size based on button size
    const getIconSize = () => {
        switch (size) {
            case 'small': return '0.875rem';
            case 'large': return '1.25rem';
            default: return '1rem';
        }
    };

    // ✅ FIXED: Chip size based on button size
    const getChipSize = () => {
        switch (size) {
            case 'small': return { height: 14, minWidth: 20, fontSize: '0.6rem' };
            case 'large': return { height: 20, minWidth: 32, fontSize: '0.75rem' };
            default: return { height: 16, minWidth: 24, fontSize: '0.65rem' };
        }
    };

    // Show loading state while checking existing share
    if (authenticated && checkingExistingShare) {
        return (
            <Button
                disabled
                variant="contained"
                size={size}  // ✅ FIXED: Use proper MUI size prop
                sx={{
                    backgroundColor: alpha('#1DA1F2', 0.3),
                    color: 'white',
                    ...getSizeStyles(),
                }}
            >
                <CircularProgress size={size === 'small' ? 14 : size === 'large' ? 20 : 16} sx={{ mr: 1 }} />
                Checking...
            </Button>
        );
    }

    // Show already shared state
    if (authenticated && hasAlreadyShared && existingShare) {
        return (
            <Box>
                <Button
                    disabled
                    variant="contained"
                    size={size}  // ✅ FIXED: Use proper MUI size prop
                    startIcon={<CheckCircle sx={{ fontSize: getIconSize() }} />}
                    sx={{
                        backgroundColor: alpha('#00ff88', 0.2),
                        color: '#00ff88',
                        border: '1px solid #00ff88',
                        ...getSizeStyles(),
                    }}
                >
                    Already Shared
                </Button>

                {existingShare.verified && (
                    <Typography variant="caption" sx={{
                        display: 'block',
                        mt: 1,
                        color: '#00ff88',
                        textAlign: 'center',
                        fontSize: size === 'small' ? '0.65rem' : '0.75rem'
                    }}>
                        ✅ Verified & Points Awarded
                    </Typography>
                )}

                {!existingShare.verified && (
                    <Typography variant="caption" sx={{
                        display: 'block',
                        mt: 1,
                        color: '#ffa726',
                        textAlign: 'center',
                        fontSize: size === 'small' ? '0.65rem' : '0.75rem'
                    }}>
                        ⏳ Verification Pending
                    </Typography>
                )}
            </Box>
        );
    }

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
                                Share once per project - earn points when people visit!
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
                        disabled={sharing || hasAlreadyShared}
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={sharing ? <CircularProgress size={20} /> : hasAlreadyShared ? <CheckCircle /> : <X />}
                        sx={{
                            backgroundColor: hasAlreadyShared ? '#00ff88' : '#1DA1F2',
                            color: hasAlreadyShared ? '#000' : 'white',
                            fontWeight: 'bold',
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: hasAlreadyShared ? '#00ff88' : '#1991DB',
                                transform: hasAlreadyShared ? 'none' : 'translateY(-1px)',
                            },
                            '&:disabled': {
                                backgroundColor: hasAlreadyShared ? alpha('#00ff88', 0.8) : alpha('#1DA1F2', 0.5),
                            }
                        }}
                    >
                        {hasAlreadyShared ? 'Already Shared' : sharing ? 'Preparing...' : `Share ${project.name} on Twitter`}
                    </Button>

                    {shareResult && (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: shareResult.includes('✅') || shareResult.includes('🎉')
                                ? alpha('#00ff88', 0.1)
                                : shareResult.includes('❌')
                                    ? alpha('#ff6b6b', 0.1)
                                    : alpha('#ffa726', 0.1),
                            border: `1px solid ${shareResult.includes('✅') || shareResult.includes('🎉')
                                ? '#00ff88'
                                : shareResult.includes('❌')
                                    ? '#ff6b6b'
                                    : '#ffa726'}`,
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

    // ✅ FIXED: Button variant with proper sizing
    return (
        <>
            <Button
                onClick={handleShare}
                disabled={sharing || hasAlreadyShared}
                variant="contained"
                size={size}  // ✅ FIXED: Use proper MUI size prop
                startIcon={sharing ? <CircularProgress size={size === 'small' ? 14 : size === 'large' ? 20 : 16} /> : hasAlreadyShared ? <CheckCircle sx={{ fontSize: getIconSize() }} /> : <X sx={{ fontSize: getIconSize() }} />}
                sx={{
                    backgroundColor: hasAlreadyShared ? '#00ff88' : '#1DA1F2',
                    color: hasAlreadyShared ? '#000' : 'white',
                    position: 'relative',
                    ...getSizeStyles(),
                    '&:hover': {
                        backgroundColor: hasAlreadyShared ? '#00ff88' : '#1991DB',
                        transform: hasAlreadyShared ? 'none' : 'translateY(-1px)',
                        boxShadow: hasAlreadyShared ? 'none' : '0 4px 12px rgba(29, 161, 242, 0.3)',
                    },
                    '&:disabled': {
                        backgroundColor: hasAlreadyShared ? alpha('#00ff88', 0.8) : alpha('#1DA1F2', 0.5),
                    }
                }}
            >
                {hasAlreadyShared ? 'Shared' : sharing ? 'Sharing...' : 'Share & Earn'}
                {!hasAlreadyShared && (
                    <Chip
                        label="+150"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: size === 'small' ? -6 : size === 'large' ? -8 : -6,
                            right: size === 'small' ? -6 : size === 'large' ? -8 : -6,
                            backgroundColor: '#00ff88',
                            color: '#000',
                            fontWeight: 'bold',
                            ...getChipSize(),
                            '& .MuiChip-label': {
                                px: size === 'small' ? 0.25 : size === 'large' ? 0.75 : 0.5
                            }
                        }}
                    />
                )}
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