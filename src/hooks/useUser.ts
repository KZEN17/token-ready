'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

interface User {
    $id: string;

    // Core user info (required fields)
    username: string;           // X username without @
    displayName: string;        // X display name
    profileImage: string;       // X profile picture URL
    followerCount: number;      // X follower count
    verified: boolean;          // X verification status

    // Points and ranking (required)
    believerPoints: number;     // Believer points earned
    believerRank: string;       // Rank based on believer points

    // Timestamps (required)
    joinedAt: string;          // When user joined
    lastActiveAt: string;      // Last activity

    // Optional profile info
    bio?: string;              // User bio
    location?: string;         // User location

    // Privy integration (required)
    privyUserId: string;       // Link to Privy user ID

    // Legacy/compatibility fields (optional)
    twitterHandle?: string;
    twitterDisplayName?: string;
    twitterPfp?: string;

    // Wallet and points (with defaults)
    walletAddress?: string;
    bobPoints: number;         // Default 0
    totalStaked: number;       // Default 0
    reviewsCount: number;      // Default 0
    projectsSupported: number; // Default 0
    isVerifiedKOL: boolean;    // Default false

    // Legacy field
    createdAt: string;         // Maps to joinedAt
}

// Helper function to calculate believer rank
const calculateBelieverRank = (points: number): string => {
    if (points >= 10000) return 'Legend';
    if (points >= 5000) return 'Expert';
    if (points >= 2500) return 'Veteran';
    if (points >= 1000) return 'Advanced';
    if (points >= 500) return 'Intermediate';
    if (points >= 100) return 'Novice';
    return 'Newcomer';
};

export const useUser = () => {
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

    //   // Get the primary Solana wallet
    //   const solanaWallet = wallets.find(wallet => wallet.chainType === 'solana');
    //   const walletAddress = solanaWallet?.address;

    // Check if user has X linked
    const twitterAccount = privyUser?.twitter;
    const hasTwitter = !!twitterAccount;

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
                        // Fix: Check if the property exists before accessing it
                        updateData.followerCount = (twitterAccount as any).followersCount || existingUser.followerCount || 0;
                        updateData.verified = (twitterAccount as any).verified || existingUser.verified;

                        // Update compatibility fields
                        updateData.twitterHandle = twitterAccount.username || existingUser.twitterHandle;
                        updateData.twitterDisplayName = twitterAccount.name || existingUser.twitterDisplayName;
                        updateData.twitterPfp = twitterAccount.profilePictureUrl || existingUser.twitterPfp;

                        // Update KOL status and believer rank
                        updateData.isVerifiedKOL = ((twitterAccount as any).followersCount || 0) > 1000;
                        updateData.believerRank = calculateBelieverRank(existingUser.believerPoints);
                    }

                    // Update wallet if available
                    // if (walletAddress && walletAddress !== existingUser.walletAddress) {
                    //     updateData.walletAddress = walletAddress;
                    // }

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
    const logout = async () => {
        try {
            await privyLogout();
            setUser(null);
            setError(null);
        } catch (err) {
            console.error('Error logging out:', err);
            setError('Failed to logout');
        }
    };

    // Connect X function
    const connectTwitter = async () => {
        try {
            await linkTwitter();
        } catch (err) {
            console.error('Error connecting X:', err);
            setError('Failed to connect X account');
        }
    };

    // Disconnect X function
    const disconnectTwitter = async () => {
        try {
            await unlinkTwitter(twitterAccount!.subject);
        } catch (err) {
            console.error('Error disconnecting X:', err);
            setError('Failed to disconnect X account');
        }
    };

    // Update user points
    const updateUserPoints = async (bobPoints: number, believerPoints: number) => {
        if (!user) return;

        try {
            const newBelieverPoints = user.believerPoints + believerPoints;
            const newBobPoints = user.bobPoints + bobPoints;

            const updatedUser = await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                user.$id,
                {
                    bobPoints: newBobPoints,
                    believerPoints: newBelieverPoints,
                    believerRank: calculateBelieverRank(newBelieverPoints),
                    lastActiveAt: new Date().toISOString(),
                }
            );

            setUser(updatedUser as unknown as User);
        } catch (err) {
            console.error('Error updating user points:', err);
            setError('Failed to update points');
        }
    };

    // Update user profile
    const updateUserProfile = async (updates: Partial<Pick<User, 'bio' | 'location'>>) => {
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
    };

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
        // hasWallet: !!walletAddress,
        // walletAddress,
        // solanaWallet,

        // Authentication methods
        login,
        logout,
        connectTwitter,
        disconnectTwitter,

        // User management
        updateUserPoints,
        updateUserProfile,

        // Helper methods
        isKOL: user?.isVerifiedKOL || false,
        userDisplayName: user?.displayName || user?.username || 'Anonymous',
        userAvatar: user?.profileImage || null,
        believerRank: user?.believerRank || 'Newcomer',
        isVerified: user?.verified || false,
    };
};