// src/lib/believerPointsService.ts (Fixed for your actual schema)
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from './appwrite';
import { ID, Query } from 'appwrite';
import {
    BelieverAction,
    BelieverActionType,
    BELIEVER_ACTIONS,
    calculateBelieverRank,
    calculateStreakBonus,
    calculateStakingPoints,
    canPerformAction
} from './believerPoints';

// Collection ID with fallback
export const BELIEVER_ACTIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BELIEVER_ACTIONS_COLLECTION_ID || 'believer_actions';

export class BelieverPointsService {
    /**
     * Award points for a specific action
     */
    static async awardPoints(
        userId: string, // This is the user.$id from your users collection
        actionType: BelieverActionType,
        projectId?: string,
        metadata?: Record<string, any>
    ): Promise<{ points: number; action: BelieverAction }> {
        try {
            // Calculate points based on action type
            let points = BELIEVER_ACTIONS[actionType].basePoints;

            // Handle special cases
            switch (actionType) {
                case 'daily_checkin':
                    points = 50; // Simplified for now
                    break;

                case 'stake_tokens':
                    if (metadata?.stakedAmount) {
                        points = calculateStakingPoints(metadata.stakedAmount);
                    }
                    break;

                case 'write_review':
                    // Bonus points for high-quality reviews
                    if (metadata?.rating >= 8 && metadata?.investment >= 1000) {
                        points += 50; // Quality bonus
                    }
                    break;
            }

            // Create action record - store the user.$id as userId
            const actionData = {
                type: actionType,
                points,
                description: BELIEVER_ACTIONS[actionType].description,
                userId: userId, // This should be the user.$id (document ID)
                projectId: projectId || null,
                metadata: metadata ? JSON.stringify(metadata) : null,
                createdAt: new Date().toISOString()
            };

            try {
                const action = await databases.createDocument(
                    DATABASE_ID,
                    BELIEVER_ACTIONS_COLLECTION_ID,
                    ID.unique(),
                    actionData
                );

                console.log('✅ Action recorded in believer_actions collection');
            } catch (actionError) {
                console.warn('Could not save to believer_actions collection:', actionError);
                // Continue anyway - we'll still update user points
            }

            // Update user's believer points in users collection using the document ID
            await this.updateUserBelieverPoints(userId, points);

            const mockAction: BelieverAction = {
                $id: `action_${Date.now()}`,
                type: actionType,
                points,
                description: BELIEVER_ACTIONS[actionType].description,
                userId,
                projectId,
                metadata,
                createdAt: new Date().toISOString()
            };

            console.log(`✅ Awarded ${points} believer points for ${actionType}`);
            return { points, action: mockAction };

        } catch (error) {
            console.error('Error awarding points:', error);
            throw new Error('Failed to award points');
        }
    }

    /**
     * Get user's total believer points and rank
     */
    static async getUserStats(userId: string): Promise<{
        totalPoints: number;
        rank: any;
        nextRank: any;
        todayPoints: number;
        weeklyProgress: number;
        streak: number;
    }> {
        try {
            // Get points from user record using document ID
            const userRecord = await this.getUserRecord(userId);
            const totalPoints = userRecord?.believerPoints || 0;
            const rank = calculateBelieverRank(totalPoints);

            // Try to get additional stats from actions if possible
            let todayPoints = 0;
            let weeklyProgress = 0;
            let streak = 0;

            try {
                // Try to get today's actions
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayActions = await databases.listDocuments(
                    DATABASE_ID,
                    BELIEVER_ACTIONS_COLLECTION_ID,
                    [
                        Query.equal('userId', userId),
                        Query.greaterThanEqual('createdAt', today.toISOString()),
                        Query.limit(100)
                    ]
                );

                todayPoints = todayActions.documents.reduce((sum: number, action: any) => sum + (action.points || 0), 0);

                // Get weekly progress
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                weekStart.setHours(0, 0, 0, 0);

                const weeklyActions = await databases.listDocuments(
                    DATABASE_ID,
                    BELIEVER_ACTIONS_COLLECTION_ID,
                    [
                        Query.equal('userId', userId),
                        Query.greaterThanEqual('createdAt', weekStart.toISOString()),
                        Query.limit(100)
                    ]
                );

                const uniqueActionTypes = new Set(weeklyActions.documents.map((action: any) => action.type));
                weeklyProgress = uniqueActionTypes.size;

            } catch (actionsError) {
                console.warn('Could not fetch action details:', actionsError);
                // Use defaults
            }

            return {
                totalPoints,
                rank,
                nextRank: null,
                todayPoints,
                weeklyProgress,
                streak,
            };

        } catch (error) {
            console.error('Error getting user stats:', error);

            // Return safe defaults on error
            return {
                totalPoints: 0,
                rank: calculateBelieverRank(0),
                nextRank: null,
                todayPoints: 0,
                weeklyProgress: 0,
                streak: 0,
            };
        }
    }

    /**
     * Get leaderboard data
     */
    static async getLeaderboard(limit = 50): Promise<Array<{
        userId: string;
        username: string;
        displayName: string;
        profileImage: string;
        totalPoints: number;
        rank: any;
        weeklyPoints: number;
        isVerifiedKOL: boolean;
    }>> {
        try {
            // Get users sorted by believerPoints
            const usersResponse = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [
                    Query.orderDesc('believerPoints'),
                    Query.limit(limit)
                ]
            );

            const users = usersResponse.documents;

            // Format leaderboard
            const leaderboard = users.map((user: any) => ({
                userId: user.$id, // Use document ID
                username: user.username || 'anonymous',
                displayName: user.displayName || user.username || 'Anonymous',
                profileImage: user.profileImage || '',
                totalPoints: user.believerPoints || 0,
                rank: calculateBelieverRank(user.believerPoints || 0),
                weeklyPoints: 0, // Could calculate from actions if needed
                isVerifiedKOL: user.isVerifiedKOL || false
            }));

            return leaderboard;

        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return [];
        }
    }

    /**
     * Get project leaderboard
     */
    static async getProjectLeaderboard(limit = 20): Promise<Array<{
        projectId: string;
        projectName: string;
        totalPoints: number;
        totalUpvotes: number;
        totalReviews: number;
        averageRating: number;
        momentum: number;
    }>> {
        try {
            // Fallback: get projects from your existing projects collection
            const projectsResponse = await databases.listDocuments(
                DATABASE_ID,
                'projects', // Your existing projects collection ID
                [
                    Query.orderDesc('bobScore'),
                    Query.limit(limit)
                ]
            );

            return projectsResponse.documents.map((project: any) => ({
                projectId: project.$id,
                projectName: project.name || 'Unnamed Project',
                totalPoints: (project.upvotes?.length || 0) * 75 + (project.reviews || 0) * 100,
                totalUpvotes: project.upvotes?.length || 0,
                totalReviews: project.reviews || 0,
                averageRating: 0, // Would need to calculate from reviews
                momentum: 0
            }));

        } catch (error) {
            console.error('Error getting project leaderboard:', error);
            return [];
        }
    }

    /**
     * Helper methods
     */
    private static async getUserRecord(userId: string): Promise<any> {
        try {
            // Get user by document ID
            const response = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId
            );
            return response;
        } catch (error) {
            console.error('Error getting user record:', error);
            return null;
        }
    }

    private static async updateUserBelieverPoints(userId: string, pointsToAdd: number): Promise<void> {
        try {
            // Get current user record by document ID
            const userRecord = await this.getUserRecord(userId);
            if (!userRecord) {
                console.error('User record not found:', userId);
                return;
            }

            const currentPoints = userRecord.believerPoints || 0;
            const newPoints = currentPoints + pointsToAdd;
            const newRank = calculateBelieverRank(newPoints);

            // Update user record by document ID
            await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId,
                {
                    believerPoints: newPoints,
                    believerRank: newRank.name,
                    lastActiveAt: new Date().toISOString()
                }
            );

            console.log(`✅ Updated user ${userId}: +${pointsToAdd} points (total: ${newPoints})`);

        } catch (error) {
            console.error('Error updating user believer points:', error);
        }
    }
}