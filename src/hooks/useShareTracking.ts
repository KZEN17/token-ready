// src/hooks/useShareTracking.ts
'use client';

import { useEffect, useState } from 'react';
import { TrackableShareService } from '@/lib/trackableShareService';
import { ShareTrackingData, ShareVerificationResult } from '@/lib/types';

interface UseShareTrackingOptions {
    enableUrlCleanup?: boolean;
    showNotifications?: boolean;
}

interface ShareTrackingState {
    shareId: string | null;
    referrerUserId: string | null;
    isValidShare: boolean;
    pointsAwarded: boolean;
    loading: boolean;
}

export const useShareTracking = (options: UseShareTrackingOptions = {}) => {
    const {
        enableUrlCleanup = true,
        showNotifications = true
    } = options;

    const [trackingState, setTrackingState] = useState<ShareTrackingState>({
        shareId: null,
        referrerUserId: null,
        isValidShare: false,
        pointsAwarded: false,
        loading: false
    });

    useEffect(() => {
        const processShareTracking = async () => {
            // Get URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const shareId = urlParams.get('share');
            const ref = urlParams.get('ref');

            if (!shareId) return;

            setTrackingState(prev => ({
                ...prev,
                shareId,
                referrerUserId: ref,
                loading: true
            }));

            try {
                // Track the referral visit
                const result: ShareVerificationResult = await TrackableShareService.trackReferralVisit(
                    shareId,
                    document.referrer,
                    navigator.userAgent
                );

                setTrackingState(prev => ({
                    ...prev,
                    isValidShare: result.isValidShare,
                    loading: false
                }));

                if (result.shouldAwardPoints) {
                    // Award points
                    const pointsResult = await TrackableShareService.awardSharePoints(shareId);

                    if (pointsResult.success) {
                        setTrackingState(prev => ({
                            ...prev,
                            pointsAwarded: true
                        }));

                        if (showNotifications) {
                            console.log(`🎉 Share tracking: Points awarded for successful share!`);

                            // You could integrate with a toast notification system here
                            // toast.success(`Someone visited via your share! +${pointsResult.points} points`);
                        }
                    }
                }

                // Clean up URL parameters
                if (enableUrlCleanup && window.history.replaceState) {
                    const cleanUrl = window.location.pathname +
                        (window.location.search.replace(/[?&]share=[^&]*/, '').replace(/[?&]ref=[^&]*/, '') || '');
                    window.history.replaceState({}, document.title, cleanUrl);
                }

            } catch (error) {
                console.error('Share tracking error:', error);
                setTrackingState(prev => ({
                    ...prev,
                    loading: false
                }));
            }
        };

        processShareTracking();
    }, [enableUrlCleanup, showNotifications]);

    return trackingState;
};

/**
 * Hook for getting user's share analytics
 */
export const useShareAnalytics = (userId?: string) => {
    const [analytics, setAnalytics] = useState<{
        totalShares: number;
        totalClicks: number;
        totalConversions: number;
        totalPointsEarned: number;
        recentShares: ShareTrackingData[];
        loading: boolean;
        error: string | null;
    }>({
        totalShares: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalPointsEarned: 0,
        recentShares: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!userId) {
                setAnalytics(prev => ({ ...prev, loading: false }));
                return;
            }

            try {
                setAnalytics(prev => ({ ...prev, loading: true, error: null }));

                const data = await TrackableShareService.getUserShareAnalytics(userId);

                setAnalytics({
                    ...data,
                    loading: false,
                    error: null
                });

            } catch (error) {
                console.error('Failed to fetch share analytics:', error);
                setAnalytics(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load analytics'
                }));
            }
        };

        fetchAnalytics();
    }, [userId]);

    return analytics;
};