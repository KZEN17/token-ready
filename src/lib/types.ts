export interface Project {
    $id?: string;
    name: string;
    ticker: string;
    description: string;
    website: string;
    github?: string;
    twitter: string;
    category: string;
    status: 'pending' | 'live' | 'ended';
    launchDate?: string; // Will be stored as datetime in Appwrite
    logoUrl?: string; // New field for project logo
    teamMembers?: string[]; // Changed to string array
    whitepaper?: string; // New field for whitepaper/docs
    requestTwitterSpace?: boolean; // New field for Twitter Space request
    totalStaked: number;
    believers: number;
    reviews: number;
    bobScore: number;
    estimatedReturn: number;
    simulatedInvestment: number;
    createdAt: string; // Will be stored as datetime in Appwrite
    updatedAt: string; // Will be stored as datetime in Appwrite
}

export interface Review {
    $id?: string;
    projectId: string;
    userId: string;
    rating: number;
    comment: string;
    investment: number;
    believerPoints: number; // Points earned for this review
    createdAt: string;
}

export interface User {
    $id?: string;
    email: string;
    name: string;
    wallet?: string;
    totalStaked: number;
    bobPoints: number;
    believerPoints: number; // New field for believer points
    reviewsCount: number;
    projectsSupported: number; // New field
    twitterHandle?: string; // For KOL authentication
    isVerifiedKOL: boolean; // For influencer verification
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