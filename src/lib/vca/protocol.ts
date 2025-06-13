// src/lib/vca/protocol.ts - UPDATED to use projectId consistently
import { ethers } from 'ethers';
import { VCAMapping, VCAMetadata } from '../types';

export class VCAProtocol {
    /**
     * Generate a VCA address from a project ID
     * 
     * @param projectId Project identifier
     * @param timestamp Optional timestamp or salt
     * @returns EVM-compatible address
     */
    static generateAddress(projectId: string, timestamp: string = Date.now().toString()): string {
        try {
            console.log(`Generating VCA address for projectId: ${projectId}, timestamp: ${timestamp}`);

            // Create a hash of the projectId + timestamp
            const hash = ethers.keccak256(
                ethers.toUtf8Bytes(projectId + timestamp)
            );

            console.log(`Generated hash: ${hash}`);

            // Convert to EVM address format (take last 20 bytes and add 0x prefix)
            const address = ethers.getAddress(
                '0x' + hash.slice(26)
            );

            console.log(`Final VCA address: ${address}`);

            return address;
        } catch (error) {
            console.error('Error generating VCA address:', error);
            throw new Error(`Failed to generate VCA address: 'Unknown error'`);
        }
    }

    /**
     * Create a new VCA for a project
     * 
     * @param projectId Project identifier
     * @param owner Owner address or Twitter handle
     * @returns VCA object with address and metadata
     */
    static createVCA(projectId: string, owner: string): { address: string, metadata: VCAMetadata } {
        console.log(`Creating VCA for projectId: ${projectId}, owner: ${owner}`);

        // Sanitize inputs
        const sanitizedProjectId = projectId.trim().toLowerCase();
        const sanitizedOwner = owner.trim();

        const timestamp = Date.now().toString();
        const address = this.generateAddress(sanitizedProjectId, timestamp);

        const metadata: VCAMetadata = {
            projectId: sanitizedProjectId,
            owner: sanitizedOwner,
            signalScore: 0,
            uniqueBackers: 0,
            reviews: 0,
            followers: 0,
            createdAt: new Date().toISOString()
        };

        console.log(`Created VCA with address: ${address}`, metadata);

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
        console.log(`Updating signal score for VCA: backings=${backings}, shares=${shares}, reviews=${reviews}`);

        // Simple weighted scoring algorithm
        // Adjust weights as needed for your specific use case
        const backingWeight = 1;
        const shareWeight = 0.5;
        const reviewWeight = 2;

        const signalScore =
            (backings * backingWeight) +
            (shares * shareWeight) +
            (reviews * reviewWeight);

        console.log(`Calculated signal score: ${signalScore}`);

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
        console.log(`Mapping VCA ${vcaAddress} to token contract ${tokenAddress}`);

        // Sanitize inputs
        const sanitizedVcaAddress = vcaAddress.trim();
        const sanitizedTokenAddress = tokenAddress.trim();

        // Validate both addresses
        if (!this.isValidAddress(sanitizedVcaAddress)) {
            throw new Error(`Invalid VCA address format: ${sanitizedVcaAddress}`);
        }

        if (!this.isValidAddress(sanitizedTokenAddress)) {
            throw new Error(`Invalid token address format: ${sanitizedTokenAddress}`);
        }

        return {
            vca: sanitizedVcaAddress,
            tokenAddress: sanitizedTokenAddress,
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
            if (!address) return false;

            // Handle the common case of an empty string or null/undefined
            if (!address.trim()) return false;

            // Make sure it starts with 0x
            if (!address.trim().startsWith('0x')) return false;

            const normalizedAddress = ethers.getAddress(address.trim());
            return normalizedAddress.length === 42 && normalizedAddress.startsWith('0x');
        } catch (error) {
            console.error(`Address validation failed for: ${address}`, error);
            return false;
        }
    }
}