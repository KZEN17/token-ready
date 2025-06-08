// src/hooks/useReviews.ts
'use client';

import { useState, useEffect } from 'react';
import { ReviewService, Review, ReviewWithUser } from '@/lib/reviewService';
import { useUser } from './useUser';

interface UseReviewsOptions {
    projectId?: string;
    userId?: string;
    limit?: number;
    autoFetch?: boolean;
}

interface UseReviewsReturn {
    reviews: ReviewWithUser[];
    loading: boolean;
    error: string | null;
    hasUserReviewed: boolean;
    reviewStats: {
        totalReviews: number;
        averageRating: number;
        totalInvestment: number;
        totalBelieverPoints: number;
    };
    submitReview: (reviewData: {
        rating: number;
        comment: string;
        investment: number;
    }) => Promise<Review>;
    updateReview: (reviewId: string, updates: Partial<Pick<Review, 'rating' | 'comment' | 'investment'>>) => Promise<Review>;
    deleteReview: (reviewId: string) => Promise<void>;
    refreshReviews: () => Promise<void>;
    checkUserReviewed: () => Promise<void>;
}

export const useReviews = ({
    projectId,
    userId,
    limit = 10,
    autoFetch = true
}: UseReviewsOptions = {}): UseReviewsReturn => {
    const { user, authenticated } = useUser();

    const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [reviewStats, setReviewStats] = useState({
        totalReviews: 0,
        averageRating: 0,
        totalInvestment: 0,
        totalBelieverPoints: 0,
    });

    const fetchReviews = async () => {
        if (!projectId && !userId) return;

        setLoading(true);
        setError(null);

        try {
            let reviewsData: Review[] = [];

            if (projectId && userId) {
                // Get reviews for specific project by specific user
                const userReviews = await ReviewService.getUserReviews(userId, limit);
                reviewsData = userReviews.filter(review => review.projectId === projectId);
            } else if (projectId) {
                // Get reviews for specific project
                reviewsData = await ReviewService.getProjectReviews(projectId, limit);
            } else if (userId) {
                // Get reviews by specific user
                reviewsData = await ReviewService.getUserReviews(userId, limit);
            }

            // Note: ReviewService already handles fetching user data for reviews
            // For now, we'll set reviews as ReviewWithUser[] but without user data
            // The RecentReviews component handles fetching user data
            setReviews(reviewsData as ReviewWithUser[]);

        } catch (err: any) {
            console.error('Error fetching reviews:', err);
            setError(err.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewStats = async () => {
        if (!projectId) return;

        try {
            const stats = await ReviewService.getProjectReviewStats(projectId);
            setReviewStats(stats);
        } catch (err) {
            console.error('Error fetching review stats:', err);
        }
    };

    const checkUserReviewed = async () => {
        if (!projectId || !authenticated || !user) {
            setHasUserReviewed(false);
            return;
        }

        try {
            const hasReviewed = await ReviewService.hasUserReviewedProject(user.$id, projectId);
            setHasUserReviewed(hasReviewed);
        } catch (err) {
            console.error('Error checking user review:', err);
            setHasUserReviewed(false);
        }
    };

    const submitReview = async (reviewData: {
        rating: number;
        comment: string;
        investment: number;
    }): Promise<Review> => {
        if (!projectId || !authenticated || !user) {
            throw new Error('Must be authenticated and have a project ID to submit review');
        }

        try {
            setError(null);

            const review = await ReviewService.submitReview({
                ...reviewData,
                projectId,
                userId: user.$id,
            });

            // Update user points
            if (user.updateUserPoints) {
                await user.updateUserPoints(0, review.believerPoints);
            }

            // Refresh data
            await refreshReviews();
            setHasUserReviewed(true);

            return review;
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
            throw err;
        }
    };

    const updateReview = async (
        reviewId: string,
        updates: Partial<Pick<Review, 'rating' | 'comment' | 'investment'>>
    ): Promise<Review> => {
        try {
            setError(null);

            const updatedReview = await ReviewService.updateReview(reviewId, updates);

            // Refresh data
            await refreshReviews();

            return updatedReview;
        } catch (err: any) {
            setError(err.message || 'Failed to update review');
            throw err;
        }
    };

    const deleteReview = async (reviewId: string): Promise<void> => {
        try {
            setError(null);

            await ReviewService.deleteReview(reviewId);

            // Refresh data
            await refreshReviews();
            setHasUserReviewed(false);
        } catch (err: any) {
            setError(err.message || 'Failed to delete review');
            throw err;
        }
    };

    const refreshReviews = async () => {
        await Promise.all([
            fetchReviews(),
            fetchReviewStats(),
            checkUserReviewed(),
        ]);
    };

    // Auto-fetch on mount and when dependencies change
    useEffect(() => {
        if (autoFetch) {
            fetchReviews();
        }
    }, [projectId, userId, limit, autoFetch]);

    // Fetch stats when projectId changes
    useEffect(() => {
        if (autoFetch && projectId) {
            fetchReviewStats();
        }
    }, [projectId, autoFetch]);

    // Check user review status when user or project changes
    useEffect(() => {
        if (autoFetch) {
            checkUserReviewed();
        }
    }, [projectId, authenticated, user?.$id, autoFetch]);

    return {
        reviews,
        loading,
        error,
        hasUserReviewed,
        reviewStats,
        submitReview,
        updateReview,
        deleteReview,
        refreshReviews,
        checkUserReviewed,
    };
};