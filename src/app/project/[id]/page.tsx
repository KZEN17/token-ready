'use client';

import {
    Container,
    Box,
    Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/lib/appwrite';
import { useParams } from 'next/navigation';
import { ProjectLoading, ProjectError } from '@/components/projects/LoadingErrorState';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectInfo from '@/components/projects/ProjectInfo';
import ProjectReviewForm from '@/components/projects/ProjectReviewForm';
import RecentReviews from '@/components/projects/RecentReviews';


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

export default function ProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: Get actual user ID from authentication
    const currentUserId = 'user_123';

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

    const handleUpvote = async () => {
        if (!project) return;

        const isUpvoted = project.upvotes.includes(currentUserId);
        const newUpvotes = isUpvoted
            ? project.upvotes.filter(id => id !== currentUserId)
            : [...project.upvotes, currentUserId];

        // Update local state immediately for better UX
        setProject({ ...project, upvotes: newUpvotes });

        // Update in database
        try {
            await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                project.$id,
                { upvotes: newUpvotes }
            );
        } catch (error) {
            console.error('Failed to update upvote:', error);
            // Revert local state on error
            setProject({ ...project, upvotes: project.upvotes });
        }
    };

    const handleSubmitReview = async (reviewData: { rating: number; review: string; investment: number }) => {
        console.log('Submitting review:', reviewData);
        // TODO: Submit to database
        // Could show success message, update review count, etc.
    };

    if (loading) {
        return <ProjectLoading />;
    }

    if (error || !project) {
        return <ProjectError error={error || 'Project not found'} />;
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: 'white',
            py: 4
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Project Header */}
                    <Grid size={{ xs: 12 }}>
                        <ProjectHeader
                            project={project}
                            currentUserId={currentUserId}
                            onUpvote={handleUpvote}
                        />
                    </Grid>

                    {/* Project Review Form */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <ProjectReviewForm
                            projectTicker={project.ticker}
                            onSubmitReview={handleSubmitReview}
                        />
                    </Grid>

                    {/* Recent Reviews Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <RecentReviews />
                    </Grid>

                    {/* Detailed Project Information */}
                    <Grid size={{ xs: 12 }}>
                        <ProjectInfo project={project} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}