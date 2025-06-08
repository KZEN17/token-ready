'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    alpha,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Star, Person } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { ReviewService, ReviewWithUser } from '@/lib/reviewService';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface RecentReviewsProps {
    projectId?: string;
    limit?: number;
    showProjectName?: boolean;
}

export default function RecentReviews({
    projectId,
    limit = 5,
    showProjectName = false
}: RecentReviewsProps) {
    const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);

            try {
                let reviewsData;

                if (projectId) {
                    // Get reviews for specific project
                    reviewsData = await ReviewService.getProjectReviews(projectId, limit);
                } else {
                    // Get recent reviews across all projects
                    reviewsData = await ReviewService.getRecentReviews(limit);
                }

                // Fetch user data for each review
                const reviewsWithUsers = await Promise.all(
                    reviewsData.map(async (review) => {
                        try {
                            const userResponse = await databases.getDocument(
                                DATABASE_ID,
                                USERS_COLLECTION_ID,
                                review.userId
                            );

                            return {
                                ...review,
                                user: {
                                    username: userResponse.username,
                                    displayName: userResponse.displayName,
                                    profileImage: userResponse.profileImage,
                                    followerCount: userResponse.followerCount,
                                    verified: userResponse.verified,
                                    isVerifiedKOL: userResponse.isVerifiedKOL,
                                    believerRank: userResponse.believerRank,
                                }
                            } as ReviewWithUser;
                        } catch (userError) {
                            console.error('Error fetching user data:', userError);
                            // Return review without user data if user fetch fails
                            return {
                                ...review,
                                user: {
                                    username: 'deleted_user',
                                    displayName: 'Deleted User',
                                    profileImage: '',
                                    followerCount: 0,
                                    verified: false,
                                    isVerifiedKOL: false,
                                    believerRank: 'Newcomer',
                                }
                            } as ReviewWithUser;
                        }
                    })
                );

                setReviews(reviewsWithUsers);
            } catch (error: any) {
                console.error('Error fetching reviews:', error);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [projectId, limit]);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return '#00ff88';
        if (rating >= 6) return '#ffa726';
        if (rating >= 4) return '#ff9800';
        return '#ff6b6b';
    };

    const truncateComment = (comment: string, maxLength = 120) => {
        if (comment.length <= maxLength) return comment;
        return comment.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress size={40} sx={{ color: '#00ff88', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        Loading reviews...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Alert
                        severity="error"
                        sx={{
                            backgroundColor: alpha('#ff6b6b', 0.1),
                            color: '#ff6b6b',
                            border: '1px solid #ff6b6b'
                        }}
                    >
                        {error}
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (reviews.length === 0) {
        return (
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Person sx={{ color: '#666', fontSize: '3rem', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                        No Reviews Yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        {projectId
                            ? 'Be the first to review this project!'
                            : 'No reviews have been submitted yet.'
                        }
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#00ff88', mb: 3, fontWeight: 'bold' }}>
                    📋 {projectId ? 'Project Reviews' : 'Latest Reviews'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {reviews.map((review, index) => (
                        <Box key={review.$id || index}>
                            {/* User Info Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={review.user?.profileImage || undefined}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: '#00ff88',
                                            color: '#000',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {review.user?.displayName?.charAt(0) || '?'}
                                    </Avatar>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                                @{review.user?.username || 'unknown'}
                                            </Typography>
                                            {review.user?.verified && (
                                                <Chip
                                                    label="✓"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha('#00ff88', 0.2),
                                                        color: '#00ff88',
                                                        fontSize: '0.7rem',
                                                        height: 18,
                                                        minWidth: 18,
                                                        '& .MuiChip-label': { px: 0.5 }
                                                    }}
                                                />
                                            )}
                                            {review.user?.isVerifiedKOL && (
                                                <Chip
                                                    label="KOL"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha('#ff6b6b', 0.2),
                                                        color: '#ff6b6b',
                                                        fontSize: '0.65rem',
                                                        height: 18,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#888' }}>
                                            {review.user?.believerRank} • {review.user?.followerCount?.toLocaleString()} followers
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ textAlign: 'right' }}>
                                    <Chip
                                        label={`${review.believerPoints} BP`}
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha('#00ff88', 0.1),
                                            color: '#00ff88',
                                            border: '1px solid #00ff88',
                                            fontSize: '0.7rem',
                                            mb: 0.5,
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                        {formatTimeAgo(review.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Review Content */}
                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#b0b0b0',
                                        mb: 2,
                                        fontStyle: 'italic',
                                        lineHeight: 1.5,
                                        backgroundColor: alpha('#00ff88', 0.03),
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid #333',
                                    }}
                                >
                                    "{truncateComment(review.comment)}"
                                </Typography>
                            </Box>

                            {/* Rating and Investment */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Star fontSize="small" sx={{ color: getRatingColor(review.rating) }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: getRatingColor(review.rating),
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {review.rating}/10
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        •
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                        {review.investment.toLocaleString()} $BOB
                                    </Typography>
                                </Box>

                                {showProjectName && (
                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                        Project ID: {review.projectId.substring(0, 8)}...
                                    </Typography>
                                )}
                            </Box>

                            {index < reviews.length - 1 && (
                                <Divider sx={{ mt: 3, borderColor: '#333' }} />
                            )}
                        </Box>
                    ))}
                </Box>

                {reviews.length >= limit && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                            Showing latest {limit} reviews
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}