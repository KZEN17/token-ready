// src/lib/vca/storage.ts


/**
 * Abstract storage interface for VCA data
 * Implement this with your specific storage solution (Appwrite, Firebase, etc.)
 */
export interface VCAStorageInterface {
    // VCA management
    saveVCA(address: string, metadata: VCAMetadata): Promise<void>;
    getVCA(address: string): Promise<VCAMetadata | null>;
    getVCABySlug(slug: string): Promise<{ address: string, metadata: VCAMetadata } | null>;
    listVCAs(limit?: number, offset?: number): Promise<{ address: string, metadata: VCAMetadata }[]>;

    // Activity tracking
    addActivity(vcaAddress: string, activity: VCAActivity): Promise<void>;
    getActivities(vcaAddress: string, limit?: number): Promise<VCAActivity[]>;

    // Contract mapping
    saveMapping(mapping: VCAMapping): Promise<void>;
    getMapping(vcaAddress: string): Promise<VCAMapping | null>;
    getVCAByTokenAddress(tokenAddress: string): Promise<{ address: string, metadata: VCAMetadata } | null>;
}

// Implementation example for Appwrite
import { ID, Query } from 'appwrite';
import { databases, DATABASE_ID } from '../appwrite';
import { VCAMetadata, VCAActivity, VCAMapping } from '../types';
import { VCAProtocol } from './protocol';

// Collection IDs - replace with your actual collection IDs
const VCA_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_COLLECTION_ID || 'vcas';
const VCA_ACTIVITY_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_ACTIVITY_COLLECTION_ID || 'vca_activities';
const VCA_MAPPING_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_MAPPING_COLLECTION_ID || 'vca_mappings';

export class AppwriteVCAStorage implements VCAStorageInterface {
    async saveVCA(address: string, metadata: VCAMetadata): Promise<void> {
        try {
            // Check if VCA already exists
            const existing = await this.getVCA(address);

            if (existing) {
                // Update existing VCA
                await databases.updateDocument(
                    DATABASE_ID,
                    VCA_COLLECTION,
                    address, // Using address as document ID
                    metadata
                );
            } else {
                // Create new VCA
                await databases.createDocument(
                    DATABASE_ID,
                    VCA_COLLECTION,
                    address, // Using address as document ID
                    metadata
                );
            }
        } catch (error) {
            console.error('Error saving VCA:', error);
            throw new Error('Failed to save VCA');
        }
    }

    async getVCA(address: string): Promise<VCAMetadata | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                VCA_COLLECTION,
                address
            );

            return response as unknown as VCAMetadata;
        } catch (error) {
            if ((error as any).code === 404) {
                return null;
            }
            console.error('Error getting VCA:', error);
            throw new Error('Failed to get VCA');
        }
    }

    async getVCABySlug(slug: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [Query.equal('projectSlug', slug)]
            );

            if (response.documents.length === 0) {
                return null;
            }

            const doc = response.documents[0];
            return {
                address: doc.$id,
                metadata: doc as unknown as VCAMetadata
            };
        } catch (error) {
            console.error('Error getting VCA by slug:', error);
            throw new Error('Failed to get VCA by slug');
        }
    }

    async listVCAs(limit = 50, offset = 0): Promise<{ address: string, metadata: VCAMetadata }[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [
                    Query.limit(limit),
                    Query.offset(offset),
                    Query.orderDesc('createdAt')
                ]
            );

            return response.documents.map(doc => ({
                address: doc.$id,
                metadata: doc as unknown as VCAMetadata
            }));
        } catch (error) {
            console.error('Error listing VCAs:', error);
            throw new Error('Failed to list VCAs');
        }
    }

    async addActivity(vcaAddress: string, activity: VCAActivity): Promise<void> {
        try {
            await databases.createDocument(
                DATABASE_ID,
                VCA_ACTIVITY_COLLECTION,
                ID.unique(),
                {
                    vcaAddress,
                    ...activity
                }
            );

            // Update VCA metadata if needed
            const vca = await this.getVCA(vcaAddress);
            if (vca) {
                // Get updated counts
                const activities = await this.getActivities(vcaAddress);

                // Count unique backers and activities by type
                const backers = new Set();
                let reviews = 0;
                let shares = 0;

                activities.forEach(act => {
                    backers.add(act.userId);
                    if (act.type === 'review') reviews++;
                    if (act.type === 'share') shares++;
                });

                // Update signal score
                const updatedMetadata = VCAProtocol.updateSignalScore(
                    vca,
                    backers.size,
                    shares,
                    reviews
                );

                await this.saveVCA(vcaAddress, updatedMetadata);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            throw new Error('Failed to add activity');
        }
    }

    async getActivities(vcaAddress: string, limit = 100): Promise<VCAActivity[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_ACTIVITY_COLLECTION,
                [
                    Query.equal('vcaAddress', vcaAddress),
                    Query.orderDesc('timestamp'),
                    Query.limit(limit)
                ]
            );

            return response.documents.map(doc => ({
                type: doc.type,
                userId: doc.userId,
                timestamp: doc.timestamp,
                details: doc.details
            }));
        } catch (error) {
            console.error('Error getting activities:', error);
            throw new Error('Failed to get activities');
        }
    }

    async saveMapping(mapping: VCAMapping): Promise<void> {
        try {
            // Check if mapping already exists
            const existing = await this.getMapping(mapping.vca);

            if (existing) {
                // Update existing mapping
                await databases.updateDocument(
                    DATABASE_ID,
                    VCA_MAPPING_COLLECTION,
                    mapping.vca, // Using VCA address as document ID
                    mapping
                );
            } else {
                // Create new mapping
                await databases.createDocument(
                    DATABASE_ID,
                    VCA_MAPPING_COLLECTION,
                    mapping.vca, // Using VCA address as document ID
                    mapping
                );
            }

            // Also update the VCA metadata
            const vca = await this.getVCA(mapping.vca);
            if (vca) {
                await this.saveVCA(mapping.vca, {
                    ...vca,
                    tokenAddress: mapping.tokenAddress
                });
            }
        } catch (error) {
            console.error('Error saving mapping:', error);
            throw new Error('Failed to save mapping');
        }
    }

    async getMapping(vcaAddress: string): Promise<VCAMapping | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                VCA_MAPPING_COLLECTION,
                vcaAddress
            );

            return response as unknown as VCAMapping;
        } catch (error) {
            if ((error as any).code === 404) {
                return null;
            }
            console.error('Error getting mapping:', error);
            throw new Error('Failed to get mapping');
        }
    }

    async getVCAByTokenAddress(tokenAddress: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        try {
            // First find the mapping
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_MAPPING_COLLECTION,
                [Query.equal('tokenAddress', tokenAddress)]
            );

            if (response.documents.length === 0) {
                return null;
            }

            const mapping = response.documents[0];
            const vcaAddress = mapping.$id;

            // Then get the VCA metadata
            const vca = await this.getVCA(vcaAddress);

            if (!vca) {
                return null;
            }

            return {
                address: vcaAddress,
                metadata: vca
            };
        } catch (error) {
            console.error('Error getting VCA by token address:', error);
            throw new Error('Failed to get VCA by token address');
        }
    }
}