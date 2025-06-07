// src/components/projects/ProjectCard.tsx (Updated with Auth Guards)
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
} from '@mui/material';
import {
    ThumbUp,
    ThumbUpOutlined,
    Favorite,
    FavoriteBorder,
    Launch,
    GitHub,
    Twitter,
    RateReview,
    Star,
    People,
    AccountBalanceWallet,
} from '@mui/icons-material';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import AuthDialog from '@/components/auth/AuthDialog';

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

    const handleUpvote = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        requireAuth(() => onUpvote(project.$id), 'upvote projects');
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

    return (
        <>
            <Card
                sx={{
                    height: '100%',
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

                <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src={project.logoUrl || undefined}
                                sx={{
                                    width: 56,
                                    height: 56,
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    border: '2px solid #333'
                                }}
                            >
                                {project.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                                    {project.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#00ff88',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {project.ticker}
                                </Typography>
                            </Box>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={handleUpvote}
                                sx={{
                                    color: isUpvoted ? '#00ff88' : '#666',
                                    '&:hover': {
                                        color: '#00ff88',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                {isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
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

                    {/* Pitch */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#b0b0b0',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5,
                            height: '4.5em'
                        }}
                    >
                        {project.pitch}
                    </Typography>

                    {/* Team Members Preview */}
                    {project.teamMembers && project.teamMembers.length > 0 && (
                        <Box sx={{ mb: 2 }}>
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
                        </Box>
                    )}

                    {/* Stats Grid */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
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

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
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
                                '&:hover': {
                                    backgroundColor: alpha('#ff6b6b', 0.1),
                                    borderColor: '#ff6b6b',
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            Review
                        </Button>
                        <IconButton
                            size="small"
                            href={`https://twitter.com/${project.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            component="a"
                            sx={{
                                backgroundColor: alpha('#1DA1F2', 0.1),
                                color: '#1DA1F2',
                                border: '1px solid #1DA1F2',
                                '&:hover': {
                                    backgroundColor: '#1DA1F2',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            <Twitter sx={{ fontSize: '1.2rem' }} />
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
                                    backgroundColor: alpha('#666', 0.1),
                                    color: '#666',
                                    border: '1px solid #666',
                                    '&:hover': {
                                        backgroundColor: '#666',
                                        color: 'white',
                                        transform: 'translateY(-1px)',
                                    }
                                }}
                            >
                                <GitHub sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        )}
                    </Stack>
                </CardContent>
            </Card>

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