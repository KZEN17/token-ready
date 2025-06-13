// src/components/projects/ProjectCard.tsx - FIXED VERSION with creator info and proper button sizes
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
    Tooltip,
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
    Person,
    Verified,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useBelieverActions } from '@/hooks/useBelieverPoints';
import { useUser } from '@/hooks/useUser';
import { ReviewService } from '@/lib/reviewService';
import AuthDialog from '@/components/auth/AuthDialog';
import TrackableShareButton from '../sharing/TrackableShareButton';
import ProjectSharers from './ProjectSharers';
import { Project } from '@/lib/types';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite';
import { toTitleCase } from '@/utils/helpers'; // Assuming you have a utility function for title casing

// Updated interface to include creator info
interface ProjectWithCreator extends Project {
    creator?: {
        $id: string;
        username: string;
        displayName: string;
        profileImage: string;
        isVerifiedKOL: boolean;
        verified: boolean;
        believerRank: string;
        followerCount: number;
    };
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

    // Creator state
    const [creator, setCreator] = useState<ProjectWithCreator['creator'] | null>(null);
    const [loadingCreator, setLoadingCreator] = useState(false);

    // Review status state
    const [hasReviewed, setHasReviewed] = useState<boolean | null>(null);
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

    // Fetch creator information
    useEffect(() => {
        const fetchCreator = async () => {
            if (!project.createdBy || project.createdBy === 'user-id-placeholder') return;

            setLoadingCreator(true);
            try {
                const creatorResponse = await databases.getDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    project.createdBy
                );

                setCreator({
                    $id: creatorResponse.$id,
                    username: creatorResponse.username || 'anonymous',
                    displayName: creatorResponse.displayName || 'Anonymous Creator',
                    profileImage: creatorResponse.profileImage || '',
                    isVerifiedKOL: creatorResponse.isVerifiedKOL || false,
                    verified: creatorResponse.verified || false,
                    believerRank: creatorResponse.believerRank || 'Believer',
                    followerCount: creatorResponse.followerCount || 0,
                });
            } catch (error) {
                console.error('Failed to fetch creator:', error);
                setCreator(null);
            } finally {
                setLoadingCreator(false);
            }
        };

        fetchCreator();
    }, [project.createdBy]);

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
                setHasReviewed(false);
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
                const canUpvote = await canPerformAction('upvote_project');

                if (!canUpvote.canPerform) {
                    setPointsSnackbar({
                        open: true,
                        message: canUpvote.reason || 'Cannot upvote at this time',
                        severity: 'error'
                    });
                    return;
                }

                onUpvote(project.$id);

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

    const renderReviewButton = () => {
        if (!authenticated) {
            return (
                <Button
                    variant="outlined"
                    size="small"  // ✅ FIXED: Explicit small size
                    startIcon={<RateReview sx={{ fontSize: '0.875rem' }} />}
                    onClick={handleReview}
                    sx={{
                        borderColor: '#ff6b6b',
                        color: '#ff6b6b',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',  // ✅ FIXED: Smaller font size
                        minWidth: '80px',     // ✅ FIXED: Control minimum width
                        height: '32px',       // ✅ FIXED: Control height
                        px: 1.5,              // ✅ FIXED: Smaller padding
                        py: 0.5,
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
                            top: -6,
                            right: -6,
                            backgroundColor: '#ff6b6b',
                            color: '#000',
                            fontSize: '0.6rem',
                            height: 14,      // ✅ FIXED: Smaller chip
                            minWidth: 20,    // ✅ FIXED: Smaller chip
                            fontWeight: 'bold',
                            '& .MuiChip-label': { px: 0.25 }
                        }}
                    />
                </Button>
            );
        }

        if (checkingReview || hasReviewed === null) {
            return (
                <Button
                    variant="outlined"
                    size="small"  // ✅ FIXED: Explicit small size
                    disabled
                    sx={{
                        borderColor: '#666',
                        color: '#666',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        minWidth: '80px',
                        height: '32px',
                        px: 1.5,
                        py: 0.5,
                    }}
                >
                    <CircularProgress size={14} sx={{ color: '#666' }} />
                </Button>
            );
        }

        if (hasReviewed) {
            return (
                <Button
                    variant="outlined"
                    size="small"  // ✅ FIXED: Explicit small size
                    disabled
                    startIcon={<CheckCircle sx={{ fontSize: '0.875rem' }} />}
                    sx={{
                        borderColor: '#00ff88',
                        color: '#00ff88',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        minWidth: '80px',
                        height: '32px',
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: alpha('#00ff88', 0.1),
                    }}
                >
                    Reviewed
                </Button>
            );
        }

        return (
            <Button
                variant="outlined"
                size="small"  // ✅ FIXED: Explicit small size
                startIcon={<RateReview sx={{ fontSize: '0.875rem' }} />}
                onClick={handleReview}
                sx={{
                    borderColor: '#ff6b6b',
                    color: '#ff6b6b',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    minWidth: '80px',
                    height: '32px',
                    px: 1.5,
                    py: 0.5,
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
                        top: -6,
                        right: -6,
                        backgroundColor: '#ff6b6b',
                        color: '#000',
                        fontSize: '0.6rem',
                        height: 14,
                        minWidth: 20,
                        fontWeight: 'bold',
                        '& .MuiChip-label': { px: 0.25 }
                    }}
                />
            </Button>
        );
    };

    const renderCreatorInfo = () => {
        if (loadingCreator) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircularProgress size={16} sx={{ color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#888' }}>
                        Loading creator...
                    </Typography>
                </Box>
            );
        }

        if (!creator) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person sx={{ color: '#666', fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ color: '#888' }}>
                        Creator: Unknown
                    </Typography>
                </Box>
            );
        }

        return (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
                <Chip
                    avatar={<Avatar src={creator.profileImage || undefined} />}
                    label={`Creator: @${creator.username}`}
                    variant="outlined"
                    sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                />

                <Chip
                    avatar={<Avatar src={`/${project.platform}.svg`} />}
                    label={toTitleCase(project.platform)}
                    variant="outlined"
                    sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                />

                <Chip
                    avatar={<Avatar src={`/${project.chain}.svg`} />}
                    label={toTitleCase(project.chain)}
                    variant="outlined"
                    sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                />
            </Box>
        );
    };

    return (
        <>
            <Card
                sx={{
                    height: '600px', // Slightly increased height for creator info
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

                        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>  {/* ✅ FIXED: Smaller spacing */}

                            <IconButton
                                size="small"  // ✅ FIXED: Explicit small size
                                onClick={handleUpvote}
                                sx={{
                                    color: isUpvoted ? '#00ff88' : '#666',
                                    position: 'relative',
                                    width: 36,     // ✅ FIXED: Control size
                                    height: 36,    // ✅ FIXED: Control size
                                    '&:hover': {
                                        color: '#00ff88',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                {isUpvoted ? <ThumbUp sx={{ fontSize: '1rem' }} /> : <ThumbUpOutlined sx={{ fontSize: '1rem' }} />}
                                {!isUpvoted && (
                                    <Chip
                                        label="+75"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: -6,
                                            right: -6,
                                            backgroundColor: '#00ff88',
                                            color: '#000',
                                            fontSize: '0.6rem',
                                            height: 14,      // ✅ FIXED: Smaller chip
                                            minWidth: 20,    // ✅ FIXED: Smaller chip
                                            fontWeight: 'bold',
                                            '& .MuiChip-label': { px: 0.25 }
                                        }}
                                    />
                                )}
                            </IconButton>

                        </Stack>

                    </Box>
                    <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold', display: 'block', mb: 1 }}>
                        VCA
                    </Typography>
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
                        {project.vcaAddress}
                    </Typography>
                    {/* ✅ FIXED: Creator Info - Now properly displayed in header */}
                    {renderCreatorInfo()}

                    {/* Status and Category */}
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
                        {/* Add admin review status chip */}
                        {project.adminReviewStatus === 'pending' && (
                            <Chip
                                label="UNDER REVIEW"
                                size="small"
                                sx={{
                                    backgroundColor: alpha('#ffa726', 0.2),
                                    color: '#ffa726',
                                    border: '1px solid #ffa726',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem',
                                    animation: 'pulse 2s infinite'
                                }}
                            />
                        )}
                        {project.adminReviewStatus === 'approved' && (
                            <Chip
                                label="✓ VERIFIED"
                                size="small"
                                sx={{
                                    backgroundColor: alpha('#00ff88', 0.2),
                                    color: '#00ff88',
                                    border: '1px solid #00ff88',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem'
                                }}
                            />
                        )}
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

                    {/* Pitch */}
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

                    {/* Team Members Preview */}
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

                    {/* Stats Grid */}
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

                    {/* Action Buttons - ✅ FIXED: All buttons properly sized */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                size="small"  // ✅ FIXED: Explicit small size
                                startIcon={<Launch sx={{ fontSize: '0.875rem' }} />}
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
                                    fontSize: '0.75rem',  // ✅ FIXED: Smaller font
                                    height: '32px',       // ✅ FIXED: Control height
                                    px: 1.5,              // ✅ FIXED: Smaller padding
                                    py: 0.5,
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
                                size="small"  // ✅ FIXED: Pass small size
                            />
                        </Stack>
                    </Box>

                    {/* Sharers and Social Links Section */}
                    <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={0.5}>  {/* ✅ FIXED: Smaller spacing */}
                                <IconButton
                                    size="small"  // ✅ FIXED: Explicit small size
                                    href={`https://twitter.com/${project.twitter.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    component="a"
                                    sx={{
                                        backgroundColor: '#000',
                                        color: '#FFF',
                                        border: '1px solid #000',
                                        width: 28,      // ✅ FIXED: Control size
                                        height: 28,     // ✅ FIXED: Control size
                                        '&:hover': {
                                            backgroundColor: '#000',
                                            color: 'white',
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                >
                                    <X sx={{ fontSize: '0.875rem' }} />
                                </IconButton>
                                {project.github && (
                                    <IconButton
                                        size="small"  // ✅ FIXED: Explicit small size
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        component="a"
                                        sx={{
                                            backgroundColor: '#000',
                                            color: '#FFF',
                                            border: '1px solid #000',
                                            width: 28,      // ✅ FIXED: Control size
                                            height: 28,     // ✅ FIXED: Control size
                                            '&:hover': {
                                                backgroundColor: '#000',
                                                color: 'white',
                                                transform: 'translateY(-1px)',
                                            }
                                        }}
                                    >
                                        <GitHub sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                )}
                            </Stack>
                            {/* Compact sharers display */}
                            <ProjectSharers projectId={project.$id} compact={true} limit={3} />
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