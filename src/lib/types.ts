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
    launchDate?: string;
    totalStaked: number;
    believers: number;
    reviews: number;
    bobScore: number;
    estimatedReturn: number;
    simulatedInvestment: number;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    $id?: string;
    projectId: string;
    userId: string;
    rating: number;
    comment: string;
    investment: number;
    createdAt: string;
}

export interface User {
    $id?: string;
    email: string;
    name: string;
    wallet?: string;
    totalStaked: number;
    bobPoints: number;
    reviewsCount: number;
}

export interface StakingPool {
    $id?: string;
    totalValue: number;
    apr: number;
    activeProjects: number;
    participants: number;
}