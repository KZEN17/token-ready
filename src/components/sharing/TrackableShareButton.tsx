// src/components/sharing/TrackableShareButton.tsx - FIXED VERSION
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
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { useUser } from '@/hooks/useUser';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import AuthDialog from '@/components/auth/AuthDialog';
import { BelieverPointsService } from '@/lib/believerPointsService';

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
    const [shareResult, setShareResult] = useState<string>('');
    const [shareData, setShareData] = useState<any>(null);

    // Helper functions (same as TrackableShareService but simplified)
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

        setSharing(true);
        setShareResult('Generating trackable link...');

        try {
            // Generate share data (matching the manual test format exactly)
            const shareId = generateShareId();
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tokenready.io';
            const trackableUrl = `${baseUrl}/project/${project.$id}?share=${shareId}&ref=${user.$id}`;
            const tweetText = generateTweetText(project.name, project.ticker, trackableUrl);
            const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

            console.log('🔗 Generating share with data:', {
                shareId,
                userId: user.$id,
                projectId: project.$id,
                trackableUrl,
                twitterIntentUrl
            });

            // Create share record in database (using EXACT same format as manual test)
            const shareRecord = {
                shareId: shareId,
                userId: user.$id, // CRITICAL: Use user.$id exactly like manual test
                projectId: project.$id,
                shareUrl: trackableUrl,
                twitterIntentUrl: twitterIntentUrl,
                clickCount: 0, // Start at 0, will increment when clicked
                shareCount: 0,
                conversionCount: 0,
                events: JSON.stringify([{
                    type: 'share_generated',
                    timestamp: new Date().toISOString(),
                    metadata: { method: 'trackable_button' }
                }]),
                pointsAwarded: false, // Will be set to true when points are awarded
                verified: false, // Will be set to true when share is verified
                createdAt: new Date().toISOString()
            };

            console.log('💾 Creating share record:', shareRecord);

            // Save to database (same method as manual test)
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

            setShareResult('Opening Twitter...');

            // Set up popup tracking
            let popup: Window | null = null;
            let checkClosed: NodeJS.Timeout;

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

                        // Popup closed - optimistically award points
                        setTimeout(() => {
                            handleShareCompletion(response.$id);
                        }, 1000);
                    }
                }, 1000);
            };

            // Open Twitter intent
            openTwitterIntent();

            // Show success message
            setShareResult('✅ Twitter opened! You\'ll earn 150 points when someone visits via your shared link.');

            // Cleanup after 5 minutes
            setTimeout(() => {
                if (checkClosed) clearInterval(checkClosed);
                if (popup && !popup.closed) popup.close();
            }, 300000);

        } catch (error) {
            console.error('❌ Share failed:', error);
            setShareResult('❌ Share failed. Please try again.');
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

    // Handle share completion (when popup closes)
    const handleShareCompletion = async (documentId: string) => {
        try {
            console.log('🎯 Share completion detected, awarding points optimistically...');

            // Update share record to mark as verified and award points
            await updateShareRecord(documentId, {
                verified: true,
                pointsAwarded: true,
                verifiedAt: new Date().toISOString(),
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
                        type: 'share_completed',
                        timestamp: new Date().toISOString(),
                        metadata: { method: 'popup_closed', confidence: 'optimistic' }
                    }
                ])
            });

            // Award believer points
            try {
                await BelieverPointsService.awardPoints(
                    user!.$id,
                    'create_tweet',
                    project.$id,
                    {
                        shareId: shareData?.shareId,
                        method: 'trackable_link',
                        shareUrl: shareData?.trackableUrl
                    }
                );

                setShareResult('🎉 Success! You earned 150 Believer Points for sharing!');
                console.log('✅ Points awarded successfully');
            } catch (pointsError) {
                console.error('❌ Failed to award points:', pointsError);
                setShareResult('✅ Share completed! (Points will be awarded when verified)');
            }

        } catch (error) {
            console.error('❌ Failed to handle share completion:', error);
        }
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
                            backgroundColor: shareResult.includes('✅') || shareResult.includes('🎉')
                                ? alpha('#00ff88', 0.1)
                                : alpha('#ff6b6b', 0.1),
                            border: `1px solid ${shareResult.includes('✅') || shareResult.includes('🎉') ? '#00ff88' : '#ff6b6b'}`,
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