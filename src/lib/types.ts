// Updated User interface to match your Appwrite collection schema
export interface User {
    $id: string;

    // Core user info
    username: string;           // Required - X username without @
    displayName: string;        // Required - X display name
    profileImage: string;       // Required - X profile picture URL
    followerCount: number;      // Required - X follower count
    verified: boolean;          // Required - X verification status

    // Points and ranking
    believerPoints: number;     // Required - Believer points earned
    believerRank: string;       // Required - Rank based on believer points

    // Timestamps
    joinedAt: string;          // Required - When user joined (ISO datetime)
    lastActiveAt: string;      // Required - Last activity (ISO datetime)

    // Optional profile info
    bio?: string;              // Optional - User bio
    location?: string;         // Optional - User location

    // Privy integration
    privyUserId: string;       // Required - Link to Privy user ID

    // Social accounts
    twitterHandle?: string;    // Optional - X handle (redundant with username but keeping for compatibility)
    twitterDisplayName?: string; // Optional - X display name (redundant but keeping)
    twitterPfp?: string;       // Optional - X profile pic (redundant but keeping)

    // Wallet and staking
    walletAddress?: string;    // Optional - Primary Solana wallet address
    bobPoints: number;         // Integer with default 0 - BOB points
    totalStaked: number;       // Integer with default 0 - Total staked amount

    // Activity counters
    reviewsCount: number;      // Integer with default 0 - Number of reviews
    projectsSupported: number; // Integer with default 0 - Projects supported

    // KOL status
    isVerifiedKOL: boolean;    // Boolean with default false - KOL verification

    // Legacy datetime fields (keeping for compatibility)
    createdAt: string;         // Will map to joinedAt
}

export interface Project {
    $id: string;
    name: string;
    ticker: string;
    pitch: string;
    description: string;
    website: string;
    github?: string;
    twitter: string;
    category: string;
    status: string;
    launchDate?: string;
    logoUrl?: string;
    totalStaked: number;
    believers: number;
    reviews: number;
    bobScore: number;
    estimatedReturn: number;
    simulatedInvestment: number;
    upvotes: string[]; // Array of user IDs who upvoted
    teamMembers: string[]; // Array of team member strings
    createdAt: string;
}

export interface Review {
    $id?: string;
    projectId: string;
    userId: string;
    rating: number;
    comment: string;
    investment: number;
    believerPoints: number;
    createdAt: string;
    // Note: No updatedAt field to match Appwrite schema
}

export interface StakingPool {
    $id?: string;
    totalValue: number;
    apr: number;
    activeProjects: number;
    participants: number;
}

export interface BelieverActivity {
    $id?: string;
    userId: string;
    activity: 'review' | 'vote' | 'stake' | 'early_support' | 'kol_endorsement';
    pointsEarned: number;
    projectId?: string;
    description: string;
    createdAt: string;
}
export interface ShareTrackingData {
    $id?: string;
    shareId: string;          // Unique identifier for this share
    userId: string;           // User who created the share
    projectId: string;        // Project being shared
    shareUrl: string;         // The generated trackable URL
    twitterIntentUrl: string; // The Twitter intent URL

    // Analytics
    clickCount: number;       // How many times the link was clicked
    shareCount: number;       // How many times it was actually shared
    conversionCount: number;  // How many led to actual engagement

    // Tracking events
    events: ShareEvent[];     // Array of tracking events

    // Status
    pointsAwarded: boolean;   // Whether points have been awarded
    verified: boolean;        // Whether the share was verified

    // Timestamps
    createdAt: string;
    lastClickedAt?: string;
    verifiedAt?: string;
}

export interface ShareEvent {
    type: 'click' | 'twitter_open' | 'referral_visit' | 'share_detected';
    timestamp: string;
    userAgent?: string;
    referrer?: string;
    ip?: string;
    metadata?: Record<string, any>;
}

export interface ShareGenerationResult {
    shareId: string;
    trackableUrl: string;
    twitterIntentUrl: string;
}

export interface ShareVerificationResult {
    isValidShare: boolean;
    shareData?: ShareTrackingData;
    shouldAwardPoints: boolean;
}

export interface PointsAwardResult {
    success: boolean;
    points?: number;
    error?: string;
}