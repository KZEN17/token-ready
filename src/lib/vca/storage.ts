// src/lib/vca/storage.ts - COMPLETE REWRITE
import { ID, Query } from 'appwrite';
import { databases, DATABASE_ID } from '../appwrite';
import { VCAMetadata, VCAActivity, VCAMapping } from '../types';
import { VCAProtocol } from './protocol';

// Collection IDs from environment variables
const VCA_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_COLLECTION_ID || 'vcas';
const VCA_ACTIVITY_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_ACTIVITY_COLLECTION_ID || 'vca_activities';
const VCA_MAPPING_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_MAPPING_COLLECTION_ID || 'vca_mappings';

/**
 * Appwrite implementation of VCA storage
 */
export class AppwriteVCAStorage {
    /**
     * Save a VCA to the database
     * 
     * @param address The VCA address
     * @param metadata The VCA metadata
     */
    async saveVCA(address: string, metadata: VCAMetadata): Promise<void> {
        try {
            console.log(`[Storage] Saving VCA with address: ${address}`, metadata);

            // Convert metadata to a format suitable for Appwrite
            const documentData = {
                projectId: metadata.projectId,
                owner: metadata.owner,
                signalScore: metadata.signalScore || 0,
                uniqueBackers: metadata.uniqueBackers || 0,
                reviews: metadata.reviews || 0,
                followers: metadata.followers || 0,
                createdAt: metadata.createdAt,
                ...(metadata.tokenAddress ? { tokenAddress: metadata.tokenAddress } : {})
            };

            console.log('[Storage] Prepared document data:', documentData);

            // Always use a consistent ID format - the VCA address
            // First check if it already exists
            try {
                const existingDoc = await databases.getDocument(
                    DATABASE_ID,
                    VCA_COLLECTION,
                    address
                );

                // If we get here, document exists - update it
                console.log(`[Storage] Updating existing VCA document with ID: ${address}`);
                await databases.updateDocument(
                    DATABASE_ID,
                    VCA_COLLECTION,
                    address,
                    documentData
                );
                console.log(`[Storage] Successfully updated VCA document: ${address}`);
            } catch (err) {
                // Document doesn't exist (404) or other error
                if ((err as any).code === 404) {
                    // Create new document with VCA address as the ID
                    console.log(`[Storage] Creating new VCA document with ID: ${address}`);
                    await databases.createDocument(
                        DATABASE_ID,
                        VCA_COLLECTION,
                        address, // Use address as document ID
                        documentData
                    );
                    console.log(`[Storage] Successfully created VCA document: ${address}`);
                } else {
                    // Some other error - rethrow
                    throw err;
                }
            }
        } catch (error) {
            console.error(`[Storage] Failed to save VCA with address ${address}:`, error);
            throw new Error(`Failed to save VCA: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get a VCA by its address
     * 
     * @param address The VCA address
     * @returns The VCA metadata or null if not found
     */
    async getVCA(address: string): Promise<VCAMetadata | null> {
        try {
            console.log(`[Storage] Getting VCA with address: ${address}`);

            // Get document directly by ID (address)
            const doc = await databases.getDocument(
                DATABASE_ID,
                VCA_COLLECTION,
                address
            );

            console.log(`[Storage] Found VCA document:`, doc);

            // Convert Appwrite document to VCAMetadata
            const metadata: VCAMetadata = {
                projectId: doc.projectId,
                owner: doc.owner,
                signalScore: doc.signalScore || 0,
                uniqueBackers: doc.uniqueBackers || 0,
                reviews: doc.reviews || 0,
                followers: doc.followers || 0,
                createdAt: doc.createdAt,
                tokenAddress: doc.tokenAddress
            };

            return metadata;
        } catch (error) {
            // If document not found, return null
            if ((error as any).code === 404) {
                console.log(`[Storage] No VCA found with address: ${address}`);
                return null;
            }

            console.error(`[Storage] Error getting VCA with address ${address}:`, error);
            throw new Error(`Failed to get VCA: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get a VCA by project ID
     * 
     * @param projectId The project ID
     * @returns The VCA with address and metadata, or null if not found
     */
    async getVCAByProjectId(projectId: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        try {
            console.log(`[Storage] Getting VCA by projectId: ${projectId}`);

            // Query by projectId field
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [Query.equal('projectId', projectId)]
            );

            if (response.documents.length === 0) {
                console.log(`[Storage] No VCA found for projectId: ${projectId}`);
                return null;
            }

            const doc = response.documents[0];
            console.log(`[Storage] Found VCA for projectId ${projectId}:`, doc);

            // Document ID should be the address
            const address = doc.$id;

            // Convert Appwrite document to VCAMetadata
            const metadata: VCAMetadata = {
                projectId: doc.projectId,
                owner: doc.owner,
                signalScore: doc.signalScore || 0,
                uniqueBackers: doc.uniqueBackers || 0,
                reviews: doc.reviews || 0,
                followers: doc.followers || 0,
                createdAt: doc.createdAt,
                tokenAddress: doc.tokenAddress
            };

            return {
                address,
                metadata
            };
        } catch (error) {
            console.error(`[Storage] Error getting VCA by projectId ${projectId}:`, error);
            throw new Error(`Failed to get VCA by projectId: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * List all VCAs with pagination
     * 
     * @param limit Maximum number of VCAs to return
     * @param offset Offset for pagination
     * @returns Array of VCAs with addresses and metadata
     */
    async listVCAs(limit = 50, offset = 0): Promise<{ address: string, metadata: VCAMetadata }[]> {
        try {
            console.log(`[Storage] Listing VCAs: limit=${limit}, offset=${offset}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [
                    Query.limit(limit),
                    Query.offset(offset),
                    Query.orderDesc('createdAt')
                ]
            );

            console.log(`[Storage] Found ${response.documents.length} VCAs`);

            return response.documents.map(doc => {
                // Document ID should be the address
                const address = doc.$id;

                // Convert Appwrite document to VCAMetadata
                const metadata: VCAMetadata = {
                    projectId: doc.projectId,
                    owner: doc.owner,
                    signalScore: doc.signalScore || 0,
                    uniqueBackers: doc.uniqueBackers || 0,
                    reviews: doc.reviews || 0,
                    followers: doc.followers || 0,
                    createdAt: doc.createdAt,
                    tokenAddress: doc.tokenAddress
                };

                return {
                    address,
                    metadata
                };
            });
        } catch (error) {
            console.error('[Storage] Error listing VCAs:', error);
            throw new Error(`Failed to list VCAs: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Add activity to a VCA
     * 
     * @param vcaAddress The VCA address
     * @param activity The activity to add
     */
    async addActivity(vcaAddress: string, activity: VCAActivity): Promise<void> {
        try {
            console.log(`[Storage] Adding activity to VCA ${vcaAddress}:`, activity);

            // Create activity document
            await databases.createDocument(
                DATABASE_ID,
                VCA_ACTIVITY_COLLECTION,
                ID.unique(),
                {
                    vcaAddress,
                    type: activity.type,
                    userId: activity.userId,
                    timestamp: activity.timestamp,
                    details: activity.details || {}
                }
            );

            console.log(`[Storage] Activity added to VCA ${vcaAddress}`);

            // Update VCA metadata with new stats
            const vca = await this.getVCA(vcaAddress);
            if (vca) {
                // Get all activities for this VCA
                const activities = await this.getActivities(vcaAddress);
                console.log(`[Storage] Found ${activities.length} activities for VCA ${vcaAddress}`);

                // Count unique backers and activities by type
                const backers = new Set<string>();
                let reviews = 0;
                let shares = 0;

                activities.forEach(act => {
                    backers.add(act.userId);
                    if (act.type === 'review') reviews++;
                    if (act.type === 'share') shares++;
                });

                console.log(`[Storage] VCA ${vcaAddress} stats: ${backers.size} backers, ${reviews} reviews, ${shares} shares`);

                // Update signal score
                const updatedMetadata = VCAProtocol.updateSignalScore(
                    vca,
                    backers.size,
                    shares,
                    reviews
                );

                console.log(`[Storage] Updating VCA ${vcaAddress} metadata with new signal score: ${updatedMetadata.signalScore}`);

                await this.saveVCA(vcaAddress, updatedMetadata);
            }
        } catch (error) {
            console.error(`[Storage] Error adding activity to VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to add activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get activities for a VCA
     * 
     * @param vcaAddress The VCA address
     * @param limit Maximum number of activities to return
     * @returns Array of activities
     */
    async getActivities(vcaAddress: string, limit = 100): Promise<VCAActivity[]> {
        try {
            console.log(`[Storage] Getting activities for VCA ${vcaAddress}: limit=${limit}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_ACTIVITY_COLLECTION,
                [
                    Query.equal('vcaAddress', vcaAddress),
                    Query.orderDesc('timestamp'),
                    Query.limit(limit)
                ]
            );

            console.log(`[Storage] Found ${response.documents.length} activities for VCA ${vcaAddress}`);

            return response.documents.map(doc => ({
                type: doc.type,
                userId: doc.userId,
                timestamp: doc.timestamp,
                details: doc.details || {}
            }));
        } catch (error) {
            console.error(`[Storage] Error getting activities for VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to get activities: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Save a mapping between a VCA and a token contract
     * 
     * @param mapping The mapping to save
     */
    async saveMapping(mapping: VCAMapping): Promise<void> {
        try {
            console.log(`[Storage] Saving mapping for VCA ${mapping.vca} to token ${mapping.tokenAddress}`);

            // Always create/update with VCA address as the document ID
            try {
                // Try to get the document first to determine if it exists
                const existingDoc = await databases.getDocument(
                    DATABASE_ID,
                    VCA_MAPPING_COLLECTION,
                    mapping.vca
                );

                // Document exists, update it
                console.log(`[Storage] Updating existing mapping for VCA ${mapping.vca}`);
                await databases.updateDocument(
                    DATABASE_ID,
                    VCA_MAPPING_COLLECTION,
                    mapping.vca,
                    {
                        vca: mapping.vca,
                        tokenAddress: mapping.tokenAddress,
                        timestamp: mapping.timestamp
                    }
                );
            } catch (err) {
                // Document doesn't exist (404) or other error
                if ((err as any).code === 404) {
                    // Create new document
                    console.log(`[Storage] Creating new mapping for VCA ${mapping.vca}`);
                    await databases.createDocument(
                        DATABASE_ID,
                        VCA_MAPPING_COLLECTION,
                        mapping.vca, // Use VCA address as document ID
                        {
                            vca: mapping.vca,
                            tokenAddress: mapping.tokenAddress,
                            timestamp: mapping.timestamp
                        }
                    );
                } else {
                    // Some other error - rethrow
                    throw err;
                }
            }

            console.log(`[Storage] Mapping saved for VCA ${mapping.vca}`);

            // Also update the VCA metadata with the token address
            const vca = await this.getVCA(mapping.vca);
            if (vca) {
                console.log(`[Storage] Updating VCA ${mapping.vca} metadata with token address: ${mapping.tokenAddress}`);
                await this.saveVCA(mapping.vca, {
                    ...vca,
                    tokenAddress: mapping.tokenAddress
                });
            }
        } catch (error) {
            console.error(`[Storage] Error saving mapping for VCA ${mapping.vca}:`, error);
            throw new Error(`Failed to save mapping: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get a mapping by VCA address
     * 
     * @param vcaAddress The VCA address
     * @returns The mapping or null if not found
     */
    async getMapping(vcaAddress: string): Promise<VCAMapping | null> {
        try {
            console.log(`[Storage] Getting mapping for VCA ${vcaAddress}`);

            const response = await databases.getDocument(
                DATABASE_ID,
                VCA_MAPPING_COLLECTION,
                vcaAddress
            );

            console.log(`[Storage] Found mapping for VCA ${vcaAddress}:`, response);

            return {
                vca: response.vca,
                tokenAddress: response.tokenAddress,
                timestamp: response.timestamp
            };
        } catch (error) {
            // If document not found, return null
            if ((error as any).code === 404) {
                console.log(`[Storage] No mapping found for VCA ${vcaAddress}`);
                return null;
            }

            console.error(`[Storage] Error getting mapping for VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to get mapping: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get a VCA by token address
     * 
     * @param tokenAddress The token address
     * @returns The VCA with address and metadata, or null if not found
     */
    async getVCAByTokenAddress(tokenAddress: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        try {
            console.log(`[Storage] Getting VCA by token address: ${tokenAddress}`);

            // First find the mapping
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_MAPPING_COLLECTION,
                [Query.equal('tokenAddress', tokenAddress)]
            );

            if (response.documents.length === 0) {
                console.log(`[Storage] No mapping found for token address: ${tokenAddress}`);
                return null;
            }

            const mapping = response.documents[0];
            const vcaAddress = mapping.vca;
            console.log(`[Storage] Found mapping for token address ${tokenAddress}: VCA=${vcaAddress}`);

            // Then get the VCA metadata
            const vca = await this.getVCA(vcaAddress);

            if (!vca) {
                console.log(`[Storage] VCA ${vcaAddress} not found even though mapping exists`);
                return null;
            }

            console.log(`[Storage] Found VCA for token address ${tokenAddress}:`, vca);

            return {
                address: vcaAddress,
                metadata: vca
            };
        } catch (error) {
            console.error(`[Storage] Error getting VCA by token address ${tokenAddress}:`, error);
            throw new Error(`Failed to get VCA by token address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}