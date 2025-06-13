// src/lib/vca/api.ts - FIXED VERSION
import { VCAMetadata, VCAActivity, VCAMapping } from '../types';
import { VCAProtocol } from './protocol';
import { AppwriteVCAStorage } from './storage';

// Create a singleton instance of the storage
const vcaStorage = new AppwriteVCAStorage();

export class VCAApi {
    /**
     * Create a new VCA for a project
     */
    // Add this to your createVCA method in src/lib/vca/api.ts
    static async createVCA(slug: string, owner: string): Promise<{ address: string, metadata: VCAMetadata }> {
        console.log(`VCAApi.createVCA: Creating VCA for slug=${slug}, owner=${owner}`);

        try {
            // Check if VCA already exists for this slug
            let existing = null;
            try {
                existing = await vcaStorage.getVCABySlug(slug);
                console.log(`Checked for existing VCA with slug=${slug}, result:`, existing);
            } catch (existingError) {
                console.error(`Error checking for existing VCA:`, existingError);
            }

            if (existing) {
                console.log(`VCA already exists for slug=${slug}:`, existing);
                return existing;
            }

            // Create new VCA
            console.log(`Creating new VCA with slug=${slug}, owner=${owner}`);
            const vca = VCAProtocol.createVCA(slug, owner);
            console.log(`Created new VCA object:`, vca);

            // Save to storage - this is where the error likely happens
            console.log(`Attempting to save VCA to storage: address=${vca.address}`);
            try {
                await vcaStorage.saveVCA(vca.address, vca.metadata);
                console.log(`Successfully saved VCA to storage: address=${vca.address}`);
            } catch (saveError) {
                console.error(`Failed to save VCA to storage:`, saveError);
                throw new Error(`Failed to save VCA to storage: ${saveError || 'Unknown storage error'}`);
            }

            return vca;
        } catch (error) {
            // Detailed error logging
            console.error(`Failed to create VCA for slug=${slug}:`, error);
            if (error instanceof Error) {
                console.error(`Error name: ${error.name}, message: ${error.message}`);
                console.error(`Error stack: ${error.stack}`);
            }
            throw new Error(`Failed to create VCA: ${error || 'Unknown error'}`);
        }
    }

    /**
     * Get VCA details by address
     */
    static async getVCA(address: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        console.log(`VCAApi.getVCA: Getting VCA details for address=${address}`);

        try {
            // Validate address format
            if (!VCAProtocol.isValidAddress(address)) {
                console.error(`Invalid VCA address format: ${address}`);
                throw new Error('Invalid VCA address format');
            }

            const metadata = await vcaStorage.getVCA(address);
            if (!metadata) {
                console.log(`No VCA found for address=${address}`);
                return null;
            }

            console.log(`Found VCA for address=${address}:`, metadata);
            return { address, metadata };
        } catch (error) {
            console.error(`Failed to get VCA for address=${address}:`, error);
            throw new Error(`Failed to get VCA:  'Unknown error'}`);
        }
    }

    /**
     * Get VCA by project slug
     */
    static async getVCABySlug(slug: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        console.log(`VCAApi.getVCABySlug: Getting VCA for slug=${slug}`);

        try {
            // Important: Normalize the slug to ensure consistency
            const normalizedSlug = slug.trim().toLowerCase();
            console.log(`Normalized slug: ${normalizedSlug}`);

            const result = await vcaStorage.getVCABySlug(normalizedSlug);
            console.log(`Result for slug=${normalizedSlug}:`, result);

            if (!result) {
                console.log(`No VCA found for slug=${normalizedSlug}`);
                return null;
            }

            return result;
        } catch (error) {
            console.error(`Failed to get VCA for slug=${slug}:`, error);

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

    /**
     * List all VCAs with pagination
     */
    static async listVCAs(limit?: number, offset?: number): Promise<{ address: string, metadata: VCAMetadata }[]> {
        console.log(`VCAApi.listVCAs: Listing VCAs with limit=${limit}, offset=${offset}`);

        try {
            const results = await vcaStorage.listVCAs(limit, offset);
            console.log(`Found ${results.length} VCAs`);
            return results;
        } catch (error) {
            console.error(`Failed to list VCAs:`, error);
            throw new Error(`Failed to list VCAs:  'Unknown error'}`);
        }
    }

    /**
     * Record activity for a VCA
     */
    static async addActivity(vcaAddress: string, activity: VCAActivity): Promise<void> {
        console.log(`VCAApi.addActivity: Adding activity to VCA address=${vcaAddress}:`, activity);

        try {
            // Validate address format
            if (!VCAProtocol.isValidAddress(vcaAddress)) {
                console.error(`Invalid VCA address format: ${vcaAddress}`);
                throw new Error('Invalid VCA address format');
            }

            // Check if VCA exists
            const vca = await vcaStorage.getVCA(vcaAddress);
            if (!vca) {
                console.error(`VCA not found for address=${vcaAddress}`);
                throw new Error('VCA not found');
            }

            await vcaStorage.addActivity(vcaAddress, activity);
            console.log(`Activity added to VCA ${vcaAddress}`);
        } catch (error) {
            console.error(`Failed to add activity to VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to add activity:  'Unknown error'}`);
        }
    }

    /**
     * Get activities for a VCA
     */
    static async getActivities(vcaAddress: string, limit?: number): Promise<VCAActivity[]> {
        console.log(`VCAApi.getActivities: Getting activities for VCA address=${vcaAddress}, limit=${limit}`);

        try {
            // Validate address format
            if (!VCAProtocol.isValidAddress(vcaAddress)) {
                console.error(`Invalid VCA address format: ${vcaAddress}`);
                throw new Error('Invalid VCA address format');
            }

            const activities = await vcaStorage.getActivities(vcaAddress, limit);
            console.log(`Found ${activities.length} activities for VCA ${vcaAddress}`);
            return activities;
        } catch (error) {
            console.error(`Failed to get activities for VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to get activities:  'Unknown error'}`);
        }
    }

    /**
     * Map VCA to real contract
     */
    static async mapToContract(vcaAddress: string, tokenAddress: string): Promise<VCAMapping> {
        console.log(`VCAApi.mapToContract: Mapping VCA ${vcaAddress} to contract ${tokenAddress}`);

        try {
            // Validate addresses
            if (!VCAProtocol.isValidAddress(vcaAddress)) {
                console.error(`Invalid VCA address format: ${vcaAddress}`);
                throw new Error('Invalid VCA address format');
            }
            if (!VCAProtocol.isValidAddress(tokenAddress)) {
                console.error(`Invalid token address format: ${tokenAddress}`);
                throw new Error('Invalid token address format');
            }

            // Check if VCA exists
            const vca = await vcaStorage.getVCA(vcaAddress);
            if (!vca) {
                console.error(`VCA not found for address=${vcaAddress}`);
                throw new Error('VCA not found');
            }

            const mapping = VCAProtocol.mapToContract(vcaAddress, tokenAddress);
            console.log(`Created mapping:`, mapping);

            await vcaStorage.saveMapping(mapping);
            console.log(`Saved mapping to storage`);

            return mapping;
        } catch (error) {
            console.error(`Failed to map VCA ${vcaAddress} to contract ${tokenAddress}:`, error);
            throw new Error(`Failed to map to contract:  'Unknown error'}`);
        }
    }

    /**
     * Get mapping for a VCA
     */
    static async getMapping(vcaAddress: string): Promise<VCAMapping | null> {
        console.log(`VCAApi.getMapping: Getting mapping for VCA address=${vcaAddress}`);

        try {
            // Validate address format
            if (!VCAProtocol.isValidAddress(vcaAddress)) {
                console.error(`Invalid VCA address format: ${vcaAddress}`);
                throw new Error('Invalid VCA address format');
            }

            const mapping = await vcaStorage.getMapping(vcaAddress);
            console.log(`Mapping for VCA ${vcaAddress}:`, mapping);
            return mapping;
        } catch (error) {
            console.error(`Failed to get mapping for VCA ${vcaAddress}:`, error);
            throw new Error(`Failed to get mapping:  'Unknown error'}`);
        }
    }

    /**
     * Get VCA by token address
     */
    static async getVCAByTokenAddress(tokenAddress: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        console.log(`VCAApi.getVCAByTokenAddress: Getting VCA for token address=${tokenAddress}`);

        try {
            // Validate address format
            if (!VCAProtocol.isValidAddress(tokenAddress)) {
                console.error(`Invalid token address format: ${tokenAddress}`);
                throw new Error('Invalid token address format');
            }

            const result = await vcaStorage.getVCAByTokenAddress(tokenAddress);
            console.log(`Result for token address=${tokenAddress}:`, result);
            return result;
        } catch (error) {
            console.error(`Failed to get VCA by token address ${tokenAddress}:`, error);
            throw new Error(`Failed to get VCA by token address:  'Unknown error'}`);
        }
    }
}