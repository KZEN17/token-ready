'use client';

import {
    Container,
    Box,
    Grid,
    Alert,
    alpha,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/lib/appwrite';
import { useParams } from 'next/navigation';
import { ProjectLoading, ProjectError } from '@/components/projects/LoadingErrorState';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectInfo from '@/components/projects/ProjectInfo';
import ProjectReviewForm from '@/components/projects/ProjectReviewForm';
import RecentReviews from '@/components/projects/RecentReviews';
import { ReviewService } from '@/lib/reviewService';
import { useUser } from '@/hooks/useUser';

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

interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    totalInvestment: number;
    totalBelieverPoints: number;
}

export default function ProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { user, authenticated, updateUserPoints } = useUser();

    const [project, setProject] = useState<Project | null>(null);
    const [reviewStats, setReviewStats] = useState<ReviewStats>({
        totalReviews: 0,
        averageRating: 0,
        totalInvestment: 0,
        totalBelieverPoints: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewsKey, setReviewsKey] = useState(0); // Force re-render of reviews

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

    // Fetch review statistics
    useEffect(() => {
        const fetchReviewStats = async () => {
            if (!project) return;

            try {
                const stats = await ReviewService.getProjectReviewStats(project.$id);
                setReviewStats(stats);

                // Update project with latest review count if different
                if (stats.totalReviews !== project.reviews) {
                    // Optionally update the project in the database
                    // await databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, project.$id, {
                    //     reviews: stats.totalReviews
                    // });

                    // Update local state
                    setProject(prev => prev ? { ...prev, reviews: stats.totalReviews } : null);
                }
            } catch (error) {
                console.error('Error fetching review stats:', error);
            }
        };

        fetchReviewStats();
    }, [project, reviewsKey]);

    const handleUpvote = async () => {
        if (!project || !authenticated || !user) return;

        const isUpvoted = project.upvotes.includes(user.$id);
        const newUpvotes = isUpvoted
            ? project.upvotes.filter(id => id !== user.$id)
            : [...project.upvotes, user.$id];

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

    const handleReviewSubmitted = async (review: any) => {
        console.log('Review submitted:', review);

        // Only update user points if they weren't already updated
        if (!review.pointsAlreadyUpdated && updateUserPoints) {
            try {
                await updateUserPoints(0, review.believerPoints);
            } catch (error) {
                console.error('Error updating user points:', error);
                // Don't fail if points update fails
            }
        }

        // Force refresh of review stats and reviews list
        setReviewsKey(prev => prev + 1);

        // Optionally update project stats in database
        try {
            const newStats = await ReviewService.getProjectReviewStats(project!.$id);

            // Update project with new stats
            await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                project!.$id,
                {
                    reviews: newStats.totalReviews,
                    // You could also update other fields like average rating if you store it
                }
            );

            // Update local project state
            setProject(prev => prev ? {
                ...prev,
                reviews: newStats.totalReviews,
            } : null);

        } catch (error) {
            console.error('Error updating project stats:', error);
        }
    };

    if (loading) {
        return <ProjectLoading />;
    }

    if (error || !project) {
        return <ProjectError error={error || 'Project not found'} />;
    }

    const currentUserId = user?.$id || 'anonymous';

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

                    {/* Review Statistics Display */}
                    {reviewStats.totalReviews > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{
                                p: 3,
                                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                                border: '1px solid #333',
                                borderRadius: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 2,
                            }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: '#00ff88', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                        {reviewStats.totalReviews}
                                    </Box>
                                    <Box sx={{ color: '#888', fontSize: '0.9rem' }}>Reviews</Box>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: '#ffa726', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                        {reviewStats.averageRating}/10
                                    </Box>
                                    <Box sx={{ color: '#888', fontSize: '0.9rem' }}>Avg Rating</Box>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: '#ff6b6b', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                        {reviewStats.totalInvestment.toLocaleString()}
                                    </Box>
                                    <Box sx={{ color: '#888', fontSize: '0.9rem' }}>Total Pledged</Box>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: '#00ff88', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                        {reviewStats.totalBelieverPoints.toLocaleString()}
                                    </Box>
                                    <Box sx={{ color: '#888', fontSize: '0.9rem' }}>Community Points</Box>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Project Review Form */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <ProjectReviewForm
                            projectId={project.$id}
                            projectTicker={project.ticker}
                            projectName={project.name}
                            onReviewSubmitted={handleReviewSubmitted}
                        />
                    </Grid>

                    {/* Recent Reviews Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <RecentReviews
                            key={reviewsKey} // Force re-render when reviews change
                            projectId={project.$id}
                            limit={5}
                        />
                    </Grid>

                    {/* Detailed Project Information */}
                    <Grid size={{ xs: 12 }}>
                        <ProjectInfo project={project} />
                    </Grid>

                    {/* Additional Reviews Section for larger lists */}
                    {reviewStats.totalReviews > 5 && (
                        <Grid size={{ xs: 12 }}>
                            <Alert
                                severity="info"
                                sx={{
                                    backgroundColor: alpha('#00ff88', 0.1),
                                    color: '#00ff88',
                                    border: '1px solid #00ff88',
                                    borderRadius: 2,
                                }}
                            >
                                This project has {reviewStats.totalReviews} reviews.
                                Showing the 5 most recent above. More detailed review analytics coming soon!
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}