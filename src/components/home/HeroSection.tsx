'use client';

import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    Avatar,
} from '@mui/material';
import { Rocket, TrendingUp, People, Star } from '@mui/icons-material';
import Link from 'next/link';

export default function HeroSection() {
    const topProjects = [
        {
            name: 'VaderAI',
            ticker: 'VADER',
            category: 'AI & Tools',
            believers: 178,
            reviews: 12,
            bobScore: 91,
            status: 'Community Heat',
            description: 'AI-powered trading agent protocol revolutionizing automated trading strategies.',
            progress: 87,
            raised: '$127K',
            target: '$150K',
            estimatedReturn: 14,
        },
        {
            name: 'PixelMind',
            ticker: 'PIXEL',
            category: 'Meme & Culture',
            believers: 132,
            reviews: 9,
            bobScore: 85,
            status: 'Initial Funding',
            description: 'Onchain meme studio meets DAO. Create, vote, and earn from viral content.',
            progress: 62,
            raised: '$93K',
            target: '$150K',
            estimatedReturn: 8,
        },
        {
            name: 'ChainRush',
            ticker: 'RUSH',
            category: 'DeFi',
            believers: 101,
            reviews: 6,
            bobScore: 77,
            status: 'Verified',
            description: 'Cross-chain liquidity aggregator with MEV protection and yield optimization.',
            progress: 100,
            raised: '$76K',
            target: '$76K',
            estimatedReturn: 6,
        },
    ];

    const getStatusColor = (status: string, theme: any) => {
        switch (status) {
            case 'Community Heat':
                return {
                    bg: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main
                };
            case 'Initial Funding':
                return {
                    bg: `${theme.palette.warning.main}20`,
                    color: theme.palette.warning.main
                };
            case 'Verified':
                return {
                    bg: `${theme.palette.grey[500]}20`,
                    color: theme.palette.grey[500]
                };
            default:
                return {
                    bg: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main
                };
        }
    };

    return (
        <Box
            sx={{
                background: (theme) => `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 50%, #16213e 100%)`,
                pt: { xs: 12, md: 16 },
                pb: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                minHeight: '90vh',
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1.1,
                            }}
                        >
                            Where Conviction Meets Launch
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                lineHeight: 1.6,
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                maxWidth: '600px',
                            }}
                        >
                            Community-driven launchpad for belief-based investing in the Internet Capital Market.
                            Submit your project, get vetted by believers, and build momentum with trust.
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ mb: 6 }}
                        >
                            <Link href="/submit" passHref>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Rocket />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Submit Your Project
                                </Button>
                            </Link>
                            <Link href="/explore" passHref>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<TrendingUp />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Explore Projects
                                </Button>
                            </Link>
                        </Stack>

                        {/* Stats Grid */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h4"
                                        color="primary.main"
                                        fontWeight={700}
                                        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                                    >
                                        $645K
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Staked
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h4"
                                        color="primary.main"
                                        fontWeight={700}
                                        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                                    >
                                        12.4%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Success Rate
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h4"
                                        color="primary.main"
                                        fontWeight={700}
                                        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                                    >
                                        5
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Projects
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Featured Projects */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                }}
                            >
                                🔥 Featured Projects
                            </Typography>
                            <Stack spacing={3}>
                                {topProjects.map((project, index) => (
                                    <Card
                                        key={index}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}20`,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            backgroundColor: 'primary.main',
                                                            color: 'primary.contrastText',
                                                            fontWeight: 700,
                                                            fontSize: '1.2rem',
                                                        }}
                                                    >
                                                        {project.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                                                            {project.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ${project.ticker}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={project.status}
                                                    size="small"
                                                    sx={(theme) => {
                                                        const statusStyle = getStatusColor(project.status, theme);
                                                        return {
                                                            backgroundColor: statusStyle.bg,
                                                            color: statusStyle.color,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                        };
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 3, lineHeight: 1.5 }}
                                            >
                                                {project.description}
                                            </Typography>

                                            {/* Progress Bar */}
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Progress
                                                    </Typography>
                                                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                        {project.raised} / {project.target}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={project.progress}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Stack direction="row" spacing={3}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <People fontSize="small" sx={{ color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {project.believers}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Star fontSize="small" sx={{ color: 'warning.main' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {project.reviews}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                        BOB: {project.bobScore}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" color="secondary.main" fontWeight={600}>
                                                    Est. {project.estimatedReturn}%
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}