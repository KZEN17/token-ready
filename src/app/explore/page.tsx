'use client';

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Container,
    Fab,
    Stack,
    alpha,
} from '@mui/material';
import {
    Search,
    Favorite,
    FavoriteBorder,
    Launch,
    GitHub,
    Twitter,
    Add,
    Star,
    People,
    AccountBalanceWallet,
    ThumbUp,
    ThumbUpOutlined,
    RateReview,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../lib/appwrite';
import { Query } from 'appwrite';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    upvotes: string[]; // Array of user IDs who upvoted
    teamMembers: string[]; // Array of team member strings
    createdAt: string;
}

export default function ExplorePage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [upvotedProjects, setUpvotedProjects] = useState<Set<string>>(new Set());

    // TODO: Get actual user ID from authentication
    const currentUserId = 'user_123';

    const categories = [
        'All Categories',
        'AI & Tools',
        'DeFi',
        'GameFi',
        'Meme & Culture',
        'Social & Media',
        'Infrastructure',
        'NFT & Metaverse',
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'bobScore', label: 'Highest BOB Score' },
        { value: 'believers', label: 'Most Believers' },
        { value: 'totalStaked', label: 'Most Staked' },
        { value: 'name', label: 'Alphabetical' },
    ];

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                [
                    Query.orderDesc('createdAt'),
                    Query.limit(100),
                ]
            );

            const projectsData = response.documents as unknown as Project[];
            setProjects(projectsData);
            setFilteredProjects(projectsData);

        } catch (error: any) {
            console.error('Failed to fetch projects:', error);
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...projects];

        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.pitch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory && selectedCategory !== 'All Categories') {
            filtered = filtered.filter(project => project.category === selectedCategory);
        }

        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'bobScore':
                filtered.sort((a, b) => b.bobScore - a.bobScore);
                break;
            case 'believers':
                filtered.sort((a, b) => b.believers - a.believers);
                break;
            case 'totalStaked':
                filtered.sort((a, b) => b.totalStaked - a.totalStaked);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        setFilteredProjects(filtered);
    }, [projects, searchTerm, selectedCategory, sortBy]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const toggleFavorite = (projectId: string) => {
        const newFavorites = new Set(favorites);
        if (favorites.has(projectId)) {
            newFavorites.delete(projectId);
        } else {
            newFavorites.add(projectId);
        }
        setFavorites(newFavorites);
    };

    const toggleUpvote = async (projectId: string) => {
        // TODO: Get actual user ID from authentication
        const currentUserId = 'user_123'; // Replace with actual user ID

        // Find the project and update upvotes
        const project = projects.find(p => p.$id === projectId);
        if (!project) return;

        const isCurrentlyUpvoted = project.upvotes.includes(currentUserId);
        let newupvotes: string[];

        if (isCurrentlyUpvoted) {
            newupvotes = project.upvotes.filter(id => id !== currentUserId);
        } else {
            newupvotes = [...project.upvotes, currentUserId];
        }

        // Update local state immediately for better UX
        const updatedProjects = projects.map(p =>
            p.$id === projectId
                ? { ...p, upvotes: newupvotes }
                : p
        );
        setProjects(updatedProjects);

        // TODO: Update in database
        try {
            await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                projectId,
                { upvotes: newupvotes }
            );
        } catch (error) {
            console.error('Failed to update upvote:', error);
            // Revert local state on error
            setProjects(projects);
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

    const handleCardClick = (projectId: string) => {
        router.push(`/project/${projectId}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <CircularProgress size={60} sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#FFD700' }}>
                    Loading projects...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)', p: 4 }}>
                <Alert
                    severity="error"
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        mt: 8,
                        backgroundColor: alpha('#F44336', 0.1),
                        color: '#F44336',
                        border: '1px solid #F44336'
                    }}
                    action={
                        <Button color="inherit" size="small" onClick={fetchProjects}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
            color: 'white'
        }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Hero Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 900,
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2
                        }}
                    >
                        Discover Web3 Projects
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#B0B0B0', mb: 4, maxWidth: 600, mx: 'auto' }}>
                        Find the next generation of revolutionary blockchain projects
                    </Typography>

                    {/* Stats Cards */}
                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #1E1E1E, #2A2A2A)',
                                border: '1px solid #333',
                                textAlign: 'center',
                                p: 2
                            }}>
                                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    {projects.length}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                                    Projects Listed
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #1E1E1E, #2A2A2A)',
                                border: '1px solid #333',
                                textAlign: 'center',
                                p: 2
                            }}>
                                <Typography variant="h3" sx={{ color: '#00E676', fontWeight: 'bold' }}>
                                    {formatNumber(projects.reduce((sum, p) => sum + p.totalStaked, 0))}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                                    Total Staked
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Card sx={{
                                background: 'linear-gradient(135deg, #1E1E1E, #2A2A2A)',
                                border: '1px solid #333',
                                textAlign: 'center',
                                p: 2
                            }}>
                                <Typography variant="h3" sx={{ color: '#00BFFF', fontWeight: 'bold' }}>
                                    {formatNumber(projects.reduce((sum, p) => sum + p.believers, 0))}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                                    Total Believers
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Search and Filters */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <TextField
                                fullWidth
                                placeholder="Search projects, tickers, descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: alpha('#FFD700', 0.05),
                                        border: '1px solid #333',
                                        borderRadius: 2,
                                        '&:hover': {
                                            borderColor: '#FFD700',
                                        },
                                        '&.Mui-focused': {
                                            borderColor: '#FFD700',
                                            boxShadow: `0 0 0 2px ${alpha('#FFD700', 0.2)}`,
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: 'white',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: '#FFD700' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    displayEmpty
                                    sx={{
                                        backgroundColor: alpha('#FFD700', 0.05),
                                        border: '1px solid #333',
                                        borderRadius: 2,
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: '#FFD700',
                                        },
                                        '&.Mui-focused': {
                                            borderColor: '#FFD700',
                                        }
                                    }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category === 'All Categories' ? '' : category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    sx={{
                                        backgroundColor: alpha('#FFD700', 0.05),
                                        border: '1px solid #333',
                                        borderRadius: 2,
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: '#FFD700',
                                        }
                                    }}
                                >
                                    {sortOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#FFD700',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    mt: 1.5
                                }}
                            >
                                {filteredProjects.length} found
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h4" sx={{ color: '#FFD700', mb: 2, fontWeight: 'bold' }}>
                            No Projects Found
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#B0B0B0', mb: 4 }}>
                            {projects.length === 0
                                ? "Be the first to submit a project and get featured!"
                                : "Try adjusting your search or filters."}
                        </Typography>
                        <Button
                            component={Link}
                            href="/submit"
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            sx={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: '#000',
                                fontWeight: 'bold',
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                                }
                            }}
                        >
                            Submit Your Project
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredProjects.map((project) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.$id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                                        border: '1px solid #333',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 20px 40px ${alpha('#FFD700', 0.15)}`,
                                            borderColor: '#FFD700',
                                        }
                                    }}
                                    onClick={() => handleCardClick(project.$id)}
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
                                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
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
                                                            color: '#FFD700',
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
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleUpvote(project.$id);
                                                    }}
                                                    sx={{
                                                        color: project.upvotes.includes(currentUserId) ? '#00E676' : '#666',
                                                        '&:hover': {
                                                            color: '#00E676',
                                                            transform: 'scale(1.1)',
                                                        }
                                                    }}
                                                >
                                                    {project.upvotes.includes(currentUserId) ? <ThumbUp /> : <ThumbUpOutlined />}
                                                </IconButton>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(project.$id);
                                                    }}
                                                    sx={{
                                                        color: favorites.has(project.$id) ? '#FF4444' : '#666',
                                                        '&:hover': {
                                                            color: '#FF4444',
                                                            transform: 'scale(1.1)',
                                                        }
                                                    }}
                                                >
                                                    {favorites.has(project.$id) ? <Favorite /> : <FavoriteBorder />}
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
                                                    backgroundColor: alpha('#FFD700', 0.1),
                                                    color: '#FFD700',
                                                    border: '1px solid #FFD700',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </Stack>

                                        {/* Pitch */}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#B0B0B0',
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
                                                <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 'bold', display: 'block', mb: 1 }}>
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
                                                        <ThumbUp sx={{ color: '#00E676', fontSize: '1rem', mr: 0.5 }} />
                                                        <Typography variant="h6" sx={{ color: '#00E676', fontWeight: 'bold' }}>
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
                                                        <Star sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
                                                        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
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
                                                        <People sx={{ color: '#00BFFF', fontSize: '1rem', mr: 0.5 }} />
                                                        <Typography variant="h6" sx={{ color: '#00BFFF', fontWeight: 'bold' }}>
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
                                                        <AccountBalanceWallet sx={{ color: '#00E676', fontSize: '1rem', mr: 0.5 }} />
                                                        <Typography variant="h6" sx={{ color: '#00E676', fontWeight: 'bold' }}>
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
                                                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    py: 1,
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                                                        transform: 'translateY(-1px)',
                                                    }
                                                }}
                                            >
                                                Website
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<RateReview sx={{ fontSize: '1rem' }} />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/project/${project.$id}`);
                                                }}
                                                sx={{
                                                    borderColor: '#00BFFF',
                                                    color: '#00BFFF',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    py: 1,
                                                    '&:hover': {
                                                        backgroundColor: alpha('#00BFFF', 0.1),
                                                        borderColor: '#00BFFF',
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
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Floating Action Button */}
                <Fab
                    component={Link}
                    href="/submit"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#000',
                        width: 64,
                        height: 64,
                        '&:hover': {
                            background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                            transform: 'scale(1.1)',
                        },
                        boxShadow: `0 8px 25px ${alpha('#FFD700', 0.4)}`,
                    }}
                >
                    <Add sx={{ fontSize: '2rem' }} />
                </Fab>
            </Container>
        </Box>
    );
}