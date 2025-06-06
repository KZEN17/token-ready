'use client';

import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    TextField,
    Slider,
    Alert,
    Divider,
    Link,
    alpha,
    CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
    ThumbUp,
    Launch,
    GitHub,
    Twitter,
    TrendingUp,
    People,
    Star,
    AccountBalanceWallet,
    ThumbUpOutlined,
} from '@mui/icons-material';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/lib/appwrite';

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
    launchDate?: string;
    logoUrl?: string;
    totalStaked: number;
    believers: number;
    reviews: number;
    bobScore: number;
    estimatedReturn: number;
    upvotedBy: string[]; // Array of user IDs who upvoted
    teamMembers: string[]; // Array of team member strings
    createdAt: string;
}

export default function ProjectDetailsPage({
    params
}: {
    params: { id: string }
}) {
    const { id } = params;
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState(8);
    const [review, setReview] = useState('');
    const [investment, setInvestment] = useState(1500);

    // TODO: Get actual user ID from authentication
    const currentUserId = 'user_123';
    const isUpvoted = project?.upvotedBy.includes(currentUserId) || false;

    // Fetch project data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await databases.getDocument(
                    DATABASE_ID,
                    PROJECTS_COLLECTION_ID,
                    id
                );
                setProject(response as unknown as Project);
            } catch (error: any) {
                console.error('Failed to fetch project:', error);
                setError('Failed to load project. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const recentReviews = [
        { user: '@alpha_bob', rating: 9, comment: 'Team is KYC\'d & docs ready. Worth watching.', bobPoints: 187 },
        { user: '@earlydgen', rating: 7, comment: 'Strong concept but needs more development.', bobPoints: 161 },
        { user: '@honestbagger', rating: 8, comment: 'Solid project with good fundamentals.', bobPoints: 140 },
        { user: '@checkmate', rating: 9, comment: 'Best tokenomics I\'ve seen in this category.', bobPoints: 126 },
    ];

    const handleSubmitReview = async () => {
        console.log('Submitting review:', { rating, review, investment });
        // TODO: Submit to database
        setRating(8);
        setReview('');
        setInvestment(1500);
    };

    const handleUpvote = async () => {
        if (!project) return;

        const newUpvotedBy = isUpvoted
            ? project.upvotedBy.filter(id => id !== currentUserId)
            : [...project.upvotedBy, currentUserId];

        // Update local state immediately for better UX
        setProject({ ...project, upvotedBy: newUpvotedBy });

        // Update in database
        try {
            await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                project.$id,
                { upvotedBy: newUpvotedBy }
            );
        } catch (error) {
            console.error('Failed to update upvote:', error);
            // Revert local state on error
            setProject({ ...project, upvotedBy: project.upvotedBy });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return '#00E676';
            case 'pending': return '#FF9800';
            case 'rejected': return '#F44336';
            default: return '#757575';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <CircularProgress size={60} sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>
                    Loading project details...
                </Typography>
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
            }}>
                <Alert
                    severity="error"
                    sx={{
                        maxWidth: 600,
                        backgroundColor: alpha('#F44336', 0.1),
                        color: '#F44336',
                        border: '1px solid #F44336'
                    }}
                >
                    {error || 'Project not found'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
            color: 'white',
            py: 4
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Project Header */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                            border: '1px solid #333',
                            borderRadius: 3,
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
                                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
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
                                            color: '#FFD700',
                                            fontWeight: 700,
                                            mb: 1
                                        }}>
                                            {project.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            color: '#FFA500',
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
                                                    backgroundColor: alpha('#FFD700', 0.1),
                                                    color: '#FFD700',
                                                    border: '1px solid #FFD700',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            <Chip
                                                label="Community Reviewed"
                                                sx={{
                                                    backgroundColor: alpha('#00BFFF', 0.1),
                                                    color: '#00BFFF',
                                                    border: '1px solid #00BFFF'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                                            onClick={handleUpvote}
                                            sx={{
                                                background: isUpvoted
                                                    ? 'linear-gradient(45deg, #00E676, #00C853)'
                                                    : 'linear-gradient(45deg, #333, #555)',
                                                color: isUpvoted ? '#000' : '#FFF',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #00E676, #00C853)',
                                                    color: '#000'
                                                }
                                            }}
                                        >
                                            Upvote ({formatNumber(project.upvotedBy?.length || 0)})
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Star />}
                                            sx={{
                                                borderColor: '#FFD700',
                                                color: '#FFD700',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    backgroundColor: alpha('#FFD700', 0.1),
                                                    borderColor: '#FFD700'
                                                }
                                            }}
                                        >
                                            Submit Review
                                        </Button>
                                    </Box>
                                </Box>

                                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: '#B0B0B0' }}>
                                    {project.pitch}
                                </Typography>

                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ThumbUp sx={{ color: '#00E676', mb: 1, fontSize: '2rem' }} />
                                            <Typography variant="h6" sx={{ color: '#00E676', fontWeight: 'bold' }}>
                                                {formatNumber(project.upvotedBy?.length || 0)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                Upvotes
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <People sx={{ color: '#00BFFF', mb: 1, fontSize: '2rem' }} />
                                            <Typography variant="h6" sx={{ color: '#00BFFF', fontWeight: 'bold' }}>
                                                {formatNumber(project.believers)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                Believers
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <AccountBalanceWallet sx={{ color: '#00E676', mb: 1, fontSize: '2rem' }} />
                                            <Typography variant="h6" sx={{ color: '#00E676', fontWeight: 'bold' }}>
                                                ${formatNumber(project.totalStaked)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                Total Staked
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 3 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Star sx={{ color: '#FFD700', mb: 1, fontSize: '2rem' }} />
                                            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
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
                                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
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
                    </Grid>

                    {/* Project Interaction */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                            border: '1px solid #333',
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 'bold' }}>
                                    📊 Project Review — {project.ticker}
                                </Typography>

                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                        Rate This Project (1-10)
                                    </Typography>
                                    <Slider
                                        value={rating}
                                        onChange={(_, newValue) => setRating(newValue as number)}
                                        min={1}
                                        max={10}
                                        step={1}
                                        marks
                                        valueLabelDisplay="on"
                                        sx={{
                                            mb: 2,
                                            color: '#FFD700',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: '#FFD700',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: '#FFD700',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: '#333',
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                        Short Review
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        placeholder="Why do you believe in this project?"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: alpha('#FFD700', 0.05),
                                                '& fieldset': { borderColor: '#333' },
                                                '&:hover fieldset': { borderColor: '#FFD700' },
                                                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                            },
                                            '& .MuiOutlinedInput-input': { color: 'white' },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                                        Simulate Investment (in $BOB Points)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        placeholder="e.g. 1500"
                                        value={investment}
                                        onChange={(e) => setInvestment(Number(e.target.value))}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: alpha('#FFD700', 0.05),
                                                '& fieldset': { borderColor: '#333' },
                                                '&:hover fieldset': { borderColor: '#FFD700' },
                                                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                            },
                                            '& .MuiOutlinedInput-input': { color: 'white' },
                                        }}
                                    />
                                    <Alert
                                        severity="warning"
                                        sx={{
                                            mt: 2,
                                            backgroundColor: alpha('#FF9800', 0.1),
                                            color: '#FF9800',
                                            border: '1px solid #FF9800'
                                        }}
                                    >
                                        ⚠️ This project is considered oversubscribed after $100,000 total virtual pledges.
                                    </Alert>
                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={handleSubmitReview}
                                    sx={{
                                        py: 2,
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                                        }
                                    }}
                                >
                                    📝 Submit Review & Simulated Investment
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Latest Reviews */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                            border: '1px solid #333',
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ color: '#FFD700', mb: 3, fontWeight: 'bold' }}>
                                    📋 Latest Reviews
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {recentReviews.map((review, index) => (
                                        <Box key={index}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                                    {review.user}
                                                </Typography>
                                                <Chip
                                                    label={`${review.bobPoints} BOB Points`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha('#FFD700', 0.1),
                                                        color: '#FFD700',
                                                        border: '1px solid #FFD700',
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 1, fontStyle: 'italic' }}>
                                                "{review.comment}"
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Star fontSize="small" sx={{ color: '#FFD700' }} />
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    Rating: {review.rating}/10
                                                </Typography>
                                            </Box>
                                            {index < recentReviews.length - 1 && <Divider sx={{ mt: 2, borderColor: '#333' }} />}
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Detailed Information */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                            border: '1px solid #333',
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 'bold' }}>
                                    About {project.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: '#B0B0B0' }}>
                                    {project.description}
                                </Typography>

                                {/* Team Members Section */}
                                {project.teamMembers && project.teamMembers.length > 0 && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 'bold' }}>
                                            👥 Team ({project.teamMembers.length} members)
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {project.teamMembers.map((member, index) => {
                                                // Parse team member string (format: "Name - Role - Social")
                                                const parts = member.split(' - ');
                                                const name = parts[0] || member;
                                                const role = parts[1] || '';
                                                const social = parts[2] || '';

                                                return (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{
                                                            backgroundColor: '#FFD700',
                                                            color: '#000',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                                                                {role && `${role} • `}{social}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                )}

                                {project.launchDate && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                                            📅 Launch Date
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                                            {new Date(project.launchDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        Project submitted on {new Date(project.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}