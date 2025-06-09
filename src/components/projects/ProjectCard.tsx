// src/components/projects/ProjectCard.tsx (Fixed with review status checking and consistent heights)
'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Avatar,
    IconButton,
    Stack,
    Grid,
    alpha,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    ThumbUp,
    ThumbUpOutlined,
    Favorite,
    FavoriteBorder,
    Launch,
    GitHub,
    X,
    RateReview,
    Star,
    People,
    AccountBalanceWallet,
    CheckCircle,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useBelieverActions } from '@/hooks/useBelieverPoints';
import { useUser } from '@/hooks/useUser';
import { ReviewService } from '@/lib/reviewService';
import AuthDialog from '@/components/auth/AuthDialog';
import TrackableShareButton from '../sharing/TrackableShareButton';

interface Project {
    $id: string;
    name: string;
    ticker: string;
    pitch: string;
    description: string;
    website: string;
    github?: string;
    twitter: string;
    category: string;
    status: string;
    logoUrl?: string;
    totalStaked: number;
    believers: number;
    reviews: number;
    bobScore: number;
    estimatedReturn: number;
    upvotes: string[];
    teamMembers: string[];
}

interface ProjectCardProps {
    project: Project;
    currentUserId: string;
    isFavorited: boolean;
    onCardClick: (projectId: string) => void;
    onUpvote: (projectId: string) => void;
    onToggleFavorite: (projectId: string) => void;
    onReview: (projectId: string) => void;
}




export default function ProjectCard({
    project,
    currentUserId,
    isFavorited,
    onCardClick,
    onUpvote,
    onToggleFavorite,
    onReview,
}: ProjectCardProps) {
    const { requireAuth, showAuthDialog, hideAuthDialog, authMessage, login } = useAuthGuard();
    const { awardUpvotePoints, canPerformAction } = useBelieverActions();
    const { user, authenticated } = useUser();

    // Review status state
    const [hasReviewed, setHasReviewed] = useState<boolean | null>(null); // null = loading
    const [checkingReview, setCheckingReview] = useState(false);

    // Points notification state
    const [pointsSnackbar, setPointsSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Check if user has reviewed this project
    useEffect(() => {
        const checkUserReview = async () => {
            if (!authenticated || !user) {
                setHasReviewed(null);
                return;
            }

            setCheckingReview(true);
            try {
                const hasUserReviewed = await ReviewService.hasUserReviewedProject(user.$id, project.$id);
                setHasReviewed(hasUserReviewed);
            } catch (error) {
                console.error('Error checking review status:', error);
                setHasReviewed(false); // Default to false on error
            } finally {
                setCheckingReview(false);
            }
        };

        checkUserReview();
    }, [authenticated, user, project.$id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live': return '#00ff88';
            case 'pending': return '#ffa726';
            case 'ended': return '#ff6b6b';
            default: return '#757575';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const isUpvoted = project.upvotes.includes(currentUserId);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        requireAuth(async () => {
            try {
                // Check if user can perform upvote action
                const canUpvote = await canPerformAction('upvote_project');

                if (!canUpvote.canPerform) {
                    setPointsSnackbar({
                        open: true,
                        message: canUpvote.reason || 'Cannot upvote at this time',
                        severity: 'error'
                    });
                    return;
                }

                // Perform the upvote
                onUpvote(project.$id);

                // Award believer points (only if not already upvoted)
                if (!isUpvoted) {
                    await awardUpvotePoints(project.$id);
                    setPointsSnackbar({
                        open: true,
                        message: '+75 Believer Points for upvoting! 🎉',
                        severity: 'success'
                    });
                }
            } catch (error) {
                console.error('Error awarding upvote points:', error);
                // Still perform the upvote even if points fail
                onUpvote(project.$id);
            }
        }, 'upvote projects');
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        requireAuth(() => onToggleFavorite(project.$id), 'add projects to favorites');
    };

    const handleReview = (e: React.MouseEvent) => {
        e.stopPropagation();
        requireAuth(() => onReview(project.$id), 'review projects');
    };

    const handleCloseSnackbar = () => {
        setPointsSnackbar(prev => ({ ...prev, open: false }));
    };

    // Render review button based on authentication and review status
    const renderReviewButton = () => {
        if (!authenticated) {
            // Show review button for unauthenticated users (will trigger auth dialog)
            return (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RateReview sx={{ fontSize: '1rem' }} />}
                    onClick={handleReview}
                    sx={{
                        borderColor: '#ff6b6b',
                        color: '#ff6b6b',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        py: 1,
                        position: 'relative',
                        '&:hover': {
                            backgroundColor: alpha('#ff6b6b', 0.1),
                            borderColor: '#ff6b6b',
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    Review
                    <Chip
                        label="+100"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#ff6b6b',
                            color: '#000',
                            fontSize: '0.6rem',
                            height: 16,
                            minWidth: 24,
                            fontWeight: 'bold',
                            '& .MuiChip-label': { px: 0.5 }
                        }}
                    />
                </Button>
            );
        }

        if (checkingReview || hasReviewed === null) {
            // Show loading state while checking review status
            return (
                <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                        borderColor: '#666',
                        color: '#666',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        py: 1,
                        minWidth: '90px',
                    }}
                >
                    <CircularProgress size={16} sx={{ color: '#666' }} />
                </Button>
            );
        }

        if (hasReviewed) {
            // Show "Reviewed" state for users who already reviewed
            return (
                <Button
                    variant="outlined"
                    size="small"
                    disabled
                    startIcon={<CheckCircle sx={{ fontSize: '1rem' }} />}
                    sx={{
                        borderColor: '#00ff88',
                        color: '#00ff88',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        py: 1,
                        backgroundColor: alpha('#00ff88', 0.1),
                    }}
                >
                    Reviewed
                </Button>
            );
        }

        // Show review button for authenticated users who haven't reviewed
        return (
            <Button
                variant="outlined"
                size="small"
                startIcon={<RateReview sx={{ fontSize: '1rem' }} />}
                onClick={handleReview}
                sx={{
                    borderColor: '#ff6b6b',
                    color: '#ff6b6b',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1,
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: alpha('#ff6b6b', 0.1),
                        borderColor: '#ff6b6b',
                        transform: 'translateY(-1px)',
                    }
                }}
            >
                Review
                <Chip
                    label="+100"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#ff6b6b',
                        color: '#000',
                        fontSize: '0.6rem',
                        height: 16,
                        minWidth: 24,
                        fontWeight: 'bold',
                        '& .MuiChip-label': { px: 0.5 }
                    }}
                />
            </Button>
        );
    };

    return (
        <>
            <Card
                sx={{
                    height: '500px', // Fixed height for consistency
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                    border: '1px solid #333',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha('#00ff88', 0.15)}`,
                        borderColor: '#00ff88',
                    }
                }}
                onClick={() => onCardClick(project.$id)}
            >
                {/* Status Indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: getStatusColor(project.status),
                    }}
                />

                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                            <Avatar
                                src={project.logoUrl || undefined}
                                sx={{
                                    width: 56,
                                    height: 56,
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    border: '2px solid #333',
                                    flexShrink: 0,
                                }}
                            >
                                {project.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        mb: 0.5,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {project.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#00ff88',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {project.ticker}
                                </Typography>
                            </Box>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                            <IconButton
                                onClick={handleUpvote}
                                sx={{
                                    color: isUpvoted ? '#00ff88' : '#666',
                                    position: 'relative',
                                    '&:hover': {
                                        color: '#00ff88',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                {isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                                {/* Points indicator */}
                                {!isUpvoted && (
                                    <Chip
                                        label="+75"
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
                                )}
                            </IconButton>
                            <IconButton
                                onClick={handleToggleFavorite}
                                sx={{
                                    color: isFavorited ? '#ff6b6b' : '#666',
                                    '&:hover': {
                                        color: '#ff6b6b',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                {isFavorited ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Status and Category */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                            label={project.status}
                            size="small"
                            sx={{
                                backgroundColor: alpha(getStatusColor(project.status), 0.2),
                                color: getStatusColor(project.status),
                                border: `1px solid ${getStatusColor(project.status)}`,
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                fontSize: '0.7rem'
                            }}
                        />
                        <Chip
                            label={project.category}
                            size="small"
                            sx={{
                                backgroundColor: alpha('#00ff88', 0.1),
                                color: '#00ff88',
                                border: '1px solid #00ff88',
                                fontWeight: 'bold'
                            }}
                        />
                    </Stack>

                    {/* Pitch - Fixed height container */}
                    <Box sx={{ mb: 2, height: '4.5em', overflow: 'hidden' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#b0b0b0',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.5,
                            }}
                        >
                            {project.pitch}
                        </Typography>
                    </Box>

                    {/* Team Members Preview - Fixed height */}
                    <Box sx={{ mb: 2, height: '3em' }}>
                        {project.teamMembers && project.teamMembers.length > 0 && (
                            <>
                                <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold', display: 'block', mb: 1 }}>
                                    Team ({project.teamMembers.length} members)
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#888',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {project.teamMembers.slice(0, 2).join(' • ')}
                                    {project.teamMembers.length > 2 && ' • ...'}
                                </Typography>
                            </>
                        )}
                    </Box>

                    {/* Stats Grid - Fixed height */}
                    <Box sx={{ mb: 3, height: '4em' }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                                        <ThumbUp sx={{ color: '#00ff88', fontSize: '1rem', mr: 0.5 }} />
                                        <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                            {formatNumber(project.upvotes?.length || 0)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                        Upvotes
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                                        <Star sx={{ color: '#ffa726', fontSize: '1rem', mr: 0.5 }} />
                                        <Typography variant="h6" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                            {project.bobScore || '-'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                        BOB Score
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                                        <People sx={{ color: '#ff6b6b', fontSize: '1rem', mr: 0.5 }} />
                                        <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                            {formatNumber(project.believers)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                        Believers
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                                        <AccountBalanceWallet sx={{ color: '#00ff88', fontSize: '1rem', mr: 0.5 }} />
                                        <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                            {formatNumber(project.totalStaked)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                        Staked
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Action Buttons - Fixed at bottom */}
                    <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<Launch sx={{ fontSize: '1rem' }} />}
                                href={project.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                component="a"
                                sx={{
                                    flex: 1,
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    py: 1,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                    }
                                }}
                            >
                                Website
                            </Button>
                            {renderReviewButton()}
                            <TrackableShareButton
                                project={project}
                                variant="button"
                                size="small"
                            />
                        </Stack>

                        {/* Social Links */}
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                                size="small"
                                href={`https://twitter.com/${project.twitter.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                component="a"
                                sx={{
                                    backgroundColor: '#000',
                                    color: '#FFF',
                                    border: '1px solid #000',
                                    '&:hover': {
                                        backgroundColor: '#000',
                                        color: 'white',
                                        transform: 'translateY(-1px)',
                                    }
                                }}
                            >
                                <X sx={{ fontSize: '1rem' }} />
                            </IconButton>
                            {project.github && (
                                <IconButton
                                    size="small"
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    component="a"
                                    sx={{
                                        backgroundColor: '#000',
                                        color: '#FFF',
                                        border: '1px solid #000',
                                        '&:hover': {
                                            backgroundColor: '#000',
                                            color: 'white',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    <GitHub sx={{ fontSize: '1.2rem' }} />
                                </IconButton>
                            )}
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            {/* Points Notification Snackbar */}
            <Snackbar
                open={pointsSnackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={pointsSnackbar.severity}
                    variant="filled"
                    sx={{
                        backgroundColor: pointsSnackbar.severity === 'success' ? '#00ff88' : '#ff6b6b',
                        color: '#000',
                        fontWeight: 'bold',
                    }}
                >
                    {pointsSnackbar.message}
                </Alert>
            </Snackbar>

            {/* Auth Dialog */}
            <AuthDialog
                open={showAuthDialog}
                onClose={hideAuthDialog}
                onLogin={login}
                message={authMessage}
            />
        </>
    );
}