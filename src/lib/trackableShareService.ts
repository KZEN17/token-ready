// src/lib/trackableShareService.ts
import { BelieverPointsService } from './believerPointsService';
import { databases, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';
import { ShareGenerationResult, ShareTrackingData, ShareEvent, ShareVerificationResult, PointsAwardResult } from './types';


// Collection ID for share tracking (add this to your Appwrite database)
export const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

export class TrackableShareService {

    /**
     * Step 1: Generate a trackable share link
     * Creates unique URL with tracking parameters
     */
    static async generateTrackableShare(
        userId: string,
        projectId: string,
        projectName: string,
        projectTicker: string
    ): Promise<ShareGenerationResult> {
        // Generate unique share ID
        const shareId = this.generateShareId();

        // Create trackable project URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tokenready.io';
        const trackableUrl = `${baseUrl}/project/${projectId}?share=${shareId}&ref=${userId}`;

        // Create Twitter intent with trackable URL
        const tweetText = this.generateTweetText(projectName, projectTicker, trackableUrl);
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

        // Store tracking data
        const trackingData: Omit<ShareTrackingData, '$id'> = {
            shareId,
            userId,
            projectId,
            shareUrl: trackableUrl,
            twitterIntentUrl,
            clickCount: 0,
            shareCount: 0,
            conversionCount: 0,
            events: [{
                type: 'click',
                timestamp: new Date().toISOString(),
                metadata: { action: 'share_generated' }
            }],
            pointsAwarded: false,
            verified: false,
            createdAt: new Date().toISOString()
        };

        try {
            await databases.createDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                ID.unique(),
                trackingData
            );
            console.log(`📊 Created trackable share: ${shareId}`);
        } catch (error) {
            console.error('Failed to store tracking data:', error);
            // Continue anyway - basic functionality still works
        }

        return {
            shareId,
            trackableUrl,
            twitterIntentUrl
        };
    }

    /**
     * Step 2: Track when someone clicks the Twitter intent
     * Called when user clicks the share button
     */
    static async trackShareClick(
        shareId: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        try {
            const event: ShareEvent = {
                type: 'twitter_open',
                timestamp: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
                metadata
            };

            await this.addTrackingEvent(shareId, event);
            await this.incrementCounter(shareId, 'clickCount');

            console.log(`📊 Tracked Twitter intent click for share: ${shareId}`);
        } catch (error) {
            console.error('Failed to track share click:', error);
        }
    }

    /**
     * Step 3: Track when someone visits via the shared link
     * Called on your project page when someone visits with ?share= parameter
     */
    static async trackReferralVisit(
        shareId: string,
        referrer?: string,
        userAgent?: string
    ): Promise<ShareVerificationResult> {
        try {
            // Get share data
            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return { isValidShare: false, shouldAwardPoints: false };
            }

            // Track the referral visit
            const event: ShareEvent = {
                type: 'referral_visit',
                timestamp: new Date().toISOString(),
                referrer,
                userAgent,
                metadata: { fromShare: true }
            };

            await this.addTrackingEvent(shareId, event);
            await this.incrementCounter(shareId, 'conversionCount');

            // Check if this came from Twitter (indicating successful share)
            const isFromTwitter = this.isTwitterReferrer(referrer);
            const shouldAwardPoints = isFromTwitter && !shareData.pointsAwarded;

            if (shouldAwardPoints) {
                await this.markShareAsVerified(shareId);
            }

            console.log(`🔗 Tracked referral visit for share: ${shareId}, from Twitter: ${isFromTwitter}`);

            return {
                isValidShare: true,
                shareData,
                shouldAwardPoints
            };

        } catch (error) {
            console.error('Failed to track referral visit:', error);
            return { isValidShare: false, shouldAwardPoints: false };
        }
    }

    /**
     * Step 4: Award points for successful shares
     * Called when we detect a valid Twitter share
     */
    static async awardSharePoints(shareId: string): Promise<PointsAwardResult> {
        try {
            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                return { success: false, error: 'Share not found' };
            }

            if (shareData.pointsAwarded) {
                return { success: false, error: 'Points already awarded' };
            }

            // Award believer points
            const result = await BelieverPointsService.awardPoints(
                shareData.userId,
                'create_tweet',
                shareData.projectId,
                {
                    shareId,
                    method: 'trackable_link',
                    shareUrl: shareData.shareUrl,
                    conversionCount: shareData.conversionCount
                }
            );

            // Mark as awarded
            await this.markPointsAwarded(shareId);

            console.log(`🎉 Awarded ${result.points} points for share: ${shareId}`);

            return { success: true, points: result.points };

        } catch (error) {
            console.error('Failed to award share points:', error);
            return { success: false, error: 'Failed to award points' };
        }
    }

    /**
     * Advanced: Detect shares through popup monitoring
     * This works when Twitter intent is opened in a popup
     */
    static setupTwitterIntentTracking(shareId: string): {
        openTwitterIntent: (url: string) => void;
        cleanup: () => void;
    } {
        let popup: Window | null = null;
        let checkClosed: NodeJS.Timeout;

        const openTwitterIntent = (url: string) => {
            // Track the click
            this.trackShareClick(shareId, { method: 'popup' });

            // Open Twitter in popup
            popup = window.open(
                url,
                'twitter-intent',
                'width=600,height=400,scrollbars=yes,resizable=yes'
            );

            // Monitor popup closure
            checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed);

                    // Popup closed - likely shared
                    setTimeout(() => {
                        this.detectShareCompletion(shareId);
                    }, 1000);
                }
            }, 1000);
        };

        const cleanup = () => {
            if (checkClosed) clearInterval(checkClosed);
            if (popup && !popup.closed) popup.close();
        };

        return { openTwitterIntent, cleanup };
    }

    /**
     * Detect if share was likely completed
     * Uses various heuristics to determine if user actually shared
     */
    static async detectShareCompletion(shareId: string): Promise<void> {
        try {
            // Add detection event
            const event: ShareEvent = {
                type: 'share_detected',
                timestamp: new Date().toISOString(),
                metadata: {
                    method: 'popup_closed',
                    confidence: 'medium' // Could be 'high', 'medium', 'low'
                }
            };

            await this.addTrackingEvent(shareId, event);

            // Check for referral confirmation after a delay
            const shareData = await this.getShareData(shareId);
            if (shareData && !shareData.pointsAwarded) {
                // Wait a bit to see if we get a referral visit
                setTimeout(() => {
                    this.checkForReferralConfirmation(shareId);
                }, 30000); // Wait 30 seconds
            }

        } catch (error) {
            console.error('Failed to detect share completion:', error);
        }
    }

    /**
     * Get analytics for a user's shares
     */
    static async getUserShareAnalytics(userId: string): Promise<{
        totalShares: number;
        totalClicks: number;
        totalConversions: number;
        totalPointsEarned: number;
        recentShares: ShareTrackingData[];
    }> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('createdAt'),
                    Query.limit(50)
                ]
            );

            const shares = response.documents as unknown as ShareTrackingData[];

            const analytics = {
                totalShares: shares.length,
                totalClicks: shares.reduce((sum, share) => sum + share.clickCount, 0),
                totalConversions: shares.reduce((sum, share) => sum + share.conversionCount, 0),
                totalPointsEarned: shares.filter(share => share.pointsAwarded).length * 150,
                recentShares: shares.slice(0, 10)
            };

            return analytics;

        } catch (error) {
            console.error('Failed to get user share analytics:', error);
            return {
                totalShares: 0,
                totalClicks: 0,
                totalConversions: 0,
                totalPointsEarned: 0,
                recentShares: []
            };
        }
    }

    // Private Helper Methods
    private static generateShareId(): string {
        return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private static generateTweetText(
        projectName: string,
        projectTicker: string,
        trackableUrl: string
    ): string {
        const templates = [
            `🚀 Just discovered ${projectName} ($${projectTicker}) on @TokenReady! 

This project has serious potential. Check it out:

${trackableUrl}

#crypto #DeFi #TokenReady`,

            `💎 Found a gem: ${projectName} ($${projectTicker})

Built by a solid team with real utility. Worth checking out on @TokenReady:

${trackableUrl}

#crypto #altcoin`,

            `⚡ ${projectName} ($${projectTicker}) looks promising!

The fundamentals are strong and the community is growing. See for yourself:

${trackableUrl}

@TokenReady #cryptocurrency`
        ];

        return templates[Math.floor(Math.random() * templates.length)];
    }

    private static isTwitterReferrer(referrer?: string): boolean {
        if (!referrer) return false;

        const twitterDomains = ['twitter.com', 't.co', 'x.com', 'mobile.twitter.com'];
        return twitterDomains.some(domain => referrer.includes(domain));
    }

    private static async getShareData(shareId: string): Promise<ShareTrackingData | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [Query.equal('shareId', shareId)]
            );

            return response.documents.length > 0 ?
                response.documents[0] as unknown as ShareTrackingData : null;
        } catch (error) {
            console.error('Failed to get share data:', error);
            return null;
        }
    }

    private static async addTrackingEvent(shareId: string, event: ShareEvent): Promise<void> {
        const shareData = await this.getShareData(shareId);
        if (!shareData) return;

        const updatedEvents = [...shareData.events, event];

        await databases.updateDocument(
            DATABASE_ID,
            SHARE_TRACKING_COLLECTION_ID,
            shareData.$id!,
            {
                events: updatedEvents,
                lastClickedAt: new Date().toISOString()
            }
        );
    }

    private static async incrementCounter(
        shareId: string,
        field: 'clickCount' | 'shareCount' | 'conversionCount'
    ): Promise<void> {
        const shareData = await this.getShareData(shareId);
        if (!shareData) return;

        await databases.updateDocument(
            DATABASE_ID,
            SHARE_TRACKING_COLLECTION_ID,
            shareData.$id!,
            { [field]: shareData[field] + 1 }
        );
    }

    private static async markShareAsVerified(shareId: string): Promise<void> {
        const shareData = await this.getShareData(shareId);
        if (!shareData) return;

        await databases.updateDocument(
            DATABASE_ID,
            SHARE_TRACKING_COLLECTION_ID,
            shareData.$id!,
            {
                verified: true,
                verifiedAt: new Date().toISOString()
            }
        );
    }

    private static async markPointsAwarded(shareId: string): Promise<void> {
        const shareData = await this.getShareData(shareId);
        if (!shareData) return;

        await databases.updateDocument(
            DATABASE_ID,
            SHARE_TRACKING_COLLECTION_ID,
            shareData.$id!,
            { pointsAwarded: true }
        );
    }

    private static async checkForReferralConfirmation(shareId: string): Promise<void> {
        const shareData = await this.getShareData(shareId);
        if (!shareData || shareData.pointsAwarded) return;

        // If we have referral visits from Twitter, award points
        const hasTwitterReferral = shareData.events.some(event =>
            event.type === 'referral_visit' &&
            event.referrer &&
            this.isTwitterReferrer(event.referrer)
        );

        if (hasTwitterReferral) {
            await this.awardSharePoints(shareId);
        }
    }
}