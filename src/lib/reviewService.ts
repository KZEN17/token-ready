// src/lib/reviewService.ts
import { databases, DATABASE_ID, REVIEWS_COLLECTION_ID } from './appwrite';
import { ID, Query } from 'appwrite';

export interface Review {
    $id?: string;
    projectId: string;
    userId: string;
    rating: number;
    comment: string;
    investment: number;
    believerPoints: number;
    createdAt: string;
}

export interface ReviewWithUser extends Review {
    user?: {
        username: string;
        displayName: string;
        profileImage: string;
        followerCount: number;
        verified: boolean;
        isVerifiedKOL: boolean;
        believerRank: string;
    };
}

export class ReviewService {
    /**
     * Submit a new review for a project
     */
    static async submitReview(reviewData: {
        projectId: string;
        userId: string;
        rating: number;
        comment: string;
        investment: number;
    }): Promise<Review> {
        // Calculate believer points based on rating and investment
        const believerPoints = this.calculateBelieverPoints(reviewData.rating, reviewData.investment);

        const review = {
            projectId: reviewData.projectId,
            userId: reviewData.userId,
            rating: reviewData.rating,
            comment: reviewData.comment,
            investment: reviewData.investment,
            believerPoints,
            createdAt: new Date().toISOString(),
        };

        try {
            console.log('Submitting review with data:', review);

            const response = await databases.createDocument(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                ID.unique(),
                review
            );

            console.log('Review submitted successfully:', response);
            return response as unknown as Review;
        } catch (error) {
            console.error('Error submitting review:', error);
            console.error('Review data that failed:', review);
            throw new Error('Failed to submit review');
        }
    }

    /**
     * Get reviews for a specific project
     */
    static async getProjectReviews(projectId: string, limit = 10, offset = 0): Promise<Review[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                [
                    Query.equal('projectId', projectId),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            return response.documents as unknown as Review[];
        } catch (error) {
            console.error('Error fetching project reviews:', error);
            throw new Error('Failed to fetch project reviews');
        }
    }

    /**
     * Get reviews by a specific user
     */
    static async getUserReviews(userId: string, limit = 10, offset = 0): Promise<Review[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            return response.documents as unknown as Review[];
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            throw new Error('Failed to fetch user reviews');
        }
    }

    /**
     * Check if user has already reviewed a project
     */
    static async hasUserReviewedProject(userId: string, projectId: string): Promise<boolean> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.equal('projectId', projectId),
                    Query.limit(1)
                ]
            );

            return response.documents.length > 0;
        } catch (error) {
            console.error('Error checking user review:', error);
            return false;
        }
    }

    /**
     * Get project review statistics
     */
    static async getProjectReviewStats(projectId: string): Promise<{
        totalReviews: number;
        averageRating: number;
        totalInvestment: number;
        totalBelieverPoints: number;
    }> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                [
                    Query.equal('projectId', projectId),
                    Query.limit(100) // Adjust as needed
                ]
            );

            const reviews = response.documents as unknown as Review[];

            if (reviews.length === 0) {
                return {
                    totalReviews: 0,
                    averageRating: 0,
                    totalInvestment: 0,
                    totalBelieverPoints: 0,
                };
            }

            const totalReviews = reviews.length;
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / totalReviews;
            const totalInvestment = reviews.reduce((sum, review) => sum + review.investment, 0);
            const totalBelieverPoints = reviews.reduce((sum, review) => sum + review.believerPoints, 0);

            return {
                totalReviews,
                averageRating: Number(averageRating.toFixed(1)),
                totalInvestment,
                totalBelieverPoints,
            };
        } catch (error) {
            console.error('Error calculating review stats:', error);
            return {
                totalReviews: 0,
                averageRating: 0,
                totalInvestment: 0,
                totalBelieverPoints: 0,
            };
        }
    }

    /**
     * Update an existing review
     */
    static async updateReview(
        reviewId: string,
        updates: Partial<Pick<Review, 'rating' | 'comment' | 'investment'>>
    ): Promise<Review> {
        try {
            const updateData = {
                ...updates,
            } as Partial<Review>;

            // Recalculate believer points if rating or investment changed
            if (updates.rating !== undefined || updates.investment !== undefined) {
                // We need to fetch the current review to get missing values
                const currentReview = await databases.getDocument(
                    DATABASE_ID,
                    REVIEWS_COLLECTION_ID,
                    reviewId
                ) as unknown as Review;

                const newRating = updates.rating ?? currentReview.rating;
                const newInvestment = updates.investment ?? currentReview.investment;

                updateData.believerPoints = this.calculateBelieverPoints(newRating, newInvestment);
            }

            const response = await databases.updateDocument(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                reviewId,
                updateData
            );

            return response as unknown as Review;
        } catch (error) {
            console.error('Error updating review:', error);
            throw new Error('Failed to update review');
        }
    }

    /**
     * Delete a review
     */
    static async deleteReview(reviewId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                reviewId
            );
        } catch (error) {
            console.error('Error deleting review:', error);
            throw new Error('Failed to delete review');
        }
    }

    /**
     * Calculate believer points based on rating and investment
     */
    private static calculateBelieverPoints(rating: number, investment: number): number {
        // Base points from rating (1-10 scale)
        const ratingPoints = rating * 10;

        // Investment tier points
        let investmentPoints = 0;
        if (investment >= 5000) investmentPoints = 50;
        else if (investment >= 2500) investmentPoints = 30;
        else if (investment >= 1000) investmentPoints = 20;
        else if (investment >= 500) investmentPoints = 10;
        else if (investment >= 100) investmentPoints = 5;

        // Bonus for high ratings with high investment
        const bonusPoints = (rating >= 8 && investment >= 1000) ? 20 : 0;

        return ratingPoints + investmentPoints + bonusPoints;
    }

    /**
     * Get recent reviews across all projects (for dashboard/homepage)
     */
    static async getRecentReviews(limit = 5): Promise<Review[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REVIEWS_COLLECTION_ID,
                [
                    Query.orderDesc('createdAt'),
                    Query.limit(limit)
                ]
            );

            return response.documents as unknown as Review[];
        } catch (error) {
            console.error('Error fetching recent reviews:', error);
            throw new Error('Failed to fetch recent reviews');
        }
    }
}