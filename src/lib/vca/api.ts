// src/lib/vca/api.ts
import { VCAMetadata, VCAActivity, VCAMapping } from '../types';
import { VCAProtocol } from './protocol';
import { AppwriteVCAStorage } from './storage';

// Create a singleton instance of the storage
const vcaStorage = new AppwriteVCAStorage();

export class VCAApi {
    /**
     * Create a new VCA for a project
     */
    static async createVCA(slug: string, owner: string): Promise<{ address: string, metadata: VCAMetadata }> {
        // Check if VCA already exists for this slug
        const existing = await vcaStorage.getVCABySlug(slug);
        if (existing) {
            return existing;
        }

        // Create new VCA
        const vca = VCAProtocol.createVCA(slug, owner);

        // Save to storage
        await vcaStorage.saveVCA(vca.address, vca.metadata);

        return vca;
    }

    /**
     * Get VCA details by address
     */
    static async getVCA(address: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        // Validate address format
        if (!VCAProtocol.isValidAddress(address)) {
            throw new Error('Invalid VCA address format');
        }

        const metadata = await vcaStorage.getVCA(address);
        if (!metadata) {
            return null;
        }

        return { address, metadata };
    }

    /**
     * Get VCA by project slug
     */
    static async getVCABySlug(slug: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        return vcaStorage.getVCABySlug(slug);
    }

    /**
     * List all VCAs with pagination
     */
    static async listVCAs(limit?: number, offset?: number): Promise<{ address: string, metadata: VCAMetadata }[]> {
        return vcaStorage.listVCAs(limit, offset);
    }

    /**
     * Record activity for a VCA
     */
    static async addActivity(vcaAddress: string, activity: VCAActivity): Promise<void> {
        // Validate address format
        if (!VCAProtocol.isValidAddress(vcaAddress)) {
            throw new Error('Invalid VCA address format');
        }

        // Check if VCA exists
        const vca = await vcaStorage.getVCA(vcaAddress);
        if (!vca) {
            throw new Error('VCA not found');
        }

        await vcaStorage.addActivity(vcaAddress, activity);
    }

    /**
     * Get activities for a VCA
     */
    static async getActivities(vcaAddress: string, limit?: number): Promise<VCAActivity[]> {
        // Validate address format
        if (!VCAProtocol.isValidAddress(vcaAddress)) {
            throw new Error('Invalid VCA address format');
        }

        return vcaStorage.getActivities(vcaAddress, limit);
    }

    /**
     * Map VCA to real contract
     */
    static async mapToContract(vcaAddress: string, tokenAddress: string): Promise<VCAMapping> {
        // Validate addresses
        if (!VCAProtocol.isValidAddress(vcaAddress)) {
            throw new Error('Invalid VCA address format');
        }
        if (!VCAProtocol.isValidAddress(tokenAddress)) {
            throw new Error('Invalid token address format');
        }

        // Check if VCA exists
        const vca = await vcaStorage.getVCA(vcaAddress);
        if (!vca) {
            throw new Error('VCA not found');
        }

        const mapping = VCAProtocol.mapToContract(vcaAddress, tokenAddress);

        await vcaStorage.saveMapping(mapping);

        return mapping;
    }

    /**
     * Get mapping for a VCA
     */
    static async getMapping(vcaAddress: string): Promise<VCAMapping | null> {
        // Validate address format
        if (!VCAProtocol.isValidAddress(vcaAddress)) {
            throw new Error('Invalid VCA address format');
        }

        return vcaStorage.getMapping(vcaAddress);
    }

    /**
     * Get VCA by token address
     */
    static async getVCAByTokenAddress(tokenAddress: string): Promise<{ address: string, metadata: VCAMetadata } | null> {
        // Validate address format
        if (!VCAProtocol.isValidAddress(tokenAddress)) {
            throw new Error('Invalid token address format');
        }

        return vcaStorage.getVCAByTokenAddress(tokenAddress);
    }
}