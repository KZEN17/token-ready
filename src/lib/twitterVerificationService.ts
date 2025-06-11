// src/lib/twitterVerificationService.ts - FIXED VERSION
import { databases, DATABASE_ID } from './appwrite';
import { BelieverPointsService } from './believerPointsService';
import { Query } from 'appwrite';

const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

export interface TwitterVerificationResult {
    verified: boolean;
    tweetFound: boolean;
    containsRequiredElements: boolean;
    tweetUrl?: string;
    error?: string;
}

export class TwitterVerificationService {

    /**
     * Verify a Twitter share using multiple methods
     */
    static async verifyTwitterShare(
        shareId: string,
        userId: string,
        projectId: string,
        trackableUrl: string
    ): Promise<TwitterVerificationResult> {
        console.log('🔍 Starting Twitter verification for:', { shareId, userId, projectId });

        try {
            // Method 1: Check for referral visits from Twitter
            const referralVerification = await this.verifyViaReferralTracking(shareId);

            if (referralVerification.verified) {
                console.log('✅ Verified via referral tracking');
                await this.markShareAsVerified(shareId, userId, projectId, 'referral_tracking');
                return referralVerification;
            }

            // Method 2: Time-based optimistic verification
            const timeBasedVerification = await this.verifyViaTimeDelay(shareId);

            if (timeBasedVerification.verified) {
                console.log('✅ Verified via time-based method');
                await this.markShareAsVerified(shareId, userId, projectId, 'time_based');
                return timeBasedVerification;
            }

            // Method 3: User behavior verification (checking if they returned to the site)
            const behaviorVerification = await this.verifyViaBehavior(shareId, userId);

            if (behaviorVerification.verified) {
                console.log('✅ Verified via behavior tracking');
                await this.markShareAsVerified(shareId, userId, projectId, 'behavior');
                return behaviorVerification;
            }

            // If no verification method succeeds, use fallback
            console.log('⚠️ No verification method succeeded, using fallback');
            return await this.fallbackVerification(shareId, userId, projectId);

        } catch (error) {
            console.error('❌ Twitter verification error:', error);
            return {
                verified: false,
                tweetFound: false,
                containsRequiredElements: false,
                error: error instanceof Error ? error.message : 'Verification failed'
            };
        }
    }

    /**
     * Method 1: Verify via referral tracking (most reliable)
     */
    private static async verifyViaReferralTracking(shareId: string): Promise<TwitterVerificationResult> {
        try {
            // Check if we've received any visits from Twitter domains for this share
            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return { verified: false, tweetFound: false, containsRequiredElements: false };
            }

            // Parse events to look for Twitter referrals
            const events = typeof shareData.events === 'string'
                ? JSON.parse(shareData.events)
                : shareData.events || [];

            const twitterReferrals = events.filter((event: any) =>
                event.type === 'referral_visit' &&
                event.referrer &&
                this.isTwitterReferrer(event.referrer)
            );

            const hasConversions = shareData.conversionCount > 0;
            const hasTwitterReferrals = twitterReferrals.length > 0;

            if (hasConversions || hasTwitterReferrals) {
                return {
                    verified: true,
                    tweetFound: true,
                    containsRequiredElements: true
                };
            }

            return { verified: false, tweetFound: false, containsRequiredElements: false };

        } catch (error) {
            console.error('❌ Referral verification failed:', error);
            return { verified: false, tweetFound: false, containsRequiredElements: false };
        }
    }

    /**
     * Method 2: Time-based optimistic verification
     */
    private static async verifyViaTimeDelay(shareId: string): Promise<TwitterVerificationResult> {
        try {
            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return { verified: false, tweetFound: false, containsRequiredElements: false };
            }

            // Check if enough time has passed (5+ minutes) and user opened Twitter intent
            const createdAt = new Date(shareData.createdAt);
            const now = new Date();
            const timeDiff = now.getTime() - createdAt.getTime();
            const minutesPassed = timeDiff / (1000 * 60);

            const events = typeof shareData.events === 'string'
                ? JSON.parse(shareData.events)
                : shareData.events || [];

            const hasTwitterIntent = events.some((event: any) =>
                event.type === 'twitter_intent_opened'
            );

            // If Twitter intent was opened and 5+ minutes have passed, consider it verified
            if (hasTwitterIntent && minutesPassed >= 5) {
                return {
                    verified: true,
                    tweetFound: true, // Assumed
                    containsRequiredElements: true // Assumed
                };
            }

            return { verified: false, tweetFound: false, containsRequiredElements: false };

        } catch (error) {
            console.error('❌ Time-based verification failed:', error);
            return { verified: false, tweetFound: false, containsRequiredElements: false };
        }
    }

    /**
     * Method 3: User behavior verification
     */
    private static async verifyViaBehavior(shareId: string, userId: string): Promise<TwitterVerificationResult> {
        try {
            // Check if user has performed actions indicating they shared successfully
            // (e.g., returned to site, checked their points, etc.)

            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return { verified: false, tweetFound: false, containsRequiredElements: false };
            }

            // Look for positive signals in user behavior
            const events = typeof shareData.events === 'string'
                ? JSON.parse(shareData.events)
                : shareData.events || [];

            const hasPositiveSignals = events.some((event: any) =>
                event.type === 'twitter_intent_opened' ||
                event.type === 'user_returned'
            );

            // Simple behavior verification based on Twitter intent usage
            if (hasPositiveSignals) {
                return {
                    verified: true,
                    tweetFound: true, // Assumed based on behavior
                    containsRequiredElements: true
                };
            }

            return { verified: false, tweetFound: false, containsRequiredElements: false };

        } catch (error) {
            console.error('❌ Behavior verification failed:', error);
            return { verified: false, tweetFound: false, containsRequiredElements: false };
        }
    }

    /**
     * Fallback verification for when other methods fail
     */
    private static async fallbackVerification(
        shareId: string,
        userId: string,
        projectId: string
    ): Promise<TwitterVerificationResult> {
        try {
            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return { verified: false, tweetFound: false, containsRequiredElements: false };
            }

            // Check if user at least opened Twitter intent
            const events = typeof shareData.events === 'string'
                ? JSON.parse(shareData.events)
                : shareData.events || [];

            const openedTwitter = events.some((event: any) =>
                event.type === 'twitter_intent_opened'
            );

            if (openedTwitter) {
                // Give user benefit of the doubt if they opened Twitter
                console.log('ℹ️ Using fallback verification - user opened Twitter intent');

                // Mark with lower confidence
                await this.markShareAsVerified(shareId, userId, projectId, 'fallback');

                return {
                    verified: true,
                    tweetFound: false, // Unknown
                    containsRequiredElements: false // Unknown
                };
            }

            return { verified: false, tweetFound: false, containsRequiredElements: false };

        } catch (error) {
            console.error('❌ Fallback verification failed:', error);
            return { verified: false, tweetFound: false, containsRequiredElements: false };
        }
    }

    /**
     * Mark a share as verified and award points
     * FIXED: Now stores verification method in the event metadata instead of as a separate field
     */
    private static async markShareAsVerified(
        shareId: string,
        userId: string,
        projectId: string,
        verificationMethod: string
    ): Promise<void> {
        try {
            const shareData = await this.getShareData(shareId);

            if (!shareData || shareData.verified) {
                console.log('ℹ️ Share already verified or not found');
                return;
            }

            // Update share record
            const events = typeof shareData.events === 'string'
                ? JSON.parse(shareData.events)
                : shareData.events || [];

            const updatedEvents = [
                ...events,
                {
                    type: 'share_verified',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        method: verificationMethod,
                        confidence: this.getConfidenceLevel(verificationMethod)
                    }
                }
            ];

            // FIXED: No longer including verificationMethod field in document update
            await databases.updateDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                shareData.$id!,
                {
                    verified: true,
                    pointsAwarded: true,
                    verifiedAt: new Date().toISOString(),
                    events: JSON.stringify(updatedEvents)
                    // verificationMethod field removed from here
                }
            );

            // Award believer points
            try {
                await BelieverPointsService.awardPoints(
                    userId,
                    'create_tweet',
                    projectId,
                    {
                        shareId,
                        method: 'trackable_link',
                        verificationMethod, // Still include in metadata for the points service
                        verified: true
                    }
                );

                console.log(`✅ Points awarded for verified share: ${shareId}`);
            } catch (pointsError) {
                console.error('❌ Failed to award points:', pointsError);
            }

        } catch (error) {
            console.error('❌ Failed to mark share as verified:', error);
        }
    }

    /**
     * Get confidence level for verification method
     */
    private static getConfidenceLevel(method: string): string {
        switch (method) {
            case 'referral_tracking': return 'high';
            case 'time_based': return 'medium';
            case 'behavior': return 'medium';
            case 'fallback': return 'low';
            default: return 'unknown';
        }
    }

    /**
     * Check if referrer is from Twitter
     */
    private static isTwitterReferrer(referrer: string): boolean {
        const twitterDomains = ['twitter.com', 't.co', 'x.com', 'mobile.twitter.com'];
        return twitterDomains.some(domain => referrer.includes(domain));
    }

    /**
     * Get share data from database
     */
    private static async getShareData(shareId: string): Promise<any> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [Query.equal('shareId', shareId)]
            );

            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.error('❌ Failed to get share data:', error);
            return null;
        }
    }

    /**
     * Background verification job (can be called periodically)
     */
    static async verifyPendingShares(): Promise<void> {
        try {
            console.log('🔄 Running background verification for pending shares...');

            // Get unverified shares older than 5 minutes
            const fiveMinutesAgo = new Date();
            fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.equal('verified', false),
                    Query.lessThan('createdAt', fiveMinutesAgo.toISOString()),
                    Query.limit(50)
                ]
            );

            console.log(`📊 Found ${response.documents.length} pending shares to verify`);

            for (const share of response.documents) {
                try {
                    const result = await this.verifyTwitterShare(
                        share.shareId,
                        share.userId,
                        share.projectId,
                        share.shareUrl
                    );

                    if (result.verified) {
                        console.log(`✅ Background verification successful for share: ${share.shareId}`);
                    } else {
                        console.log(`❌ Background verification failed for share: ${share.shareId}`);
                    }
                } catch (shareError) {
                    console.error(`❌ Error verifying share ${share.shareId}:`, shareError);
                }
            }

        } catch (error) {
            console.error('❌ Background verification job failed:', error);
        }
    }

    /**
     * Manual verification endpoint (for admin use)
     * FIXED: Now stores the verification method in event metadata instead of document field
     */
    static async manuallyVerifyShare(
        shareId: string,
        adminUserId: string,
        tweetUrl?: string
    ): Promise<TwitterVerificationResult> {
        try {
            console.log(`🔧 Manual verification requested by admin ${adminUserId} for share: ${shareId}`);

            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return {
                    verified: false,
                    tweetFound: false,
                    containsRequiredElements: false,
                    error: 'Share not found'
                };
            }

            if (shareData.verified) {
                return {
                    verified: true,
                    tweetFound: true,
                    containsRequiredElements: true,
                    error: 'Already verified'
                };
            }

            // Log manual verification
            const events = typeof shareData.events === 'string'
                ? JSON.parse(shareData.events)
                : shareData.events || [];

            const updatedEvents = [
                ...events,
                {
                    type: 'manual_verification',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        adminUserId,
                        tweetUrl: tweetUrl || null,
                        method: 'admin_override'
                    }
                }
            ];

            // FIXED: Store verification info in event metadata, not as a separate field
            await databases.updateDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                shareData.$id,
                {
                    verified: true,
                    pointsAwarded: true,
                    verifiedAt: new Date().toISOString(),
                    events: JSON.stringify(updatedEvents),
                    manuallyVerified: true,
                    manualVerificationBy: adminUserId,
                    tweetUrl: tweetUrl || null
                    // verificationMethod field removed from here
                }
            );

            // Award points
            try {
                await BelieverPointsService.awardPoints(
                    shareData.userId,
                    'create_tweet',
                    shareData.projectId,
                    {
                        shareId,
                        method: 'manual_verification',
                        tweetUrl: tweetUrl || null
                    }
                );
            } catch (pointsError) {
                console.error('❌ Failed to award points during manual verification:', pointsError);
            }

            console.log(`✅ Manual verification completed for share: ${shareId}`);

            return {
                verified: true,
                tweetFound: true,
                containsRequiredElements: true,
                tweetUrl
            };

        } catch (error) {
            console.error('❌ Manual verification failed:', error);
            return {
                verified: false,
                tweetFound: false,
                containsRequiredElements: false,
                error: error instanceof Error ? error.message : 'Manual verification failed'
            };
        }
    }

    /**
     * Get verification statistics
     * FIXED: Now gets verification method from event metadata
     */
    static async getVerificationStats(): Promise<{
        total: number;
        verified: number;
        pending: number;
        verificationRate: number;
        byMethod: Record<string, number>;
    }> {
        try {
            // Get all shares
            const allShares = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [Query.limit(1000)]
            );

            const total = allShares.total;
            const verified = allShares.documents.filter(share => share.verified).length;
            const pending = total - verified;
            const verificationRate = total > 0 ? (verified / total) * 100 : 0;

            // Count by verification method (from event metadata)
            const byMethod: Record<string, number> = {};

            for (const share of allShares.documents) {
                if (!share.verified) continue;

                try {
                    // Parse events to find verification method
                    const events = typeof share.events === 'string'
                        ? JSON.parse(share.events)
                        : share.events || [];

                    // Find the verification event
                    const verificationEvent = events.find((event: any) =>
                        event.type === 'share_verified' ||
                        event.type === 'manual_verification'
                    );

                    if (verificationEvent && verificationEvent.metadata && verificationEvent.metadata.method) {
                        const method = verificationEvent.metadata.method;
                        byMethod[method] = (byMethod[method] || 0) + 1;
                    } else {
                        byMethod['unknown'] = (byMethod['unknown'] || 0) + 1;
                    }
                } catch (parseError) {
                    console.error('Error parsing share events:', parseError);
                    byMethod['error'] = (byMethod['error'] || 0) + 1;
                }
            }

            return {
                total,
                verified,
                pending,
                verificationRate: Math.round(verificationRate * 100) / 100,
                byMethod
            };

        } catch (error) {
            console.error('❌ Failed to get verification stats:', error);
            return {
                total: 0,
                verified: 0,
                pending: 0,
                verificationRate: 0,
                byMethod: {}
            };
        }
    }
}