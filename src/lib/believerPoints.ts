// src/lib/believerPoints.ts
export interface BelieverAction {
    $id?: string;
    type: BelieverActionType;
    points: number;
    description: string;
    userId: string;
    projectId?: string;
    metadata?: Record<string, any>;
    createdAt: string;
}

export type BelieverActionType =
    | 'daily_checkin'
    | 'upvote_project'
    | 'write_review'
    | 'create_tweet'
    | 'submit_project'
    | 'stake_tokens'
    | 'refer_friend'
    | 'weekly_true_believer'
    | 'weekly_scout_master';

export interface BelieverRank {
    name: string;
    minPoints: number;
    maxPoints: number;
    color: string;
    icon: string;
}

export interface BelieverReward {
    name: string;
    cost: number;
    description: string;
    type: 'boost' | 'role' | 'access' | 'airdrop';
    icon: string;
}

// Believer Points Configuration
export const BELIEVER_ACTIONS: Record<BelieverActionType, {
    basePoints: number;
    description: string;
    cooldown?: number; // in hours
    maxDaily?: number;
    icon: string;
}> = {
    daily_checkin: {
        basePoints: 50,
        description: 'Daily check-in (streak bonus: 7 days = +200)',
        cooldown: 24,
        icon: '📅'
    },
    upvote_project: {
        basePoints: 75,
        description: 'Express conviction on verified listing',
        icon: '👍'
    },
    write_review: {
        basePoints: 100,
        description: '30+ words, auto/AI reviewed',
        icon: '📝'
    },
    create_tweet: {
        basePoints: 150,
        description: 'Must tag @TokenReady + project + unique insight',
        icon: '🐦'
    },
    submit_project: {
        basePoints: 250,
        description: 'Tag on Twitter + submit via TokenReady',
        icon: '🚀'
    },
    stake_tokens: {
        basePoints: 5, // per $10 staked
        description: '+5 per $10 staked (snapshot daily, capped at +500/day)',
        maxDaily: 500,
        icon: '💎'
    },
    refer_friend: {
        basePoints: 250,
        description: 'One-time per verified referral (Wallet + Twitter linked)',
        icon: '👥'
    },
    weekly_true_believer: {
        basePoints: 500,
        description: 'Perform all 7 core actions in a 7-day window',
        icon: '🔥'
    },
    weekly_scout_master: {
        basePoints: 750,
        description: 'Submit 3 approved unique project discoveries this week',
        icon: '🎯'
    }
};

// Believer Rank Tiers
export const BELIEVER_RANKS: BelieverRank[] = [
    {
        name: 'Believer',
        minPoints: 0,
        maxPoints: 499,
        color: '#6b7280',
        icon: '👤'
    },
    {
        name: 'Committed',
        minPoints: 500,
        maxPoints: 999,
        color: '#059669',
        icon: '✊'
    },
    {
        name: 'Signal Giver',
        minPoints: 1000,
        maxPoints: 2499,
        color: '#0ea5e9',
        icon: '📡'
    },
    {
        name: 'Curator',
        minPoints: 2500,
        maxPoints: 4999,
        color: '#8b5cf6',
        icon: '🎭'
    },
    {
        name: 'Scout',
        minPoints: 5000,
        maxPoints: 9999,
        color: '#f59e0b',
        icon: '🔍'
    },
    {
        name: 'Super Scout',
        minPoints: 10000,
        maxPoints: 14999,
        color: '#f97316',
        icon: '🌟'
    },
    {
        name: 'Cult Starter',
        minPoints: 15000,
        maxPoints: 24999,
        color: '#ef4444',
        icon: '🔥'
    },
    {
        name: 'Cult Leader',
        minPoints: 25000,
        maxPoints: 49999,
        color: '#dc2626',
        icon: '👑'
    },
    {
        name: 'Inner Circle',
        minPoints: 50000,
        maxPoints: 99999,
        color: '#7c3aed',
        icon: '💜'
    },
    {
        name: 'The Belief Engine',
        minPoints: 100000,
        maxPoints: Infinity,
        color: '#00ff88',
        icon: '⚡'
    }
];

// Believer Rewards Store
export const BELIEVER_REWARDS: BelieverReward[] = [
    {
        name: 'Vote Boost Project',
        cost: 750,
        description: 'Boost your favorite project on the public leaderboard',
        type: 'boost',
        icon: '🚀'
    },
    {
        name: 'Custom Role',
        cost: 2500,
        description: 'Get a custom role in our community',
        type: 'role',
        icon: '🎨'
    },
    {
        name: 'First to See / Preseed',
        cost: 5000,
        description: 'Early access to new project submissions',
        type: 'access',
        icon: '👁️'
    },
    {
        name: 'Token Airdrop',
        cost: 10000,
        description: 'Exclusive token airdrop allocation',
        type: 'airdrop',
        icon: '🎁'
    }
];

// Helper Functions
export const calculateBelieverRank = (points: number): BelieverRank => {
    return BELIEVER_RANKS.find(rank =>
        points >= rank.minPoints && points <= rank.maxPoints
    ) || BELIEVER_RANKS[0];
};

export const getNextRank = (currentPoints: number): { rank: BelieverRank; pointsNeeded: number } | null => {
    const currentRankIndex = BELIEVER_RANKS.findIndex(rank =>
        currentPoints >= rank.minPoints && currentPoints <= rank.maxPoints
    );

    if (currentRankIndex === -1 || currentRankIndex === BELIEVER_RANKS.length - 1) {
        return null; // Already at max rank
    }

    const nextRank = BELIEVER_RANKS[currentRankIndex + 1];
    const pointsNeeded = nextRank.minPoints - currentPoints;

    return { rank: nextRank, pointsNeeded };
};

export const calculateStreakBonus = (streakDays: number): number => {
    if (streakDays >= 7) {
        return 200;
    }
    return 0;
};

export const calculateStakingPoints = (stakedAmount: number): number => {
    const pointsPerTen = Math.floor(stakedAmount / 10) * 5;
    return Math.min(pointsPerTen, 500); // Capped at 500 daily
};

export const canPerformAction = (
    actionType: BelieverActionType,
    lastActionTime?: string,
    dailyCount?: number
): { canPerform: boolean; reason?: string; cooldownEnds?: Date } => {
    const actionConfig = BELIEVER_ACTIONS[actionType];

    // Check cooldown
    if (actionConfig.cooldown && lastActionTime) {
        const lastAction = new Date(lastActionTime);
        const cooldownEnd = new Date(lastAction.getTime() + (actionConfig.cooldown * 60 * 60 * 1000));
        const now = new Date();

        if (now < cooldownEnd) {
            return {
                canPerform: false,
                reason: `Action on cooldown for ${Math.ceil((cooldownEnd.getTime() - now.getTime()) / (60 * 60 * 1000))} hours`,
                cooldownEnds: cooldownEnd
            };
        }
    }

    // Check daily limits
    if (actionConfig.maxDaily && dailyCount && dailyCount >= actionConfig.maxDaily) {
        return {
            canPerform: false,
            reason: `Daily limit of ${actionConfig.maxDaily} reached`
        };
    }

    return { canPerform: true };
};