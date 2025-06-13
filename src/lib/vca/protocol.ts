// src/lib/vca/protocol.ts
import { ethers } from 'ethers';
import { VCAMapping, VCAMetadata } from '../types';

export class VCAProtocol {
    /**
     * Generate a VCA address from a project slug
     * 
     * @param slug Project slug
     * @param timestamp Optional timestamp or salt
     * @returns EVM-compatible address
     */
    static generateAddress(slug: string, timestamp: string = Date.now().toString()): string {
        try {
            // Create a hash of the slug + timestamp
            const hash = ethers.keccak256(
                ethers.toUtf8Bytes(slug + timestamp)
            );

            // Convert to EVM address format (take last 20 bytes and add 0x prefix)
            const address = ethers.getAddress(
                '0x' + hash.slice(26)
            );

            return address;
        } catch (error) {
            console.error('Error generating VCA address:', error);
            throw new Error('Failed to generate VCA address');
        }
    }

    /**
     * Create a new VCA for a project
     * 
     * @param slug Project slug
     * @param owner Owner address or Twitter handle
     * @returns VCA object with address and metadata
     */
    static createVCA(slug: string, owner: string): { address: string, metadata: VCAMetadata } {
        const timestamp = Date.now().toString();
        const address = this.generateAddress(slug, timestamp);

        const metadata: VCAMetadata = {
            projectSlug: slug,
            owner,
            signalScore: 0,
            uniqueBackers: 0,
            reviews: 0,
            followers: 0,
            createdAt: new Date().toISOString()
        };

        return { address, metadata };
    }

    /**
     * Update signal score for a VCA
     * 
     * @param metadata Current VCA metadata
     * @param backings Number of backings
     * @param shares Number of shares
     * @param reviews Number of reviews
     * @returns Updated metadata
     */
    static updateSignalScore(
        metadata: VCAMetadata,
        backings: number,
        shares: number,
        reviews: number
    ): VCAMetadata {
        // Simple weighted scoring algorithm
        // Adjust weights as needed for your specific use case
        const backingWeight = 1;
        const shareWeight = 0.5;
        const reviewWeight = 2;

        const signalScore =
            (backings * backingWeight) +
            (shares * shareWeight) +
            (reviews * reviewWeight);

        return {
            ...metadata,
            signalScore: Math.round(signalScore),
            uniqueBackers: backings,
            reviews
        };
    }

    /**
     * Map a VCA to a real token contract after launch
     * 
     * @param vcaAddress VCA address
     * @param tokenAddress Real token contract address
     * @returns VCA mapping object
     */
    static mapToContract(vcaAddress: string, tokenAddress: string): VCAMapping {
        return {
            vca: vcaAddress,
            tokenAddress,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate a VCA address format
     * 
     * @param address Address to validate
     * @returns Boolean indicating if address is valid
     */
    static isValidAddress(address: string): boolean {
        try {
            const normalizedAddress = ethers.getAddress(address);
            return normalizedAddress.length === 42 && normalizedAddress.startsWith('0x');
        } catch {
            return false;
        }
    }
}