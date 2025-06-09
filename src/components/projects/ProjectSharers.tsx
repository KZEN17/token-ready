// src/components/projects/ProjectSharers.tsx 
'use client';

import {
    Box,
    Typography,
    Avatar,
    AvatarGroup,
    Tooltip,
    CircularProgress,
    Chip,
    Stack,
    alpha,
} from '@mui/material';
import { X, Share, Verified } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { TrackableShareService } from '@/lib/trackableShareService';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite';

interface ProjectSharer {
    userId: string; // This maps to the user's $id in the users collection
    shareId: string;
    verified: boolean;
    pointsAwarded: boolean;
    createdAt: string;
    user?: {
        username: string;
        displayName: string;
        profileImage: string;
        followerCount: number;
        isVerifiedKOL: boolean;
    };
}

interface ProjectSharersProps {
    projectId: string;
    compact?: boolean;
    limit?: number;
}

export default function ProjectSharers({
    projectId,
    compact = false,
    limit = 10
}: ProjectSharersProps) {
    const [sharers, setSharers] = useState<ProjectSharer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjectSharers();
    }, [projectId]);

    const fetchProjectSharers = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log(`🔍 Fetching sharers for project: ${projectId}`);

            // Get users who shared this project
            const shareData = await TrackableShareService.getProjectSharers(projectId, limit);

            console.log(`📊 Found ${shareData.length} shares for project ${projectId}:`, shareData);

            if (shareData.length === 0) {
                setSharers([]);
                setLoading(false);
                return;
            }

            // Fetch user data for each sharer
            const sharersWithUserData = await Promise.all(
                shareData.map(async (share) => {
                    try {
                        console.log(`👤 Fetching user data for userId: ${share.userId}`);

                        // FIXED: Use the userId (which is the user's $id) to get the user document
                        const userResponse = await databases.getDocument(
                            DATABASE_ID,
                            USERS_COLLECTION_ID,
                            share.userId // This is the user's document $id
                        );

                        console.log(`✅ User data found:`, {
                            id: userResponse.$id,
                            username: userResponse.username,
                            displayName: userResponse.displayName
                        });

                        return {
                            ...share,
                            user: {
                                username: userResponse.username || 'anonymous',
                                displayName: userResponse.displayName || 'Anonymous User',
                                profileImage: userResponse.profileImage || '',
                                followerCount: userResponse.followerCount || 0,
                                isVerifiedKOL: userResponse.isVerifiedKOL || false,
                            }
                        } as ProjectSharer;
                    } catch (userError) {
                        console.error(`❌ Error fetching user data for ${share.userId}:`, userError);
                        // Return sharer without user data if user fetch fails
                        return {
                            ...share,
                            user: {
                                username: 'deleted_user',
                                displayName: 'Deleted User',
                                profileImage: '',
                                followerCount: 0,
                                isVerifiedKOL: false,
                            }
                        } as ProjectSharer;
                    }
                })
            );

            console.log(`✅ Final sharers with user data:`, sharersWithUserData);
            setSharers(sharersWithUserData);
        } catch (err) {
            console.error('❌ Error fetching project sharers:', err);
            setError('Failed to load sharers');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    // Always show loading state if loading
    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#1DA1F2' }} />
                <Typography variant="caption" sx={{ color: '#888' }}>
                    Loading sharers...
                </Typography>
            </Box>
        );
    }

    // Show error state if there's an error
    if (error) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#ff6b6b' }}>
                    ❌ {error}
                </Typography>
            </Box>
        );
    }

    // Show empty state if no sharers
    if (sharers.length === 0) {
        return compact ? null : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
                <X sx={{ color: '#666', fontSize: '2rem', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                    No shares yet
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                    Be the first to share this project!
                </Typography>
            </Box>
        );
    }

    if (compact) {
        // Compact version for project cards
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <X sx={{ color: '#1DA1F2', fontSize: '1rem' }} />
                <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                    {sharers.map((sharer) => (
                        <Tooltip
                            key={sharer.shareId}
                            title={`@${sharer.user?.username} shared this ${formatTimeAgo(sharer.createdAt)}`}
                            arrow
                        >
                            <Avatar
                                src={sharer.user?.profileImage || undefined}
                                sx={{
                                    border: sharer.user?.isVerifiedKOL ? '2px solid #ff6b6b' : '1px solid #1DA1F2',
                                    cursor: 'pointer',
                                }}
                            >
                                {sharer.user?.displayName?.charAt(0) || '?'}
                            </Avatar>
                        </Tooltip>
                    ))}
                </AvatarGroup>
                <Typography variant="caption" sx={{ color: '#888' }}>
                    {sharers.length} shared
                </Typography>
            </Box>
        );
    }

    // Full version for project detail pages
    return (
        <Box sx={{
            p: 3,
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #1DA1F2',
            borderRadius: 3,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Share sx={{ color: '#1DA1F2' }} />
                <Typography variant="h6" sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                    📢 Shared on Twitter ({sharers.length})
                </Typography>
            </Box>

            <Stack spacing={2}>
                {sharers.map((sharer) => (
                    <Box
                        key={sharer.shareId}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            backgroundColor: alpha('#1DA1F2', 0.05),
                            borderRadius: 2,
                            border: '1px solid rgba(29, 161, 242, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: alpha('#1DA1F2', 0.1),
                                transform: 'translateY(-1px)',
                            }
                        }}
                    >
                        <Avatar
                            src={sharer.user?.profileImage || undefined}
                            sx={{
                                width: 48,
                                height: 48,
                                border: sharer.user?.isVerifiedKOL ? '2px solid #ff6b6b' : '1px solid #1DA1F2',
                            }}
                        >
                            {sharer.user?.displayName?.charAt(0) || '?'}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {sharer.user?.displayName || 'Anonymous'}
                                </Typography>
                                {sharer.user?.isVerifiedKOL && (
                                    <Chip
                                        label="KOL"
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha('#ff6b6b', 0.2),
                                            color: '#ff6b6b',
                                            fontSize: '0.7rem',
                                            height: 18,
                                        }}
                                    />
                                )}
                                {sharer.verified && (
                                    <Verified sx={{ color: '#00ff88', fontSize: '1rem' }} />
                                )}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#1DA1F2' }}>
                                @{sharer.user?.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                                {sharer.user?.followerCount?.toLocaleString()} followers • Shared {formatTimeAgo(sharer.createdAt)}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                            <X sx={{ color: '#1DA1F2', mb: 1 }} />
                            {sharer.pointsAwarded && (
                                <Chip
                                    label="+150 Points"
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha('#00ff88', 0.2),
                                        color: '#00ff88',
                                        fontSize: '0.7rem',
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                ))}
            </Stack>

            {sharers.length >= limit && (
                <Typography variant="caption" sx={{ color: '#888', textAlign: 'center', display: 'block', mt: 2 }}>
                    Showing recent {limit} shares
                </Typography>
            )}
        </Box>
    );
}