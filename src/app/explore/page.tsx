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

// Import our new modular components
import ExploreHero from '@/components/explore/ExploreHero';
import ExploreFilters from '@/components/explore/ExploreFilters';
import EmptyState from '@/components/explore/EmptyState';
import FloatingActionButton from '@/components/explore/FloatingActionButton';
import ProjectCard from '@/components/projects/ProjectCard';

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

    // TODO: Get actual user ID from authentication
    const currentUserId = 'user_123';

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
        } catch (error) {
            console.error('Failed to update upvote:', error);
            // Revert local state on error
            setProjects(projects);
        }
    };

    const handleToggleFavorite = (projectId: string) => {
        const newFavorites = new Set(favorites);
        if (favorites.has(projectId)) {
            newFavorites.delete(projectId);
        } else {
            newFavorites.add(projectId);
        }
        setFavorites(newFavorites);
    };

    const handleReview = (projectId: string) => {
        router.push(`/project/${projectId}`);
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

                {/* Floating Action Button */}
                <FloatingActionButton />
            </Container>
        </Box>
    );
}