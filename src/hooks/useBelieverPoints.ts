// src/hooks/useBelieverPoints.ts (Fixed version)
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { BelieverPointsService } from '@/lib/believerPointsService';
import {
    BelieverActionType,
    canPerformAction,
    calculateBelieverRank
} from '@/lib/believerPoints';

interface UseBelieverPointsReturn {
    // User stats
    totalPoints: number;
    rank: any;
    todayPoints: number;
    weeklyProgress: number;
    streak: number;
    loading: boolean;
    error: string | null;

    // Actions
    awardPoints: (actionType: BelieverActionType, projectId?: string, metadata?: any) => Promise<void>;
    canPerformAction: (actionType: BelieverActionType) => Promise<{ canPerform: boolean; reason?: string }>;
    checkDailyCheckin: () => Promise<boolean>;

    // Refresh
    refreshStats: () => Promise<void>;
}

export const useBelieverPoints = (): UseBelieverPointsReturn => {
    const { user, authenticated, updateUserPoints } = useUser();

    const [totalPoints, setTotalPoints] = useState(0);
    const [rank, setRank] = useState(calculateBelieverRank(0));
    const [todayPoints, setTodayPoints] = useState(0);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user stats
    const fetchStats = useCallback(async () => {
        if (!authenticated || !user) {
            // Reset stats for unauthenticated users
            setTotalPoints(0);
            setRank(calculateBelieverRank(0));
            setTodayPoints(0);
            setWeeklyProgress(0);
            setStreak(0);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const stats = await BelieverPointsService.getUserStats(user.$id);

            setTotalPoints(stats.totalPoints);
            setRank(stats.rank);
            setTodayPoints(stats.todayPoints);
            setWeeklyProgress(stats.weeklyProgress);
            setStreak(stats.streak);

        } catch (err) {
            console.error('Error fetching believer points stats:', err);
            setError('Failed to load believer points');
        } finally {
            setLoading(false);
        }
    }, [authenticated, user]);

    // Award points for an action
    const awardPoints = useCallback(async (
        actionType: BelieverActionType,
        projectId?: string,
        metadata?: any
    ) => {
        if (!authenticated || !user) {
            throw new Error('Must be authenticated to award points');
        }

        try {
            const result = await BelieverPointsService.awardPoints(
                user.$id,
                actionType,
                projectId,
                metadata
            );

            // Update local state immediately
            setTotalPoints(prev => prev + result.points);
            setTodayPoints(prev => prev + result.points);

            // Recalculate rank
            const newRank = calculateBelieverRank(totalPoints + result.points);
            setRank(newRank);

            // Also update the user hook's believer points if available
            if (updateUserPoints) {
                try {
                    // Update the user's believerPoints field for consistency
                    await updateUserPoints(0, result.points);
                } catch (updateError) {
                    console.warn('Could not update user hook points:', updateError);
                }
            }

            // Refresh stats from backend to ensure accuracy
            setTimeout(() => {
                fetchStats();
            }, 1000);

            console.log(`✅ Awarded ${result.points} believer points for ${actionType}`);

        } catch (err) {
            console.error('Error awarding points:', err);
            throw err;
        }
    }, [authenticated, user, totalPoints, updateUserPoints, fetchStats]);

    // Check if user can perform action
    const checkCanPerformAction = useCallback(async (
        actionType: BelieverActionType
    ): Promise<{ canPerform: boolean; reason?: string }> => {
        if (!authenticated || !user) {
            return { canPerform: false, reason: 'Must be authenticated' };
        }

        try {
            // Use the basic canPerformAction function for now
            return canPerformAction(actionType);
        } catch (err) {
            console.error('Error checking action availability:', err);
            return { canPerform: false, reason: 'Error checking availability' };
        }
    }, [authenticated, user]);

    // Check daily check-in status
    const checkDailyCheckin = useCallback(async (): Promise<boolean> => {
        if (!authenticated || !user) return false;

        try {
            const canCheckin = await checkCanPerformAction('daily_checkin');
            return canCheckin.canPerform;
        } catch (err) {
            console.error('Error checking daily check-in:', err);
            return false;
        }
    }, [authenticated, user, checkCanPerformAction]);

    // Refresh stats
    const refreshStats = useCallback(async () => {
        await fetchStats();
    }, [fetchStats]);

    // Auto-fetch stats when user changes
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Also fetch stats when user.believerPoints changes (from the user hook)
    useEffect(() => {
        if (user?.believerPoints !== undefined && user.believerPoints !== totalPoints) {
            setTotalPoints(user.believerPoints);
            setRank(calculateBelieverRank(user.believerPoints));
        }
    }, [user?.believerPoints, totalPoints]);

    return {
        totalPoints,
        rank,
        todayPoints,
        weeklyProgress,
        streak,
        loading,
        error,
        awardPoints,
        canPerformAction: checkCanPerformAction,
        checkDailyCheckin,
        refreshStats,
    };
};

// Helper hook for specific actions
export const useBelieverActions = () => {
    const { awardPoints, canPerformAction } = useBelieverPoints();
    const { user, authenticated } = useUser();

    // Award points for upvoting a project
    const awardUpvotePoints = useCallback(async (projectId: string) => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('upvote_project', projectId);
    }, [awardPoints, authenticated]);

    // Award points for writing a review
    const awardReviewPoints = useCallback(async (
        projectId: string,
        rating: number,
        investment: number
    ) => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('write_review', projectId, { rating, investment });
    }, [awardPoints, authenticated]);

    // Award points for submitting a project
    const awardSubmitProjectPoints = useCallback(async (projectId: string) => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('submit_project', projectId);
    }, [awardPoints, authenticated]);

    // Award points for daily check-in
    const awardDailyCheckinPoints = useCallback(async () => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('daily_checkin');
    }, [awardPoints, authenticated]);

    // Award points for staking
    const awardStakingPoints = useCallback(async (stakedAmount: number) => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('stake_tokens', undefined, { stakedAmount });
    }, [awardPoints, authenticated]);

    // Award points for creating a tweet
    const awardTweetPoints = useCallback(async (projectId: string, tweetUrl: string) => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('create_tweet', projectId, { tweetUrl });
    }, [awardPoints, authenticated]);

    // Award points for referring a friend
    const awardReferralPoints = useCallback(async (referredUserId: string) => {
        if (!authenticated) throw new Error('Must be authenticated');

        await awardPoints('refer_friend', undefined, { referredUserId });
    }, [awardPoints, authenticated]);

    return {
        awardUpvotePoints,
        awardReviewPoints,
        awardSubmitProjectPoints,
        awardDailyCheckinPoints,
        awardStakingPoints,
        awardTweetPoints,
        awardReferralPoints,
        canPerformAction,
    };
};