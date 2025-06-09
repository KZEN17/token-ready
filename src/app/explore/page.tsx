'use client';

import {
    Box,
    Grid,
    CircularProgress,
    Alert,
    Container,
    alpha,
    Button,
    Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useAuthGuard } from '@/hooks/useAuthGuard';

// Import our new modular components
import ExploreHero from '@/components/explore/ExploreHero';
import ExploreFilters from '@/components/explore/ExploreFilters';
import EmptyState from '@/components/explore/EmptyState';
import FloatingActionButton from '@/components/explore/FloatingActionButton';
import ProjectCard from '@/components/projects/ProjectCard';
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
    launchDate?: string;
    logoUrl?: string;
    totalStaked: number;
    believers: number;
    reviews: number;
    bobScore: number;
    estimatedReturn: number;
    upvotes: string[];
    teamMembers: string[];
    createdAt: string;
    simulatedInvestment: number;
}

export default function ExplorePage() {
    const router = useRouter();
    // Fix: Destructure updateUserPoints directly from the hook
    const { user, authenticated, updateUserPoints } = useUser();
    const { requireAuth, showAuthDialog, hideAuthDialog, authMessage, login } = useAuthGuard();

    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const currentUserId = user?.$id || 'anonymous';

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

    // Filter and sort projects
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

    const handleCardClick = (projectId: string) => {
        router.push(`/project/${projectId}`);
    };

    const handleUpvote = async (projectId: string) => {
        if (!authenticated || !user) {
            requireAuth(() => handleUpvote(projectId), 'upvote projects');
            return;
        }

        const project = projects.find(p => p.$id === projectId);
        if (!project) return;

        const isCurrentlyUpvoted = project.upvotes.includes(currentUserId);
        let newUpvotes: string[];

        if (isCurrentlyUpvoted) {
            newUpvotes = project.upvotes.filter(id => id !== currentUserId);
        } else {
            newUpvotes = [...project.upvotes, currentUserId];
        }

        // Update local state immediately for better UX
        const updatedProjects = projects.map(p =>
            p.$id === projectId
                ? { ...p, upvotes: newUpvotes }
                : p
        );
        setProjects(updatedProjects);

        // Update in database
        try {
            await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                projectId,
                { upvotes: newUpvotes }
            );

            // Fix: Use updateUserPoints from hook, not from user object
            // Award user points for upvoting (optional)
            if (!isCurrentlyUpvoted && updateUserPoints) {
                try {
                    await updateUserPoints(1, 5); // 1 BOB point, 5 believer points
                } catch (pointsError) {
                    console.error('Failed to update user points:', pointsError);
                    // Don't fail the upvote if points update fails
                }
            }
        } catch (error) {
            console.error('Failed to update upvote:', error);
            // Revert local state on error
            setProjects(projects);
        }
    };

    const handleToggleFavorite = (projectId: string) => {
        if (!authenticated) {
            requireAuth(() => handleToggleFavorite(projectId), 'add projects to favorites');
            return;
        }

        const newFavorites = new Set(favorites);
        if (favorites.has(projectId)) {
            newFavorites.delete(projectId);
        } else {
            newFavorites.add(projectId);
        }
        setFavorites(newFavorites);

        // In a real app, you'd save this to the user's profile
        // For now, just store in local state
    };

    const handleReview = (projectId: string) => {
        if (!authenticated) {
            requireAuth(() => handleReview(projectId), 'review projects');
            return;
        }
        router.push(`/project/${projectId}`);
    };

    // Handle floating action button click
    const handleSubmitProject = () => {
        if (!authenticated) {
            requireAuth(() => handleSubmitProject(), 'submit projects');
            return;
        }
        router.push('/submit');
    };

    // Calculate stats for hero section
    const totalStaked = projects.reduce((sum, p) => sum + p.totalStaked, 0);
    const totalBelievers = projects.reduce((sum, p) => sum + p.believers, 0);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <CircularProgress size={60} sx={{ color: '#00ff88' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#00ff88' }}>
                    Loading projects...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                p: 4
            }}>
                <Alert
                    severity="error"
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        mt: 8,
                        backgroundColor: alpha('#ff6b6b', 0.1),
                        color: '#ff6b6b',
                        border: '1px solid #ff6b6b'
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
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: 'white'
        }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Hero Section */}
                <ExploreHero
                    projectCount={projects.length}
                    totalStaked={totalStaked}
                    totalBelievers={totalBelievers}
                />

                {/* Authentication Status Banner */}
                {!authenticated && (
                    <Box sx={{ mb: 4 }}>
                        <Alert
                            severity="info"
                            sx={{
                                backgroundColor: alpha('#00ff88', 0.1),
                                color: '#00ff88',
                                border: '1px solid #00ff88',
                                borderRadius: 2,
                            }}
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() => requireAuth(() => { }, 'access all features')}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Login
                                </Button>
                            }
                        >
                            👋 Login with X to upvote, review, and submit projects to earn Believer Points!
                        </Alert>
                    </Box>
                )}

                {/* Search and Filters */}
                <ExploreFilters
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    sortBy={sortBy}
                    resultCount={filteredProjects.length}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setSelectedCategory}
                    onSortChange={setSortBy}
                />

                {/* Projects Grid or Empty State */}
                {filteredProjects.length === 0 ? (
                    <EmptyState hasProjects={projects.length > 0} />
                ) : (
                    <Grid container spacing={3}>
                        {filteredProjects.map((project) => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.$id}>
                                <ProjectCard
                                    project={project}
                                    currentUserId={currentUserId}
                                    isFavorited={favorites.has(project.$id)}
                                    onCardClick={handleCardClick}
                                    onUpvote={handleUpvote}
                                    onToggleFavorite={handleToggleFavorite}
                                    onReview={handleReview}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Floating Action Button with Auth Guard */}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        zIndex: 1000,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleSubmitProject}
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            minWidth: 'unset',
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontSize: '2rem',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 8px 25px rgba(0, 255, 136, 0.4)',
                            },
                            boxShadow: `0 8px 25px ${alpha('#00ff88', 0.4)}`,
                        }}
                    >
                        +
                    </Button>
                </Box>
            </Container>

            {/* Auth Dialog */}
            <AuthDialog
                open={showAuthDialog}
                onClose={hideAuthDialog}
                onLogin={login}
                message={authMessage}
            />
        </Box>
    );
}