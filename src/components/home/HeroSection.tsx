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
} from '@mui/material';
import { Rocket, TrendingUp, People } from '@mui/icons-material';
import Link from 'next/link';

export default function HeroSection() {
    const topProjects = [
        {
            name: 'VaderAI',
            category: 'AI & Tools',
            believers: 178,
            bobScore: 91,
            status: 'Community Heat',
        },
        {
            name: 'PixelMind',
            category: 'GameFi',
            believers: 132,
            bobScore: 85,
            status: 'Initial Funding',
        },
        {
            name: 'ChainRush',
            category: 'DeFi',
            believers: 101,
            bobScore: 77,
            status: 'Verified',
        },
    ];

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                pt: 8,
                pb: 12,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 6, md: 6 }} >
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                            className="fade-in"
                        >
                            Launch Smarter with BOB
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{ mb: 4, lineHeight: 1.6 }}
                            className="fade-in"
                        >
                            Submit your project, get vetted by believers, and build momentum
                            with trust. We&apos;re the community-driven launchpad built for conviction-based investing.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 6 }} className="fade-in">
                            <Link href="/submit" passHref>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Rocket />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
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
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                    }}
                                >
                                    Explore Projects
                                </Button>
                            </Link>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary.main" fontWeight={700}>
                                    $645K
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Staked
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary.main" fontWeight={700}>
                                    12.4%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Avg APR
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary.main" fontWeight={700}>
                                    5
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Projects
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, md: 6 }} >
                        <Box className="slide-up">
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                🔥 Top 3 Upcoming Projects
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {topProjects.map((project, index) => (
                                    <Card
                                        key={index}
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 255, 136, 0.2)',
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="h6" color="primary.main">
                                                    {project.name}
                                                </Typography>
                                                <Chip
                                                    label={project.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                                                        color: 'primary.main',
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {project.category}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <People fontSize="small" />
                                                    <Typography variant="body2">
                                                        Believers: {project.believers}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                    BOB Score: {project.bobScore}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}