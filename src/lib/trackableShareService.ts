// src/lib/trackableShareService.ts - UPDATED with Production URL and Reshare Prevention

import { BelieverPointsService } from './believerPointsService';
import { databases, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';
import { ShareGenerationResult, ShareTrackingData, ShareEvent, ShareVerificationResult, PointsAwardResult } from './types';

// Use exact same collection ID as manual test
export const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

export class TrackableShareService {

    /**
     * UPDATED: Generate trackable share with production URL and reshare prevention
     */
    static async generateTrackableShare(
        userId: string,
        projectId: string,
        projectName: string,
        projectTicker: string
    ): Promise<ShareGenerationResult> {
        console.log('🔗 TrackableShareService.generateTrackableShare called with:', {
            userId,
            projectId,
            projectName,
            projectTicker
        });

        // FIRST: Check if user has already shared this project
        const existingShare = await this.getUserProjectShare(userId, projectId);
        if (existingShare) {
            console.log('❌ User has already shared this project:', existingShare);
            throw new Error('You have already shared this project. Each user can only share a project once.');
        }

        // Generate unique share ID
        const shareId = this.generateShareId();

        // UPDATED: Use production URL for deployed environment
        const baseUrl = this.getBaseUrl();
        const trackableUrl = `${baseUrl}/project/${projectId}?share=${shareId}&ref=${userId}`;

        // Create Twitter intent with trackable URL
        const tweetText = this.generateTweetText(projectName, projectTicker, trackableUrl);
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

        // Store tracking data in EXACT same format as manual test
        const trackingData = {
            shareId: shareId,
            userId: userId, // CRITICAL: This must be user.$id
            projectId: projectId,
            shareUrl: trackableUrl,
            twitterIntentUrl: twitterIntentUrl,
            clickCount: 0,
            shareCount: 0,
            conversionCount: 0,
            events: JSON.stringify([{
                type: 'share_generated',
                timestamp: new Date().toISOString(),
                metadata: {
                    method: 'service_api',
                    baseUrl,
                    environment: process.env.NODE_ENV
                }
            }]),
            pointsAwarded: false,
            verified: false,
            createdAt: new Date().toISOString()
        };

        try {
            console.log('💾 Creating trackable share record:', trackingData);

            const response = await databases.createDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                ID.unique(),
                trackingData
            );

            console.log('✅ Trackable share created successfully:', response);

            return {
                shareId,
                trackableUrl,
                twitterIntentUrl
            };
        } catch (error) {
            console.error('❌ Failed to store tracking data:', error);
            // Continue anyway - basic functionality still works
            return {
                shareId,
                trackableUrl,
                twitterIntentUrl
            };
        }
    }

    /**
     * NEW: Check if a user has already shared a specific project
     */
    static async hasUserSharedProject(userId: string, projectId: string): Promise<boolean> {
        try {
            console.log(`🔍 Checking if user ${userId} has shared project ${projectId}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.equal('projectId', projectId),
                    Query.limit(1)
                ]
            );

            const hasShared = response.documents.length > 0;
            console.log(`📊 User has ${hasShared ? 'already' : 'not'} shared this project`);

            return hasShared;
        } catch (error) {
            console.error('❌ Failed to check user share status:', error);
            return false; // Default to allowing shares on error
        }
    }

    /**
     * NEW: Get user's existing share for a project (if any)
     */
    static async getUserProjectShare(userId: string, projectId: string): Promise<ShareTrackingData | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.equal('projectId', projectId),
                    Query.orderDesc('createdAt'),
                    Query.limit(1)
                ]
            );

            return response.documents.length > 0 ?
                this.parseShareData(response.documents[0]) : null;
        } catch (error) {
            console.error('❌ Failed to get user project share:', error);
            return null;
        }
    }

    /**
     * Get project sharers with better debugging
     */
    static async getProjectSharers(projectId: string, limit = 10): Promise<Array<{
        userId: string;
        shareId: string;
        verified: boolean;
        pointsAwarded: boolean;
        createdAt: string;
    }>> {
        try {
            console.log(`🔍 TrackableShareService.getProjectSharers called with:`, {
                projectId,
                limit,
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID
            });

            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.equal('projectId', projectId),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit)
                ]
            );

            console.log(`📊 Raw database response:`, {
                total: response.total,
                documentsCount: response.documents.length,
                firstDocument: response.documents[0] || 'No documents'
            });

            if (response.documents.length === 0) {
                console.log(`ℹ️ No share documents found for project ${projectId}`);
                return [];
            }

            const result = response.documents.map((doc, index) => {
                console.log(`📋 [${index}] Processing share document:`, {
                    docId: doc.$id,
                    userId: doc.userId,
                    shareId: doc.shareId,
                    verified: doc.verified,
                    pointsAwarded: doc.pointsAwarded,
                    createdAt: doc.createdAt,
                    projectId: doc.projectId
                });

                // Validate required fields
                if (!doc.userId || !doc.shareId) {
                    console.warn(`⚠️ [${index}] Missing required fields in document:`, doc);
                }

                return {
                    userId: doc.userId || 'unknown',
                    shareId: doc.shareId || 'unknown',
                    verified: Boolean(doc.verified),
                    pointsAwarded: Boolean(doc.pointsAwarded),
                    createdAt: doc.createdAt || new Date().toISOString()
                };
            });

            console.log(`✅ Returning ${result.length} sharers:`, result);
            return result;

        } catch (error) {
            console.error('❌ TrackableShareService.getProjectSharers failed:', error);
            return [];
        }
    }

    /**
     * Track referral visit with enhanced verification
     */
    static async trackReferralVisit(
        shareId: string,
        referrer?: string,
        userAgent?: string
    ): Promise<ShareVerificationResult> {
        try {
            console.log(`🔗 Tracking referral visit for shareId: ${shareId}`);

            // Get share data
            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                console.log(`❌ Share not found: ${shareId}`);
                return { isValidShare: false, shouldAwardPoints: false };
            }

            console.log(`📊 Found share data:`, shareData);

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

            // Enhanced point awarding logic
            const isFromTwitter = this.isTwitterReferrer(referrer);
            const shouldAwardPoints = !shareData.pointsAwarded; // Award if not already awarded

            console.log(`🎯 Share analysis:`, {
                isFromTwitter,
                alreadyAwarded: shareData.pointsAwarded,
                shouldAwardPoints,
                referrer
            });

            if (shouldAwardPoints) {
                console.log(`🎉 Awarding points for successful referral visit`);
                await this.markShareAsVerified(shareId);
                await this.awardSharePoints(shareId);
            }

            return {
                isValidShare: true,
                shareData,
                shouldAwardPoints
            };

        } catch (error) {
            console.error('❌ Failed to track referral visit:', error);
            return { isValidShare: false, shouldAwardPoints: false };
        }
    }

    /**
     * Award points for a successful share
     */
    static async awardSharePoints(shareId: string): Promise<PointsAwardResult> {
        try {
            console.log(`🎯 Attempting to award points for share: ${shareId}`);

            const shareData = await this.getShareData(shareId);

            if (!shareData) {
                console.error(`❌ Share not found: ${shareId}`);
                return { success: false, error: 'Share not found' };
            }

            if (shareData.pointsAwarded) {
                console.log(`ℹ️ Points already awarded for share: ${shareId}`);
                return { success: false, error: 'Points already awarded' };
            }

            console.log(`🎯 Awarding points to user: ${shareData.userId} for project: ${shareData.projectId}`);

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

            console.log(`🎉 Successfully awarded ${result.points} points for share: ${shareId}`);

            return { success: true, points: result.points };

        } catch (error) {
            console.error('❌ Failed to award share points:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return { success: false, error: `Failed to award points: ${errorMessage}` };
        }
    }

    /**
     * Get user's share analytics
     */
    static async getUserShareAnalytics(userId: string): Promise<{
        totalShares: number;
        totalClicks: number;
        totalConversions: number;
        totalPointsEarned: number;
        recentShares: ShareTrackingData[];
    }> {
        try {
            console.log(`📊 Getting share analytics for user: ${userId}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('createdAt'),
                    Query.limit(50)
                ]
            );

            const shares = response.documents.map(doc => this.parseShareData(doc)) as ShareTrackingData[];

            const analytics = {
                totalShares: shares.length,
                totalClicks: shares.reduce((sum, share) => sum + share.clickCount, 0),
                totalConversions: shares.reduce((sum, share) => sum + share.conversionCount, 0),
                totalPointsEarned: shares.filter(share => share.pointsAwarded).length * 150,
                recentShares: shares.slice(0, 10)
            };

            console.log(`📊 User analytics:`, analytics);
            return analytics;

        } catch (error) {
            console.error('❌ Failed to get user share analytics:', error);
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

    /**
     * Get the correct base URL for the environment
     */
    private static getBaseUrl(): string {
        // In production, always use the deployed URL
        if (process.env.NODE_ENV === 'production') {
            return 'https://tokenready.vercel.app';
        }

        // In development, use local or environment URL
        return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }

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
                this.parseShareData(response.documents[0]) : null;
        } catch (error) {
            console.error('❌ Failed to get share data:', error);
            return null;
        }
    }

    private static parseShareData(doc: any): ShareTrackingData {
        return {
            ...doc,
            events: typeof doc.events === 'string' ? JSON.parse(doc.events) : (doc.events || [])
        } as ShareTrackingData;
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
                events: JSON.stringify(updatedEvents),
                lastClickedAt: new Date().toISOString()
            }
        );
    }

    private static async incrementCounter(
        shareId: string,
        field: 'clickCount' | 'shareCount' | 'conversionCount'
    ): Promise<void> {
        try {
            const shareData = await this.getShareData(shareId);
            if (!shareData) return;

            await databases.updateDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                shareData.$id!,
                { [field]: shareData[field] + 1 }
            );
        } catch (error) {
            console.error(`❌ Failed to increment ${field}:`, error);
        }
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
}