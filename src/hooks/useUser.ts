// src/hooks/useUser.ts (Fixed version)
'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useCallback } from 'react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

interface User {
    $id: string;

    // Core user info (required fields)
    username: string;
    displayName: string;
    profileImage: string;
    followerCount: number;
    verified: boolean;

    // Points and ranking (required)
    believerPoints: number;
    believerRank: string;

    // Timestamps (required)
    joinedAt: string;
    lastActiveAt: string;

    // Optional profile info
    bio?: string;
    location?: string;

    // Privy integration (required)
    privyUserId: string;

    // Legacy/compatibility fields (optional)
    twitterHandle?: string;
    twitterDisplayName?: string;
    twitterPfp?: string;

    // Wallet and points (with defaults)
    walletAddress?: string;
    bobPoints: number;
    totalStaked: number;
    reviewsCount: number;
    projectsSupported: number;
    isVerifiedKOL: boolean;

    // Legacy field
    createdAt: string;
}

// Helper function to calculate believer rank
const calculateBelieverRank = (points: number): string => {
    if (points >= 100000) return 'The Belief Engine';
    if (points >= 50000) return 'Inner Circle';
    if (points >= 25000) return 'Cult Leader';
    if (points >= 15000) return 'Cult Starter';
    if (points >= 10000) return 'Super Scout';
    if (points >= 5000) return 'Scout';
    if (points >= 2500) return 'Curator';
    if (points >= 1000) return 'Signal Giver';
    if (points >= 500) return 'Committed';
    return 'Believer';
};

// Define the return type of the useUser hook
interface UseUserReturn {
    // User data
    user: User | null;
    privyUser: any;
    authenticated: boolean;
    loading: boolean;
    error: string | null;
    ready: boolean;

    // Authentication state
    hasTwitter: boolean;

    // Authentication methods
    login: () => void;
    logout: () => Promise<void>;
    connectTwitter: () => Promise<void>;
    disconnectTwitter: () => Promise<void>;

    // User management
    updateUserPoints: (bobPointsToAdd: number, believerPointsToAdd: number) => Promise<void>;
    updateUserProfile: (updates: Partial<Pick<User, 'bio' | 'location'>>) => Promise<void>;
    refreshUserData: () => Promise<void>;

    // Helper methods
    isKOL: boolean;
    userDisplayName: string;
    userAvatar: string | null;
    believerRank: string;
    isVerified: boolean;
}

export const useUser = (): UseUserReturn => {
    const {
        user: privyUser,
        authenticated,
        ready,
        login,
        logout: privyLogout,
        linkTwitter,
        unlinkTwitter,
    } = usePrivy();

    const { wallets } = useWallets();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user has X linked
    const twitterAccount = privyUser?.twitter;
    const hasTwitter = !!twitterAccount;

    // Update user points function
    const updateUserPoints = useCallback(async (bobPointsToAdd: number, believerPointsToAdd: number): Promise<void> => {
        const currentUser = user;
        if (!currentUser) {
            throw new Error('No user found');
        }

        try {
            const newBobPoints = currentUser.bobPoints + bobPointsToAdd;
            const newBelieverPoints = currentUser.believerPoints + believerPointsToAdd;
            const newBelieverRank = calculateBelieverRank(newBelieverPoints);

            await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                currentUser.$id,
                {
                    bobPoints: newBobPoints,
                    believerPoints: newBelieverPoints,
                    believerRank: newBelieverRank,
                    lastActiveAt: new Date().toISOString(),
                }
            );

            // Update local state immediately
            setUser(prev => prev ? {
                ...prev,
                bobPoints: newBobPoints,
                believerPoints: newBelieverPoints,
                believerRank: newBelieverRank,
                lastActiveAt: new Date().toISOString(),
            } : null);

        } catch (err) {
            console.error('Error updating user points:', err);
            setError('Failed to update points');
            throw err;
        }
    }, [user]);

    // Refresh user data from database
    const refreshUserData = useCallback(async () => {
        if (!authenticated || !privyUser || !user) return;

        try {
            const refreshedUser = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                user.$id
            );

            setUser(refreshedUser as unknown as User);
        } catch (err) {
            console.error('Error refreshing user data:', err);
        }
    }, [authenticated, privyUser, user]);

    // Create or update user in Appwrite when Privy user changes
    useEffect(() => {
        const syncUser = async () => {
            if (!ready) return;

            if (!authenticated || !privyUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Check if user exists in Appwrite
                const existingUsers = await databases.listDocuments(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    [Query.equal('privyUserId', privyUser.id)]
                );

                let appwriteUser: User;
                const now = new Date().toISOString();

                if (existingUsers.documents.length > 0) {
                    // Update existing user
                    const existingUser = existingUsers.documents[0] as unknown as User;

                    const updateData: Partial<User> = {
                        lastActiveAt: now,
                    };

                    // Update X info if available
                    if (twitterAccount) {
                        updateData.username = twitterAccount.username || existingUser.username;
                        updateData.displayName = twitterAccount.name || existingUser.displayName;
                        updateData.profileImage = twitterAccount.profilePictureUrl || existingUser.profileImage;
                        updateData.followerCount = (twitterAccount as any).followersCount || existingUser.followerCount || 0;
                        updateData.verified = (twitterAccount as any).verified || existingUser.verified;

                        // Update compatibility fields
                        updateData.twitterHandle = twitterAccount.username || existingUser.twitterHandle;
                        updateData.twitterDisplayName = twitterAccount.name || existingUser.twitterDisplayName;
                        updateData.twitterPfp = twitterAccount.profilePictureUrl || existingUser.twitterPfp;

                        // Update KOL status and believer rank
                        updateData.isVerifiedKOL = ((twitterAccount as any).followersCount || 0) > 1000;
                        updateData.believerRank = calculateBelieverRank(existingUser.believerPoints || 0);
                    }

                    const updatedUser = await databases.updateDocument(
                        DATABASE_ID,
                        USERS_COLLECTION_ID,
                        existingUser.$id,
                        updateData
                    );

                    appwriteUser = updatedUser as unknown as User;
                } else {
                    // Create new user - all required fields must be provided
                    const newUserData: Omit<User, '$id'> = {
                        // Required core info
                        username: twitterAccount?.username || 'anonymous',
                        displayName: twitterAccount?.name || 'Anonymous User',
                        profileImage: twitterAccount?.profilePictureUrl || '',
                        followerCount: (twitterAccount as any)?.followersCount || 0,
                        verified: (twitterAccount as any)?.verified || false,

                        // Required points and ranking
                        believerPoints: 0,
                        believerRank: calculateBelieverRank(0),

                        // Required timestamps
                        joinedAt: now,
                        lastActiveAt: now,

                        // Required Privy integration
                        privyUserId: privyUser.id,

                        // Optional fields
                        bio: '',
                        location: '',

                        // Compatibility fields  
                        twitterHandle: twitterAccount?.username || '',
                        twitterDisplayName: twitterAccount?.name || '',
                        twitterPfp: twitterAccount?.profilePictureUrl || '',

                        // Fields with defaults
                        walletAddress: '',
                        bobPoints: 0,
                        totalStaked: 0,
                        reviewsCount: 0,
                        projectsSupported: 0,
                        isVerifiedKOL: false,

                        // Legacy field
                        createdAt: now,
                    };

                    const createdUser = await databases.createDocument(
                        DATABASE_ID,
                        USERS_COLLECTION_ID,
                        ID.unique(),
                        newUserData
                    );

                    appwriteUser = createdUser as unknown as User;
                }

                setUser(appwriteUser);
            } catch (err) {
                console.error('Error syncing user:', err);
                setError(err instanceof Error ? err.message : 'Failed to sync user data');
            } finally {
                setLoading(false);
            }
        };

        syncUser();
    }, [authenticated, privyUser, ready, twitterAccount]);

    // Enhanced logout function
    const logout = useCallback(async () => {
        try {
            await privyLogout();
            setUser(null);
            setError(null);
        } catch (err) {
            console.error('Error logging out:', err);
            setError('Failed to logout');
        }
    }, [privyLogout]);

    // Connect X function
    const connectTwitter = useCallback(async () => {
        try {
            await linkTwitter();
        } catch (err) {
            console.error('Error connecting X:', err);
            setError('Failed to connect X account');
        }
    }, [linkTwitter]);

    // Disconnect X function
    const disconnectTwitter = useCallback(async () => {
        if (!twitterAccount) return;

        try {
            await unlinkTwitter(twitterAccount.subject);
        } catch (err) {
            console.error('Error disconnecting X:', err);
            setError('Failed to disconnect X account');
        }
    }, [unlinkTwitter, twitterAccount]);

    // Update user profile
    const updateUserProfile = useCallback(async (updates: Partial<Pick<User, 'bio' | 'location'>>) => {
        if (!user) return;

        try {
            const updatedUser = await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                user.$id,
                {
                    ...updates,
                    lastActiveAt: new Date().toISOString(),
                }
            );

            setUser(updatedUser as unknown as User);
        } catch (err) {
            console.error('Error updating user profile:', err);
            setError('Failed to update profile');
        }
    }, [user]);

    return {
        // User data
        user,
        privyUser,
        authenticated,
        loading,
        error,
        ready,

        // Authentication state
        hasTwitter,

        // Authentication methods
        login,
        logout,
        connectTwitter,
        disconnectTwitter,

        // User management
        updateUserPoints,
        updateUserProfile,
        refreshUserData,

        // Helper methods
        isKOL: user?.isVerifiedKOL || false,
        userDisplayName: user?.displayName || user?.username || 'Anonymous',
        userAvatar: user?.profileImage || null,
        believerRank: user?.believerRank || 'Believer',
        isVerified: user?.verified || false,
    };
};