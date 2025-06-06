'use client';

import {
    Container,
    Typography,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
} from '@mui/material';
import { useState } from 'react';
import ProjectCard from '../../components/projects/ProjectCard';
import { Project } from '../../lib/types';

export default function ExplorePage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Mock data - replace with actual API call
    const mockProjects: Project[] = [
        {
            $id: '1',
            name: 'VaderAI',
            ticker: 'VADER',
            description: 'AI-powered trading agent protocol revolutionizing automated trading strategies.',
            website: 'https://vaderai.com',
            github: 'https://github.com/vaderai',
            twitter: '@vaderai',
            category: 'AI & Tools',
            status: 'live',
            launchDate: '2024-07-15',
            totalStaked: 127000,
            believers: 178,
            reviews: 12,
            bobScore: 91,
            estimatedReturn: 14,
            simulatedInvestment: 127000,
            createdAt: '2024-06-01',
            updatedAt: '2024-06-01',
        },
        {
            $id: '2',
            name: 'PixelMind',
            ticker: 'PIXEL',
            description: 'Onchain meme studio meets DAO. Create, vote, and earn from viral content.',
            website: 'https://pixelmind.io',
            twitter: '@pixelmind',
            category: 'Meme & Culture',
            status: 'pending',
            totalStaked: 93000,
            believers: 132,
            reviews: 9,
            bobScore: 85,
            estimatedReturn: 8,
            simulatedInvestment: 93000,
            createdAt: '2024-06-05',
            updatedAt: '2024-06-05',
        },
        {
            $id: '3',
            name: 'ChainRush',
            ticker: 'RUSH',
            description: 'Cross-chain liquidity aggregator with MEV protection and yield optimization.',
            website: 'https://chainrush.fi',
            github: 'https://github.com/chainrush',
            twitter: '@chainrush',
            category: 'DeFi',
            status: 'ended',
            totalStaked: 76000,
            believers: 101,
            reviews: 6,
            bobScore: 77,
            estimatedReturn: 6,
            simulatedInvestment: 76000,
            createdAt: '2024-05-20',
            updatedAt: '2024-05-20',
        },
    ];

    const categories = [
        'All Categories',
        'AI & Tools',
        'DeFi',
        'GameFi',
        'Meme & Culture',
        'Social & Media',
    ];

    const filteredProjects = mockProjects.filter((project) => {
        const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filter === 'all' || project.status === filter;
        const matchesCategory = categoryFilter === 'all' ||
            categoryFilter === 'All Categories' ||
            project.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography
                variant="h2"
                sx={{
                    mb: 2,
                    textAlign: 'center',
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Explore Projects
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, textAlign: 'center' }}
            >
                Discover the next generation of blockchain projects vetted by our community
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }} >
                        <TextField
                            fullWidth
                            label="Search projects..."
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }} >
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filter}
                                label="Status"
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="live">Live</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="ended">Ended</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}  >
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category === 'All Categories' ? 'all' : category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }} >
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                label={`${filteredProjects.length} Projects`}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Categories Filter */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    🧭 Categories
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['🎮 GameFi', '🤖 AI & Tools', '💰 DeFi', '🎭 Meme & Culture', '👥 Social & Media'].map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            variant="outlined"
                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: (theme) => `${theme.palette.primary.main}15`,
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Projects Grid */}
            <Grid container spacing={4}>
                {filteredProjects.map((project) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.$id}>
                        <ProjectCard
                            project={project}
                            onViewDetails={(project) => {
                                // Navigate to project details
                                window.location.href = `/project/${project.$id}`;
                            }}
                            onUpvote={(projectId) => {
                                console.log('Upvote project:', projectId);
                            }}
                            onInvest={(projectId) => {
                                console.log('Invest in project:', projectId);
                            }}
                        />
                    </Grid>
                ))}
            </Grid>

            {filteredProjects.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No projects found matching your criteria
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your filters or search terms
                    </Typography>
                </Box>
            )}
        </Container>
    );
}