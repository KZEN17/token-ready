'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
} from '@mui/material';

interface ExploreHeroProps {
    projectCount: number;
    totalStaked: number;
    totalBelievers: number;
}

export default function ExploreHero({
    projectCount,
    totalStaked,
    totalBelievers,
}: ExploreHeroProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
                variant="h2"
                component="h1"
                sx={{
                    fontWeight: 900,
                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                }}
            >
                Discover Web3 Projects
            </Typography>
            <Typography variant="h5" sx={{ color: '#b0b0b0', mb: 4, maxWidth: 600, mx: 'auto' }}>
                Find the next generation of revolutionary blockchain projects
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #00ff88',
                        textAlign: 'center',
                        p: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0, 255, 136, 0.2)',
                            transform: 'translateY(-2px)',
                        }
                    }}>
                        <Typography variant="h3" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                            {projectCount}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                            Projects Listed
                        </Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #00ff88',
                        textAlign: 'center',
                        p: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0, 255, 136, 0.2)',
                            transform: 'translateY(-2px)',
                        }
                    }}>
                        <Typography variant="h3" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                            {formatNumber(totalStaked)}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                            Total Staked
                        </Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #00ff88',
                        textAlign: 'center',
                        p: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0, 255, 136, 0.2)',
                            transform: 'translateY(-2px)',
                        }
                    }}>
                        <Typography variant="h3" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                            {formatNumber(totalBelievers)}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                            Total Believers
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}