// src/lib/trackableShareService.ts - FIXED KEY METHODS

import { BelieverPointsService } from './believerPointsService';
import { databases, DATABASE_ID } from './appwrite';
import { ID, Query } from 'appwrite';
import { ShareGenerationResult, ShareTrackingData, ShareEvent, ShareVerificationResult, PointsAwardResult } from './types';

// FIXED: Use exact same collection ID as manual test
export const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

export class TrackableShareService {

    /**
     * FIXED: Generate trackable share - now matches manual test format exactly
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

        // Generate unique share ID (same format as manual test)
        const shareId = this.generateShareId();

        // Create trackable project URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tokenready.io';
        const trackableUrl = `${baseUrl}/project/${projectId}?share=${shareId}&ref=${userId}`;

        // Create Twitter intent with trackable URL
        const tweetText = this.generateTweetText(projectName, projectTicker, trackableUrl);
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

        // FIXED: Store tracking data in EXACT same format as manual test
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
                metadata: { method: 'service_api' }
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
     * FIXED: Get project sharers - now with better debugging
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

            // FIXED: Process and return the results with better validation
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

            // Log debugging info
            console.log(`🔍 Error context:`, {
                projectId,
                limit,
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                errorStack: error instanceof Error ? error.stack : undefined
            });

            return [];
        }
    }

    /**
     * FIXED: Track referral visit - optimistic points awarding
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

            // FIXED: More aggressive point awarding
            const isFromTwitter = this.isTwitterReferrer(referrer);
            const shouldAwardPoints = !shareData.pointsAwarded; // Award if not already awarded

            console.log(`🎯 Share analysis:`, {
                isFromTwitter,
                alreadyAwarded: shareData.pointsAwarded,
                shouldAwardPoints
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
     * FIXED: Award share points with better error handling
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

            // Award believer points using the same service as manual test
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

    // Private Helper Methods (same as before but with better logging)
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