// src/lib/vca/storage.ts - FIXED VERSION
import { ID, Query } from 'appwrite';
import { databases, DATABASE_ID } from '../appwrite';
import { VCAMetadata, VCAActivity, VCAMapping } from '../types';
import { VCAProtocol } from './protocol';

// Collection IDs - replace with your actual collection IDs
const VCA_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_COLLECTION_ID || 'vcas';
const VCA_ACTIVITY_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_ACTIVITY_COLLECTION_ID || 'vca_activities';
const VCA_MAPPING_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_MAPPING_COLLECTION_ID || 'vca_mappings';

/**
 * Appwrite implementation of VCA storage
 */
export class AppwriteVCAStorage {
    // Replace the saveVCA method in your src/lib/vca/storage.ts file with this version
    async saveVCA(address: string, metadata: VCAMetadata): Promise<void> {
        try {
            console.log(`Attempting to save VCA with address: ${address}`, metadata);

            // Convert metadata to a format suitable for Appwrite
            // This ensures only valid fields are included
            const documentData = {
                projectSlug: metadata.projectSlug,
                owner: metadata.owner,
                signalScore: metadata.signalScore || 0,
                uniqueBackers: metadata.uniqueBackers || 0,
                reviews: metadata.reviews || 0,
                followers: metadata.followers || 0,
                createdAt: metadata.createdAt,
                // Only include tokenAddress if it exists
                ...(metadata.tokenAddress ? { tokenAddress: metadata.tokenAddress } : {})
            };

            console.log('Formatted document data:', documentData);

            // Check if document exists first using list instead of get
            // This avoids permission errors if the document doesn't exist
            const existing = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [Query.equal('$id', address)]
            );

            if (existing.documents.length > 0) {
                // Document exists, update it
                console.log(`Updating existing VCA document with ID: ${address}`);
                await databases.updateDocument(
                    DATABASE_ID,
                    VCA_COLLECTION,
                    address,
                    documentData
                );
                console.log(`Successfully updated VCA document: ${address}`);
            } else {
                // Document doesn't exist, create it
                // Use generated ID instead of address as document ID to avoid potential issues
                console.log(`Creating new VCA document for address: ${address}`);

                // Include the address in the document data so we can reference it
                const newDocumentData = {
                    ...documentData,
                    vcaAddress: address // Store the address as a field
                };

                // Use a unique ID instead of the address as document ID
                const doc = await databases.createDocument(
                    DATABASE_ID,
                    VCA_COLLECTION,
                    ID.unique(), // Generate a unique ID rather than using address
                    newDocumentData
                );

                console.log(`Successfully created VCA document with ID: ${doc.$id}`);
            }
        } catch (error) {
            // Enhanced error handling
            console.error(`Failed to save VCA with address ${address}:`, error);

            // Extract more useful error information
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error(`Error name: ${error.name}`);
                console.error(`Error message: ${error.message}`);
                console.error(`Error stack: ${error.stack}`);
            } else {
                console.error('Non-Error object thrown:', error);
            }

            throw new Error(`Failed to save VCA: ${errorMessage}`);
        }
    }

    async getVCA(address: string): Promise<VCAMetadata | null> {
        try {
            console.log(`Getting VCA with address: ${address}`);

            // Query by vcaAddress field instead of document ID
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [Query.equal('vcaAddress', address)]
            );

            if (response.documents.length === 0) {
                console.log(`No VCA found with address: ${address}`);
                return null;
            }

            const doc = response.documents[0];
            console.log(`Found VCA document:`, doc);

            // Convert Appwrite document to VCAMetadata
            const metadata: VCAMetadata = {
                projectSlug: doc.projectSlug,
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
            console.error(`Error getting VCA with address ${address}:`, error);

            // Enhanced error handling
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error(`Error name: ${error.name}`);
                console.error(`Error message: ${error.message}`);
                console.error(`Error stack: ${error.stack}`);
            }

            throw new Error(`Failed to get VCA: ${errorMessage}`);
        }
    }

    async getVCABySlug(slug: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        try {
            console.log(`Getting VCA by slug: ${slug}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [Query.equal('projectSlug', slug)]
            );

            if (response.documents.length === 0) {
                console.log(`No VCA found for slug: ${slug}`);
                return null;
            }

            const doc = response.documents[0];
            console.log(`Found VCA for slug ${slug}:`, doc);

            // Get address from vcaAddress field
            const address = doc.vcaAddress || doc.$id;

            // Convert Appwrite document to VCAMetadata
            const metadata: VCAMetadata = {
                projectSlug: doc.projectSlug,
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
            console.error(`Error getting VCA by slug ${slug}:`, error);

            // Enhanced error handling
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error(`Error name: ${error.name}`);
                console.error(`Error message: ${error.message}`);
                console.error(`Error stack: ${error.stack}`);
            }

            throw new Error(`Failed to get VCA by slug: ${errorMessage}`);
        }
    }

    async listVCAs(limit = 50, offset = 0): Promise<{ address: string, metadata: VCAMetadata }[]> {
        try {
            console.log(`Listing VCAs: limit=${limit}, offset=${offset}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_COLLECTION,
                [
                    Query.limit(limit),
                    Query.offset(offset),
                    Query.orderDesc('createdAt')
                ]
            );

            console.log(`Found ${response.documents.length} VCAs`);

            return response.documents.map(doc => {
                // Get address from vcaAddress field if available, otherwise use document ID
                const address = doc.vcaAddress || doc.$id;

                // Convert Appwrite document to VCAMetadata
                const metadata: VCAMetadata = {
                    projectSlug: doc.projectSlug,
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
            console.error('Error listing VCAs:', error);

            // Enhanced error handling
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error(`Error name: ${error.name}`);
                console.error(`Error message: ${error.message}`);
                console.error(`Error stack: ${error.stack}`);
            }

            throw new Error(`Failed to list VCAs: ${errorMessage}`);
        }
    }

    async addActivity(vcaAddress: string, activity: VCAActivity): Promise<void> {
        try {
            console.log(`Adding activity to VCA ${vcaAddress}:`, activity);

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

            console.log(`Activity added to VCA ${vcaAddress}`);

            // Update VCA metadata
            const vca = await this.getVCA(vcaAddress);
            if (vca) {
                // Get updated counts
                const activities = await this.getActivities(vcaAddress);
                console.log(`Found ${activities.length} activities for VCA ${vcaAddress}`);

                // Count unique backers and activities by type
                const backers = new Set<string>();
                let reviews = 0;
                let shares = 0;

                activities.forEach(act => {
                    backers.add(act.userId);
                    if (act.type === 'review') reviews++;
                    if (act.type === 'share') shares++;
                });

                console.log(`VCA ${vcaAddress} stats: ${backers.size} backers, ${reviews} reviews, ${shares} shares`);

                // Update signal score
                const updatedMetadata = VCAProtocol.updateSignalScore(
                    vca,
                    backers.size,
                    shares,
                    reviews
                );

                console.log(`Updating VCA ${vcaAddress} metadata with new signal score: ${updatedMetadata.signalScore}`);

                await this.saveVCA(vcaAddress, updatedMetadata);
            }
        } catch (error) {
            console.error(`Error adding activity to VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to add activity:  'Unknown error'}`);
        }
    }

    async getActivities(vcaAddress: string, limit = 100): Promise<VCAActivity[]> {
        try {
            console.log(`Getting activities for VCA ${vcaAddress}: limit=${limit}`);

            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_ACTIVITY_COLLECTION,
                [
                    Query.equal('vcaAddress', vcaAddress),
                    Query.orderDesc('timestamp'),
                    Query.limit(limit)
                ]
            );

            console.log(`Found ${response.documents.length} activities for VCA ${vcaAddress}`);

            return response.documents.map(doc => ({
                type: doc.type,
                userId: doc.userId,
                timestamp: doc.timestamp,
                details: doc.details || {}
            }));
        } catch (error) {
            console.error(`Error getting activities for VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to get activities:  'Unknown error'}`);
        }
    }

    async saveMapping(mapping: VCAMapping): Promise<void> {
        try {
            console.log(`Saving mapping for VCA ${mapping.vca} to token ${mapping.tokenAddress}`);

            // Check if mapping already exists
            let existing = null;
            try {
                existing = await this.getMapping(mapping.vca);
            } catch (error) {
                // Document doesn't exist, which is fine for a new mapping
                console.log(`No mapping exists yet for VCA ${mapping.vca}`);
            }

            if (existing) {
                // Update existing mapping
                console.log(`Updating existing mapping for VCA ${mapping.vca}`);
                await databases.updateDocument(
                    DATABASE_ID,
                    VCA_MAPPING_COLLECTION,
                    mapping.vca, // Using VCA address as document ID
                    {
                        vca: mapping.vca,
                        tokenAddress: mapping.tokenAddress,
                        timestamp: mapping.timestamp
                    }
                );
            } else {
                // Create new mapping
                console.log(`Creating new mapping for VCA ${mapping.vca}`);
                await databases.createDocument(
                    DATABASE_ID,
                    VCA_MAPPING_COLLECTION,
                    mapping.vca, // Using VCA address as document ID
                    {
                        vca: mapping.vca,
                        tokenAddress: mapping.tokenAddress,
                        timestamp: mapping.timestamp
                    }
                );
            }

            console.log(`Mapping saved for VCA ${mapping.vca}`);

            // Also update the VCA metadata
            const vca = await this.getVCA(mapping.vca);
            if (vca) {
                console.log(`Updating VCA ${mapping.vca} metadata with token address: ${mapping.tokenAddress}`);
                await this.saveVCA(mapping.vca, {
                    ...vca,
                    tokenAddress: mapping.tokenAddress
                });
            }
        } catch (error) {
            console.error(`Error saving mapping for VCA ${mapping.vca}:`, error);
            throw new Error(`Failed to save mapping:  'Unknown error'}`);
        }
    }

    async getMapping(vcaAddress: string): Promise<VCAMapping | null> {
        try {
            console.log(`Getting mapping for VCA ${vcaAddress}`);

            const response = await databases.getDocument(
                DATABASE_ID,
                VCA_MAPPING_COLLECTION,
                vcaAddress
            );

            console.log(`Found mapping for VCA ${vcaAddress}:`, response);

            return {
                vca: response.vca,
                tokenAddress: response.tokenAddress,
                timestamp: response.timestamp
            };
        } catch (error) {
            console.error(`Error getting mapping for VCA ${vcaAddress}:`, error);

            // If document not found, return null
            if ((error as any).code === 404) {
                return null;
            }

            throw new Error(`Failed to get mapping:  'Unknown error'}`);
        }
    }

    async getVCAByTokenAddress(tokenAddress: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        try {
            console.log(`Getting VCA by token address: ${tokenAddress}`);

            // First find the mapping
            const response = await databases.listDocuments(
                DATABASE_ID,
                VCA_MAPPING_COLLECTION,
                [Query.equal('tokenAddress', tokenAddress)]
            );

            if (response.documents.length === 0) {
                console.log(`No mapping found for token address: ${tokenAddress}`);
                return null;
            }

            const mapping = response.documents[0];
            const vcaAddress = mapping.$id;
            console.log(`Found mapping for token address ${tokenAddress}: VCA=${vcaAddress}`);

            // Then get the VCA metadata
            const vca = await this.getVCA(vcaAddress);

            if (!vca) {
                console.log(`VCA ${vcaAddress} not found even though mapping exists`);
                return null;
            }

            console.log(`Found VCA for token address ${tokenAddress}:`, vca);

            return {
                address: vcaAddress,
                metadata: vca
            };
        } catch (error) {
            console.error(`Error getting VCA by token address ${tokenAddress}:`, error);
            throw new Error(`Failed to get VCA by token address:  'Unknown error'}`);
        }
    }
}