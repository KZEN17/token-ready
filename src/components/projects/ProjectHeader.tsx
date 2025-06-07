'use client';

import {
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    alpha,
} from '@mui/material';
import {
    ThumbUp,
    Launch,
    GitHub,
    Twitter,
    Star,
    ThumbUpOutlined,
    People,
    AccountBalanceWallet,
} from '@mui/icons-material';

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
    upvotes: string[];
    createdAt: string;
}

interface ProjectHeaderProps {
    project: Project;
    currentUserId: string;
    onUpvote: () => void;
}

export default function ProjectHeader({
    project,
    currentUserId,
    onUpvote,
}: ProjectHeaderProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return '#00ff88';
            case 'pending': return '#ffa726';
            case 'rejected': return '#ff6b6b';
            default: return '#757575';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const isUpvoted = project.upvotes.includes(currentUserId);

    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
        }}>
            <CardContent sx={{ p: 4 }}>
                {/* Status Indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: getStatusColor(project.status),
                        borderRadius: '12px 12px 0 0',
                    }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, mt: 1 }}>
                    <Avatar
                        src={project.logoUrl || undefined}
                        sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontSize: '2rem',
                            fontWeight: 700,
                            border: '3px solid #333'
                        }}
                    >
                        {project.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h3" sx={{
                            color: '#00ff88',
                            fontWeight: 700,
                            mb: 1
                        }}>
                            {project.name}
                        </Typography>
                        <Typography variant="h6" sx={{
                            color: '#4dffb0',
                            mb: 2,
                            fontWeight: 'bold'
                        }}>
                            {project.ticker}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={project.status}
                                sx={{
                                    backgroundColor: alpha(getStatusColor(project.status), 0.2),
                                    color: getStatusColor(project.status),
                                    border: `1px solid ${getStatusColor(project.status)}`,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}
                            />
                            <Chip
                                label={project.category}
                                sx={{
                                    backgroundColor: alpha('#00ff88', 0.1),
                                    color: '#00ff88',
                                    border: '1px solid #00ff88',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Chip
                                label="Community Reviewed"
                                sx={{
                                    backgroundColor: alpha('#ff6b6b', 0.1),
                                    color: '#ff6b6b',
                                    border: '1px solid #ff6b6b'
                                }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                            onClick={onUpvote}
                            sx={{
                                background: isUpvoted
                                    ? 'linear-gradient(45deg, #00ff88, #4dffb0)'
                                    : 'linear-gradient(45deg, #333, #555)',
                                color: isUpvoted ? '#000' : '#FFF',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                }
                            }}
                        >
                            Upvote ({formatNumber(project.upvotes?.length || 0)})
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Star />}
                            sx={{
                                borderColor: '#ffa726',
                                color: '#ffa726',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: alpha('#ffa726', 0.1),
                                    borderColor: '#ffa726'
                                }
                            }}
                        >
                            Submit Review
                        </Button>
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: '#b0b0b0' }}>
                    {project.pitch}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <ThumbUp sx={{ color: '#00ff88', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                {formatNumber(project.upvotes?.length || 0)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Upvotes
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <People sx={{ color: '#ff6b6b', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                {formatNumber(project.believers)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Believers
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <AccountBalanceWallet sx={{ color: '#00ff88', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                ${formatNumber(project.totalStaked)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Total Staked
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Star sx={{ color: '#ffa726', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                {project.bobScore || '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                BOB Score
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Launch />}
                        href={project.website}
                        target="_blank"
                        sx={{
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                            }
                        }}
                    >
                        Website
                    </Button>
                    {project.github && (
                        <Button
                            variant="outlined"
                            startIcon={<GitHub />}
                            href={project.github}
                            target="_blank"
                            sx={{
                                borderColor: '#666',
                                color: '#666',
                                '&:hover': {
                                    backgroundColor: alpha('#666', 0.1),
                                    borderColor: '#666'
                                }
                            }}
                        >
                            GitHub
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<Twitter />}
                        href={`https://twitter.com/${project.twitter.replace('@', '')}`}
                        target="_blank"
                        sx={{
                            borderColor: '#1DA1F2',
                            color: '#1DA1F2',
                            '&:hover': {
                                backgroundColor: alpha('#1DA1F2', 0.1),
                                borderColor: '#1DA1F2'
                            }
                        }}
                    >
                        Twitter
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}