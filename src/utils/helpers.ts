import { Project } from '../lib/types';

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

export const truncateWallet = (address: string, startChars = 6, endChars = 4): string => {
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const calculateBobScore = (project: Project): number => {
    // Simple scoring algorithm based on believers, reviews, and other factors
    const believerScore = Math.min(project.believers / 10, 50); // Max 50 points for believers
    const reviewScore = Math.min(project.reviews * 5, 25); // Max 25 points for reviews
    const investmentScore = Math.min(project.simulatedInvestment / 10000, 25); // Max 25 points for investment

    return Math.round(believerScore + reviewScore + investmentScore);
};

export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
        case 'live':
            return 'success';
        case 'pending':
            return 'warning';
        case 'ended':
            return 'error';
        default:
            return 'default';
    }
};

export const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'live':
            return 'Community Heat';
        case 'pending':
            return 'Initial Funding';
        case 'ended':
            return 'Verified';
        default:
            return status;
    }
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const generateProjectSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateTwitterHandle = (handle: string): boolean => {
    const twitterRegex = /^@?[A-Za-z0-9_]{1,15}$/;
    return twitterRegex.test(handle);
};

export const validateUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const sortProjects = (projects: Project[], sortBy: string): Project[] => {
    switch (sortBy) {
        case 'bobScore':
            return [...projects].sort((a, b) => b.bobScore - a.bobScore);
        case 'believers':
            return [...projects].sort((a, b) => b.believers - a.believers);
        case 'newest':
            return [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case 'investment':
            return [...projects].sort((a, b) => b.simulatedInvestment - a.simulatedInvestment);
        default:
            return projects;
    }
};

export const filterProjects = (
    projects: Project[],
    filters: {
        search?: string;
        category?: string;
        status?: string;
    }
): Project[] => {
    return projects.filter((project) => {
        const matchesSearch = !filters.search ||
            project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            project.description.toLowerCase().includes(filters.search.toLowerCase());

        const matchesCategory = !filters.category ||
            filters.category === 'all' ||
            project.category === filters.category;

        const matchesStatus = !filters.status ||
            filters.status === 'all' ||
            project.status === filters.status;

        return matchesSearch && matchesCategory && matchesStatus;
    });
};