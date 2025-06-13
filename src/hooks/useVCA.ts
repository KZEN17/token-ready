// src/hooks/useVCA.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { VCAApi } from '@/lib/vca/api';
import { VCAMetadata, VCAActivity, VCAMapping } from '@/lib/types';
import { useUser } from './useUser';

interface UseVCAOptions {
    projectSlug: string;
    autoFetch?: boolean;
}

interface UseVCAResult {
    vcaData: { address: string; metadata: VCAMetadata } | null;
    activities: VCAActivity[];
    loading: boolean;
    error: string | null;
    createVCA: () => Promise<{ address: string; metadata: VCAMetadata }>;
    mapToContract: (tokenAddress: string) => Promise<VCAMapping>;
    addActivity: (type: 'backing' | 'review' | 'share', details?: any) => Promise<void>;
    refreshVCA: () => Promise<void>;
}

/**
 * Custom hook for working with VCAs in components
 */
export function useVCA({ projectSlug, autoFetch = true }: UseVCAOptions): UseVCAResult {
    const { user, authenticated } = useUser();

    const [vcaData, setVcaData] = useState<{ address: string; metadata: VCAMetadata } | null>(null);
    const [activities, setActivities] = useState<VCAActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load VCA data by project slug
    const loadVCA = useCallback(async () => {
        if (!projectSlug) return;

        try {
            setLoading(true);
            setError(null);

            const data = await VCAApi.getVCABySlug(projectSlug);
            setVcaData(data);

            if (data) {
                const activitiesData = await VCAApi.getActivities(data.address);
                setActivities(activitiesData);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error loading VCA:', err);
            setError('Failed to load VCA data');
            setLoading(false);
        }
    }, [projectSlug]);

    // Create a new VCA
    const createVCA = async () => {
        if (!authenticated || !user) {
            throw new Error('User must be authenticated to create a VCA');
        }

        try {
            setLoading(true);
            setError(null);

            const owner = user.username || user.$id;
            const result = await VCAApi.createVCA(projectSlug, owner);

            setVcaData(result);
            setActivities([]);
            setLoading(false);

            return result;
        } catch (err) {
            console.error('Error creating VCA:', err);
            setError('Failed to create VCA');
            setLoading(false);
            throw err;
        }
    };

    // Map VCA to a token contract
    const mapToContract = async (tokenAddress: string) => {
        if (!vcaData) {
            throw new Error('No VCA found to map');
        }

        try {
            setLoading(true);
            setError(null);

            const mapping = await VCAApi.mapToContract(vcaData.address, tokenAddress);

            // Refresh VCA data to get updated metadata
            await loadVCA();

            setLoading(false);
            return mapping;
        } catch (err) {
            console.error('Error mapping VCA to contract:', err);
            setError('Failed to map VCA to contract');
            setLoading(false);
            throw err;
        }
    };

    // Add activity to VCA
    const addActivity = async (type: 'backing' | 'review' | 'share', details?: any) => {
        if (!authenticated || !user) {
            throw new Error('User must be authenticated to add activity');
        }

        if (!vcaData) {
            throw new Error('No VCA found to add activity to');
        }

        try {
            setLoading(true);
            setError(null);

            const activity: VCAActivity = {
                type,
                userId: user.$id,
                timestamp: new Date().toISOString(),
                details
            };

            await VCAApi.addActivity(vcaData.address, activity);

            // Refresh VCA data after adding activity
            await loadVCA();

            setLoading(false);
        } catch (err) {
            console.error('Error adding activity:', err);
            setError('Failed to add activity');
            setLoading(false);
            throw err;
        }
    };

    // Refresh VCA data
    const refreshVCA = async () => {
        await loadVCA();
    };

    // Auto-fetch on mount if enabled
    useEffect(() => {
        if (autoFetch) {
            loadVCA();
        }
    }, [autoFetch, loadVCA, projectSlug]);

    return {
        vcaData,
        activities,
        loading,
        error,
        createVCA,
        mapToContract,
        addActivity,
        refreshVCA
    };
}